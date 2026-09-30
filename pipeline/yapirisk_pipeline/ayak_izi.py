"""Bina ayak izleri (Microsoft GlobalMLBuildingFootprints, CDLA Permissive 2.0) → z14 parçaları.

Her bina, merkezinin düştüğü tek bir z14 parçasına yazılır; istemci yalnız görünen parçaları çeker
(S4: Manisa ~475 bin bina, ~15 MB). Koordinatlar 6 ondalık (~10 cm).
"""

import csv
import gzip
import json
import math
import shutil
from collections import defaultdict
from collections.abc import Iterator
from pathlib import Path

from shapely.geometry import shape
from shapely.geometry.base import BaseGeometry
from shapely.prepared import prep

from .ortak import indir, json_yaz

MS_LISTE = "https://minedbuildings.z5.web.core.windows.net/global-buildings/dataset-links.csv"
KAYNAK_Z = 9  # Microsoft dosyaları z9 quadkey'lerine bölünmüş
PARCA_Z = 14


def karo(boylam: float, enlem: float, z: int) -> tuple[int, int]:
    """Web Mercator karo (x, y)."""
    n = 2**z
    x = int((boylam + 180) / 360 * n)
    e = math.radians(enlem)
    y = int((1 - math.asinh(math.tan(e)) / math.pi) / 2 * n)
    return min(max(x, 0), n - 1), min(max(y, 0), n - 1)


def quadkey(x: int, y: int, z: int) -> str:
    return "".join(str(((x >> i) & 1) | (((y >> i) & 1) << 1)) for i in range(z - 1, -1, -1))


def kapsayan_quadkeyler(kutu: tuple[float, float, float, float], z: int = KAYNAK_Z) -> set[str]:
    bmin, emin, bmax, emax = kutu
    x0, y0 = karo(bmin, emax, z)  # kuzeybatı
    x1, y1 = karo(bmax, emin, z)  # güneydoğu
    return {quadkey(x, y, z) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}


def kaynak_dosyalar(kutu: tuple[float, float, float, float]) -> tuple[list[Path], dict]:
    liste, liste_meta = indir("ms/dataset-links.csv", MS_LISTE)
    istenen = kapsayan_quadkeyler(kutu)
    satirlar = [
        s
        for s in csv.DictReader(liste.read_text(encoding="utf-8").splitlines())
        if s["Location"] == "Turkey" and s["QuadKey"] in istenen
    ]
    yollar = [
        indir(f"ms/{s['QuadKey']}.csv.gz", s["Url"], zaman_asimi=600)[0]
        for s in sorted(satirlar, key=lambda s: s["QuadKey"])
    ]
    # Liste sürümü (URL'deki tarih) kaynak.json'a yazılır.
    surum = satirlar[0]["Url"].split("/global-buildings/")[1].split("/")[0] if satirlar else ""
    return yollar, {"liste": liste_meta, "surum": surum, "quadkeyler": sorted(s["QuadKey"] for s in satirlar)}


def _binalar(yollar: list[Path]) -> Iterator[dict]:
    for yol in yollar:
        with gzip.open(yol, "rt", encoding="utf-8") as g:
            for satir in g:
                yield json.loads(satir)["geometry"]


def parcala(yollar: list[Path], il: BaseGeometry, hedef: Path) -> dict:
    """Il içindeki binaları z14 parçalarına yazar. Döner: parça dizini + sayımlar."""
    il_p = prep(il)
    parcalar: dict[tuple[int, int], list] = defaultdict(list)
    atlanan = 0
    for geo in _binalar(yollar):
        if geo["type"] != "Polygon":
            atlanan += 1
            continue
        merkez = shape(geo).centroid
        if not il_p.contains(merkez):
            continue
        halkalar = [[[round(b, 6), round(e, 6)] for b, e in halka] for halka in geo["coordinates"]]
        parcalar[karo(merkez.x, merkez.y, PARCA_Z)].append(halkalar)

    # Eski çalıştırmadan kalan parça yeni dizinde olmasın.
    if hedef.exists():
        shutil.rmtree(hedef)
    dizin = []
    for (x, y), binalar in sorted(parcalar.items()):
        binalar.sort()  # kaynak dosya sırasından bağımsız, kararlı çıktı
        json_yaz(hedef / str(x) / f"{y}.json.gz", {"binalar": binalar})
        dizin.append([x, y, len(binalar)])
    json_yaz(hedef / "dizin.json", {"z": PARCA_Z, "parcalar": dizin})
    return {"parca": len(dizin), "bina": sum(d[2] for d in dizin), "atlanan_cokgen_disi": atlanan}
