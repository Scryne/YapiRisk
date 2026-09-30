"""Boru hattı adımlarının paylaştığı yardımcılar.

Çıktılar yeniden üretilebilir olmalı: aynı girdiyle iki çalıştırma bayt bayt aynı dosyayı ve
dolayısıyla aynı sha256'yı verir (kaynak.json bunu kaydeder). Ağdan gelen her ham dosya
`pipeline/.onbellek/` altında çekim tarihiyle saklanır; ikinci çalıştırma ağa çıkmaz.
"""

import gzip
import hashlib
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
ONBELLEK = REPO / "pipeline" / ".onbellek"
VERI = REPO / "public" / "data"
YONTEM = REPO / "src" / "yontem"
KULLANICI_AJANI = "YapiRisk-pipeline/0.1 (+https://github.com/Scryne/YapiRisk)"


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


def indir(
    ad: str,
    url: str,
    *,
    veri: dict[str, str] | None = None,
    yedek_urller: tuple[str, ...] = (),
    zaman_asimi: float = 300,
    deneme: int = 3,
) -> tuple[Path, dict[str, str]]:
    """URL'yi önbelleğe indirir (varsa dokunmaz). `veri` verilirse POST form gövdesi olarak gider.

    Döner: (dosya yolu, meta). Meta: url, çekim tarihi (UTC), sha256.
    """
    yol = ONBELLEK / ad
    meta_yol = yol.with_name(yol.name + ".meta.json")
    if yol.exists() and meta_yol.exists():
        return yol, json.loads(meta_yol.read_text(encoding="utf-8"))

    govde = urllib.parse.urlencode(veri).encode() if veri else None
    son_hata: Exception | None = None
    for aday in (url, *yedek_urller):
        for i in range(deneme):
            try:
                istek = urllib.request.Request(aday, data=govde, headers={"User-Agent": KULLANICI_AJANI})
                with urllib.request.urlopen(istek, timeout=zaman_asimi) as yanit:
                    icerik = yanit.read()
                yol.parent.mkdir(parents=True, exist_ok=True)
                gecici = yol.with_name(yol.name + ".indiriliyor")
                gecici.write_bytes(icerik)
                gecici.replace(yol)
                meta = {
                    "url": aday,
                    "cekim": datetime.now(UTC).strftime("%Y-%m-%d"),
                    "sha256": hashlib.sha256(icerik).hexdigest(),
                }
                meta_yol.write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
                return yol, meta
            except (urllib.error.URLError, TimeoutError, ConnectionError) as hata:
                son_hata = hata
                time.sleep(5 * (i + 1))
    raise RuntimeError(f"{ad} indirilemedi: {son_hata}")
