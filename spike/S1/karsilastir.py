"""S1 spike: ESHM20 (EFEHR) ile AFAD TDTH değerlerini 10 Manisa noktasında karşılaştırır.

Kullanım:  python karsilastir.py
Girdi:     veri/manisa-*.json (EFEHR /v1/maps/area, 475 yıl = yıllık aşılma 0.002103, ortalama)
           tdth-okumalar.csv (Scryne'ın TDTH'den okuduğu DD-2 değerleri, zemin ZC)
Çıktı:     ekrana tablo + sonuc.csv

İki referans da Vs30 = 760 m/s kayada tanımlı (TBDY: ZB referansı, ESHM20: B/C sınırı),
yani SS ↔ SA(0.2 s), S1 ↔ SA(1.0 s), PGA ↔ PGA doğrudan karşılaştırılabilir.
"""
import csv
import json
from pathlib import Path

KOK = Path(__file__).parent
IMT = {"PGA": "PGA", "SS": "SA0.20s", "S1": "SA1.00s"}

# TBDY-2018 Tablo 2.1 zemin katsayıları: Aria'nın hafızasından, DOĞRULANMADI (S2-b).
# ZC okumaları bu tabloyu sınar: SDS_ZC == Fs(SS) * SS tutmazsa tablo yanlıştır.
FS_SS = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50]
FS = {"ZC": [1.3, 1.3, 1.2, 1.2, 1.2, 1.2]}
F1_S1 = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60]
F1 = {"ZC": [1.5, 1.5, 1.5, 1.5, 1.5, 1.4]}


def ara_deger(xs, ys, x):
    """Tablo sınırları dışında sabit, arada doğrusal (TBDY tablolarının okunuşu)."""
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    for i in range(len(xs) - 1):
        if xs[i] <= x <= xs[i + 1]:
            t = (x - xs[i]) / (xs[i + 1] - xs[i])
            return ys[i] + t * (ys[i + 1] - ys[i])


def izgara_yukle(ad):
    noktalar = json.loads((KOK / "veri" / f"manisa-{ad}.json").read_text(encoding="utf-8"))["points"]
    return {(round(p["lat"], 4), round(p["lon"], 4)): p["value"] for p in noktalar}


def bilineer(izgara, lat, lon):
    lats = sorted({k[0] for k in izgara})
    lons = sorted({k[1] for k in izgara})
    la0 = max(v for v in lats if v <= lat)
    la1 = min(v for v in lats if v >= lat)
    lo0 = max(v for v in lons if v <= lon)
    lo1 = min(v for v in lons if v >= lon)
    ty = 0 if la1 == la0 else (lat - la0) / (la1 - la0)
    tx = 0 if lo1 == lo0 else (lon - lo0) / (lo1 - lo0)
    v00, v01 = izgara[(la0, lo0)], izgara[(la0, lo1)]
    v10, v11 = izgara[(la1, lo0)], izgara[(la1, lo1)]
    return (v00 * (1 - tx) + v01 * tx) * (1 - ty) + (v10 * (1 - tx) + v11 * tx) * ty


def sayi(s):
    s = (s or "").strip().replace(",", ".")
    return float(s) if s else None


def main():
    izgaralar = {k: izgara_yukle(v) for k, v in IMT.items()}
    satirlar = list(csv.DictReader(open(KOK / "tdth-okumalar.csv", encoding="utf-8-sig")))
    cikti = []
    print(f"{'ilçe':28} {'büyüklük':>8} {'ESHM20':>7} {'TDTH':>7} {'oran':>6}")
    for r in satirlar:
        lat, lon = float(r["enlem"]), float(r["boylam"])
        for buyukluk in IMT:
            e = bilineer(izgaralar[buyukluk], lat, lon)
            t = sayi(r.get(buyukluk))
            oran = e / t if t else None
            cikti.append({"no": r["no"], "ilce": r["ilce"], "buyukluk": buyukluk,
                          "eshm20": round(e, 3), "tdth": t, "oran": round(oran, 3) if oran else None})
            print(f"{r['ilce']:28} {buyukluk:>8} {e:7.3f} {t if t is not None else '-':>7} "
                  f"{f'{oran:.2f}' if oran else '-':>6}")
        ss, s1 = sayi(r.get("SS")), sayi(r.get("S1"))
        sds, sd1 = sayi(r.get("SDS_ZC")), sayi(r.get("SD1_ZC"))
        if ss and sds:
            print(f"{'':28} {'SDS_ZC':>8} hesap {ara_deger(FS_SS, FS['ZC'], ss) * ss:.3f} / TDTH {sds}")
        if s1 and sd1:
            print(f"{'':28} {'SD1_ZC':>8} hesap {ara_deger(F1_S1, F1['ZC'], s1) * s1:.3f} / TDTH {sd1}")

    oranlar = {}
    for c in cikti:
        if c["oran"]:
            oranlar.setdefault(c["buyukluk"], []).append(c["oran"])
    for b, o in oranlar.items():
        print(f"\n{b}: n={len(o)}  ESHM20/TDTH ortalama {sum(o) / len(o):.2f}  aralık {min(o):.2f}–{max(o):.2f}")

    with open(KOK / "sonuc.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(cikti[0]))
        w.writeheader()
        w.writerows(cikti)


if __name__ == "__main__":
    main()
