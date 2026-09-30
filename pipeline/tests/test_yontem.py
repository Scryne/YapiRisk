"""Boru hattının Python puanı = spike ryteie.py = istemci TS motoru (aynı ACI-133 fikstürü)."""

import csv
import json

from yapirisk_pipeline import tehlike, yontem
from yapirisk_pipeline.dogrulama import auc
from yapirisk_pipeline.ortak import REPO, YONTEM


def test_aci133_fiksturu_ile_birebir():
    fikstur = json.loads((YONTEM / "__fikstur__" / "aci133-pp.json").read_text(encoding="utf-8"))
    karsilastirma = 0
    for b in fikstur["binalar"]:
        for ad, oran in fikstur["oranlar"].items():
            beklenen = b["sonuc"][ad]
            s = yontem.sds(b["ssEshm20"] / oran, b["zemin"])
            bolge = yontem.tehlike_bolgesi(s, b["zemin"])
            pp = yontem.puan(
                b["kat"],
                bolge,
                perde=b["perde"],
                kusurlar={"yumusakKat": b["yumusakKat"], "kisaKolon": b["kisaKolon"]},
            )
            assert abs(s - beklenen["sds"]) < 1e-12
            assert (bolge, pp) == (beklenen["bolge"], beklenen["pp"])
            karsilastirma += 1
    assert karsilastirma == 462


def test_zemin_sinifi_vs30_sinirlari():
    assert [yontem.zemin_sinifi(v) for v in (1600, 1500, 761, 760, 361, 360, 181, 180)] == [
        "ZA",
        "ZB",
        "ZB",
        "ZC",
        "ZC",
        "ZD",
        "ZD",
        "ZE",
    ]


def test_auc():
    assert auc([3, 2, 1, 0], [True, True, False, False]) == 1.0
    assert auc([0, 1, 2, 3], [True, True, False, False]) == 0.0
    assert auc([1, 1, 1, 1], [True, False, True, False]) == 0.5


def test_izgara_s1_degerleri():
    """EFEHR nokta listesi → düzenli ızgara → bilineer; spike S1 değerleriyle 3 ondalık."""
    s1 = REPO / "spike" / "S1"
    izgaralar = {
        ad: tehlike.duzenli_izgara(
            json.loads((s1 / "veri" / f"manisa-{dosya}.json").read_text(encoding="utf-8"))["points"]
        )
        for ad, dosya in {"PGA": "PGA", "SS": "SA0.20s", "S1": "SA1.00s"}.items()
    }
    assert len(izgaralar["SS"]["enlemler"]) == 15 and len(izgaralar["SS"]["boylamlar"]) == 22
    noktalar = {r["no"]: r for r in csv.DictReader((s1 / "tdth-okumalar.csv").open(encoding="utf-8-sig"))}
    satirlar = list(csv.DictReader((s1 / "sonuc.csv").open(encoding="utf-8-sig")))
    assert len(satirlar) == 30
    for r in satirlar:
        n = noktalar[r["no"]]
        v = tehlike.bilineer(izgaralar[r["buyukluk"]], float(n["enlem"]), float(n["boylam"]))
        assert abs(v - float(r["eshm20"])) <= 0.0005 + 1e-9, (r["ilce"], r["buyukluk"])
