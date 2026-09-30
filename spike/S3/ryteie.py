"""RYTEİE 2019 Ek-A betonarme hızlı değerlendirme puanı (spike sürümü).

Kaynak: Resmî Gazete 16.02.2019 / 30688 eki, Ek-A s. 30–35 (Tablo A.1–A.4), asıl metinden doğrulandı
2026-09-30. PP = TP + Σ(Oᵢ · OPᵢ) + YSP. Resmî metinde eşik yok; puan sıralama içindir (A.2.1.8).
"""

# Tablo A.1 — satır anahtarı: kat grubu; TP sütunları tehlike bölgesi I..IV
TP = {
    "1-2": {"I": 90, "II": 120, "III": 160, "IV": 195},
    "3": {"I": 80, "II": 100, "III": 140, "IV": 170},
    "4": {"I": 70, "II": 90, "III": 130, "IV": 160},
    "5": {"I": 60, "II": 80, "III": 110, "IV": 135},
    "6-7": {"I": 50, "II": 65, "III": 90, "IV": 110},
}
YSP = {  # BAÇ her zaman 0
    "1-2": 100, "3": 85, "4": 75, "5": 65, "6-7": 55,
}

# Tablo A.4 — olumsuzluk parametre puanları
OP = {
    "1-2": {"yumusak_kat": -10, "kalite": -10, "agir_cikma": -10, "duseyde": -5, "planda": -5, "kisa_kolon": -5, "egim": -3},
    "3": {"yumusak_kat": -20, "kalite": -10, "agir_cikma": -20, "duseyde": -10, "planda": -10, "kisa_kolon": -5, "egim": -3},
    "4": {"yumusak_kat": -30, "kalite": -15, "agir_cikma": -30, "duseyde": -15, "planda": -10, "kisa_kolon": -5, "egim": -3},
    "5": {"yumusak_kat": -30, "kalite": -25, "agir_cikma": -30, "duseyde": -15, "planda": -10, "kisa_kolon": -5, "egim": -3},
    "6-7": {"yumusak_kat": -30, "kalite": -30, "agir_cikma": -30, "duseyde": -15, "planda": -10, "kisa_kolon": -5, "egim": -3},
}
# Nizam: bitişikse Oᵢ = 1, puan kat seviyesi (aynı/farklı) ve konuma (orta/kenar) göre; kat grubundan bağımsız
NIZAM_OP = {("ayni", "orta"): 0, ("ayni", "kenar"): -10, ("farkli", "orta"): -5, ("farkli", "kenar"): -15}
KALITE_O = {"iyi": 0, "orta": 1, "kotu": 2}


def kat_grubu(n):
    if n < 1 or n > 7:
        raise ValueError(f"RYTEİE Ek-A 1–7 kat içindir, gelen: {n}")
    return "1-2" if n <= 2 else "6-7" if n >= 6 else str(n)


def tehlike_bolgesi(sds, zemin):
    """Tablo A.2. zemin: ZA..ZE."""
    kaya = zemin in ("ZA", "ZB")
    if sds >= 1.0:
        return "II" if kaya else "I"
    if sds >= 0.75:
        return "III" if kaya else "II"
    if sds >= 0.50:
        return "IV" if kaya else "III"
    return "IV"


def puan(kat, bolge, perde=False, kalite="iyi", nizam=None, **kusurlar):
    """kusurlar: yumusak_kat, agir_cikma, duseyde, planda, kisa_kolon, egim → bool.
    nizam: None (ayrık) ya da ("ayni"|"farkli", "orta"|"kenar")."""
    g = kat_grubu(kat)
    pp = TP[g][bolge] + (YSP[g] if perde else 0)
    pp += KALITE_O[kalite] * OP[g]["kalite"]
    for ad, var in kusurlar.items():
        if var:
            pp += OP[g][ad]
    if nizam:
        pp += NIZAM_OP[nizam]
    return pp
