# Upload media to DigitalOcean Spaces

Run this from the project root:

```sh
python3 upload_spaces_assets.py --dry-run
python3 upload_spaces_assets.py
```

The default destination is `s3://godot-forge/2d-game-development/` in `sgp1`. The script scans for image, audio, and video files, including PNG, JPEG, WebP, MP3, MP4, and WebM. It excludes `.git` and `node_modules` by default. Local relative paths become object paths under the prefix.

Before uploading, the script checks each public URL. A new file has no matching object; a changed file has different bytes. Both are uploaded with `public-read`. Unchanged public files are skipped. After uploading, the script verifies the public URLs and updates [SPACES_PUBLIC_URLS.json](SPACES_PUBLIC_URLS.json), [SPACES_PUBLIC_URLS.csv](SPACES_PUBLIC_URLS.csv), and [SPACES_PUBLIC_URLS.md](SPACES_PUBLIC_URLS.md). The app server reads the JSON manifest at startup, so restart it after adding assets. The dry run checks which files would upload without needing credentials.

The AWS CLI must be installed for an upload. When a file needs uploading, the script prompts for the Spaces Access Key ID and Secret Access Key. The secret is not stored by the script. You can also provide a named AWS CLI profile:

```sh
python3 upload_spaces_assets.py --profile digitalocean
```

Useful options:

```sh
python3 upload_spaces_assets.py --help
python3 upload_spaces_assets.py --force
python3 upload_spaces_assets.py --include-dependencies
python3 upload_spaces_assets.py --bucket another-bucket --region sgp1 --prefix game-assets
```

`--force` uploads every selected asset again. `--include-dependencies` also selects media inside `node_modules`. Changing the bucket or prefix creates a separate set of public URLs.
