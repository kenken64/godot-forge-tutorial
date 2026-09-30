import base64
import io
import tarfile
import unittest
import subprocess
from unittest.mock import patch
from types import SimpleNamespace
import provision_lightsail as infrastructure
import provision_student
import remove_student

NAME = 'godot-' + 'a' * 24
JOB = {'learnerId': 'student001', 'instanceName': NAME, 'hostname': NAME + '.kere.com',
       'secret': 'b' * 64, 'appOrigin': 'https://learn-game.kere.com', 'region': 'ap-southeast-1', 'dnsDomain': 'kere.com'}

class StudentWorkflowTests(unittest.TestCase):
    def test_bootstrap_contains_only_deployment_files_and_unique_config(self):
        script = provision_student.launch_script(JOB)
        self.assertTrue(script.startswith('#!/bin/sh\nset -eu'))
        subprocess.run(['sh', '-n'], input=script, text=True, check=True)
        payload = script.split("printf '%s' '")[1].split("'")[0]
        with tarfile.open(fileobj=io.BytesIO(base64.b64decode(payload)), mode='r:gz') as archive:
            names = archive.getnames()
            self.assertIn('controller/service.mjs', names)
            self.assertIn('editor/root/defaults/autostart', names)
            self.assertNotIn('.env.aws', names)
            self.assertIn(JOB['hostname'], archive.extractfile('.env').read().decode())
        self.assertIn('Restart=on-failure', script)
        self.assertLess(len(script.encode()), 16384)

    def test_student_provisioner_does_not_reuse_another_tagged_instance(self):
        args = SimpleNamespace(profile=None, dns_domain='kere.com', dns_name=JOB['hostname'],
                               name=NAME, region='ap-southeast-1', exact_name_only=True)
        calls = []
        def fake(region, profile, action, *options):
            calls.append(action)
            if action == 'get-instances':
                return {'instances': [{'name': 'other-student', 'tags': [{'key': infrastructure.TAG}]}]}
            if action == 'get-blueprints':
                raise RuntimeError('Reached new instance path')
            raise AssertionError(action)
        with patch.object(infrastructure, 'get_dns_zone'), patch.object(infrastructure, 'aws', side_effect=fake):
            with self.assertRaisesRegex(RuntimeError, 'Reached new instance path'):
                infrastructure.provision(args)
        self.assertEqual(calls, ['get-instances', 'get-blueprints'])

    def test_removal_deletes_only_matching_resources(self):
        calls = []
        listings = iter([[{'name': NAME, 'tags': [{'key': infrastructure.TAG}]}], []])
        ips = iter([[{'name': NAME + '-ip', 'ipAddress': '203.0.113.4', 'attachedTo': NAME}],
                    [{'name': NAME + '-ip', 'ipAddress': '203.0.113.4', 'isAttached': False}]])
        def fake(region, profile, action, *options):
            calls.append((action, options))
            if action == 'get-instances': return {'instances': next(listings)}
            if action == 'get-static-ips': return {'staticIps': next(ips)}
            return {}
        zone = {'domainEntries': [{'id': 'student-dns', 'name': JOB['hostname'], 'type': 'A', 'target': '203.0.113.4'}]}
        with patch.object(infrastructure, 'aws', side_effect=fake), patch.object(infrastructure, 'get_dns_zone', return_value=zone):
            remove_student.remove(JOB)
        self.assertIn(('delete-instance', ('--instance-name', NAME)), calls)
        self.assertIn(('release-static-ip', ('--static-ip-name', NAME + '-ip')), calls)
        self.assertEqual([action for action, _ in calls].count('delete-domain-entry'), 1)

    def test_removal_refuses_foreign_ip_before_any_mutation(self):
        def fake(region, profile, action, *options):
            if action == 'get-instances': return {'instances': []}
            if action == 'get-static-ips': return {'staticIps': [{'name': NAME + '-ip', 'attachedTo': 'foreign'}]}
            raise AssertionError('Unexpected mutation: ' + action)
        with patch.object(infrastructure, 'aws', side_effect=fake):
            with self.assertRaisesRegex(RuntimeError, 'another instance'):
                remove_student.remove(JOB)

    def test_removal_is_idempotent_when_resources_are_already_gone(self):
        with patch.object(infrastructure, 'aws', side_effect=[{'instances': []}, {'staticIps': []}]), patch.object(infrastructure, 'get_dns_zone', return_value={'domainEntries': []}):
            remove_student.remove(JOB)
