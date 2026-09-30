"""Boru hattı adımlarının paylaştığı yardımcılar.

Çıktılar yeniden üretilebilir olmalı: aynı girdiyle iki çalıştırma bayt bayt aynı dosyayı ve
dolayısıyla aynı sha256'yı verir (kaynak.json bunu kaydeder).
"""

import gzip
import hashlib
import json
from pathlib import Path
from typing import Any


def json_bayt(veri: Any) -> bytes:
    """Deterministik JSON: sıralı anahtar, sabit ayraç, UTF-8, sonda satır sonu."""
    metin = json.dumps(veri, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return (metin + "\n").encode("utf-8")


def json_yaz(yol: Path, veri: Any) -> str:
    """JSON'u yazar, sha256'sını döner. `.gz` uzantısında zaman damgasız gzip kullanır."""
    ham = json_bayt(veri)
    if yol.suffix == ".gz":
        ham = gzip.compress(ham, compresslevel=9, mtime=0)
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_bytes(ham)
    return hashlib.sha256(ham).hexdigest()


def sha256_dosya(yol: Path) -> str:
    h = hashlib.sha256()
    with yol.open("rb") as f:
        for parca in iter(lambda: f.read(1 << 20), b""):
            h.update(parca)
    return h.hexdigest()
