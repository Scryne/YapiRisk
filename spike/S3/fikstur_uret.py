"""Faz 2 eşdeğerlik fikstürü: ACI-133 kapsamındaki 154 binanın girdileri ve Python PP'leri.

Çalıştır:  uv run --no-project --with pandas --with openpyxl python fikstur_uret.py
Çıktı:     ../../src/yontem/__fikstur__/aci133-pp.json

TS puan motoru (src/yontem) aynı girdilerle aynı PP'yi vermeli. Koordinat ve bina kimliği yazılmaz;
SS değerleri ESHM20 ızgarasından burada bilineer alınır (TS bilineeri S1 noktalarıyla ayrıca test edilir).
"""
import json
from pathlib import Path

import aci133_analiz as a
import ryteie

KOK = Path(__file__).parent
HEDEF = KOK.parent.parent / "src" / "yontem" / "__fikstur__" / "aci133-pp.json"
ORANLAR = {"ham": 1.0, "ort": 0.89, "kotu": a.S1_ORAN_ALT}


def main():
    b = a.yukle()
    g = a.izgara("maras-SA0.20s.json")
    k = b[b.kat.between(1, 7)]
    binalar = []
    for r in k.itertuples():
        zemin = a.zemin_sinifi(r.vs30)
        ss = a.bilineer(g, r.lat, r.lon)
        perde = bool(r.perde_alan > 0)
        pp = {}
        for ad, oran in ORANLAR.items():
            s = ss / oran
            sds = a.ara(a.FS_SS, a.FS[zemin], s) * s
            bolge = ryteie.tehlike_bolgesi(sds, zemin)
            pp[ad] = {"sds": sds, "bolge": bolge, "pp": ryteie.puan(
                int(r.kat), bolge, perde=perde,
                yumusak_kat=bool(r.yumusak_kat), kisa_kolon=bool(r.kisa_kolon))}
        binalar.append({"kat": int(r.kat), "zemin": zemin, "ssEshm20": ss, "perde": perde,
                        "yumusakKat": bool(r.yumusak_kat), "kisaKolon": bool(r.kisa_kolon), "sonuc": pp})
    cikti = {
        "aciklama": "spike/S3/fikstur_uret.py çıktısı; elle düzenlenmez.",
        "kaynak": [
            "ACI-133: Hariri-Ardebili 2024, Zenodo 13386343, CC BY 4.0 (kat, yumuşak kat, kısa kolon, perde, Vs30)",
            "ESHM20: EFEHR, 475 yıl SA(0.2 s), CC BY 4.0 (ssEshm20)",
        ],
        "oranlar": ORANLAR,
        "binalar": binalar,
    }
    HEDEF.parent.mkdir(parents=True, exist_ok=True)
    HEDEF.write_text(json.dumps(cikti, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(binalar)} bina -> {HEDEF}")


if __name__ == "__main__":
    main()
