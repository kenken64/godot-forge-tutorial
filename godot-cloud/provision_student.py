"""Provision and bootstrap one student's editor; receive secrets only on stdin."""
import base64
import io
import ipaddress
import subprocess
import tempfile
from pathlib import Path
import json
import re
import sys
import tarfile
import time
import urllib.request
from types import SimpleNamespace

import provision_lightsail as infrastructure


def launch_script(job):
    if not re.fullmatch(r"godot-[a-f0-9]{24}\.[a-z0-9.-]+", job["hostname"]):
        raise ValueError("Invalid student hostname")
    if not re.fullmatch(r"[a-f0-9]{64}", job["secret"]):
        raise ValueError("Invalid editor secret")
    if not re.fullmatch(r"https://[a-zA-Z0-9.-]+(?::[0-9]+)?", job["appOrigin"]):
        raise ValueError("Configure the tutorial HTTPS origin")
    if not re.fullmatch(r'[a-zA-Z0-9_-]{8,100}', job['learnerId']):
        raise ValueError('Invalid assigned learner ID')
    extra = job.get('extraFrameOrigins', '')
    for origin in extra.split():
        if not re.fullmatch(r'https://[a-zA-Z0-9.-]+(?::[0-9]+)?|http://(?:localhost|127\.0\.0\.1)(?::[0-9]+)?', origin):
            raise ValueError('Invalid extra frame origin')
    extra = ' '.join(extra.split())
    archive = io.BytesIO()
    root = infrastructure.ROOT
    with tarfile.open(fileobj=archive, mode="w:gz") as bundle:
        for name in ["compose.yaml", "Caddyfile", "controller", "editor"]:
            bundle.add(root / name, arcname=name)
        content = (f'GODOT_CLOUD_DOMAIN={job["hostname"]}\n'
                   f'GODOT_CLOUD_SHARED_SECRET={job["secret"]}\n'
                   f'GODOT_CLOUD_LEARNER_ID={job["learnerId"]}\n'
                   f'GODOT_CLOUD_APP_ORIGIN={job["appOrigin"]}\n'
                   f'GODOT_CLOUD_EXTRA_FRAME_ORIGINS={extra}\n'
                   'GODOT_CLOUD_MAX_SESSIONS=1\n').encode()
        info = tarfile.TarInfo(".env")
        info.size = len(content)
        info.mode = 0o600
        bundle.addfile(info, io.BytesIO(content))
    payload = base64.b64encode(archive.getvalue()).decode()
    return f'''#!/bin/sh
set -eu
umask 077
mkdir -p /opt/godot-cloud /srv/godot-forge-cloud/data
printf '%s' '{payload}' | base64 -d | tar xz -C /opt/godot-cloud
cat > /opt/godot-cloud/deploy.sh <<'DEPLOY'
#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y docker.io docker-compose-v2
systemctl enable --now docker
cd /opt/godot-cloud
docker build -t godot-forge-cloud-editor:4.7.2 ./editor
docker compose up -d --build
DEPLOY
chmod 700 /opt/godot-cloud/deploy.sh
cat > /etc/systemd/system/godot-cloud-deploy.service <<'UNIT'
[Unit]
Description=Deploy student Godot editor
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=0
[Service]
Type=oneshot
ExecStart=/opt/godot-cloud/deploy.sh
Restart=on-failure
RestartSec=60
TimeoutStartSec=0
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable godot-cloud-deploy.service
systemctl start --no-block godot-cloud-deploy.service
'''


def bootstrap_existing(job, script):
    details = infrastructure.aws(job['region'], None, 'get-instance-access-details',
        '--instance-name', job['instanceName'], '--protocol', 'ssh')['accessDetails']
    address = str(ipaddress.IPv4Address(details['ipAddress']))
    if not re.fullmatch(r'[a-z_][a-z0-9_-]*', details['username']):
        raise ValueError('Invalid SSH username')
    with tempfile.TemporaryDirectory(prefix='godot-bootstrap-') as directory:
        root = Path(directory)
        key = root / 'key'
        key.write_text(details['privateKey'])
        key.chmod(0o600)
        cert = root / 'key-cert.pub'
        cert.write_text(details['certKey'])
        cert.chmod(0o600)
        known = root / 'known_hosts'
        known.write_text(''.join(address + ' ' + item['algorithm'] + ' ' + item['publicKey'] + '\n'
                                 for item in details['hostKeys']))
        subprocess.run(['ssh', '-i', str(key), '-o', 'CertificateFile=' + str(cert),
            '-o', 'UserKnownHostsFile=' + str(known), '-o', 'StrictHostKeyChecking=yes',
            '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15',
            details['username'] + '@' + address, 'sudo bash -s'],
            input=script, text=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            timeout=60, check=True)


def report_progress(stage):
    print("GODOT_PROGRESS " + json.dumps({"stage": stage}), flush=True)


def main():
    infrastructure.load_local_aws_env()
    job = json.load(sys.stdin)
    if not re.fullmatch(r"godot-[a-f0-9]{24}", job["instanceName"]):
        raise ValueError("Invalid student instance name")
    script = launch_script(job)
    args = SimpleNamespace(region=job["region"],
                           profile=None, name=job["instanceName"], static_ip_name=job["instanceName"] + "-ip",
                           bundle_id=None, zone=None, key_pair_name=None,
                           dns_domain=job["dnsDomain"], dns_name=job["hostname"],
                           exact_name_only=True, launch_script=script, dns_provider=job["dnsProvider"], progress_hook=report_progress)
    result = infrastructure.provision(args)
    if not result["created"]:
        bootstrap_existing(job, script)
    request = urllib.request.Request('https://' + job["hostname"] + '/internal/stop',
        data=json.dumps({"learnerId": job["learnerId"]}).encode(),
        headers={"Authorization": "Bearer " + job["secret"], "Content-Type": "application/json"})
    # Authenticated check verifies this student's service and secret, not just a public health page.
    for _ in range(120):
        try:
            with urllib.request.urlopen("https://" + job["hostname"] + "/health", timeout=10) as health:
                if health.status != 200:
                    raise RuntimeError("Controller is still starting")
            report_progress("secure")
            with urllib.request.urlopen(request, timeout=10) as response:
                if response.status == 200:
                    report_progress("ready")
                    return
        except Exception:
            pass
        time.sleep(10)
    raise RuntimeError("Editor deployment/HTTPS is not ready. Check /opt/godot-cloud and godot-cloud-deploy.service on the instance; retry reuses the same instance.")


if __name__ == '__main__':
    try:
        main()
    except Exception:
        print('Student provisioning or deployment failed; inspect instance deployment logs.', file=sys.stderr)
        sys.exit(1)
