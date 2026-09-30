#!/usr/bin/env python3
"""Reuse or create the Godot Forge Lightsail instance, static IP, and DNS record."""

import argparse
import ipaddress
import json
import os
from pathlib import Path
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parent
TAG = "godot-forge-cloud"
DEFAULT_NAME = "godot-forge-cloud"
DEFAULT_STATIC_IP = "godot-forge-cloud-ip"
DEFAULT_DNS_DOMAIN = "kere.com"
DEFAULT_DNS_NAME = "godot.kere.com"
DNS_REGION = "us-east-1"
MAX_MONTHLY_PRICE = 24.0
AWS_ENV_KEYS = {"AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "AWS_PROFILE", "AWS_REGION"}


def load_local_aws_env():
    """Read AWS CLI credentials from an ignored local file without printing them."""
    local = ROOT / ".env.aws"
    if not local.is_file():
        return
    for raw in local.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key in AWS_ENV_KEYS:
            os.environ.setdefault(key, value.strip().strip('"').strip("'"))


def aws(region, profile, action, *arguments):
    command = ["aws", "lightsail", action, "--region", region, "--output", "json", "--no-cli-pager"]
    if profile:
        command.extend(["--profile", profile])
    command.extend(arguments)
    result = subprocess.run(command, capture_output=True, text=True, timeout=90, check=False)
    if result.returncode:
        raise RuntimeError(f"AWS Lightsail {action} failed: {result.stderr.strip()[-1200:]}")
    return json.loads(result.stdout or "{}")


def select_instance(instances, name):
    exact = [item for item in instances if item.get("name") == name]
    if exact:
        return exact[0]
    tagged = [item for item in instances if any(tag.get("key") == TAG for tag in item.get("tags", []))]
    if len(tagged) > 1:
        raise RuntimeError("Multiple Godot Forge instances are tagged. Choose one with --name.")
    return tagged[0] if tagged else None


def select_blueprint(blueprints):
    matches = [item for item in blueprints if item.get("isActive") and item.get("type") == "os"
               and item.get("platform") == "LINUX_UNIX"
               and "ubuntu" in f"{item.get('name', '')} {item.get('group', '')}".lower()
               and ("24.04" in f"{item.get('name', '')} {item.get('version', '')}"
                    or item.get("blueprintId") == "ubuntu_24_04")]
    if not matches:
        raise RuntimeError("No active Ubuntu 24.04 Lightsail blueprint was found in this region.")
    return next((item for item in matches if item.get("blueprintId") == "ubuntu_24_04"), matches[0])


def select_bundle(bundles, requested_id=None):
    eligible = [item for item in bundles if item.get("isActive")
                and "LINUX_UNIX" in item.get("supportedPlatforms", [])
                and item.get("publicIpv4AddressCount", 1) >= 1
                and item.get("ramSizeInGb", 0) >= 4
                and item.get("cpuCount", 0) >= 2
                and item.get("price", float("inf")) <= MAX_MONTHLY_PRICE]
    if requested_id:
        matches = [item for item in eligible if item.get("bundleId") == requested_id]
        if not matches:
            raise RuntimeError("Requested bundle must have at least 4 GiB / 2 vCPUs, public IPv4, and cost at most $24/month.")
        return matches[0]
    if not eligible:
        raise RuntimeError("No active Linux Lightsail bundle meets 4 GiB / 2 vCPUs with public IPv4 for at most $24/month.")
    return min(eligible, key=lambda item: (item.get("price", float("inf")), item.get("ramSizeInGb", 0)))


def select_zone(regions, region):
    entry = next((item for item in regions if item.get("name") == region), None)
    zones = entry.get("availabilityZones", []) if entry else []
    zone = next((item.get("zoneName") for item in zones
                 if item.get("state", "available") == "available" and item.get("zoneName")), None)
    if not zone:
        raise RuntimeError(f"No available Lightsail zone was found in {region}.")
    return zone


def wait_for_instance(region, profile, name):
    for _ in range(60):
        instance = aws(region, profile, "get-instance", "--instance-name", name)["instance"]
        state = instance.get("state", {}).get("name")
        if state == "running" and instance.get("publicIpAddress"):
            return instance
        if state in {"terminated", "shutting-down"}:
            raise RuntimeError(f"Lightsail instance entered {state} state.")
        time.sleep(5)
    raise RuntimeError("Lightsail instance did not become ready within five minutes.")


def ensure_static_ip(region, profile, instance_name, static_ip_name):
    ips = aws(region, profile, "get-static-ips").get("staticIps", [])
    attached = next((item for item in ips if item.get("attachedTo") == instance_name), None)
    if attached:
        return attached
    chosen = next((item for item in ips if item.get("name") == static_ip_name), None)
    if chosen and chosen.get("isAttached"):
        raise RuntimeError(f"Static IP {static_ip_name} is attached to another instance; it was not moved.")
    if not chosen:
        aws(region, profile, "allocate-static-ip", "--static-ip-name", static_ip_name)
        for _ in range(12):
            chosen = next((item for item in aws(region, profile, "get-static-ips").get("staticIps", [])
                           if item.get("name") == static_ip_name), None)
            if chosen:
                break
            time.sleep(2)
        if not chosen:
            raise RuntimeError("Static IP allocation did not appear in Lightsail.")
    aws(region, profile, "attach-static-ip", "--static-ip-name", chosen["name"],
        "--instance-name", instance_name)
    return chosen


def ensure_web_ports(region, profile, instance_name):
    ports = aws(region, profile, "get-instance-port-states", "--instance-name", instance_name).get("portStates", [])
    for port in (80, 443):
        is_open = any(item.get("protocol", "").lower() == "tcp" and item.get("state") == "open"
                      and item.get("fromPort", 65536) <= port <= item.get("toPort", -1)
                      and (not item.get("cidrs") or "0.0.0.0/0" in item["cidrs"])
                      for item in ports)
        if not is_open:
            info = {"fromPort": port, "toPort": port, "protocol": "tcp", "cidrs": ["0.0.0.0/0"]}
            aws(region, profile, "open-instance-public-ports", "--instance-name", instance_name,
                "--port-info", json.dumps(info))


def validate_dns_name(domain, hostname):
    domain = domain.rstrip(".").lower()
    hostname = hostname.rstrip(".").lower()
    if not domain or not hostname.endswith("." + domain):
        raise ValueError("DNS name must be a subdomain of the selected Lightsail DNS zone.")
    return domain, hostname


def get_dns_zone(profile, domain):
    try:
        response = aws(DNS_REGION, profile, "get-domain", "--domain-name", domain)
    except RuntimeError as error:
        if "NotFoundException" in str(error) or "ResourceNotFoundException" in str(error):
            raise RuntimeError(f"Lightsail DNS zone {domain} does not exist. Create it and delegate its nameservers before provisioning.") from error
        raise
    if response.get("domain", {}).get("name", "").rstrip(".").lower() != domain:
        raise RuntimeError(f"Lightsail did not return the expected DNS zone {domain}.")
    return response["domain"]


def ensure_dns_entry(profile, domain, hostname, static_ip):
    """Point one existing Lightsail DNS zone's hostname at the instance's static IPv4."""
    domain, hostname = validate_dns_name(domain, hostname)
    ipaddress.IPv4Address(static_ip)
    zone = get_dns_zone(profile, domain)
    records = [item for item in zone.get("domainEntries", [])
               if item.get("name", "").rstrip(".").lower() == hostname]
    conflicts = [item for item in records if item.get("type") in {"CNAME", "AAAA"}]
    if conflicts:
        raise RuntimeError(f"{hostname} already has a CNAME or AAAA record; resolve it before pointing the hostname at this static IPv4.")
    matching = [item for item in records if item.get("type") == "A"]
    if len(matching) > 1:
        raise RuntimeError(f"{hostname} has multiple A records; resolve them before changing DNS.")
    if matching and matching[0].get("isAlias"):
        raise RuntimeError(f"{hostname} is a Lightsail alias A record; it was not replaced.")
    entry = {"name": hostname, "type": "A", "target": static_ip, "isAlias": False}
    if not matching:
        aws(DNS_REGION, profile, "create-domain-entry", "--domain-name", domain,
            "--domain-entry", json.dumps(entry))
        return "created"
    if matching[0].get("target") == static_ip:
        return "unchanged"
    if not matching[0].get("id"):
        raise RuntimeError(f"{hostname} A record has no ID; it was not updated.")
    entry["id"] = matching[0]["id"]
    aws(DNS_REGION, profile, "update-domain-entry", "--domain-name", domain,
        "--domain-entry", json.dumps(entry))
    return "updated"


def provision(args):
    progress = getattr(args, "progress_hook", lambda stage: None)
    progress("instance")
    dns_domain, _ = validate_dns_name(args.dns_domain, args.dns_name)
    zone_lookup = get_dns_zone
    dns_write = ensure_dns_entry
    if getattr(args, "dns_provider", "lightsail") == "porkbun":
        import porkbun_dns
        zone_lookup, dns_write = porkbun_dns.get_zone, porkbun_dns.ensure_entry
    zone_lookup(args.profile, dns_domain)
    instances = aws(args.region, args.profile, "get-instances").get("instances", [])
    instance = (next((item for item in instances if item.get("name") == args.name), None)
                if getattr(args, "exact_name_only", False) else select_instance(instances, args.name))
    created = instance is None
    if instance:
        bundle_id = instance.get("bundleId")
        if not bundle_id:
            raise RuntimeError("Existing Lightsail instance plan could not be verified against the $24/month budget.")
        bundles = aws(args.region, args.profile, "get-bundles").get("bundles", [])
        bundle = next((item for item in bundles if item.get("bundleId") == bundle_id), None)
        if (not bundle or bundle.get("price", float("inf")) > MAX_MONTHLY_PRICE
                or bundle.get("ramSizeInGb", 0) < 4 or bundle.get("cpuCount", 0) < 2
                or bundle.get("publicIpv4AddressCount", 1) < 1):
            raise RuntimeError("Existing Lightsail instance exceeds the $24/month budget or lacks 4 GiB RAM, two vCPUs, or public IPv4.")
        name = instance["name"]
        print(f"Reusing Lightsail instance {name}.")
        if instance.get("state", {}).get("name") == "stopped":
            aws(args.region, args.profile, "start-instance", "--instance-name", name)
    else:
        blueprint = select_blueprint(aws(args.region, args.profile, "get-blueprints").get("blueprints", []))
        bundle = select_bundle(aws(args.region, args.profile, "get-bundles").get("bundles", []), args.bundle_id)
        zone = args.zone or select_zone(aws(args.region, args.profile, "get-regions",
                                             "--include-availability-zones").get("regions", []), args.region)
        script = getattr(args, "launch_script", None) or (ROOT / "lightsail-init.sh").read_text()
        options = ["--instance-names", args.name, "--availability-zone", zone,
                   "--blueprint-id", blueprint["blueprintId"], "--bundle-id", bundle["bundleId"],
                   "--ip-address-type", "dualstack", "--user-data", script,
                   "--tags", json.dumps([{"key": TAG, "value": "editor"}])]
        if args.key_pair_name:
            options.extend(["--key-pair-name", args.key_pair_name])
        print(f"Creating Lightsail instance {args.name}: {bundle['ramSizeInGb']} GiB, "
              f"{bundle['cpuCount']} vCPUs, ${bundle['price']}/month.")
        aws(args.region, args.profile, "create-instances", *options)
        name = args.name
    instance = wait_for_instance(args.region, args.profile, name)
    progress("network")
    static_ip = ensure_static_ip(args.region, args.profile, name, args.static_ip_name)
    ensure_web_ports(args.region, args.profile, name)
    dns_status = dns_write(args.profile, args.dns_domain, args.dns_name, static_ip["ipAddress"])
    progress("installing")
    print(f"Instance: {name} ({instance.get('state', {}).get('name', 'unknown')})")
    print(f"Region: {args.region}")
    print(f"Static IPv4: {static_ip['ipAddress']}")
    dns_label = "Porkbun" if getattr(args, "dns_provider", "lightsail") == "porkbun" else "Lightsail"
    print(f"{dns_label} DNS: {args.dns_name} → {static_ip['ipAddress']} ({dns_status})")
    print("Students stop only their editor container.")
    return {"created": created, "instanceName": name, "ipAddress": static_ip["ipAddress"]}


def main():
    load_local_aws_env()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--profile", help="AWS CLI credential profile; defaults to the active profile.")
    parser.add_argument("--region", default=os.environ.get("AWS_REGION", "ap-southeast-1"),
                        help="AWS region (default: Singapore).")
    parser.add_argument("--zone", help="Lightsail availability zone; chosen automatically by default.")
    parser.add_argument("--name", default=DEFAULT_NAME, help="Instance name to reuse or create.")
    parser.add_argument("--static-ip-name", default=DEFAULT_STATIC_IP)
    parser.add_argument("--dns-domain", default=DEFAULT_DNS_DOMAIN, help="Existing Lightsail DNS zone.")
    parser.add_argument("--dns-name", default=DEFAULT_DNS_NAME, help="Subdomain A record to point at the instance.")
    parser.add_argument("--bundle-id", help="Active public-IPv4 bundle with at least 4 GiB RAM and 2 vCPUs, costing at most $24/month.")
    parser.add_argument("--key-pair-name", help="Existing regional Lightsail SSH key pair name.")
    provision(parser.parse_args())


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Provisioning failed: {error}", file=sys.stderr)
        raise SystemExit(1)
