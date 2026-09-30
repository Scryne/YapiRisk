"""Tek komut: bölge paketini üretir.

    uv run python -m yapirisk_pipeline manisa

Çıktı public/data/<bölge>/ (tehlike, sınır, mahalleler, bina parçaları, kaynak.json),
public/data/dogrulama.json ve public/data/bolgeler.json. Ağ yalnız ilk çalıştırmada; ham dosyalar
pipeline/.onbellek/ altında kalır, ikinci çalıştırma bayt bayt aynı çıktıyı verir.
"""

import argparse
import hashlib
import json
import sys
import time

from shapely.geometry import mapping

from . import ayak_izi, dogrulama, mahalle, osm, tehlike
from .bolgeler import BOLGELER, Bolge
from .ortak import VERI, json_yaz

LISANS = {
    "osm": {
        "ad": "OpenStreetMap katkıcıları",
        "lisans": "ODbL 1.0",
        "atif": "© OpenStreetMap katkıcıları",
        "url": "https://www.openstreetmap.org/copyright",
    },
    "eshm20": {
        "ad": "ESHM20, European Seismic Hazard Model 2020 (EFEHR)",
        "lisans": "CC BY 4.0",
        "atif": "Danciu vd. 2021, ESHM20, EFEHR, doi:10.12686/a15",
        "url": "https://efehr-services.ethz.ch",
    },
    "microsoft": {
        "ad": "Microsoft GlobalMLBuildingFootprints",
        "lisans": "CDLA Permissive 2.0",
        "atif": "Microsoft Building Footprints",
        "url": "https://github.com/microsoft/GlobalMLBuildingFootprints",
    },
}


def _log(mesaj: str) -> None:
    print(mesaj, flush=True)


def bolge_paketi(bolge: Bolge) -> dict:
    hedef = VERI / bolge.kimlik
    dosyalar: dict[str, str] = {}
    t0 = time.time()

    il, il_osm = osm.il_siniri(bolge)
    ilceler, ilce_osm = osm.ilceler(bolge, il)
    _log(f"sınırlar: il + {len(ilceler)} ilçe ({time.time() - t0:.0f} sn)")

    kutu = il.bounds
    izgaralar, izgara_meta = tehlike.izgara_cek(f"{bolge.kimlik}/eshm20", kutu)
    # Il sınırının her köşesi ızgara içinde olmalı (bilineer her binada tanımlı).
    for b, e in [(kutu[0], kutu[1]), (kutu[2], kutu[3])]:
        tehlike.bilineer(izgaralar["SS"], e, b)
    dosyalar["tehlike-eshm20.json"] = json_yaz(
        hedef / "tehlike-eshm20.json",
        {
            "model": "ESHM20 (EFEHR model 81)",
            "yillikAsilmaOlasiligi": tehlike.POE,
            "donusPeriyodu": 475,
            "referansZemin": "Vs30 = 760 m/s",
            "cekim": izgara_meta["SS"]["cekim"],
            "buyuklukler": {"PGA": "PGA", "SS": "SA(0,2 s)", "S1": "SA(1,0 s)"},
            "izgaralar": izgaralar,
        },
    )
    _log(
        f"tehlike: {len(izgaralar['SS']['enlemler'])}×{len(izgaralar['SS']['boylamlar'])} ({time.time() - t0:.0f} sn)"
    )

    sade = il.simplify(0.001, preserve_topology=True)
    dosyalar["sinir.json"] = json_yaz(
        hedef / "sinir.json",
        {"type": "Feature", "properties": {"ad": bolge.ad}, "geometry": _yuvarla(mapping(sade))},
    )

    yerler = osm.yer_kayitlari(bolge)
    dizin = mahalle.mahalle_dizini(yerler.elemanlar, il, ilceler)
    dosyalar["mahalleler.json"] = json_yaz(hedef / "mahalleler.json", {"kayitlar": dizin})
    _log(f"mahalle dizini: {len(dizin)} kayıt ({time.time() - t0:.0f} sn)")

    ms_yollar, ms_meta = ayak_izi.kaynak_dosyalar(kutu)
    sayim = ayak_izi.parcala(ms_yollar, il, hedef / "bina")
    bina_ozet = hashlib.sha256()
    bina_dosyalari = sorted((hedef / "bina").rglob("*"))
    for yol in bina_dosyalari:
        if yol.is_file():
            bina_ozet.update(
                f"{yol.relative_to(hedef).as_posix()} {hashlib.sha256(yol.read_bytes()).hexdigest()}\n".encode()
            )
    _log(f"ayak izi: {sayim['bina']:,} bina, {sayim['parca']} parça ({time.time() - t0:.0f} sn)")

    kaynak = {
        "bolge": bolge.kimlik,
        "dosyalar": dosyalar,
        "bina": {**sayim, "dizinOzeti": bina_ozet.hexdigest()},
        "kaynaklar": {
            "osm": {
                **LISANS["osm"],
                "osmTarihi": il_osm.osm_tarihi,
                "cekim": il_osm.meta["cekim"],
                "sorgular": {
                    "il": il_osm.meta["url"],
                    "ilceler": ilce_osm.meta["url"],
                    "yerler": yerler.meta["url"],
                },
            },
            "eshm20": {
                **LISANS["eshm20"],
                "cekim": izgara_meta["SS"]["cekim"],
                "sorgular": {k: v["url"] for k, v in izgara_meta.items()},
            },
            "microsoft": {
                **LISANS["microsoft"],
                "surum": ms_meta["surum"],
                "quadkeyler": ms_meta["quadkeyler"],
                "cekim": ms_meta["liste"]["cekim"],
            },
        },
    }
    json_yaz(hedef / "kaynak.json", kaynak)
    return {
        "kimlik": bolge.kimlik,
        "ad": bolge.ad,
        "merkez": list(bolge.merkez),
        "yakinlik": bolge.yakinlik,
        "sinirKutusu": [round(v, 4) for v in kutu],
    }


def _yuvarla(geo):
    if isinstance(geo, dict):
        return {k: _yuvarla(v) for k, v in geo.items()}
    if isinstance(geo, list | tuple):
        return [_yuvarla(v) for v in geo]
    if isinstance(geo, float):
        return round(geo, 5)
    return geo


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="yapirisk_pipeline", description=__doc__)
    ap.add_argument("bolgeler", nargs="+", choices=sorted(BOLGELER), help="üretilecek bölge(ler)")
    ap.add_argument("--dogrulama-yok", action="store_true", help="dogrulama.json'u yeniden üretme")
    arg = ap.parse_args(argv)

    # Kayıt defteri tüm bölgeleri içerir; bu çalıştırmada üretilmeyen bölgenin kaydı öncekinden korunur.
    defter_yol = VERI / "bolgeler.json"
    kayitlar = (
        {k["kimlik"]: k for k in json.loads(defter_yol.read_text(encoding="utf-8"))["bolgeler"]}
        if defter_yol.exists()
        else {}
    )
    for k in arg.bolgeler:
        kayitlar[k] = bolge_paketi(BOLGELER[k])
    json_yaz(defter_yol, {"bolgeler": [kayitlar[k] for k in sorted(kayitlar)]})

    if not arg.dogrulama_yok:
        ozet, meta = dogrulama.olc()
        ozet["kaynaklar"] = {
            "aci133": {**dogrulama.ACI133_KUNYE, "cekim": meta["aci133"]["cekim"]},
            "eshm20": {**LISANS["eshm20"], "cekim": meta["eshm20"]["SS"]["cekim"]},
        }
        json_yaz(VERI / "dogrulama.json", ozet)
        _log(f"doğrulama: n={ozet['nKapsam']}, AUC {ozet['auc']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
