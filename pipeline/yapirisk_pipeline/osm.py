"""OpenStreetMap (ODbL) sorguları: il ve ilçe sınırları, mahalle/köy yer kayıtları (Overpass)."""

import json
from dataclasses import dataclass
from pathlib import Path

from shapely.geometry import LineString
from shapely.geometry.base import BaseGeometry
from shapely.ops import polygonize, unary_union

from .bolgeler import Bolge
from .ortak import indir

OVERPASS = "https://overpass-api.de/api/interpreter"
# Ana sunucu S4'te 504 verdi, 2026-09-30'da ana sunucu ve private.coffee "too busy" dedi; yedekler aynı veriyi
# sunuyor ama gecikmeli olabilir (timestamp_osm_base kaydedilir).
OVERPASS_YEDEK = (
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
)


@dataclass(frozen=True)
class OsmSonucu:
    elemanlar: list[dict]
    #: Overpass verisinin OSM tarihi.
    osm_tarihi: str
    meta: dict[str, str]


def overpass_gecerli(icerik: bytes) -> bool:
    """Meşgul sunucu HTTP 200 ile HTML hata sayfası ya da `remark` içinde zaman aşımı döndürebiliyor."""
    try:
        d = json.loads(icerik)
    except ValueError:
        return False
    return isinstance(d, dict) and "elements" in d and "error" not in str(d.get("remark", "")).lower()


def dolu_overpass_gecerli(icerik: bytes) -> bool:
    """Alan sorgusu için: alan dizini eksik bir yedek sunucu (private.coffee, 2026-10-01) geçerli ama boş cevap
    döndürdü. Sonucu boş olamayacak sorgularda boş cevap da sıradaki sunucuya geçer."""
    return overpass_gecerli(icerik) and bool(json.loads(icerik)["elements"])


def overpass(ad: str, sorgu: str, bos_olamaz: bool = True) -> OsmSonucu:
    yol, meta = indir(
        ad,
        OVERPASS,
        veri={"data": sorgu},
        yedek_urller=OVERPASS_YEDEK,
        zaman_asimi=600,
        gecerli=dolu_overpass_gecerli if bos_olamaz else overpass_gecerli,
    )
    return _oku(yol, meta)


def _oku(yol: Path, meta: dict[str, str]) -> OsmSonucu:
    d = json.loads(yol.read_text(encoding="utf-8"))
    return OsmSonucu(d["elements"], d.get("osm3s", {}).get("timestamp_osm_base", ""), meta)


def iliski_poligonu(iliski: dict) -> BaseGeometry:
    """`out geom` ilişkisinin dış halkalarından poligon (iç halkalar çıkarılır)."""

    def halkalar(rol: str):
        hatlar = [
            LineString([(p["lon"], p["lat"]) for p in m["geometry"]])
            for m in iliski["members"]
            if m["type"] == "way" and m.get("role", "outer") == rol and len(m.get("geometry", [])) > 1
        ]
        return unary_union(list(polygonize(unary_union(hatlar)))) if hatlar else None

    dis = halkalar("outer")
    ic = halkalar("inner")
    if dis is None or dis.is_empty:
        raise ValueError(f"İlişki {iliski.get('id')} poligona çevrilemedi")
    return dis.difference(ic) if ic is not None and not ic.is_empty else dis


def il_siniri(bolge: Bolge) -> tuple[BaseGeometry, OsmSonucu]:
    s = overpass(
        f"{bolge.kimlik}/osm-il-siniri.json",
        f"[out:json][timeout:300];relation({bolge.osm_iliski});out geom;",
    )
    return iliski_poligonu(s.elemanlar[0]), s


def ilceler(bolge: Bolge, il: BaseGeometry) -> tuple[dict[str, BaseGeometry], OsmSonucu]:
    alan = 3600000000 + bolge.osm_iliski
    s = overpass(
        f"{bolge.kimlik}/osm-ilceler.json",
        f'[out:json][timeout:300];rel(area:{alan})["boundary"="administrative"]["admin_level"="6"];out geom;',
    )
    sonuc: dict[str, BaseGeometry] = {}
    for e in s.elemanlar:
        ad = e.get("tags", {}).get("name")
        if not ad:
            continue
        p = iliski_poligonu(e)
        # Komşu ilin sınıra değen ilçeleri de gelir; temsili noktası il içinde olanlar kalır.
        if il.contains(p.representative_point()):
            sonuc[ad] = p
    return sonuc, s


def yer_kayitlari(bolge: Bolge) -> OsmSonucu:
    alan = 3600000000 + bolge.osm_iliski
    return overpass(
        f"{bolge.kimlik}/osm-yerler.json",
        f'[out:json][timeout:300];node(area:{alan})["place"~"^(suburb|neighbourhood|quarter|village)$"]["name"];out;',
    )
