"""Keep the KasmVNC controls in English, regardless of browser language."""

from pathlib import Path
import sys


client = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/usr/share/kasmvnc/www/app/localization.js')
source = client.read_text()
marker = '    setup(supportedLanguages) {'
if source.count(marker) != 1:
    raise SystemExit(f'Cannot locate the KasmVNC language selector in {client}')

patched = source.replace(
    marker,
    marker + "\n        this.language = 'en';\n        return;",
    1,
)
client.write_text(patched)
