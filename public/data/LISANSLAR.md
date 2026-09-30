# Veri lisansları

Bu klasördeki dosyalar `pipeline/` boru hattıyla üçüncü taraf açık verilerden üretilmiştir. Her bölge
paketindeki `kaynak.json` kaynak sürümünü, çekim tarihini ve dosyaların sha256 özetini kaydeder. Uygulama
kodunun lisansı bu dosyaları kapsamaz; her dosya aşağıdaki kaynağının lisansıyla dağıtılır.

| Dosya | Kaynak | Lisans | Değişiklik |
| --- | --- | --- | --- |
| `<bölge>/tehlike-eshm20.json` | ESHM20, EFEHR | CC BY 4.0 | Alan sorgusu düzenli ızgaraya çevrildi, değerler 7 ondalığa yuvarlandı |
| `<bölge>/bina/**` | Microsoft GlobalMLBuildingFootprints | CDLA Permissive 2.0 | İl sınırı içindekiler seçildi, koordinatlar 6 ondalığa yuvarlandı, z14 parçalarına bölündü, yükseklik alanı çıkarıldı |
| `<bölge>/mahalleler.json`, `<bölge>/sinir.json` | OpenStreetMap | ODbL 1.0 | Mahalle/köy noktaları ilçeyle eşlendi, tekrar ve çöp kayıt elendi; il sınırı sadeleştirildi |
| `dogrulama.json` | ACI 133 hasar veri seti + ESHM20 | CC BY 4.0 | Yalnız özet istatistik (n, AUC, bant başına oran); bina düzeyinde veri yok |
| `bolgeler.json` | YapiRisk | Uygulama koduyla aynı | — |

## ESHM20 — CC BY 4.0

Danciu, L., Nandan, S., Reyes, C., Basili, R., Weatherill, G. vd. (2021). *The 2020 update of the European
Seismic Hazard Model – ESHM20: Model Overview.* EFEHR Technical Report 001, v1.0.0.
https://doi.org/10.12686/a15 — veri: EFEHR web servisleri, https://efehr-services.ethz.ch
Lisans: https://creativecommons.org/licenses/by/4.0/

Değerler Avrupa modelinin 475 yıllık (yıllık aşılma 0,002103) kaya değerleridir; AFAD Türkiye Deprem Tehlike
Haritası'nın resmî değerleri değildir.

## Microsoft GlobalMLBuildingFootprints — CDLA Permissive 2.0

Kaynak: https://github.com/microsoft/GlobalMLBuildingFootprints. Lisans metni, 2.1 maddesi gereği aşağıdadır.

```
Community Data License Agreement - Permissive - Version 2.0

This is the Community Data License Agreement - Permissive, Version 2.0 (the "agreement"). Data Provider(s) and Data Recipient(s) agree as follows:

1. Provision of the Data

1.1. A Data Recipient may use, modify, and share the Data made available by Data Provider(s) under this agreement if that Data Recipient follows the terms of this agreement.

1.2. This agreement does not impose any restriction on a Data Recipient's use, modification, or sharing of any portions of the Data that are in the public domain or that may be used, modified, or shared under any other legal exception or limitation.

2. Conditions for Sharing Data

2.1. A Data Recipient may share Data, with or without modifications, so long as the Data Recipient makes available the text of this agreement with the shared Data.

3. No Restrictions on Results

3.1. This agreement does not impose any restriction or obligations with respect to the use, modification, or sharing of Results.

4. No Warranty; Limitation of Liability

4.1. All Data Recipients receive the Data subject to the following terms:

THE DATA IS PROVIDED ON AN "AS IS" BASIS, WITHOUT REPRESENTATIONS, WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OR CONDITIONS OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

NO DATA PROVIDER SHALL HAVE ANY LIABILITY FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING WITHOUT LIMITATION LOST PROFITS), HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE DATA OR RESULTS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

5. Definitions

5.1. "Data" means the material received by a Data Recipient under this agreement.

5.2. "Data Provider" means any person who is the source of Data provided under this agreement and in reliance on a Data Recipient's agreement to its terms.

5.3. "Data Recipient" means any person who receives Data directly or indirectly from a Data Provider and agrees to the terms of this agreement.

5.4. "Results" means any outcome obtained by computational analysis of Data, including for example machine learning models and models' insights.
```

## OpenStreetMap — ODbL 1.0

© OpenStreetMap katkıcıları. Veri Open Database License (ODbL) 1.0 ile sunulur:
https://opendatacommons.org/licenses/odbl/1-0/ — ayrıntı: https://www.openstreetmap.org/copyright

`mahalleler.json` ve `sinir.json` OSM'den türetilmiş veritabanlarıdır ve aynı ODbL 1.0 lisansıyla sunulur.
Üretim yöntemi `pipeline/yapirisk_pipeline/osm.py` ve `mahalle.py` içindedir.

## ACI 133 hasar veri seti — CC BY 4.0

Hariri-Ardebili, M. A. (2024). *Damage to RC Structures and Intensity Measures from the 2023 Türkiye
Earthquake* (ACI 133). Zenodo. https://zenodo.org/records/13386343
Lisans: https://creativecommons.org/licenses/by/4.0/

`dogrulama.json` bu veriden hesaplanmış özet istatistiktir; bina düzeyinde kayıt içermez.
