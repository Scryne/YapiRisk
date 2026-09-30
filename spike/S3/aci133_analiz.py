"""S3: RYTEİE Ek-A puanının ACI-133 (2023 Kahramanmaraş, 242 BA bina) üzerinde sıralama gücü.

Çalıştır:  uv run --no-project --with pandas --with openpyxl python aci133_analiz.py
Veri:      veri/ACI133v3.xlsx (Zenodo 13386343, CC BY 4.0), veri/maras-SA0.20s.json (EFEHR ESHM20, 475 yıl)

Veri setinde olanlar: kat, yumuşak kat, kısa kolon, perde alanı (→ BAÇ/BAÇP), koordinat, Vs30, yaş,
Hassan–Sozen öncelik indeksi, gözlenen yer hareketi. Olmayanlar (0 = "yok" varsayılır): görünen kalite,
ağır çıkma, düşeyde/planda düzensizlik, nizam, eğim. Yani ölçülen şey RYTEİE'nin kısmi puanıdır.

Ölçüt: AUC (Mann–Whitney). "Riskli" = daha düşük PP; hedef = ağır hasar ve üstü.
Uyarı: örneklem hasar gözlemi için seçilmiş binalar (yanlı); mutlak isabet değil, sıralama gücü ölçülür.
"""
import json
import math
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
import ryteie  # noqa: E402

KOK = Path(__file__).parent
S1_ORAN_ALT, S1_ORAN_UST = 0.72, 1.25  # S1'de ölçülen ESHM20/TDTH SS oran aralığı (Manisa)
FS_SS = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50]
FS = {  # TBDY-2018 Tablo 2.1 (Vikikaynak; ZC 10 TDTH raporuyla doğrulandı)
    "ZA": [0.8] * 6, "ZB": [0.9] * 6,
    "ZC": [1.3, 1.3, 1.2, 1.2, 1.2, 1.2],
    "ZD": [1.6, 1.4, 1.2, 1.1, 1.0, 1.0],
    "ZE": [2.4, 1.7, 1.3, 1.1, 0.9, 0.8],
}


def ara(xs, ys, x):
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    for i in range(len(xs) - 1):
        if xs[i] <= x <= xs[i + 1]:
            return ys[i] + (x - xs[i]) / (xs[i + 1] - xs[i]) * (ys[i + 1] - ys[i])


def zemin_sinifi(vs30):  # TBDY Tablo 16.1 (Vs30 sınırları)
    return "ZA" if vs30 > 1500 else "ZB" if vs30 > 760 else "ZC" if vs30 > 360 else "ZD" if vs30 > 180 else "ZE"


def izgara(ad):
    pts = json.loads((KOK / "veri" / ad).read_text(encoding="utf-8"))["points"]
    return {(round(p["lat"], 4), round(p["lon"], 4)): p["value"] for p in pts}


def bilineer(g, lat, lon):
    lats = sorted({k[0] for k in g}); lons = sorted({k[1] for k in g})
    la0 = max(v for v in lats if v <= lat); la1 = min(v for v in lats if v >= lat)
    lo0 = max(v for v in lons if v <= lon); lo1 = min(v for v in lons if v >= lon)
    ty = 0 if la1 == la0 else (lat - la0) / (la1 - la0)
    tx = 0 if lo1 == lo0 else (lon - lo0) / (lo1 - lo0)
    return ((g[(la0, lo0)] * (1 - tx) + g[(la0, lo1)] * tx) * (1 - ty)
            + (g[(la1, lo0)] * (1 - tx) + g[(la1, lo1)] * tx) * ty)


def auc(skor_riskli, y):
    """skor_riskli büyükse daha riskli. Eşitlikler yarım sayılır."""
    poz = [s for s, t in zip(skor_riskli, y) if t]
    neg = [s for s, t in zip(skor_riskli, y) if not t]
    if not poz or not neg:
        return float("nan")
    k = sum(1.0 if p > n else 0.5 if p == n else 0.0 for p in poz for n in neg)
    return k / (len(poz) * len(neg))


def yukle():
    raw = pd.read_excel(KOK / "veri" / "ACI133v3.xlsx", header=None)
    d = raw.iloc[3:].reset_index(drop=True)
    d.columns = [f"c{i}" for i in range(d.shape[1])]
    return pd.DataFrame({
        "id": d.c0, "yas": d.c1.astype(float), "kat": d.c2.astype(int),
        "perde_alan": d.c14.astype(float), "hasar5": d.c20, "hasar3": d.c21, "kritik": d.c23,
        "kisa_kolon": d.c27.eq("Y"), "yumusak_kat": d.c34.eq("Y"), "pi": d.c33.astype(float),
        "lat": d.c36.astype(float), "lon": d.c37.astype(float), "vs30": d.c38.astype(float),
        "pga_gozlenen": d.c49.astype(float),
    })


def main():
    b = yukle()
    g = izgara("maras-SA0.20s.json")
    b["zemin"] = b.vs30.map(zemin_sinifi)
    b["ss"] = [bilineer(g, r.lat, r.lon) for r in b.itertuples()]
    b["perde"] = b.perde_alan > 0

    def pp(r, oran):
        ss = r.ss / oran  # ESHM20 → TDTH tahmini
        sds = ara(FS_SS, FS[r.zemin], ss) * ss
        return ryteie.puan(r.kat, ryteie.tehlike_bolgesi(sds, r.zemin), perde=r.perde,
                           yumusak_kat=r.yumusak_kat, kisa_kolon=r.kisa_kolon)

    k = b[b.kat.between(1, 7)].copy()
    print(f"Toplam {len(b)} BA bina; RYTEİE kapsamı (1–7 kat): {len(k)}")
    for o, ad in [(1.0, "ham"), (0.89, "ort"), (S1_ORAN_ALT, "kotu")]:
        k[f"pp_{ad}"] = [pp(r, o) for r in k.itertuples()]

    hedefler = {
        "ağır+ (hasar3 = S)": k.hasar3.eq("S"),
        "göçme (hasar5 = C)": k.hasar5.eq("C"),
        "kritik hasar = Y": k.kritik.eq("Y"),
    }
    print("\nDağılım:", dict(k.hasar5.value_counts()), "| perde:", int(k.perde.sum()),
          "| yumuşak kat:", int(k.yumusak_kat.sum()), "| kısa kolon:", int(k.kisa_kolon.sum()))
    print("Tehlike bölgesi (ort. düzeltme):", dict(k.apply(
        lambda r: ryteie.tehlike_bolgesi(ara(FS_SS, FS[r.zemin], r.ss / 0.89) * r.ss / 0.89, r.zemin), axis=1)
        .value_counts()))

    adaylar = {
        "RYTEİE kısmi PP (ESHM20 ham)": -k.pp_ham,
        "RYTEİE kısmi PP (ESHM20/0,89)": -k.pp_ort,
        "RYTEİE kısmi PP (ESHM20/0,72, kötü durum)": -k.pp_kotu,
        "yalnız kat sayısı": k.kat,
        "yalnız yaş": k.yas,
        "yalnız yumuşak kat": k.yumusak_kat.astype(int),
        "Hassan–Sozen PI (düşük = riskli; ölçüm ister)": -k.pi,
        "gözlenen PGA (yöntem dışı, tavan referansı)": k.pga_gozlenen,
    }
    satirlar = []
    for hedef, y in hedefler.items():
        print(f"\n== Hedef: {hedef}  (pozitif {int(y.sum())} / {len(y)})")
        for ad, s in adaylar.items():
            a = auc(list(s), list(y))
            satirlar.append({"hedef": hedef, "skor": ad, "auc": round(a, 3), "n": len(y), "pozitif": int(y.sum())})
            print(f"  {ad:48} AUC {a:.3f}")
    pd.DataFrame(satirlar).to_csv(KOK / "sonuc-aci133.csv", index=False, encoding="utf-8-sig")


if __name__ == "__main__":
    main()
