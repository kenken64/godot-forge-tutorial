#!/bin/sh
set -eu

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y docker.io docker-compose-v2 git unzip
systemctl enable --now docker
mkdir -p /srv/godot-forge-cloud/data
