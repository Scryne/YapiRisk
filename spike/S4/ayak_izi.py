"""S4: Microsoft GlobalMLBuildingFootprints'in Manisa kapsamı ve paket boyutu.

Çalıştır:  uv run --no-project --with shapely python ayak_izi.py
Veri:      veri/ms/*.csv.gz (dataset-links.csv'den Manisa bbox'ına düşen 16 quadkey, CDLA Permissive 2.0)
           veri/manisa-sinir.json (Overpass: il sınırı, admin_level=4, ODbL)
Çıktı:     veri/manisa-ayak-izi.geojsonl (il içindeki binalar), ekrana sayılar
"""
import gzip
import json
import time
from pathlib import Path

from shapely.geometry import LineString, shape
from shapely.ops import polygonize, unary_union
from shapely.prepared import prep

KOK = Path(__file__).parent / "veri"


def il_siniri():
    rel = json.loads((KOK / "manisa-sinir.json").read_text(encoding="utf-8"))["elements"][0]
    hatlar = [LineString([(p["lon"], p["lat"]) for p in m["geometry"]])
              for m in rel["members"] if m["type"] == "way" and m.get("role") == "outer"]
    return unary_union(list(polygonize(unary_union(hatlar))))


def main():
    t0 = time.time()
    sinir = il_siniri()
    p = prep(sinir)
    print(f"il sınırı alanı ~{sinir.area * 111 * 88:.0f} km² (kaba), geçerli: {sinir.is_valid}")
    toplam = icerde = yukseklikli = 0
    alanlar = []
    with open(KOK / "manisa-ayak-izi.geojsonl", "w", encoding="utf-8") as out:
        for f in sorted((KOK / "ms").glob("*.csv.gz")):
            with gzip.open(f, "rt", encoding="utf-8") as g:
                for satir in g:
                    toplam += 1
                    feat = json.loads(satir)
                    geo = shape(feat["geometry"])
                    if not p.contains(geo.centroid):
                        continue
                    icerde += 1
                    h = feat.get("properties", {}).get("height", -1)
                    if h is not None and h != -1:
                        yukseklikli += 1
                    alanlar.append(geo.area * 111000 * 88000)  # m², Manisa enlemi için kaba
                    out.write(json.dumps({"type": "Feature", "geometry": feat["geometry"],
                                          "properties": {"h": h}}, separators=(",", ":")) + "\n")
    alanlar.sort()
    boyut = (KOK / "manisa-ayak-izi.geojsonl").stat().st_size
    print(f"bbox'taki bina: {toplam:,} | Manisa içinde: {icerde:,} | yükseklik bilgili: {yukseklikli:,}")
    print(f"taban alanı medyan ~{alanlar[len(alanlar) // 2]:.0f} m², %90 ~{alanlar[int(len(alanlar) * .9)]:.0f} m²")
    print(f"il paketi (GeoJSONL, ham): {boyut / 1e6:.1f} MB | süre {time.time() - t0:.0f} sn")


if __name__ == "__main__":
    main()
