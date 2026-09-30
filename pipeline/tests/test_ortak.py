import gzip
import json

from yapirisk_pipeline.ortak import json_bayt, json_yaz, sha256_dosya


def test_json_bayt_anahtar_sirasindan_bagimsiz():
    assert json_bayt({"b": 1, "a": "ş"}) == json_bayt({"a": "ş", "b": 1})
    assert json_bayt({"a": "ş"}) == '{"a":"ş"}\n'.encode()


def test_gz_iki_yazimda_ayni_sha256(tmp_path):
    veri = {"tip": "FeatureCollection", "ozellikler": [[27.4, 38.6]]}
    ilk = json_yaz(tmp_path / "a.json.gz", veri)
    ikinci = json_yaz(tmp_path / "b.json.gz", veri)
    assert ilk == ikinci == sha256_dosya(tmp_path / "a.json.gz")
    assert json.loads(gzip.decompress((tmp_path / "a.json.gz").read_bytes())) == veri
