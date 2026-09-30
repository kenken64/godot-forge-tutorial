"""Offline checks for Lightsail reuse, creation, static IP, and DNS safety."""

import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location(
    "provision_lightsail", Path(__file__).with_name("provision_lightsail.py")
)
provision = importlib.util.module_from_spec(spec)
spec.loader.exec_module(provision)


def arguments():
    return SimpleNamespace(
        region="ap-southeast-1", profile=None, name="godot-forge-cloud",
        static_ip_name="godot-forge-cloud-ip", bundle_id=None, zone=None,
        key_pair_name=None, dns_domain="kere.com", dns_name="godot.kere.com",
    )


class ProvisionLightsailTests(unittest.TestCase):
    def test_loads_ignored_aws_env_without_echoing_values(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, ".env.aws").write_text(
                'AWS_ACCESS_KEY_ID="test-key"\nAWS_SECRET_ACCESS_KEY="test-secret"\nAWS_REGION=ap-southeast-1\n'
            )
            with patch.object(provision, "ROOT", Path(directory)), \
                 patch.dict("os.environ", {}, clear=True), \
                 contextlib.redirect_stdout(io.StringIO()) as out:
                provision.load_local_aws_env()
                self.assertEqual(provision.os.environ["AWS_ACCESS_KEY_ID"], "test-key")
                self.assertEqual(provision.os.environ["AWS_SECRET_ACCESS_KEY"], "test-secret")
                self.assertEqual(provision.os.environ["AWS_REGION"], "ap-southeast-1")
                self.assertEqual(out.getvalue(), "")

    def test_reuses_running_instance_without_creating_resources(self):
        instance = {
            "name": "godot-forge-cloud", "state": {"name": "running"},
            "publicIpAddress": "203.0.113.10", "bundleId": "medium_3_0",
        }
        calls = []

        def fake_aws(region, profile, action, *args):
            calls.append(action)
            return {
                "get-instances": {"instances": [instance]},
                "get-bundles": {"bundles": [{"bundleId": "medium_3_0", "price": 24.0,
                                            "ramSizeInGb": 4, "cpuCount": 2,
                                            "publicIpv4AddressCount": 1}]},
                "get-instance": {"instance": instance},
                "get-static-ips": {"staticIps": [{
                    "name": "godot-forge-cloud-ip", "ipAddress": "203.0.113.11",
                    "attachedTo": "godot-forge-cloud", "isAttached": True,
                }]},
                "get-instance-port-states": {"portStates": [
                    {"fromPort": 80, "toPort": 80, "protocol": "tcp", "state": "open"},
                    {"fromPort": 443, "toPort": 443, "protocol": "tcp", "state": "open"},
                ]},
                "get-domain": {"domain": {"name": "kere.com", "domainEntries": [
                    {"id": "record-id", "name": "godot.kere.com", "type": "A", "target": "203.0.113.11"},
                ]}},
            }[action]

        with patch.object(provision, "aws", side_effect=fake_aws), contextlib.redirect_stdout(io.StringIO()) as out:
            provision.provision(arguments())
        self.assertIn("Reusing Lightsail instance", out.getvalue())
        self.assertIn("203.0.113.11", out.getvalue())
        self.assertIn("Lightsail DNS: godot.kere.com", out.getvalue())
        self.assertEqual(calls, ["get-domain", "get-instances", "get-bundles", "get-instance",
                                 "get-static-ips", "get-instance-port-states", "get-domain"])

    def test_creates_instance_and_attaches_ip_when_none_exists(self):
        instance = {
            "name": "godot-forge-cloud", "state": {"name": "running"},
            "publicIpAddress": "203.0.113.20",
        }
        allocated = {"name": "godot-forge-cloud-ip", "ipAddress": "203.0.113.21", "isAttached": False}
        calls = []
        ip_reads = 0

        def fake_aws(region, profile, action, *args):
            nonlocal ip_reads
            calls.append((action, args))
            if action == "get-instances":
                return {"instances": []}
            if action == "get-blueprints":
                return {"blueprints": [{"blueprintId": "ubuntu_24_04", "name": "Ubuntu 24.04",
                                        "type": "os", "platform": "LINUX_UNIX", "isActive": True}]}
            if action == "get-bundles":
                return {"bundles": [
                    {"bundleId": "xlarge_3_0", "ramSizeInGb": 16, "cpuCount": 4,
                     "price": 84.0, "isActive": True, "supportedPlatforms": ["LINUX_UNIX"],
                     "publicIpv4AddressCount": 1},
                    {"bundleId": "medium_3_0", "ramSizeInGb": 4, "cpuCount": 2,
                     "price": 24.0, "isActive": True, "supportedPlatforms": ["LINUX_UNIX"],
                     "publicIpv4AddressCount": 1},
                ]}
            if action == "get-regions":
                return {"regions": [{"name": "ap-southeast-1", "availabilityZones": [
                    {"zoneName": "ap-southeast-1a", "state": "available"}]}]}
            if action == "get-instance":
                return {"instance": instance}
            if action == "get-static-ips":
                ip_reads += 1
                return {"staticIps": [] if ip_reads == 1 else [allocated]}
            if action == "get-instance-port-states":
                return {"portStates": [{"fromPort": 80, "toPort": 80,
                                        "protocol": "tcp", "state": "open"}]}
            if action == "get-domain":
                return {"domain": {"name": "kere.com", "domainEntries": []}}
            return {}

        with patch.object(provision, "aws", side_effect=fake_aws), contextlib.redirect_stdout(io.StringIO()) as out:
            provision.provision(arguments())
        self.assertIn("Creating Lightsail instance", out.getvalue())
        actions = [action for action, _ in calls]
        self.assertEqual(actions.count("create-instances"), 1)
        self.assertEqual(actions.count("allocate-static-ip"), 1)
        self.assertEqual(actions.count("attach-static-ip"), 1)
        self.assertEqual(actions.count("open-instance-public-ports"), 1)
        self.assertEqual(actions.count("create-domain-entry"), 1)
        create_options = next(args for action, args in calls if action == "create-instances")
        self.assertIn("medium_3_0", create_options)
        self.assertNotIn("xlarge_3_0", create_options)
        self.assertIn("ubuntu_24_04", create_options)

    def test_creates_dns_record_in_us_east_1(self):
        with patch.object(provision, "aws", side_effect=[
            {"domain": {"name": "kere.com", "domainEntries": []}}, {},
        ]) as mocked:
            result = provision.ensure_dns_entry(None, "kere.com", "godot.kere.com", "203.0.113.11")
        self.assertEqual(result, "created")
        self.assertEqual(mocked.call_args_list[0].args[:3], ("us-east-1", None, "get-domain"))
        create_call = mocked.call_args_list[1].args
        self.assertEqual(create_call[:3], ("us-east-1", None, "create-domain-entry"))
        self.assertEqual(create_call[3:5], ("--domain-name", "kere.com"))
        self.assertEqual(json.loads(create_call[6]), {
            "name": "godot.kere.com", "type": "A", "target": "203.0.113.11", "isAlias": False,
        })

    def test_updates_existing_dns_record_when_static_ip_changes(self):
        existing = {"id": "record-id", "name": "godot.kere.com", "type": "A",
                    "target": "203.0.113.10", "isAlias": False}
        with patch.object(provision, "aws", side_effect=[
            {"domain": {"name": "kere.com", "domainEntries": [existing]}}, {},
        ]) as mocked:
            result = provision.ensure_dns_entry(None, "kere.com", "godot.kere.com", "203.0.113.11")
        self.assertEqual(result, "updated")
        update_call = mocked.call_args_list[1].args
        self.assertEqual(update_call[:3], ("us-east-1", None, "update-domain-entry"))
        self.assertEqual(json.loads(update_call[6]), {
            "id": "record-id", "name": "godot.kere.com", "type": "A",
            "target": "203.0.113.11", "isAlias": False,
        })

    def test_rejects_conflicting_dns_record(self):
        with patch.object(provision, "aws", return_value={"domain": {
            "name": "kere.com", "domainEntries": [{"name": "godot.kere.com", "type": "CNAME"}],
        }}) as mocked:
            with self.assertRaisesRegex(RuntimeError, "CNAME or AAAA"):
                provision.ensure_dns_entry(None, "kere.com", "godot.kere.com", "203.0.113.11")
        mocked.assert_called_once()

    def test_missing_dns_zone_stops_before_instance_creation(self):
        with patch.object(provision, "aws", side_effect=RuntimeError("ResourceNotFoundException")) as mocked:
            with self.assertRaisesRegex(RuntimeError, "DNS zone kere.com does not exist"):
                provision.provision(arguments())
        self.assertEqual(mocked.call_args_list[0].args[:3], ("us-east-1", None, "get-domain"))
        mocked.assert_called_once()

    def test_rejects_existing_instance_above_budget(self):
        instance = {"name": "godot-forge-cloud", "state": {"name": "running"},
                    "bundleId": "xlarge_3_0"}
        calls = []

        def fake_aws(region, profile, action, *args):
            calls.append(action)
            return {"get-domain": {"domain": {"name": "kere.com", "domainEntries": []}},
                    "get-instances": {"instances": [instance]},
                    "get-bundles": {"bundles": [{"bundleId": "xlarge_3_0", "price": 84.0}]}}[action]

        with patch.object(provision, "aws", side_effect=fake_aws):
            with self.assertRaisesRegex(RuntimeError, r"exceeds the \$24/month budget"):
                provision.provision(arguments())
        self.assertEqual(calls, ["get-domain", "get-instances", "get-bundles"])

    def test_does_not_take_static_ip_from_another_instance(self):
        with patch.object(provision, "aws", return_value={"staticIps": [{
            "name": "godot-forge-cloud-ip", "ipAddress": "203.0.113.30",
            "attachedTo": "someone-else", "isAttached": True,
        }]}) as mocked:
            with self.assertRaisesRegex(RuntimeError, "was not moved"):
                provision.ensure_static_ip("ap-southeast-1", None, "godot-forge-cloud", "godot-forge-cloud-ip")
        mocked.assert_called_once()


if __name__ == "__main__":
    unittest.main()
