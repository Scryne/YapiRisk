---
proje: YapiRisk
created: 2026-09-30
type: arastirma
---
# ÇŞB "Hızlı Deprem Güvenliği Değerlendirme Yöntemleri" — okuma notu

> **Kaynak:** Çevre, Şehircilik ve İklim Değişikliği Bakanlığı (2025). *Hızlı Deprem Güvenliği
> Değerlendirme Yöntemleri*. Ankara. Revizyon 00, 121 sayfa. Yapı İşleri Genel Müdürlüğü; Dünya Bankası
> finansmanı, GFDRR (Japonya) desteği; hazırlayan ARUP (WB/CS-TA-02 projesi). Bakanlık sitesinde
> 13.05.2026 tarihli PDF: `webdosya.csb.gov.tr/v2/kamuguclendirme/2026/05/H-zl-De-erlendirme-Yontemleri-20260513143255.pdf`
> (sunucu sertifikası geçersiz; `curl -k` ile indirildi). Scribd kopyası: Scryne buldu (2026-09-30).
> Yerel kopya: `kaynak/` (git dışı). **Lisans:** "ticari olmayan amaçlarla, kaynak gösterildiği sürece,
> kısmen veya tamamen çoğaltılabilir." Belge kendini "genel rehber, yasal/akademik/mali tavsiye değil" diye
> niteler.
>
> Tablolar `pdftotext -layout` çıktısından aktarıldı; çok sütunlu tablolarda sütun eşlemesi ⚠ ile
> işaretli yerlerde RYTEİE 2019 Resmî Gazete asıl metnine karşı doğrulanmalı (S2 kalanı).

## Belgenin kapsamı

Türkiye'de geliştirilmiş 8 yöntem (P25, DURTES, TÜBİTAK İÇTAG-I574/Özcebe v.d., Yakut, Sucuoğlu–Yazgan–Yakut,
Coşkun–Aldemir–Şahmaran, PERA, RYTEİE 2019), 5 uluslararası yöntem (FEMA P-154, ASCE 41-23 Tier-1, NRCC
1993 Kanada, IEP Yeni Zelanda, Japon Is), ülke politikaları (ABD, Japonya, İtalya, Yeni Zelanda, Türkiye)
ve Türkiye için politika önerisi.

## Önceki araştırmayı düzelten bulgu

`02-yontem-ve-mevzuat.md` "RYTEİE 2019'da puanlı ön tarama yok gibi görünüyor" demişti. **Yanlış.**
RYTEİE 2019 **Ek-A**, "riskli olabilecek binaların bölgesel dağılımının belirlenmesi ve önceliklendirme
kararı" için basitleştirilmiş, puanlı bir yöntem tanımlar. Belge bunu "ülkemiz için resmî olarak kullanıma
alınan ilk hızlı tarama yöntemi" diye anar. Kritik kayıt, yönetmelikten alıntı:

> "Bölgesel risk durumunun tanımlanmasında kullanılacak yöntemler, bilim ve tekniğin gereği istatistiksel
> olarak anlamlı sayıda bina ihtiva eden alanlarda uygulanabilir ve **tekil binada risk değerlendirme
> amaçlı olarak kullanılamaz.**"

## RYTEİE 2019 Ek-A — betonarme (7 kata kadar)

**Formül:** `PP = TP + Σ (Oᵢ · OPᵢ) + YSP` — PP < 100 "riskli", PP ≥ 100 "risksiz" (yöntemin kendi eşiği).
Amaç: "verilen bir grup bina içerisinde PP'ye bağlı risk sıralaması".

**Tablo 23 — Taban puanı (TP) ve yapısal sistem puanı (YSP)**

| Kat sayısı | TP bölge I | II | III | IV | YSP BA çerçeve | YSP BA çerçeve+perde |
| --- | --- | --- | --- | --- | --- | --- |
| 1–2 | 90 | 120 | 160 | 195 | 0 | 100 |
| 3 | 80 | 100 | 140 | 170 | 0 | 85 |
| 4 | 70 | 90 | 130 | 160 | 0 | 75 |
| 5 | 60 | 80 | 110 | 135 | 0 | 65 |
| 6–7 | 50 | 65 | 90 | 110 | 0 | 55 |

**Tablo 24 — Tehlike bölgesi (SDS + zemin sınıfı)** ⚠ son satırın bölgesi düzen bozuk

| Bölge | Koşul |
| --- | --- |
| I | SDS ≥ 1,0 ve ZC/ZD/ZE |
| II | SDS ≥ 1,0 ve ZA/ZB; ya da 0,75 ≤ SDS < 1,0 ve ZC/ZD/ZE |
| III | 0,75 ≤ SDS < 1,0 ve ZA/ZB; ya da 0,50 ≤ SDS < 0,75 ve ZC/ZD/ZE |
| IV | 0,50 ≤ SDS < 0,75 ve ZA/ZB (⚠ örüntüye göre IV; metinde III ile IV arasında) ; SDS < 0,50 tüm zeminler |

**Tablo 25 — Olumsuzluk parametre değerleri (Oᵢ)**

| Parametre | Durum 1 (Oᵢ) | Durum 2 (Oᵢ) |
| --- | --- | --- |
| Görünen kalite | İyi (0) | Orta (1) / Kötü (2) |
| Yumuşak kat | Yok (0) | Var (1) |
| Düşeyde düzensizlik | Yok (0) | Var (1) |
| Ağır çıkma | Yok (0) | Var (1) |
| Planda düzensizlik | Yok (0) | Var (1) |
| Kısa kolon | Yok (0) | Var (1) |
| Yapı nizamı | Ayrık (0) | Bitişik / köşede bitişik (1) |
| Tabii zemin eğimi | Yok (0) | Var (1) |

**Tablo 26 — Olumsuzluk parametre puanları (OPᵢ)** ⚠ sütun eşlemesi layout'tan çıkarıldı

| Kat | Yumuşak kat | Görünen kalite | Ağır çıkma | Nizam: aynı kat sev. orta | aynı kenar | farklı orta | farklı kenar | Düşeyde düz. | Planda düz./burulma | Kısa kolon | Tabii zemin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1–2 | −10 | −10 | −10 | 0 | −10 | −5 | −15 | −5 | −5 | −5 | −3 |
| 3 | −20 | −10 | −20 | 0 | −10 | −5 | −15 | −10 | −10 | −5 | −3 |
| 4 | −30 | −15 | −30 | 0 | −10 | −5 | −15 | −15 | −10 | −5 | −3 |
| 5 | −30 | −25 | −30 | 0 | −10 | −5 | −15 | −15 | −10 | −5 | −3 |
| 6–7 | −30 | −30 | −30 | 0 | −10 | −5 | −15 | −15 | −10 | −5 | −3 |

Yorum (belge): pratik, röleve gerekmez ama bina içi kontrol ister; eleman boyutu, etriye sıklaştırması,
güçlü kolon–zayıf kiriş değerlendirme dışı; istatistiki ağırlıklara dayanır.

**Proje için sonuç (Aria çıkarımı):** Manisa'da SDS büyük ölçüde ≥ 1,0 → bölge I/II. Bölge I'de BA çerçeve
bir bina hiç kusuru olmasa bile TP ≤ 90 < 100 alır, yani eşik neredeyse her binayı "riskli" der. Yöntem de
zaten mutlak hüküm değil **sıralama** için tasarlanmış. Bu yüzden 100 eşiği kullanıcıya hüküm olarak
gösterilmez; öncelik bantları PP dağılımına ve S3 doğrulamasına göre kalibre edilir.

## Sucuoğlu–Yazgan–Yakut (2007) — çapraz kontrol

`PP = α₀ + α_SS·ss + α_AQ·aq + α_HO·ho`; ss: yumuşak kat var −1 / yok 0; aq: kötü −1 / orta 0 / iyi +1;
ho: ağır çıkma var −1 / yok 0. Eşik: PP ≤ 60 yüksek risk. 454 Düzce binasıyla test edilmiş.

| Katsayı | 3 kat | 4 kat | 5–6 kat |
| --- | --- | --- | --- |
| α₀ | 80 | 73 | 64 |
| α_SS | 23 | 22 | 24 |
| α_AQ | 9 | 15 | 23 |
| α_HO | 23 | 30 | 33 |

Sınırlar: tehlikeye bağlı değil (Düzce kalibrasyonu), 3–6 kat, kısa kolon ve malzeme dışarıda.

## Coşkun–Aldemir–Şahmaran (2019) — aday

545 BA binanın detaylı değerlendirmesinden; RYTEİE'nin eksiklerini düzeltmek için. 14 değişken: kat sayısı,
sismik bölge (SDS 0,25/0,50/0,75 g), zemin (Vs30), bina yaşı, yapısal sistem, komşu yapı, kısa kolon, düşey
düzensizlik, çıkma, plan düzensizliği, yumuşak kat, komşu döşeme seviyesi, zemin eğimi, inşaat tarihi etkisi
(2007+, 1998–2007, 1975–1998, 1975 öncesi). `BRS = 55 + Σ PSᵢ`, BRS < 0 riskli. Yaş ve inşaat tarihini
açıkça içermesi vatandaş formu için değerli. ⚠ Ceza tablosu (Tablo 20) PDF'te iki sütun birbirine karışmış;
değerler asıl makaleden alınmalı (Coşkun, Aldemir, Şahmaran 2019).

## Yöntem karşılaştırması (belge, Tablo 27)

En basit: Sucuoğlu–Yazgan–Yakut (veri toplama ve analiz hızı yüksek, bina içi gerekmez, temel beceri).
RYTEİE 2019: hızlı, 7 kata kadar, veri toplama temel, değerlendirme orta beceri. En kapsamlı: PERA (ölçüm
ister, OpenSees analizi; İBB'nin 25 bin+ bina taramasında kullanıldı; A–E sınıfı DGO ile).

## Politika önerisinden (bölüm 7) projeye doğrudan bağlanan cümleler

- Türkiye'deki hızlı yöntemlerin "doğruluk oranları tespit edilmesi gereklidir"; en uygun yöntem "son
  yaşanan Maraş depremleri sonuçları ile kalibre edilerek" seçilmeli. → Projenin "ölçülmüş isabet" farkı.
- "Kat maliklerinin, web siteleri, mobil uygulamalar veya anketler yoluyla binaları ile ilgili temel yapısal
  verileri sağlamaya katılımları sağlanabilir … kullanıcı dostu bir mobil uygulama geliştirilebilir." →
  v1'in bireysel form yaklaşımı.
- İki aşamalı tarama: ilk aşamadan geçemeyen binalar detaylı değerlendirmeye. → Çıktının "profesyonel
  inceleme önceliği" çerçevesi.
