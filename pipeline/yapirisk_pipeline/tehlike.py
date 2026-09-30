"""ESHM20 tehlike ızgarası (EFEHR, CC BY 4.0) → istemcinin bilineer okuduğu düzenli ızgara (K-2).

Parametreler S1'de doğrulandı: model 81, yıllık aşılma olasılığı 0,002103 (475 yıl = TBDY DD-2),
aritmetik ortalama. Referans zemin Vs30 = 760 m/s (TBDY ZB referansıyla aynı), yani SS ↔ SA(0,2 s).
Tek nokta sorgusu (/v1/maps) noktayı değil ızgarayı döndürür; alan sorgusu doğru araç.
"""

import json
import urllib.parse

from .ortak import indir

EFEHR = "https://efehr-services.ethz.ch/api/v1/maps/area"
MODEL = 81
POE = 0.002103
BUYUKLUKLER = {"PGA": "PGA", "SS": "SA[0.20s]", "S1": "SA[1.00s]"}
#: Izgara aralığı 0,1°; sınırın bir hücre dışına kadar çekilir ki bilineer her yerde tanımlı olsun.
PAY = 0.15


def izgara_cek(
    onek: str, kutu: tuple[float, float, float, float], *, eksik_serbest: bool = False
) -> tuple[dict, dict[str, dict]]:
    """kutu: (boylam_min, enlem_min, boylam_max, enlem_max). Döner: {büyüklük: ızgara}, {büyüklük: meta}.

    `eksik_serbest`: model alanının kenarında (ör. ESHM20'nin Suriye sınırı) boş hücreye izin verir;
    bilineer yalnız köşeleri dolu hücrede hesaplar. İstemciye giden bölge paketinde kullanılmaz.
    """
    bmin, emin, bmax, emax = kutu
    izgaralar, metalar = {}, {}
    for ad, imt in BUYUKLUKLER.items():
        sorgu = urllib.parse.urlencode(
            {
                "lon_min": round(bmin - PAY, 2),
                "lat_min": round(emin - PAY, 2),
                "lon_max": round(bmax + PAY, 2),
                "lat_max": round(emax + PAY, 2),
                "modelid": MODEL,
                "imt": imt,
                "poe": POE,
                "timespan": 1,
                "aggregationtype": "arithmetic",
                "aggregationlevel": 0.5,
            }
        )
        # SA sorguları 70–120 sn sürüyor (S1).
        yol, meta = indir(f"{onek}-{ad}.json", f"{EFEHR}?{sorgu}", zaman_asimi=600)
        noktalar = json.loads(yol.read_text(encoding="utf-8"))["points"]
        izgaralar[ad] = duzenli_izgara(noktalar, eksik_serbest=eksik_serbest)
        metalar[ad] = meta
    return izgaralar, metalar


def duzenli_izgara(noktalar: list[dict], *, eksik_serbest: bool = False) -> dict:
    """EFEHR nokta listesi → {enlemler, boylamlar, degerler[i][j]} (src/yontem/tehlike.ts `Izgara`)."""
    enlemler = sorted({round(p["lat"], 7) for p in noktalar})
    boylamlar = sorted({round(p["lon"], 7) for p in noktalar})
    ie = {v: i for i, v in enumerate(enlemler)}
    ib = {v: j for j, v in enumerate(boylamlar)}
    degerler: list[list[float | None]] = [[None] * len(boylamlar) for _ in enlemler]
    for p in noktalar:
        degerler[ie[round(p["lat"], 7)]][ib[round(p["lon"], 7)]] = round(p["value"], 7)
    eksik = sum(v is None for satir in degerler for v in satir)
    if eksik and not eksik_serbest:
        raise ValueError(f"Izgara düzenli değil: {eksik} hücre eksik")
    return {"enlemler": enlemler, "boylamlar": boylamlar, "degerler": degerler}


def bilineer(izgara: dict, enlem: float, boylam: float) -> float:
    """tehlike.ts `bilineer` ile aynı; boru hattı içi denetim ve doğrulama için."""
    e, b, v = izgara["enlemler"], izgara["boylamlar"], izgara["degerler"]
    if not (e[0] <= enlem <= e[-1] and b[0] <= boylam <= b[-1]):
        raise ValueError(f"Nokta ızgara dışında: {enlem}, {boylam}")
    i = max(k for k in range(len(e) - 1) if e[k] <= enlem) if enlem < e[-1] else len(e) - 2
    j = max(k for k in range(len(b) - 1) if b[k] <= boylam) if boylam < b[-1] else len(b) - 2
    koseler = (v[i][j], v[i][j + 1], v[i + 1][j], v[i + 1][j + 1])
    if any(k is None for k in koseler):
        raise ValueError(f"Nokta model alanı dışındaki bir hücrede: {enlem}, {boylam}")
    ty = (enlem - e[i]) / (e[i + 1] - e[i])
    tx = (boylam - b[j]) / (b[j + 1] - b[j])
    return (v[i][j] * (1 - tx) + v[i][j + 1] * tx) * (1 - ty) + (
        v[i + 1][j] * (1 - tx) + v[i + 1][j + 1] * tx
    ) * ty
