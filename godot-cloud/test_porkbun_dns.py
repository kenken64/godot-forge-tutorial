import unittest
from unittest.mock import patch
import porkbun_dns

HOST = 'godot-' + 'a' * 24 + '.kere.com'

class PorkbunDnsTests(unittest.TestCase):
    def test_create_uses_relative_hostname(self):
        with patch.object(porkbun_dns, 'get_zone', return_value={'domainEntries': []}), patch.object(porkbun_dns, 'request', return_value={'status': 'SUCCESS'}) as call:
            self.assertEqual(porkbun_dns.ensure_entry(None, 'kere.com', HOST, '203.0.113.4'), 'created')
        call.assert_called_once_with('dns/create', 'kere.com', {'name': HOST[:-9], 'type': 'A', 'content': '203.0.113.4', 'ttl': 600})

    def test_existing_correct_record_is_reused(self):
        zone = {'domainEntries': [{'name': HOST, 'type': 'A', 'target': '203.0.113.4'}]}
        with patch.object(porkbun_dns, 'get_zone', return_value=zone), patch.object(porkbun_dns, 'request') as call:
            self.assertEqual(porkbun_dns.ensure_entry(None, 'kere.com', HOST, '203.0.113.4'), 'unchanged')
            call.assert_not_called()

    def test_conflicting_record_is_not_overwritten(self):
        for record in [{'name': HOST, 'type': 'CNAME', 'target': 'foreign.example'}, {'name': HOST, 'type': 'A', 'target': '203.0.113.9'}]:
            with patch.object(porkbun_dns, 'get_zone', return_value={'domainEntries': [record]}), patch.object(porkbun_dns, 'request') as call:
                with self.assertRaises(RuntimeError):
                    porkbun_dns.ensure_entry(None, 'kere.com', HOST, '203.0.113.4')
                call.assert_not_called()

    def test_delete_uses_exact_record_id(self):
        with patch.object(porkbun_dns, 'request') as call:
            porkbun_dns.delete_entry('kere.com', {'id': '123'})
        call.assert_called_once_with('dns/delete/123', 'kere.com')
