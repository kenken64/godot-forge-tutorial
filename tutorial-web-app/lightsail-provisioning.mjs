import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export function createProvisioningController({ projectDirectory, env = process.env, spawnProcess = spawn, storageDirectory }) {
  const enabled = env.GODOT_PROVISION_ENABLED === 'true';
  const root = path.join(storageDirectory || env.APP_STORAGE_DIR || env.RAILWAY_VOLUME_MOUNT_PATH || path.join(projectDirectory, 'tutorial-web-app', 'storage'), 'lightsail');
  const active = new Map();
  const locks = new Map();
  function validate(learnerId) {
    if (typeof learnerId !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(learnerId)) {
      throw Object.assign(new Error('A valid learner ID is required.'), { statusCode: 400 });
    }
  }
  const file = learnerId => path.join(root, `${learnerId}.json`);
  async function read(learnerId) {
    validate(learnerId);
    try { return JSON.parse(await fs.readFile(file(learnerId), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }
  async function save(job) {
    await fs.mkdir(root, { recursive: true, mode: 0o700 });
    const temporary = `${file(job.learnerId)}.${randomBytes(6).toString('hex')}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(job), { mode: 0o600 });
    await fs.rename(temporary, file(job.learnerId));
  }
  function publicJob(job) {
    if (!job) return { state: 'idle', message: 'This student has no provisioned instance yet.' };
    const { state, stage, hostname, instanceName, startedAt, finishedAt, message } = job;
    return { state, stage, hostname, instanceName, startedAt, finishedAt, message };
  }
  async function serialized(learnerId, work) {
    validate(learnerId);
    const previous = locks.get(learnerId) || Promise.resolve();
    const result = previous.catch(() => {}).then(work);
    locks.set(learnerId, result);
    try { return await result; }
    finally { if (locks.get(learnerId) === result) locks.delete(learnerId); }
  }
  const controller = {
    enabled,
    async status(learnerId) {
      const job = await read(learnerId);
      if (['running', 'removing'].includes(job?.state) && !active.has(learnerId)) {
        return { ...publicJob(job), state: 'interrupted', message: 'The tutorial server restarted. Retry the interrupted action to check the saved resources; their names will be reused.' };
      }
      return publicJob(job);
    },
    async connection(learnerId) {
      const job = await read(learnerId);
      if (job?.state !== 'succeeded') return null;
      return { serviceUrl: `https://${job.hostname}`, publicUrl: `https://${job.hostname}`, secret: job.secret };
    },
    async remove(learnerId) {
      if (!enabled) throw Object.assign(new Error('Lightsail provisioning is disabled.'), { statusCode: 503 });
      return serialized(learnerId, async () => {
        let job = await read(learnerId);
        if (!job || job.state === 'removed') return publicJob(job);
        if (active.has(learnerId)) throw Object.assign(new Error('Wait for the current action to finish before removing the instance.'), { statusCode: 409 });
        job = { ...job, state: 'removing', message: 'Removing this student’s instance, static IP and DNS record. Project files will be deleted.' };
        await save(job);
        active.set(learnerId, true);
        let done = false;
        const complete = async code => {
          if (done) return;
          done = true;
          job = { ...job, state: code === 0 ? 'removed' : 'remove_failed', finishedAt: new Date().toISOString(),
            message: code === 0 ? 'Student instance, static IP and DNS record removed.' : 'Removal failed or is incomplete. Check AWS state and deletion permissions, then retry removal.' };
          try { await save(job); } finally { active.delete(learnerId); }
        };
        const finish = code => { complete(code).catch(() => { active.delete(learnerId); }); };
        try {
          const child = spawnProcess(env.GODOT_PROVISION_PYTHON || 'python3',
            ['-u', path.join(projectDirectory, 'godot-cloud', 'remove_student.py')],
            { cwd: projectDirectory, env, stdio: ['pipe', 'ignore', 'ignore'] });
          child.once('error', () => finish(1));
          child.once('close', finish);
          child.stdin.on('error', () => finish(1));
          child.stdin.end(JSON.stringify(job));
        } catch { await complete(1); }
        return publicJob(job);
      });
    },
    async start(learnerId) {
      if (!enabled) throw Object.assign(new Error('Lightsail provisioning is disabled.'), { statusCode: 503 });
      return serialized(learnerId, async () => {
        let job = await read(learnerId);
        if (job?.state === 'succeeded' || active.has(learnerId)) return publicJob(job);
        if (['removing', 'remove_failed'].includes(job?.state)) throw Object.assign(new Error('Finish removing this student’s resources before provisioning again.'), { statusCode: 409 });
        const origin = env.GODOT_CLOUD_APP_ORIGIN || 'https://learn-game.kere.ceo';
        if (!/^https:\/\/[a-zA-Z0-9.-]+(?::[0-9]+)?$/.test(origin)) {
          throw Object.assign(new Error('Configure GODOT_CLOUD_APP_ORIGIN with the tutorial HTTPS origin.'), { statusCode: 503 });
        }
        if (!job || job.state === 'removed') {
          const id = randomBytes(12).toString('hex');
          const dnsDomain = env.GODOT_DNS_DOMAIN || 'kere.ceo';
          if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(dnsDomain)) throw Object.assign(new Error('Invalid GODOT_DNS_DOMAIN.'), { statusCode: 503 });
          job = { learnerId, region: env.AWS_REGION || 'ap-southeast-1', dnsProvider: env.GODOT_DNS_PROVIDER || 'porkbun', instanceName: `godot-${id}`, dnsDomain, hostname: `godot-${id}.${dnsDomain}`, secret: randomBytes(32).toString('hex'), appOrigin: origin, extraFrameOrigins: env.GODOT_CLOUD_EXTRA_FRAME_ORIGINS || '' };
        }
        job = { ...job, state: 'running', stage: 'instance', startedAt: new Date().toISOString(), finishedAt: undefined,
          message: `Preparing this student's instance and ${job.hostname}. Installing Godot and HTTPS may take 20 minutes.` };
        await save(job);
        active.set(learnerId, true);
        const finish = async (state, message) => {
          job = { ...job, state, stage: state === 'succeeded' ? 'ready' : job.stage, message, finishedAt: new Date().toISOString() };
          await save(job);
          active.delete(learnerId);
        };
        let child;
        try {
          child = spawnProcess(env.GODOT_PROVISION_PYTHON || 'python3',
            ['-u', path.join(projectDirectory, 'godot-cloud', 'provision_student.py')],
            { cwd: projectDirectory, env, stdio: ['pipe', 'pipe', 'ignore'] });
          let done = false;
          const complete = code => {
            if (done) return;
            done = true;
            return finish(code === 0 ? 'succeeded' : 'failed', code === 0
              ? 'Your dedicated cloud editor is ready.'
              : 'Provisioning or deployment failed. Check server credentials, AWS quotas, DNS and instance deployment logs. Retry reuses this student’s instance.')
              .catch(() => { active.delete(learnerId); });
          };
          let updates = Promise.resolve();
          const queue = work => { updates = updates.then(work).catch(() => {}); };
          let output = '';
          child.stdout?.on('data', chunk => {
            output = (output + chunk.toString()).slice(-16384);
            let newline;
            while ((newline = output.indexOf('\n')) >= 0) {
              const line = output.slice(0, newline);
              output = output.slice(newline + 1);
              if (!line.startsWith('GODOT_PROGRESS ')) continue;
              try {
                const { stage } = JSON.parse(line.slice(15));
                if (!['instance', 'network', 'installing', 'secure', 'ready'].includes(stage)) continue;
                queue(async () => {
                  if (job.state !== 'running') return;
                  job = { ...job, stage };
                  await save(job);
                });
              } catch { /* Ignore non-progress output. */ }
            }
          });
          const finishQueued = code => queue(() => complete(code));
          child.once('error', () => finishQueued(1));
          child.once('close', finishQueued);
          child.stdin.on('error', () => finishQueued(1));
          child.stdin.end(JSON.stringify(job));
        } catch {
          await finish('failed', 'Could not start the provisioning process. Check the Python installation.');
        }
        return publicJob(job);
      });
    },
  };
  return controller;
}
