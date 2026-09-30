"""Yerel mahalle dizini (K-13): OSM mahalle/köy noktaları + ilçe adı. Arama istemcide yapılır."""

from shapely.geometry import Point
from shapely.geometry.base import BaseGeometry
from shapely.prepared import prep

# OSM'de adı yalnızca tür adı olan çöp kayıtlar var (S4: Kula'da "mahalle").
COP_ADLAR = {"mahalle", "mahallesi", "köy", "köyü", "mevki", "mezra"}
TUR = {"suburb": "mahalle", "neighbourhood": "mahalle", "quarter": "mahalle", "village": "koy"}


def tr_kucuk(metin: str) -> str:
    return metin.replace("I", "ı").replace("İ", "i").lower()


def mahalle_dizini(elemanlar: list[dict], il: BaseGeometry, ilceler: dict[str, BaseGeometry]) -> list[dict]:
    """Yer kayıtlarını il içindekilerle sınırlar, ilçesini bulur, çöpü ve tekrarı eler.

    Çıktı ad, ilçe, konum ([boylam, enlem], 5 ondalık ≈ 1 m) ile sıralıdır: aynı girdi, aynı dosya.
    """
    il_p = prep(il)
    ilce_p = [(ad, prep(p)) for ad, p in sorted(ilceler.items())]
    kayitlar: dict[tuple, dict] = {}
    for e in elemanlar:
        etiket = e.get("tags", {})
        ad = (etiket.get("name") or "").strip()
        tur = TUR.get(etiket.get("place", ""))
        if not ad or tur is None or tr_kucuk(ad) in COP_ADLAR:
            continue
        nokta = Point(e["lon"], e["lat"])
        if not il_p.contains(nokta):
            continue
        ilce = next((a for a, p in ilce_p if p.contains(nokta)), None)
        if ilce is None:
            continue
        konum = [round(e["lon"], 5), round(e["lat"], 5)]
        # Aynı ad + ilçe + tür yakın konumda iki kez işaretlenmişse (≈ 1 km) biri kalır.
        anahtar = (ad, ilce, tur, round(e["lon"], 2), round(e["lat"], 2))
        kayitlar.setdefault(anahtar, {"ad": ad, "ilce": ilce, "tur": tur, "konum": konum})
    return sorted(kayitlar.values(), key=lambda k: (tr_kucuk(k["ad"]), k["ilce"], k["konum"]))
