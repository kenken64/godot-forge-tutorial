"""Remove only resources named in a saved student job; input arrives on stdin."""
import json
import re
import sys
import time
import provision_lightsail as infrastructure


def remove(job):
    name = job['instanceName']
    if not re.fullmatch(r'godot-[a-f0-9]{24}', name) or job['hostname'] != name + '.' + job['dnsDomain']:
        raise ValueError('Invalid student resources')
    domain = job['dnsDomain']
    region = job['region']
    call = lambda action, *args: infrastructure.aws(region, None, action, *args)
    instances = call('get-instances').get('instances', [])
    instance = next((item for item in instances if item.get('name') == name), None)
    if instance and not any(tag.get('key') == infrastructure.TAG for tag in instance.get('tags', [])):
        raise RuntimeError('Instance ownership tag is missing; nothing was removed')
    ip_name = name + '-ip'
    ip = next((item for item in call('get-static-ips').get('staticIps', []) if item.get('name') == ip_name), None)
    if ip and ip.get('attachedTo') not in (None, '', name):
        raise RuntimeError('Static IP belongs to another instance; nothing was removed')
    if job.get('dnsProvider') == 'porkbun':
        import porkbun_dns
        zone = porkbun_dns.get_zone(None, domain)
    else:
        zone = infrastructure.get_dns_zone(None, domain)
    entries = [entry for entry in zone.get('domainEntries', [])
               if entry.get('name', '').rstrip('.') == job['hostname']]
    if entries and (len(entries) != 1 or entries[0].get('type') != 'A' or not ip
                    or entries[0].get('target') != ip.get('ipAddress') or not entries[0].get('id')):
        raise RuntimeError('DNS record ownership could not be verified; nothing was removed')
    for entry in entries:
        if job.get('dnsProvider') == 'porkbun':
            porkbun_dns.delete_entry(domain, entry)
        else:
            infrastructure.aws(infrastructure.DNS_REGION, None, 'delete-domain-entry',
                               '--domain-name', domain, '--domain-entry', json.dumps(entry))
    if instance:
        call('delete-instance', '--instance-name', name)
        for _ in range(60):
            if not any(item.get('name') == name for item in call('get-instances').get('instances', [])):
                break
            time.sleep(5)
        else:
            raise RuntimeError('Instance removal is pending; retry to finish cleanup')
    if ip:
        if ip.get('attachedTo'):
            # Instance deletion normally detaches its static IP. Query again before releasing.
            for _ in range(30):
                current = next((item for item in call('get-static-ips').get('staticIps', []) if item.get('name') == ip_name), None)
                if not current:
                    return
                if not current.get('isAttached'):
                    break
                time.sleep(2)
            else:
                raise RuntimeError('Static IP is still attached; retry cleanup')
        call('release-static-ip', '--static-ip-name', ip_name)


if __name__ == '__main__':
    try:
        infrastructure.load_local_aws_env()
        remove(json.load(sys.stdin))
    except Exception:
        print('Student removal failed; inspect AWS resource state and permissions.', file=sys.stderr)
        sys.exit(1)
