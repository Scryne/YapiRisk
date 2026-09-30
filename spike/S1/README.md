# S1 — ESHM20 ↔ AFAD TDTH (Manisa)

**Soru:** ESHM20 (EFEHR API) Manisa'da TDTH'ye yakın değer veriyor mu, ve il ızgarası K-2'deki gibi
statik dosya olarak çekilebiliyor mu?

## Yöntem
- EFEHR `GET /v1/maps/area`, model 81 (ESHM20), yıllık aşılma olasılığı 0.002103 (475 yıl = TBDY DD-2),
  `aggregationtype=arithmetic`, `aggregationlevel=0.5`. Büyüklükler: PGA, SA(0.2 s) ↔ SS, SA(1.0 s) ↔ S1.
- İki referans da Vs30 = 760 m/s kayada: ESHM20 "B/C boundary", TBDY ZB referansı → doğrudan kıyaslanır.
- 10 nokta: Nominatim ilçe merkezleri (`tdth-okumalar.csv`). ESHM20 değeri ızgaradan bilineer ara değer.
- TDTH: Scryne e-Devlet ile okur (DD-2, zemin ZC): SS, S1, PGA, PGV, SDS, SD1.
- Çalıştır: `python karsilastir.py` → ekran + `sonuc.csv`.

## Sonuç (2026-09-30)
**Izgara çekimi (K-2): tutuyor.** Alan sorgusu lat 38.1–39.5, lon 26.98–29.08; her büyüklük 330 nokta
(15 × 22), 0,1° (~11 km) aralık. Süre: PGA 7,5 sn, SA(0.2) 78 sn, SA(1.0) 71 sn. Boyut: 3 × ~17 KB JSON.
Lisans CC BY 4.0. Not: tek nokta sorgusu (`/v1/maps?lon&lat`) noktayı değil, çevresindeki 10 × 10
ızgarayı döndürüyor; alan sorgusu doğru araç.

**ESHM20 değerleri (bilineer):**

| İlçe | PGA | SS≈SA(0.2) | S1≈SA(1.0) |
| --- | --- | --- | --- |
| Şehzadeler | 0.407 | 1.027 | 0.243 |
| Akhisar | 0.292 | 0.722 | 0.162 |
| Kırkağaç | 0.393 | 0.961 | 0.208 |
| Soma | 0.343 | 0.844 | 0.189 |
| Salihli | 0.524 | 1.384 | 0.382 |
| Alaşehir | 0.474 | 1.245 | 0.343 |
| Turgutlu | 0.462 | 1.188 | 0.313 |
| Demirci | 0.276 | 0.684 | 0.161 |
| Gördes | 0.222 | 0.549 | 0.133 |
| Kula | 0.264 | 0.671 | 0.178 |

**TDTH karşılaştırması (2026-09-30; Scryne 10 raporu e-Devlet ile aldı, DD-2, ZC):**

| İlçe | SS TDTH | SS ESHM20 | oran | PGA oran | S1 oran | SDS_ZC TDTH → bölge | ESHM20 → bölge |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Şehzadeler | 1.158 | 1.027 | 0.89 | 0.86 | 0.86 | 1.390 → I | 1.232 → I |
| Akhisar | 0.977 | 0.722 | 0.74 | 0.72 | 0.69 | 1.172 → I | 0.874 → **II** |
| Kırkağaç | 1.051 | 0.961 | 0.91 | 0.91 | 0.84 | 1.261 → I | 1.153 → I |
| Soma | 0.999 | 0.844 | 0.84 | 0.83 | 0.80 | 1.199 → I | 1.013 → I |
| Salihli | 1.108 | 1.384 | 1.25 | 1.17 | 1.39 | 1.330 → I | 1.661 → I |
| Alaşehir | 1.299 | 1.245 | 0.96 | 0.88 | 1.04 | 1.559 → I | 1.494 → I |
| Turgutlu | 1.161 | 1.188 | 1.02 | 0.98 | 1.10 | 1.393 → I | 1.425 → I |
| Demirci | 0.949 | 0.684 | 0.72 | 0.69 | 0.73 | 1.139 → I | 0.839 → **II** |
| Gördes | 0.745 | 0.549 | 0.74 | 0.72 | 0.73 | 0.895 → II | 0.703 → **III** |
| Kula | 0.781 | 0.671 | 0.86 | 0.82 | 0.92 | 0.937 → II | 0.827 → II |

Ortalama oran (ESHM20/TDTH): PGA 0,86 (0,69–1,17), SS 0,89 (0,72–1,25), S1 0,91 (0,69–1,39).
Tam değerler (PGV dahil): `tdth-okumalar.csv`, `sonuc.csv`; raporlar Scryne'ın İndirilenler'inde `1–10.pdf`.

**Yan sonuç (S2-b kapandı):** TBDY Tablo 2.1'in ZC satırı (Fs, F1) 10 noktanın hepsinde TDTH'nin SDS/SD1'ini
±0,001 ile yeniden üretti. Diğer zemin sınıfları henüz doğrulanmadı.

## Karar
**ESHM20 tek başına yetmez.** Sapma sistematik (10'un 8'inde düşük) ve 10 noktanın 3'ünde RYTEİE tehlike
bölgesi değişiyor; üçünde de **güvensiz yönde** (düşük tehlike → yüksek taban puanı → bina daha güvenli
görünür; 3 katlı binada bölge I→II farkı +20 puan). Sıralama genel olarak tutuyor (en yüksek Gediz grabeni,
en düşük Gördes/Kula), Salihli dışında. 0,1° çözünürlük ve farklı kaynak modelleri iki olası neden.
Ürüne yansıması Proje-Fikri K-5'te.

## Karar kuralı (okumalar gelince)
- Oran (ESHM20/TDTH) üç büyüklükte de ~0,8–1,25 ve sıralama tutarlı → ESHM20 otomatik değer olarak kalır,
  raporda "AFAD resmî değeri değildir" notuyla.
- Sistematik sapma varsa (ör. hep %30 düşük) → risk bölgesi (RYTEİE Tablo 24) kayar; ESHM20 yalnız
  "TDTH girilmediğinde kaba tahmin" olur, TDTH girişi öne çıkar.
- 0,1° çözünürlük: fay yakınında (Gediz grabeni) TDTH'nin daha ince ızgarasıyla fark büyüyebilir;
  noktalar arası tutarsızlık buna bakılarak yorumlanır.

## İzmir (Roadmap Faz 6.5, 2026-09-30)

Yayın için ikinci il İzmir. S1 bandının (0,72–1,25) İzmir'de geçerli olup olmadığını ölçmek için 10 ilçe merkezi
seçildi (`izmir-tdth-okumalar.csv`; koordinatlar OSM `admin_centre` düğümleri, Konak için Konak Meydanı). İl
kuzeyden (Bergama, Aliağa) batıya (Çeşme, Seferihisar), merkezden (Konak, Bornova) güneydoğuya (Torbalı, Tire,
Ödemiş, Beydağ) kapsanıyor.

**Okuma (Scryne, e-Devlet):** Manisa'daki akışın aynısı: tdth.afad.gov.tr → Raporlama → koordinat → **DD-2** →
zemin **ZC** → Değerleri Hesapla. Rapordan SS, S1, PGA, PGV, SDS, SD1 CSV'nin boş sütunlarına (SDS → `SDS_ZC`,
SD1 → `SD1_ZC`). Sonra `karsilastir.py` Manisa'daki gibi oranları ve bölge değişimlerini çıkarır.
