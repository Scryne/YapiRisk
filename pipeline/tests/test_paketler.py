"""Ağsız birim testleri: karo hesabı, ayak izi parçalama, mahalle dizini, ızgara düzeni."""

import gzip
import json

import pytest
from shapely.geometry import box

from yapirisk_pipeline import ayak_izi, mahalle, tehlike


def test_karo_ve_quadkey_bilinen_degerler():
    # Bing Maps belgesindeki örnek: (3, 5), z3 → "213"
    assert ayak_izi.quadkey(3, 5, 3) == "213"
    assert ayak_izi.karo(0.0, 0.0, 1) == (1, 1)
    assert ayak_izi.karo(-180.0, 85.0, 2) == (0, 0)
    # Manisa merkezi z9'da S4'te indirilen Microsoft dosyalarından birinin quadkey'inde
    assert ayak_izi.quadkey(*ayak_izi.karo(27.43, 38.61, 9), 9) in ayak_izi.kapsayan_quadkeyler(
        (26.9, 38.0, 29.2, 39.4)
    )


def _ms_dosyasi(yol, geometriler):
    with gzip.open(yol, "wt", encoding="utf-8") as g:
        for geo in geometriler:
            g.write(json.dumps({"type": "Feature", "properties": {"height": -1}, "geometry": geo}) + "\n")


def _kare(b, e, d=0.0001):
    return {"type": "Polygon", "coordinates": [[[b, e], [b + d, e], [b + d, e + d], [b, e + d], [b, e]]]}


def test_parcala_il_disini_ve_cokgen_disini_atar_ciktisi_kararli(tmp_path):
    il = box(27.0, 38.0, 28.0, 39.0)
    binalar = [
        _kare(27.1234567891, 38.5),
        _kare(27.1236, 38.5001),  # aynı z14 parçası
        _kare(27.9, 38.9),
        _kare(29.5, 38.5),  # il dışı
        {"type": "MultiPolygon", "coordinates": [_kare(27.5, 38.5)["coordinates"]]},
    ]
    _ms_dosyasi(tmp_path / "a.csv.gz", binalar)
    _ms_dosyasi(tmp_path / "b.csv.gz", list(reversed(binalar)))

    s1 = ayak_izi.parcala([tmp_path / "a.csv.gz"], il, tmp_path / "c1")
    s2 = ayak_izi.parcala([tmp_path / "b.csv.gz"], il, tmp_path / "c2")
    assert s1 == {"parca": 2, "bina": 3, "atlanan_cokgen_disi": 1}
    assert s1 == s2

    dizin = json.loads((tmp_path / "c1" / "dizin.json").read_text(encoding="utf-8"))
    assert dizin["z"] == 14 and sum(p[2] for p in dizin["parcalar"]) == 3
    x, y, n = dizin["parcalar"][0]
    parca = json.loads(gzip.decompress((tmp_path / "c1" / str(x) / f"{y}.json.gz").read_bytes()))
    assert len(parca["binalar"]) == n == 2
    assert parca["binalar"][0][0][0] == [27.123457, 38.5]  # 6 ondalık
    # Girdi sırası farklı, çıktı bayt bayt aynı
    for p in (tmp_path / "c1").rglob("*.*"):
        assert p.read_bytes() == (tmp_path / "c2" / p.relative_to(tmp_path / "c1")).read_bytes()


def test_parcala_eski_parcalari_siler(tmp_path):
    il = box(27.0, 38.0, 28.0, 39.0)
    _ms_dosyasi(tmp_path / "a.csv.gz", [_kare(27.1, 38.1)])
    eski = tmp_path / "c" / "1" / "1.json.gz"
    eski.parent.mkdir(parents=True)
    eski.write_bytes(b"eski")
    ayak_izi.parcala([tmp_path / "a.csv.gz"], il, tmp_path / "c")
    assert not eski.exists()


def test_mahalle_dizini():
    il = box(27.0, 38.0, 29.0, 39.0)
    ilceler = {"Kula": box(28.0, 38.0, 29.0, 39.0), "Akhisar": box(27.0, 38.0, 28.0, 39.0)}

    def yer(ad, b, e, tur="suburb"):
        return {"lon": b, "lat": e, "tags": {"name": ad, "place": tur}}

    elemanlar = [
        yer("Zafer", 28.5, 38.5),
        yer("mahalle", 28.6, 38.6),  # S4 çöp kaydı
        yer("Mahalle", 28.6, 38.6),
        yer("İçhisar", 27.5, 38.5, "village"),
        yer("Zafer", 28.500001, 38.500001),  # aynı yerde tekrar
        yer("Zafer", 27.2, 38.2),  # başka ilçede aynı ad: kalır
        yer("Dışarı", 30.0, 38.5),  # il dışı
        {"lon": 28.1, "lat": 38.1, "tags": {"place": "suburb"}},  # adsız
        yer("Mezra", 28.2, 38.2, "hamlet"),  # tür kapsam dışı
    ]
    dizin = mahalle.mahalle_dizini(elemanlar, il, ilceler)
    assert dizin == [
        {"ad": "İçhisar", "ilce": "Akhisar", "tur": "koy", "konum": [27.5, 38.5]},
        {"ad": "Zafer", "ilce": "Akhisar", "tur": "mahalle", "konum": [27.2, 38.2]},
        {"ad": "Zafer", "ilce": "Kula", "tur": "mahalle", "konum": [28.5, 38.5]},
    ]


def test_tr_kucuk():
    assert mahalle.tr_kucuk("IŞIK İzmir") == "ışık izmir"


def test_duzenli_izgara_eksik_hucre_hata():
    noktalar = [{"lat": 38.0, "lon": 27.0, "value": 1}, {"lat": 38.0, "lon": 27.1, "value": 2}]
    assert tehlike.duzenli_izgara(noktalar) == {
        "enlemler": [38.0],
        "boylamlar": [27.0, 27.1],
        "degerler": [[1, 2]],
    }
    duzensiz = [*noktalar, {"lat": 38.1, "lon": 27.0, "value": 3}]
    with pytest.raises(ValueError, match="eksik"):
        tehlike.duzenli_izgara(duzensiz)
    # Model kenarı: boş hücreye izin var, ama bilineer boş köşeli hücrede hesap yapmaz
    kenar = [
        {"lat": e, "lon": b, "value": e * 10 + b}
        for e in (38.0, 38.1, 38.2)
        for b in (27.0, 27.1)
        if (e, b) != (38.2, 27.1)
    ]
    iz = tehlike.duzenli_izgara(kenar, eksik_serbest=True)
    assert iz["degerler"][2] == [38.2 * 10 + 27.0, None]
    assert tehlike.bilineer(iz, 38.05, 27.05) == pytest.approx(38.05 * 10 + 27.05)
    with pytest.raises(ValueError, match="model alanı"):
        tehlike.bilineer(iz, 38.15, 27.05)


def test_overpass_mesgul_cevabi_onbellege_girmez():
    from yapirisk_pipeline.osm import overpass_gecerli

    assert overpass_gecerli(b'{"version": 0.6, "elements": []}')
    assert not overpass_gecerli(
        b'<?xml version="1.0"?><html>Dispatcher_Client::request_read_and_idx::timeout</html>'
    )
    assert not overpass_gecerli(b'{"elements": [], "remark": "runtime error: Query timed out"}')
