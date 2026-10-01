"""S3 ek (Faz 10): RYTEİE Ek-A.2.2 yığma puanının Gaziantep verisinde (Atasever vd., 2023) sıralama gücü.

Çalıştır:  uv run --no-project --with pandas --with openpyxl python gaziantep_yigma.py
Veri:      veri/gaziantep.xlsx (doi:10.7910/DVN/OQCPWF, CC BY-NC-ND 4.0; repoya girmez), veri/maras-SA0.20s.json

Veri setinde olanlar: kat, koordinat, hasar, harç tipi, duvar malzemesi. Zemin sınıfı yok → K-9 (ZC/ZD/ZE'nin en
büyük Fs'i, zayıf zemin bölgesi). Olmayanlar: yığma türü (donatısız varsayılır, YSP = 0) ve Tablo A.6'daki bütün
gözlem parametreleri. Yani ölçülen şey taban puanıdır (kat + tehlike bölgesi, Tablo A.5). Harç tek başına düzlem
dışı eşiğine (3/4) ulaşamaz; ayrıca betimleyici olarak verilir. Yalnız toplu istatistik yazılır (lisans: ND).
"""
from pathlib import Path

import pandas as pd

from aci133_analiz import FS, FS_SS, ara, auc, bilineer, izgara

KOK = Path(__file__).parent
S1_ORAN_ALT, S1_ORAN_UST = 0.72, 1.34  # Final-Doküman: Manisa + İzmir, 20 nokta
# RYTEİE Tablo A.5 (ek s. 39), sütunlar I, II-III, IV
TP = {1: (110, 120, 130), 2: (100, 110, 120), 3: (90, 100, 110), 4: (80, 90, 100), 5: (70, 80, 90)}
AGIR = {"Heavy Damage", "Urgently Demolish", "Collapsed"}


def sds_bilinmeyen_zemin(ss):
    return max(ara(FS_SS, FS[z], ss) for z in ("ZC", "ZD", "ZE")) * ss


def sutun(sds):  # Tablo A.2 zayıf zemin: ≥1,0 I; ≥0,75 II; ≥0,5 III; diğer IV → A.5 sütunu
    return 0 if sds >= 1.0 else 1 if sds >= 0.5 else 2


def bant(pp):
    return "yuksek" if pp < 50 else "orta" if pp < 100 else "dusuk"


def main():
    d = pd.read_excel(KOK / "veri" / "gaziantep.xlsx", sheet_name="full_data")
    y = d[(d["Structural System"] == "Masonry") & (d.Damage != "No evaluation")].copy()
    y = y[y["Story Number"].between(1, 5)]
    g = izgara("maras-SA0.20s.json")
    y["ss"] = [bilineer(g, r.Latitude, r.Longitude) for r in y.itertuples()]
    y["agir"] = y.Damage.isin(AGIR)
    y["kat"] = y["Story Number"].astype(int)
    for oran, ad in [(1.0, "ham"), (S1_ORAN_ALT, "kotu")]:
        y[f"sut_{ad}"] = [sutun(sds_bilinmeyen_zemin(s / oran)) for s in y.ss]
        y[f"pp_{ad}"] = [TP[k][c] for k, c in zip(y.kat, y[f"sut_{ad}"])]
    y["harc_olumsuz"] = y["Harc Tipi Zemin"].isin(["Çamur", "Kireç"])
    y["harc_bilinen"] = y["Harc Tipi Zemin"].isin(["Çamur", "Kireç", "Çimento"])

    print(f"Yığma, değerlendirilmiş, 1–5 kat: {len(y)}; ağır hasar ve üstü {int(y.agir.sum())}")
    print("Kat:", dict(y.kat.value_counts().sort_index()))
    print("İlçe × ağır oranı:", y.groupby("District").agir.agg(["size", "mean"]).round(3).to_dict("index"))
    print("Tablo A.5 sütunu (ham / kötü):", dict(y.sut_ham.value_counts()), dict(y.sut_kotu.value_counts()))

    satirlar = []

    def yaz(ad, skor, hedef, alt=None):
        m = alt if alt is not None else pd.Series(True, index=y.index)
        a = auc(list(skor[m]), list(hedef[m]))
        satirlar.append({"skor": ad, "auc": round(a, 3), "n": int(m.sum()), "pozitif": int(hedef[m].sum())})
        print(f"  {ad:52} AUC {a:.3f}  (n {int(m.sum())}, pozitif {int(hedef[m].sum())})")

    print("\n== Hedef: ağır hasar ve üstü")
    yaz("RYTEİE yığma taban puanı (ESHM20 ham)", -y.pp_ham, y.agir)
    yaz("RYTEİE yığma taban puanı (ESHM20/0,72, kötü durum)", -y.pp_kotu, y.agir)
    yaz("yalnız kat sayısı", y.kat, y.agir)
    yaz("yalnız ESHM20 S_S", y.ss, y.agir)
    yaz("harç kireç/çamur (bilinen harçlı binalar)", y.harc_olumsuz.astype(int), y.agir, y.harc_bilinen)

    print("\nBant (K-12, taban puanı kötü uç) × ağır hasar oranı:")
    y["bant"] = y.pp_kotu.map(bant)
    tablo = y.groupby("bant").agir.agg(["size", "sum", "mean"]).round(3)
    print(tablo)
    for b, r in tablo.iterrows():
        satirlar.append({"skor": f"bant {b}: ağır oranı", "auc": r["mean"], "n": int(r["size"]), "pozitif": int(r["sum"])})
    print("\nTP × ağır oranı:", y.groupby("pp_kotu").agir.agg(["size", "mean"]).round(3).to_dict("index"))
    pd.DataFrame(satirlar).to_csv(KOK / "sonuc-gaziantep-yigma.csv", index=False, encoding="utf-8-sig")


if __name__ == "__main__":
    main()
