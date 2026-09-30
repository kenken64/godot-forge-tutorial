# Godot Forge cloud editor on AWS Lightsail

## Dedicated student instances from the tutorial

The tutorial student workflow now provisions one instance and a generated
`godot-<id>.kere.ceo` hostname per learner. It deploys the editor automatically,
waits for authenticated HTTPS readiness, and saves the student mapping and unique
secret in the tutorial storage volume. See `tutorial-web-app/README.md` for setup.
The provisioned editor image keeps the KasmVNC control panel in English even when
the learner's browser prefers another language.
`provision_student.py` receives its job on stdin and uses the existing infrastructure
provisioner with exact instance-name matching, so it never reuses another student's
tagged instance. Credentials remain on the tutorial server. DNS defaults to Porkbun and the zone
is selected through `GODOT_DNS_DOMAIN` (currently `kere.ceo`).

The instructions below describe the separate manual shared-instance deployment.


This runs the native Godot editor in per-learner Docker containers on one AWS Lightsail Linux instance. The desktop is streamed into the Learn Godot Web Editor lesson at `https://learn-game.kere.com`. Each learner's project persists on the instance when they stop their container, and the lesson's final button opens the same editor in a separate tab. The published 83 MiB starter ZIP remains in DigitalOcean Spaces and seeds each learner's project on first launch.

The default provisioner chooses a Lightsail Linux plan with 4 GiB RAM, two vCPUs, public IPv4, and a price no higher than $24 per month. The cloud service allows one active editor container at a time, limited to 2.5 GiB RAM and 1.5 vCPUs. Other students can start their saved workspace when that slot is free. The instance is billed while it exists, even when the editor container is stopped.

## 1. Provision or reuse the Lightsail instance

Configure an AWS CLI profile with Lightsail instance, static IP, firewall, and DNS record permissions. The instance runs in Singapore (`ap-southeast-1`); Lightsail DNS API calls must use `us-east-1`. The `kere.com` Lightsail DNS zone must already exist, and the domain registrar must use its Lightsail nameservers. Alternatively, put `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` in an ignored local `godot-cloud/.env.aws`; the provisioner reads it without displaying the values. Keep that file on the provisioning machine and exclude it when copying files to Lightsail. The DigitalOcean Spaces key is not an AWS credential and is not needed to run the editor. From the repository root:

```sh
python3 godot-cloud/provision_lightsail.py
```

Use `--profile PROFILE` for a named AWS profile, `--key-pair-name NAME` for an existing Lightsail SSH key, or `--name NAME` to select a differently named existing instance. With no custom key, Lightsail uses its regional default key pair; download its private key from the Lightsail console's Account → SSH keys page for local SSH access. The script reuses an instance named or tagged `godot-forge-cloud` only if its plan costs no more than $24 per month. It starts a stopped matching instance and creates a new Ubuntu 24.04 instance only when none matches. It attaches or reuses a static IPv4 address, opens inbound TCP 80 and 443, and creates or updates the `godot.kere.com` A record in Lightsail DNS. It leaves an already correct record as is and refuses conflicting CNAME, AAAA, alias, or multiple A records. It never deletes an instance or moves a static IP attached to a different instance.

The launch script installs Docker and Compose on a newly created Ubuntu instance. If reusing an instance that does not have them yet, install `docker.io`, `docker-compose-v2`, `git`, and `unzip` on that instance before deployment. Keep SSH port 22 available to administrators, preferably limited to your IP in the Lightsail firewall.

To check the DNS zone and the resulting record, run:

```sh
aws lightsail get-domain --domain-name kere.com --region us-east-1
dig +short godot.kere.com A
```

The static IP keeps the record valid after an instance restart. The editor allows `https://learn-game.kere.com` to embed it. If you choose another editor hostname, pass `--dns-name SUBDOMAIN.kere.com` and set `GODOT_CLOUD_DOMAIN` to the same hostname in the editor deployment. The provisioner never creates a DNS zone or changes registrar nameservers.

## 2. Deploy the editor service

Copy `godot-cloud/` to the Lightsail instance, excluding any local `.env`. For example, with an SSH private key downloaded from Lightsail:

```sh
rsync -av --exclude='.env' --exclude='.env.aws' -e 'ssh -i /path/to/lightsail-key.pem' \
  godot-cloud/ ubuntu@STATIC_IP:~/godot-cloud/
ssh -i /path/to/lightsail-key.pem ubuntu@STATIC_IP
```

On the instance, create `~/godot-cloud/.env` from `.env.example`. Set `GODOT_CLOUD_SHARED_SECRET` to a random value of at least 32 characters, for example one generated with `openssl rand -hex 32`. The example already sets `GODOT_CLOUD_DOMAIN=godot.kere.com` and `GODOT_CLOUD_APP_ORIGIN=https://learn-game.kere.com`.

```sh
cd ~/godot-cloud
cp .env.example .env
chmod 600 .env
# Edit GODOT_CLOUD_SHARED_SECRET in .env.
sudo docker build -t godot-forge-cloud-editor:4.7.2 ./editor
sudo docker compose up -d --build
```

The Compose stack includes Caddy, which obtains and renews HTTPS for `godot.kere.com` when DNS and ports 80/443 are working. Certificates persist in the `caddy_data` volume. The controller and student containers stay on the private Docker network; only Caddy publishes ports 80 and 443. The controller has Docker socket access, so keep its shared secret private and never expose the socket.

Verify the service:

```sh
curl -f https://godot.kere.com/health
sudo docker compose logs --tail=100 controller caddy
```

## 3. Connect the tutorial app

Set these values in the tutorial app's runtime environment at `https://learn-game.kere.com`, using the same secret as on Lightsail, then restart or redeploy the app:

```dotenv
GODOT_CLOUD_SERVICE_URL=https://godot.kere.com
GODOT_CLOUD_PUBLIC_URL=https://godot.kere.com
GODOT_CLOUD_SHARED_SECRET=the-same-secret-as-on-lightsail
```

The lesson's Start cloud editor button then starts the learner's container and embeds its desktop. Download my project ZIP archives that learner's server files. Stop my workspace stops only their container; it does not delete the project or the Lightsail instance.

The tutorial currently identifies learners with browser-generated IDs. Workspace URLs are random capability links, so anyone who obtains one can access that workspace. Add user authentication and admission controls before inviting a large public class or increasing concurrency.
