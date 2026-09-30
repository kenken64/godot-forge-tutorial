import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createProvisioningController } from '../lightsail-provisioning.mjs';

async function fixture(t) {
  const storageDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'student-lightsail-'));
  t.after(() => fs.rm(storageDirectory, { recursive: true, force: true }));
  const calls = [];
  const children = [];
  const options = { projectDirectory: '/project', storageDirectory,
    env: { GODOT_PROVISION_ENABLED: 'true', GODOT_DNS_DOMAIN: 'kere.com' },
    spawnProcess: (...args) => {
      calls.push(args);
      const child = new EventEmitter();
      child.stdout = new EventEmitter();
      child.stdin = new EventEmitter();
      child.stdin.end = value => { child.job = JSON.parse(value); };
      children.push(child);
      return child;
    } };
  return { controller: createProvisioningController(options), calls, children, options, storageDirectory };
}
async function settled(controller, id) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const job = await controller.status(id);
    if (job.state !== 'running') return job;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw new Error('Job did not settle');
}
test('requires opt-in and valid student identity without an administrator token', async t => {
  const { controller } = await fixture(t);
  assert.equal(controller.enabled, true);
  await assert.rejects(controller.start('../escape'), /learner ID/);
  const disabled = createProvisioningController({ projectDirectory: '/project', env: {} });
  await assert.rejects(disabled.start('student001'), /disabled/);
});
test('concurrent requests deduplicate one student; two students get isolated resources', async t => {
  const { controller, children, calls } = await fixture(t);
  const [a, b] = await Promise.all([controller.start('student001'), controller.start('student001')]);
  assert.equal(a.hostname, b.hostname);
  assert.equal(calls.length, 1);
  const c = await controller.start('student002');
  assert.notEqual(c.hostname, a.hostname);
  assert.notEqual(children[0].job.secret, children[1].job.secret);
  assert.match(a.hostname, /^godot-[a-f0-9]{24}\.kere\.com$/);
  assert.deepEqual(calls[0][1], ['-u', '/project/godot-cloud/provision_student.py']);
  assert.equal(await controller.connection('student001'), null);
  assert.doesNotMatch(JSON.stringify(a), /secret/);
  children[0].emit('close', 0);
  assert.equal((await settled(controller, 'student001')).state, 'succeeded');
  const connection = await controller.connection('student001');
  assert.equal(connection.serviceUrl, `https://${a.hostname}`);
  assert.equal(connection.secret, children[0].job.secret);
  await controller.start('student001');
  assert.equal(calls.length, 2);
  children[1].emit('close', 1);
  await settled(controller, 'student002');
});
test('persisted identity and secret survive failure, retries and server restarts', async t => {
  const { controller, children, calls, options, storageDirectory } = await fixture(t);
  const initial = await controller.start('student001');
  const restored = createProvisioningController(options);
  assert.equal((await restored.status('student001')).state, 'interrupted');
  children[0].emit('error', new Error('secret credential'));
  children[0].emit('close', -1);
  const failed = await settled(controller, 'student001');
  assert.equal(failed.state, 'failed');
  assert.doesNotMatch(JSON.stringify(failed), /secret credential/);
  const retry = await restored.start('student001');
  assert.equal(retry.hostname, initial.hostname);
  assert.equal(children[0].job.secret, children[1].job.secret);
  assert.equal(calls.length, 2);
  const stat = await fs.stat(path.join(storageDirectory, 'lightsail', 'student001.json'));
  assert.equal(stat.mode & 0o777, 0o600);
  children[1].emit('close', 0);
  await settled(restored, 'student001');
  assert.ok(await createProvisioningController(options).connection('student001'));
});
test('removal blocks overlapping work, disables editor routing and permits fresh provisioning after cleanup', async t => {
  const { controller, children, calls } = await fixture(t);
  const initial = await controller.start('student001');
  await assert.rejects(controller.remove('student001'), /Wait for/);
  children[0].emit('close', 0);
  await settled(controller, 'student001');
  const removing = await controller.remove('student001');
  assert.equal(removing.state, 'removing');
  assert.equal(await controller.connection('student001'), null);
  assert.equal(calls[1][1][1], '/project/godot-cloud/remove_student.py');
  children[1].emit('close', 1);
  for (let i = 0; i < 100 && (await controller.status('student001')).state === 'removing'; i++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal((await controller.status('student001')).state, 'remove_failed');
  await assert.rejects(controller.start('student001'), /Finish removing/);
  await controller.remove('student001');
  children[2].emit('close', 0);
  for (let i = 0; i < 100 && (await controller.status('student001')).state === 'removing'; i++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal((await controller.status('student001')).state, 'removed');
  const fresh = await controller.start('student001');
  assert.notEqual(fresh.hostname, initial.hostname);
  children[3].emit('close', 1);
  await settled(controller, 'student001');
});

test('worker progress is persisted before completion and invalid stages are ignored', async t => {
  const { controller, children } = await fixture(t);
  await controller.start('student001');
  children[0].stdout.emit('data', 'GODOT_PRO');
  children[0].stdout.emit('data', 'GRESS {"stage":"network"}\nGODOT_PROGRESS {"stage":"invalid"}\n');
  for (let i = 0; i < 100 && (await controller.status('student001')).stage !== 'network'; i++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal((await controller.status('student001')).stage, 'network');
  children[0].stdout.emit('data', 'GODOT_PROGRESS {"stage":"installing"}\n');
  children[0].emit('close', 0);
  assert.equal((await settled(controller, 'student001')).stage, 'ready');
});
