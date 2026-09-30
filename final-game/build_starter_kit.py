#!/usr/bin/env python3
"""Build a Godot Web Editor ZIP from the published tutorial-module media."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
from urllib.request import urlopen
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / "final-game" / "starter-project"
MANIFEST = ROOT / "SPACES_PUBLIC_URLS.json"
DEFAULT_OUTPUT = ROOT / "final-game" / "dist" / "godot-forge-starter-v1.zip"
ZIP_TIME = (2026, 1, 1, 0, 0, 0)


def module_names() -> set[str]:
    return {
        directory.name
        for directory in ROOT.iterdir()
        if directory.is_dir() and directory.name not in {"final-game", "tutorial-web-app"} and (directory / "index.html").is_file()
    }


def published_module_assets() -> list[dict]:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    modules = module_names()
    selected = []
    for item in manifest["assets"]:
        path = PurePosixPath(item["localPath"])
        if path.parts[0] not in modules or "originals" in path.parts:
            continue
        if path.is_absolute() or ".." in path.parts:
            raise ValueError(f"Unsafe manifest path: {path}")
        selected.append(item)
    return sorted(selected, key=lambda item: item["localPath"])


def read_media(item: dict, allow_download: bool) -> bytes:
    path = ROOT / item["localPath"]
    if path.is_file():
        data = path.read_bytes()
    elif allow_download:
        with urlopen(item["publicUrl"], timeout=60) as response:
            data = response.read()
    else:
        raise FileNotFoundError(f"Missing {path}; rerun with --download-missing")
    if len(data) != item["sizeBytes"]:
        raise ValueError(f"Size mismatch for {item['localPath']}: got {len(data)}, expected {item['sizeBytes']}")
    return data


def add_bytes(archive: ZipFile, name: str, data: bytes, compression: int) -> None:
    info = ZipInfo(name, date_time=ZIP_TIME)
    info.compress_type = compression
    info.external_attr = 0o644 << 16
    archive.writestr(info, data)


def build(output: Path, allow_download: bool) -> tuple[int, int]:
    items = published_module_assets()
    if not items:
        raise RuntimeError("No published module assets were found")
    output.parent.mkdir(parents=True, exist_ok=True)
    temp = output.with_suffix(output.suffix + ".tmp")
    catalog = []
    try:
        with ZipFile(temp, "w", allowZip64=True) as archive:
            for path in sorted(PROJECT.rglob("*")):
                if path.is_file():
                    name = path.relative_to(PROJECT).as_posix()
                    add_bytes(archive, name, path.read_bytes(), ZIP_DEFLATED)
            for item in items:
                data = read_media(item, allow_download)
                target = f"assets/{item['localPath']}"
                add_bytes(archive, target, data, ZIP_STORED)
                catalog.append({
                    "path": target,
                    "module": item["localPath"].split("/", 1)[0],
                    "sourceUrl": item["publicUrl"],
                    "sizeBytes": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(),
                })
            for path in sorted((ROOT / "character-creation" / "data").glob("*-sprite-sheet*.json")):
                target = f"assets/character-creation/data/{path.name}"
                data = path.read_bytes()
                add_bytes(archive, target, data, ZIP_DEFLATED)
                catalog.append({
                    "path": target,
                    "module": "character-creation",
                    "sourceUrl": None,
                    "sizeBytes": len(data),
                    "sha256": hashlib.sha256(data).hexdigest(),
                })
            add_bytes(archive, "asset_catalog.json", (json.dumps({
                "kitVersion": 1,
                "sourceManifest": "SPACES_PUBLIC_URLS.json",
                "assets": catalog,
            }, indent=2) + "\n").encode(), ZIP_DEFLATED)
        temp.replace(output)
    finally:
        temp.unlink(missing_ok=True)
    return len(catalog), output.stat().st_size


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--download-missing", action="store_true", help="Fetch missing media from public Spaces URLs")
    args = parser.parse_args()
    count, size = build(args.output.resolve(), args.download_missing)
    print(f"Built {args.output}: {count} assets, {size:,} bytes ({size / 1048576:.1f} MiB)")


if __name__ == "__main__":
    main()
