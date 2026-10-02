"""S1 ek: ESHM20 → TDTH oran bandı il başına mı, konuma göre mi? Birini dışarıda bırak (LOO) sınaması, 40 nokta.

Çalıştır:  python mekansal.py        (yalnız standart kütüphane)
Girdi:     *-tdth-okumalar.csv (Scryne'ın AFAD TDTH okumaları, DD-2) ve ../../public/data/<il>/tehlike-eshm20.json

Her nokta sırayla dışarıda bırakılır, bandı kalan noktalardan kurulur ve dışarıdaki noktanın gerçek oranı
(SS_ESHM20 / SS_TDTH) banda düştü mü bakılır. Güvensiz yön alt sınırdır: gerçek oran alt sınırın altındaysa ESHM20
tehlikeyi bandın varsaydığından da düşük gösteriyor demektir.

A  İl bandı (uygulamadaki): aynı ilin diğer 9 noktasının en küçük / en büyük oranı, alt sınır en fazla 0,72.
B  Mekânsal: log oranın Gauss çekirdekli ağırlıklı ortalaması (uzunluk ölçeği L km) ± q; q, kalan 39 noktanın kendi
   aralarındaki LOO artıklarının en büyük mutlak değeri (iç içe LOO, böylece q dışarıdaki noktayı görmez).
Ölçüt: kapsama (alt ve üst ayrı), bant genişliği log(üst / alt) ortalaması (küçük = dar).
"""
import csv
import json
import math
from pathlib import Path

KOK = Path(__file__).parent
VERI = KOK.parent.parent / "public" / "data"
ILLER = {
    "manisa": "tdth-okumalar.csv",
    "izmir": "izmir-tdth-okumalar.csv",
    "aydin": "aydin-tdth-okumalar.csv",
    "denizli": "denizli-tdth-okumalar.csv",
}
TAVAN = 0.72


def bilineer(iz, la, lo):
    E, B, V = iz["enlemler"], iz["boylamlar"], iz["degerler"]
    i = max(k for k in range(len(E) - 1) if E[k] <= la)
    j = max(k for k in range(len(B) - 1) if B[k] <= lo)
    ty = (la - E[i]) / (E[i + 1] - E[i])
    tx = (lo - B[j]) / (B[j + 1] - B[j])
    return (V[i][j] * (1 - tx) + V[i][j + 1] * tx) * (1 - ty) + (V[i + 1][j] * (1 - tx) + V[i + 1][j + 1] * tx) * ty


def km(a, b):
    r = 6371.0
    p1, p2 = math.radians(a["enlem"]), math.radians(b["enlem"])
    dp, dl = p2 - p1, math.radians(b["boylam"] - a["boylam"])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def noktalar():
    out = []
    for il, dosya in ILLER.items():
        iz = json.loads((VERI / il / "tehlike-eshm20.json").read_text(encoding="utf-8"))["izgaralar"]["SS"]
        for r in csv.DictReader(open(KOK / dosya, encoding="utf-8-sig")):
            la, lo = float(r["enlem"]), float(r["boylam"])
            out.append({"il": il, "ilce": r["ilce"], "enlem": la, "boylam": lo,
                        "oran": bilineer(iz, la, lo) / float(r["SS"])})
    return out


def tahmin(hedef, digerleri, L):
    w = [math.exp(-((km(hedef, d) / L) ** 2)) for d in digerleri]
    if sum(w) < 1e-12:  # çok uzak: düz ortalama
        w = [1.0] * len(digerleri)
    return sum(wi * math.log(d["oran"]) for wi, d in zip(w, digerleri)) / sum(w)


def il_bandi(hedef, digerleri):
    ayni = [d["oran"] for d in digerleri if d["il"] == hedef["il"]]
    return min(min(ayni), TAVAN), max(ayni)


def mekansal_bant(hedef, digerleri, L, alt_tavan):
    artik = []
    for k, d in enumerate(digerleri):
        geri = digerleri[:k] + digerleri[k + 1:]
        artik.append(abs(math.log(d["oran"]) - tahmin(d, geri, L)))
    q = max(artik)
    mu = tahmin(hedef, digerleri, L)
    alt, ust = math.exp(mu - q), math.exp(mu + q)
    return (min(alt, TAVAN) if alt_tavan else alt), ust


def degerlendir(ad, bant_fn, P):
    alt_kacan, ust_kacan, gen = [], [], []
    for i, h in enumerate(P):
        alt, ust = bant_fn(h, P[:i] + P[i + 1:])
        if h["oran"] < alt:
            alt_kacan.append(f"{h['ilce']} {h['oran']:.2f}<{alt:.2f}")
        if h["oran"] > ust:
            ust_kacan.append(f"{h['ilce']} {h['oran']:.2f}>{ust:.2f}")
        gen.append(math.log(ust / alt))
    n = len(P)
    print(f"{ad:42} alt kapsama {n - len(alt_kacan)}/{n}  üst kapsama {n - len(ust_kacan)}/{n}  "
          f"genişlik ort {sum(gen) / n:.3f} (üst/alt ×{math.exp(sum(gen) / n):.2f})")
    for k in alt_kacan:
        print(f"{'':44}güvensiz yönde kaçan: {k}")
    return {"ad": ad, "alt": n - len(alt_kacan), "ust": n - len(ust_kacan), "n": n,
            "carpan": round(math.exp(sum(gen) / n), 3)}


def main():
    P = noktalar()
    print(f"{len(P)} nokta, oran {min(p['oran'] for p in P):.3f}–{max(p['oran'] for p in P):.3f}\n")
    sonuc = [degerlendir("A il bandı (uygulama)", il_bandi, P)]
    sonuc.append(degerlendir("A' il bandı, tavansız", lambda h, D: (min(d["oran"] for d in D if d["il"] == h["il"]),
                                                                    max(d["oran"] for d in D if d["il"] == h["il"])), P))
    for L in (15, 25, 40, 60, 100):
        sonuc.append(degerlendir(f"B mekânsal L={L} km, alt tavanlı", lambda h, D, L=L: mekansal_bant(h, D, L, True), P))
        sonuc.append(degerlendir(f"B mekânsal L={L} km", lambda h, D, L=L: mekansal_bant(h, D, L, False), P))
    with open(KOK / "sonuc-mekansal.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(sonuc[0]))
        w.writeheader()
        w.writerows(sonuc)


if __name__ == "__main__":
    main()
