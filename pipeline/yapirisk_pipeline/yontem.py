"""Doğrulama için RYTEİE Ek-A puanı (Python). Tablolar istemciyle aynı dosyalardan okunur
(src/yontem/ryteie-2019.json, tbdy-2018.json); formül src/yontem/ryteie.ts ve tehlike.ts ile eşdeğer,
test: tests/test_yontem.py aynı ACI-133 fikstürüne karşı.
"""

import json
from functools import cache

from .ortak import YONTEM


@cache
def _tablo(ad: str) -> dict:
    return json.loads((YONTEM / ad).read_text(encoding="utf-8"))


def kat_grubu(kat: int) -> str:
    if not 1 <= kat <= 7:
        raise ValueError(f"RYTEİE Ek-A 1–7 kat içindir, gelen: {kat}")
    return "1-2" if kat <= 2 else "6-7" if kat >= 6 else str(kat)


def ara_deger(xs: list[float], ys: list[float], x: float) -> float:
    if x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    i = 0
    while x > xs[i + 1]:
        i += 1
    return ys[i] + (x - xs[i]) / (xs[i + 1] - xs[i]) * (ys[i + 1] - ys[i])


def sds(ss: float, zemin: str) -> float:
    t = _tablo("tbdy-2018.json")["tablo21"]
    return ara_deger(t["ss"], t["fs"][zemin], ss) * ss


def tehlike_bolgesi(sds_degeri: float, zemin: str) -> str:
    a2 = _tablo("ryteie-2019.json")["tabloA2"]
    grup = a2["kayaZemin"] if zemin in a2["kayaZemin"]["zeminler"] else a2["zayifZemin"]
    for esik, bolge in grup["esikler"]:
        if sds_degeri >= esik:
            return bolge
    return a2["digerleri"]


def zemin_sinifi(vs30: float) -> str:
    """TBDY Tablo 16.1, Vs30 sınırları."""
    return (
        "ZA" if vs30 > 1500 else "ZB" if vs30 > 760 else "ZC" if vs30 > 360 else "ZD" if vs30 > 180 else "ZE"
    )


def puan(kat: int, bolge: str, *, perde: bool, kusurlar: dict[str, bool]) -> int:
    """Kısmi PP: görünen kalite iyi, nizam ayrık; `kusurlar` Var/Yok olumsuzlukları."""
    t = _tablo("ryteie-2019.json")
    g = kat_grubu(kat)
    pp = (
        t["tabloA1"]["tabanPuani"][g][bolge]
        + t["tabloA1"]["yapisalSistemPuani"][g]["BACP" if perde else "BAC"]
    )
    for ad, var in kusurlar.items():
        if var:
            pp += t["tabloA4"][ad][g]
    return pp
