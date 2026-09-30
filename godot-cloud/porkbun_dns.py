"""Porkbun DNS adapter. Credentials remain in the tutorial server environment."""
import ipaddress
import json
import os
import re
import urllib.request
import urllib.error


def request(action, domain, payload=None):
    if not re.fullmatch(r'[a-z0-9-]+(?:\.[a-z0-9-]+)+', domain) or not re.fullmatch(r'[a-zA-Z0-9/_-]+', action):
        raise ValueError('Invalid DNS request')
    key, secret = os.environ.get('PORKBUN_API_KEY'), os.environ.get('PORKBUN_SECRET_API_KEY')
    if not key or not secret:
        raise RuntimeError('Configure Porkbun API credentials on the tutorial server')
    body = {'apikey': key, 'secretapikey': secret, **(payload or {})}
    # ID follows the domain in Porkbun edit/delete paths.
    parts = action.split('/')
    endpoint = '/'.join(parts[:2]) + '/' + domain
    if len(parts) == 3:
        endpoint += '/' + parts[2]
    req = urllib.request.Request('https://api.porkbun.com/api/json/v3/' + endpoint,
        data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        code = 'UNKNOWN'
        try:
            code = json.loads(error.read()).get('code', 'UNKNOWN')
        except Exception:
            pass
        if not isinstance(code, str) or not re.fullmatch(r'[A-Z0-9_]{1,80}', code):
            code = 'UNKNOWN'
        raise RuntimeError(f'Porkbun HTTP {error.code}: {code}. Check domain API access and credentials.') from error
    except Exception as error:
        raise RuntimeError('Porkbun request failed. Check API access, credentials and network.') from error
    if result.get('status') != 'SUCCESS' or result.get('sandbox'):
        raise RuntimeError('Porkbun rejected the request. Check live API credentials and domain API access.')
    if result.get('warnings'):
        raise RuntimeError('Porkbun reported DNS warnings. Verify the domain is delegated to Porkbun nameservers.')
    return result


def get_zone(profile, domain):
    result = request('dns/retrieve', domain)
    return {'name': domain, 'domainEntries': [
        {'id': str(item['id']), 'name': item['name'], 'type': item['type'],
         'target': item['content']} for item in result.get('records', [])]}


def ensure_entry(profile, domain, hostname, address):
    if not hostname.endswith('.' + domain):
        raise ValueError('Hostname is outside the configured domain')
    ipaddress.IPv4Address(address)
    records = [item for item in get_zone(profile, domain)['domainEntries'] if item['name'].rstrip('.') == hostname]
    if len(records) > 1 or any(item['type'] != 'A' for item in records):
        raise RuntimeError('Conflicting DNS records; no record was changed')
    if records:
        if records[0]['target'] == address:
            return 'unchanged'
        # Never overwrite a record now pointing elsewhere.
        raise RuntimeError('Student DNS record points elsewhere; no record was changed')
    request('dns/create', domain, {'name': hostname[:-len(domain)-1], 'type': 'A', 'content': address, 'ttl': 600})
    return 'created'


def delete_entry(domain, entry):
    identifier = str(entry['id'])
    if not identifier.isdigit():
        raise ValueError('Invalid Porkbun DNS record ID')
    request('dns/delete/' + identifier, domain)
