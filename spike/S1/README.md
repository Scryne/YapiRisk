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

**İzmir sonucu (2026-09-30; Scryne 10 raporu e-Devlet ile aldı, DD-2, ZC; ESHM20 İzmir bölge paketinin ızgarasından):**

| İlçe | SS TDTH | SS ESHM20 | oran | SDS_ZC TDTH → bölge | ESHM20 → bölge |
| --- | --- | --- | --- | --- | --- |
| Konak | 1,126 | 1,505 | 1,337 | 1,351 → I | I |
| Bornova | 1,103 | 1,258 | 1,141 | 1,324 → I | I |
| Bergama | 1,038 | 0,904 | 0,871 | 1,246 → I | I |
| Aliağa | 1,144 | 1,045 | 0,914 | 1,373 → I | I |
| Çeşme | 0,966 | 0,940 | 0,973 | 1,159 → I | I |
| Seferihisar | 1,114 | 1,195 | 1,073 | 1,337 → I | I |
| Torbalı | 0,863 | 0,695 | 0,806 | 1,036 → I | **II** (güvensiz yön) |
| Tire | 0,769 | 0,683 | 0,888 | 0,923 → II | II |
| Ödemiş | 0,677 | 0,621 | 0,917 | 0,832 → II | II |
| Beydağ | 0,753 | 0,676 | 0,898 | 0,904 → II | II |

Oran ortalaması 0,98 (0,81–1,34). Okuma denetimi: 10 raporda SDS ve SD1, SS ve S1'den TBDY ZC katsayısıyla
±0,0005 tutuyor. **Karar:** güvensiz yön sınırı (0,72) İzmir'de de tuttu; üst oran Konak'ta 1,25'i aştı (güvenli yön)
→ bant iki ilin 20 ölçümünü kapsayacak şekilde 0,72–1,34 (`S1_BANDI`). Öncelik bandı kötü uçtan seçildiği için
hiçbir sonuç değişmez; yalnız PP aralığının elverişli ucu genişler. Vitest: `tehlike.test.ts` "S1 İzmir".

## Aydın (Roadmap Faz 6.6, 2026-10-01)

Üçüncü il Aydın. S1 bandının (0,72–1,34) Aydın'da geçerliliği için 10 ilçe merkezi seçildi
(`aydin-tdth-okumalar.csv`; koordinatlar OSM `admin_centre` düğümleri, Efeler için ilçe etiketi, Didim için
ilçe merkezi). Batı kıyıdan (Kuşadası, Söke, Didim) Büyük Menderes grabeni boyunca doğuya (Germencik, Efeler,
Nazilli, Buharkent) ve güneye (Karacasu, Bozdoğan, Çine) kapsanıyor; on noktanın hepsi il sınırı içinde.

**Okuma (Scryne, e-Devlet):** Manisa ve İzmir'deki akışın aynısı: tdth.afad.gov.tr → Raporlama → koordinat →
**DD-2** → zemin **ZC** → Değerleri Hesapla. Rapordan SS, S1, PGA, PGV, SDS, SD1 CSV'nin boş sütunlarına.
En az 5 okuma Faz 6.6'yı kapatır; o zamana kadar uygulama Aydın'da "Bu ilde AFAD'la karşılaştırma henüz
yapılmadı" notunu gösterir ve bandı Manisa + İzmir'in 20 ölçümünden alır.

**Aydın sonucu (2026-10-02; Scryne 10 raporu e-Devlet ile aldı, DD-2, ZC; ESHM20 Aydın bölge paketinin ızgarasından):**

| İlçe | SS TDTH | SS ESHM20 | oran | SDS_ZC TDTH → bölge | ESHM20 → bölge |
| --- | --- | --- | --- | --- | --- |
| Efeler | 1,445 | 1,152 | 0,797 | 1,734 → I | I |
| Kuşadası | 1,069 | 0,861 | 0,805 | 1,283 → I | I |
| Söke | 1,263 | 0,906 | 0,717 | 1,516 → I | I |
| Didim | 0,846 | 0,440 | 0,520 | 1,015 → I | **III** (güvensiz yön) |
| Germencik | 1,325 | 0,975 | 0,736 | 1,590 → I | I |
| Nazilli | 1,333 | 1,289 | 0,967 | 1,600 → I | I |
| Buharkent | 1,365 | 1,110 | 0,813 | 1,638 → I | I |
| Karacasu | 1,014 | 0,788 | 0,777 | 1,217 → I | **II** (güvensiz yön) |
| Bozdoğan | 0,933 | 0,678 | 0,727 | 1,120 → I | **II** (güvensiz yön) |
| Çine | 0,848 | 0,603 | 0,711 | 1,018 → I | **II** (güvensiz yön) |

Oran ortalaması 0,76 (0,52–0,97). Okuma denetimi: 10 raporda SDS ve SD1, SS ve S1'den TBDY ZC katsayısıyla
±0,0005 tutuyor; koordinatlar CSV'yle birebir. **Karar:** ortak bandın güvensiz yön sınırı (0,72) Aydın'da tutmadı
(Didim, Çine). Fark ilden ile değiştiği için bant il başına o ilde ölçülen aralık oldu, alt sınır hiçbir ilde 0,72'nin
üstüne çıkmaz; ölçülmemiş ilde 30 noktanın birleşimi 0,52–1,34 (`tehlike.ts` `ilBandi`, `S1_BANDI`; `bolgeler.json`
`tdthOran`). Not: ESHM20 güneyde ve kıyıda (Didim) AFAD'dan en çok sapıyor; 0,1° ızgara Büyük Menderes grabenini
ve yarımadayı kaba çözüyor olabilir.

## Denizli (Roadmap Faz 6.8, 2026-10-02)

Dördüncü il Denizli. 10 ilçe merkezi (`denizli-tdth-okumalar.csv`; OSM `admin_centre` düğümleri, Pamukkale için ilçe
etiketi): merkez (Merkezefendi, Pamukkale), batı (Sarayköy, Buldan, Babadağ), kuzeydoğu (Çal, Çivril), güney
(Acıpayam, Tavas, Çameli); on noktanın hepsi il sınırı içinde. Okuma akışı Aydın'daki gibi (DD-2, ZC). Okumalar
gelince oran aralığı `bolgeler.py` `tdth_oran`'a yazılır, S1 testleri (`describe.each`) Denizli'yi de kapsar.

**Denizli sonucu (2026-10-02; Scryne 10 raporu e-Devlet ile aldı, DD-2, ZC; ESHM20 Denizli bölge paketinin ızgarasından):**

| İlçe | SS TDTH | SS ESHM20 | oran | SDS_ZC TDTH → bölge | ESHM20 → bölge |
| --- | --- | --- | --- | --- | --- |
| Merkezefendi | 1,147 | 1,303 | 1,136 | 1,376 → I | I |
| Pamukkale | 1,223 | 1,358 | 1,111 | 1,468 → I | I |
| Sarayköy | 1,232 | 1,370 | 1,112 | 1,478 → I | I |
| Buldan | 1,175 | 1,037 | 0,883 | 1,410 → I | I |
| Babadağ | 1,122 | 1,178 | 1,050 | 1,346 → I | I |
| Çal | 0,736 | 0,616 | 0,837 | 0,887 → II | II |
| Çivril | 0,859 | 0,967 | 1,126 | 1,031 → I | I |
| Acıpayam | 0,926 | 0,701 | 0,757 | 1,111 → I | **II** (güvensiz yön) |
| Tavas | 0,820 | 0,652 | 0,795 | 0,984 → II | II |
| Çameli | 1,066 | 1,061 | 0,996 | 1,279 → I | I |

Oran ortalaması 0,98 (0,76–1,14). Okuma denetimi: 10 raporda SDS ve SD1 TBDY ZC katsayısıyla ±0,0005; koordinatlar
CSV'yle birebir. Bant 0,72–1,14 (`tdth_oran` 0,75–1,14, alt sınır tavan kuralıyla 0,72). Dört ilde 40 nokta: oran
ortalaması il il 0,76–0,98; ESHM20'nin en çok saptığı yer Aydın'ın güneyi ve kıyısı.

