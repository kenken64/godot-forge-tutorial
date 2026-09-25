#!/usr/bin/env python3
"""Upload project media assets to DigitalOcean Spaces and verify public URLs."""

import argparse
import csv
from concurrent.futures import ThreadPoolExecutor, as_completed
from getpass import getpass
import hashlib
import json
import mimetypes
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
IMAGE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif",
    ".tiff", ".avif", ".ico", ".heic", ".apng", ".svg",
}
MEDIA_EXTENSIONS = {
    ".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".opus",
    ".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv", ".mpeg", ".mpg",
}
EXTENSIONS = IMAGE_EXTENSIONS | MEDIA_EXTENSIONS


def assets(include_dependencies=False):
    return sorted(
        (path for path in ROOT.rglob("*")
         if path.is_file()
         and path.suffix.lower() in EXTENSIONS
         and ".git" not in path.relative_to(ROOT).parts
         and (include_dependencies or "node_modules" not in path.relative_to(ROOT).parts)),
        key=lambda path: path.relative_to(ROOT).as_posix(),
    )


def public_url(bucket, region, key):
    return f"https://{bucket}.{region}.digitaloceanspaces.com/{quote(key, safe='/')}"


def digests(path):
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            md5.update(chunk)
            sha256.update(chunk)
    return md5.hexdigest(), sha256.hexdigest()


def remote_matches(url, size, md5, sha256):
    """Check that an anonymous request sees the same asset bytes."""
    try:
        with urlopen(Request(url, method="HEAD"), timeout=20) as response:
            if response.status != 200 or response.headers.get("Content-Length") != str(size):
                return False
            remote_sha = response.headers.get("x-amz-meta-sha256")
            if remote_sha:
                return remote_sha == sha256
            return response.headers.get("ETag", "").strip('"') == md5
    except (HTTPError, URLError, TimeoutError):
        return False


def upload(path, bucket, region, prefix, env, sha256):
    relative = path.relative_to(ROOT).as_posix()
    object_key = f"{prefix}/{relative}" if prefix else relative
    mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    command = [
        "aws", "s3", "cp", str(path), f"s3://{bucket}/{object_key}",
        "--endpoint-url", f"https://{region}.digitaloceanspaces.com",
        "--region", "us-east-1", "--acl", "public-read",
        "--content-type", mime_type, "--metadata", f"sha256={sha256}",
        "--no-progress", "--only-show-errors",
    ]
    for attempt in range(3):
        result = subprocess.run(command, env=env, capture_output=True, text=True)
        if result.returncode == 0:
            return relative, object_key, path.stat().st_size, None
        if attempt < 2:
            time.sleep(2 ** attempt)
    return relative, object_key, path.stat().st_size, result.stderr.strip()


def verify(url, expected_size, md5, sha256):
    for attempt in range(5):
        if remote_matches(url, expected_size, md5, sha256):
            return "public"
        if attempt < 4:
            time.sleep(2 ** attempt)
    return "verification failed"


def write_manifests(items, bucket, region, prefix):
    json_path = ROOT / "SPACES_PUBLIC_URLS.json"
    json_temp = ROOT / "SPACES_PUBLIC_URLS.json.tmp"
    json_temp.write_text(json.dumps({
        "bucket": bucket, "region": region, "prefix": prefix,
        "assets": [
            {"localPath": item["relative"], "publicUrl": item["url"], "sizeBytes": item["size"]}
            for item in items
        ],
    }, indent=2) + "\n", encoding="utf-8")
    json_temp.replace(json_path)

    csv_path = ROOT / "SPACES_PUBLIC_URLS.csv"
    csv_temp = ROOT / "SPACES_PUBLIC_URLS.csv.tmp"
    with csv_temp.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(("local_path", "public_url", "size_bytes", "status"))
        for item in items:
            writer.writerow((item["relative"], item["url"], item["size"], "public"))
    csv_temp.replace(csv_path)

    markdown_path = ROOT / "SPACES_PUBLIC_URLS.md"
    markdown_temp = ROOT / "SPACES_PUBLIC_URLS.md.tmp"
    lines = [
        "# Public DigitalOcean Spaces asset URLs", "",
        f"Bucket: `{bucket}` · Region: `{region}` · Prefix: `{prefix}/`", "",
        f"All {len(items)} media assets were verified as publicly accessible with matching content.",
        "The [CSV](SPACES_PUBLIC_URLS.csv) contains the raw URLs and exact byte sizes.", "",
    ]
    current_group = None
    for item in items:
        group = item["relative"].split("/")[0]
        if group != current_group:
            lines.extend([f"## {group}", "", "| Local asset | Public URL |", "| --- | --- |"])
            current_group = group
        label = item["relative"].replace("|", "\\|")
        lines.append(f'| `{label}` | [Open asset]({item["url"]}) |')
    lines.append("")
    markdown_temp.write_text("\n".join(lines), encoding="utf-8")
    markdown_temp.replace(markdown_path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bucket", default="godot-forge", help="Spaces bucket")
    parser.add_argument("--region", default="sgp1", help="Spaces region")
    parser.add_argument("--prefix", default="2d-game-development", help="Object key prefix")
    parser.add_argument("--profile", help="AWS CLI profile containing Spaces credentials")
    parser.add_argument("--include-dependencies", action="store_true", help="Also upload node_modules media")
    parser.add_argument("--force", action="store_true", help="Upload unchanged media too")
    parser.add_argument("--dry-run", action="store_true", help="Preview uploads without credentials")
    parser.add_argument("--workers", type=int, default=8, help="Concurrent checks and uploads")
    args = parser.parse_args()
    if args.workers < 1:
        parser.error("--workers must be at least 1")
    prefix = args.prefix.strip("/")

    files = assets(args.include_dependencies)
    items = []
    for path in files:
        relative = path.relative_to(ROOT).as_posix()
        key = f"{prefix}/{relative}" if prefix else relative
        md5, sha256 = digests(path)
        items.append({"path": path, "relative": relative, "key": key,
                      "url": public_url(args.bucket, args.region, key),
                      "size": path.stat().st_size, "md5": md5, "sha256": sha256})
    total_bytes = sum(item["size"] for item in items)
    print(f"Selected {len(items)} media assets ({total_bytes:,} bytes).", flush=True)
    print(f"Destination: s3://{args.bucket}/{prefix + '/' if prefix else ''}", flush=True)

    if args.force:
        pending = items
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            matches = list(executor.map(
                lambda item: remote_matches(item["url"], item["size"], item["md5"], item["sha256"]), items))
        pending = [item for item, matched in zip(items, matches) if not matched]
    print(f"Unchanged and public: {len(items) - len(pending)}; upload needed: {len(pending)}.", flush=True)
    if args.dry_run:
        for item in pending:
            print(item["relative"])
        return 0

    if pending:
        if not shutil.which("aws"):
            print("Install the AWS CLI before uploading.", file=sys.stderr)
            return 2
        env = os.environ.copy()
        env.update(AWS_DEFAULT_REGION="us-east-1", AWS_EC2_METADATA_DISABLED="true")
        if args.profile:
            env.pop("AWS_ACCESS_KEY_ID", None)
            env.pop("AWS_SECRET_ACCESS_KEY", None)
            env["AWS_PROFILE"] = args.profile
        else:
            env.pop("AWS_PROFILE", None)
            try:
                access_key = env.get("SPACES_ACCESS_KEY_ID") or input("Spaces Access Key ID: ").strip()
                secret_key = env.get("SPACES_SECRET_ACCESS_KEY") or getpass("Spaces Secret Access Key: ")
            except EOFError:
                print("Spaces credentials are required.", file=sys.stderr)
                return 2
            if not access_key or not secret_key:
                print("Both Spaces key values are required.", file=sys.stderr)
                return 2
            env.update(AWS_ACCESS_KEY_ID=access_key, AWS_SECRET_ACCESS_KEY=secret_key)

        check = subprocess.run(
            ["aws", "s3api", "head-bucket", "--bucket", args.bucket,
             "--endpoint-url", f"https://{args.region}.digitaloceanspaces.com",
             "--region", "us-east-1"],
            env=env, capture_output=True, text=True,
        )
        if check.returncode:
            print("Cannot access target bucket:", check.stderr.strip(), file=sys.stderr)
            return 1

        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            futures = [executor.submit(upload, item["path"], args.bucket, args.region,
                                       prefix, env, item["sha256"]) for item in pending]
            failures = []
            for number, future in enumerate(as_completed(futures), 1):
                relative, _, _, error = future.result()
                if error:
                    failures.append((relative, error))
                if number % 20 == 0 or number == len(pending):
                    print(f"Uploaded {number}/{len(pending)}", flush=True)
        if failures:
            for relative, error in failures:
                print(f"Upload failed: {relative}: {error}", file=sys.stderr)
            return 1

        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            statuses = list(executor.map(
                lambda item: verify(item["url"], item["size"], item["md5"], item["sha256"]), pending))
        failures = [item["relative"] for item, status in zip(pending, statuses) if status != "public"]
        if failures:
            for relative in failures:
                print(f"Public URL verification failed: {relative}", file=sys.stderr)
            return 1

    write_manifests(items, args.bucket, args.region, prefix)
    print(f"Verified {len(items)} public URLs. Updated SPACES_PUBLIC_URLS.json, .csv, and .md.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
