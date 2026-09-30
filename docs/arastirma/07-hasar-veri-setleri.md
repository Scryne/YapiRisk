---
proje: YapiRisk
created: 2026-09-30
type: arastirma
---
# Doğrulama için bina bazlı hasar veri setleri + S2 kaynakları

> Ham araştırma raporu (2026-09-30, web araştırması alt ajanı). S3 bağlamı: `spike/S3/README.md`.

# Bina bazlı deprem hasar veri setleri ve S2 kaynakları

**Cevap:** İndirilebilir ve RYTEİE alanlarının çoğunu taşıyan tek set Zenodo'daki ACI-133 seti (≈240 BA bina, CC BY 4.0). Kusur bayrakları için en uygun aday bu. Sütun başlıklarını göremedim. En büyük set (Yilmaz vd., 2,15 milyon bina) Bakanlık verisi. Makalenin dediği web portalın URL'sini bulamadım. Bakanlık verisi "talep üzerine / kısıtlı" görünüyor. Tüm ASCE, DesignSafe ve Sage sayfaları bana 403 verdi. RYTEİE Ek-A tablolarını okuyamadım. TBDY Fs ve F1 ile Coşkun vd. Tablo 4'ü birebir çıkardım.

## 1. Veri setleri

Doğrulama etiketleri: **[görüldü]** = sayfa/API'yi ben okudum. **[dolaylı]** = arama özeti veya başka makale. **[doğrulanmadı]** = göremedim.

| Ad | Bina | Deprem | Alanlar | Kusur alanları | Erişim / Lisans | Doğrulama | URL |
|---|---|---|---|---|---|---|---|
| ACI-133 "Damage to RC Structures and Intensity Measures from the 2023 Türkiye Earthquake" (Hariri-Ardebili, 28.08.2024) | >240 BA | 2023 Kahramanmaraş | Kaynak makaleye göre yapı özellikleri + gözlenen hasar + şok bazlı yer hareketi ölçüleri. Yerel liste: yükseklik, yaş, kat, konum, kısa kolon, yumuşak kat, düzensizlik, kolon ve perde kesitleri, döşeme boyutu, hasar sınıfı | Kısa kolon, yumuşak kat, düzensizlik var (dolaylı) | Doğrudan indirme, `ACI133v3.xlsx` (317,5 kB). CC BY 4.0 | Set ve dosya [görüldü]. Sütun başlıkları [doğrulanmadı]. Alan listesi [dolaylı] | https://zenodo.org/records/13386343 ; makale: https://doi.org/10.1177/87552930231211208 (Sage sayfası 403) |
| Atasever vd., "Structural Damage Assessment Dataset: 6 Feb 2023 Kahramanmaraş" (Gaziantep, 26.09.2025) | 1.308 bina (saha 1.733; 425'inde eksik veri) | 2023 | Konum, fotoğraf, hasar düzeyi, yapı meta verisi (taban alanı, malzeme). Makaleye göre yapım dönemi, kat, sistem (739 BA, 444 yığma, 101 hibrit, 13 prefabrik, 11 çelik), kullanım | Ayrı kusur alanı görmedim | Doğrudan indirme. **CC BY-NC-ND 4.0**. Dosya sayısı 14.076: 14.030 JPEG, 1 xlsx (`rapor_final_v2.xlsx`, 392 kB, dosya id 12080446), 38 `koordinat*.docx`, 2 mp4. Tablo dosyası yalnızca bu xlsx | Meta veri ve dosya sayımı [görüldü]. xlsx içeriği [doğrulanmadı] | https://doi.org/10.7910/DVN/OQCPWF ; harita portalı: https://ataseverk.github.io/maras_eq_data/ ; makale: https://link.springer.com/article/10.1007/s13369-025-10991-4 |
| Yilmaz, Altunışık, Taciroglu vd., "Regional Building Damage Survey Data…" ASCE OPEN 2(1), 04024009 (13.12.2024) | 2.153.835 | 2023 | Yedi grup: yapısal sistem, hasar durumu, kullanım, yapım yılı, kat, kat alanı, konum | Yok | Makale CC BY 4.0. Portal "verinin bir kısmını" sunuyor, **URL bulunamadı**. Bir arama özeti verinin Bakanlık'tan talep üzerine alınabildiğini söylüyor (dolaylı) | Künye ve alan grupları [görüldü] (OpenAlex ve Crossref). Portal ve veri erişimi [doğrulanmadı] | https://doi.org/10.1061/AOMJAH.AOENG-0041 (ASCE 403) |
| Pollalis, "Spatial Distribution of Damage caused by the 1999 earthquakes in Turkey" (06.04.2016) | 1.127 düşük katlı BA (Bolu ve Düzce) | 17 Ağu ve 12 Kas 1999 | Enlem/boylam, kat sayısı, yapısal hasar sınıfı (Hafif ≤0,13 mm çatlak / Orta / Ağır / Göçme), fotoğraf | Yok. Yıl ve sistem alanı da yok | Datacenterhub üzerinde Dropbox bağlantısı ve .kml. CC BY-NC-SA 2.5. Referans: Dönmez ve Pujol 2005 | [görüldü] | https://doi.org/10.7277/12V8-1K77 → https://datacenterhub.org/deedsdv/publications/view/332 |
| Sim vd. 2015 "Database of low-rise RC buildings with earthquake damage" (Hassan-Sozen) | >800 bina, dünya geneli. Türkiye: Erzincan, Bolu-Düzce, Bingöl (dolaylı) | Çoklu | Kolon/perde alanı, hasar, kat (dolaylı) | Belirsiz | Atıf verilen `datacenterhub.org/resources/123` bana 404 verdi. Lisans bilinmiyor | Yalnızca [dolaylı] | Deneme URL'si: https://datacenterhub.org/resources/123 |
| Sozen Digital Library | Bina verisi değil, belge dizini | – | Başlık, anahtar kelime, rapor | – | CC BY-SA 3.0, DOI 10.7277/1T2A-RZ92 | [görüldü] | https://datacenterhub.org/deedsdv/publications/view/343 |
| Sucuoğlu–Yazgan–Yakut / Özcebe vd. Düzce ve Kocaeli 1999 veri tabanları | 454 (Düzce), 477 (Marmara), ~500 (Erberik'in "Düzce field database"i) | 1999 | Altı hasar-tetikleyici parametre ve performans skoru (dolaylı) | Parametre listesini doğrulayamadım | Açık indirme **bulunamadı**. DesignSafe ve PEER'de de bulunamadı | [dolaylı] | https://link.springer.com/chapter/10.1007/978-94-010-0021-5_7 ; https://link.springer.com/chapter/10.1007/1-4020-4571-9_10 |
| Coşkun, Aldemir, Şahmaran 2019 (BEE 18:1401) | 545 BA (400 eğitim, 145 test) | Deprem verisi değil | Bkz. Bölüm 2 | Kısa kolon, düşey düzensizlik, ağır çıkma, planda düzensizlik, yumuşak kat, komşu döşeme kotu, eğim, bitişik nizam | Veri Bakanlık'tan alınmış. Veri erişilebilirlik beyanı görmedim → açık değil | [görüldü] (makale tabloları) | https://link.springer.com/article/10.1007/s10518-019-00751-9 |
| Elazığ 2020 (Sci. Rep. 2025) | 883 (267 göçme, 616 ağır) | 2020 | Sistem, hasar 1–5, kat, koordinat | – | **Kamuya açık değil**, Bakanlık kısıtı | [görüldü] | https://www.nature.com/articles/s41598-025-21320-y |
| İzmir 2020, METU EERC | 140 bina, 7–12 kat, kötü performanslılar | 2020 | Kat, kusur, yapım tarihi, koordinat, hasar durumu (dolaylı) | Yumuşak kat, ağır çıkma (dolaylı) | Erişim yolu bulunamadı | [dolaylı] | https://link.springer.com/article/10.1007/s11069-021-05085-x |
| İzmir/Samos 2020 (Aktaş vd., Frontiers) | 520 bina | 2020 | Konum, EMS-98 hasar, kat, sistem, düzensizlik | Var (düzensizlik) | Yalnızca "toplulaştırılmış, makul talep üzerine" | [görüldü] | https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2022.840192/full |
| Van 2011 | – | 2011 | Açık bina bazlı set **bulunamadı** | – | – | – | – |

**Diğer 2023 kaynakları (kullanışsız veya kısıtlı):**
- DesignSafe PRJ-3824 (StEER PVRR, 29.03.2023). ASCE ve DesignSafe sayfaları bana 403 verdi, bina tablosu olup olmadığı **doğrulanamadı** [dolaylı]. https://www.designsafe-ci.org/data/browser/public/designsafe.storage.published/PRJ-3824/
- StEER Unified App'in Türkiye dağıtımında veri tamamlanma oranı %37,9 (Frontiers 2025, dolaylı). https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2025.1546616/full
- PRJ-4283 (Thornton Tomasetti): 9.000+ fotoğraf ve gözlem, tablo yok. DOI 10.17603/ds2-33fj-c878. Lisans belirtilmemiş [görüldü, DataCite]. https://api.datacite.org/dois/10.17603/ds2-33fj-c878
- PRJ-4237: yalnızca yer hareketi ölçüleri [dolaylı].
- Damcı vd. AYZI3L (CC BY-NC-SA 4.0): "yaklaşık koordinatlar", ama dosyalar yalnızca deprem bölgesi haritaları ve fotoğraf, tablo yok [görüldü]. https://doi.org/10.7910/DVN/AYZI3L
- Zenodo 18437501 (Liu 2026, CC BY 4.0): uydu/ayak izi/hasar proxy (ARIA, UN, Microsoft), mühendislik alanı yok [görüldü]. https://zenodo.org/records/18437501
- Kaggle "damaged buildings": yalnızca görüntü (2.735 JPG), lisans bilinmiyor [görüldü]. https://www.kaggle.com/datasets/turkertuncer/turkiye-earthquake-2023-damaged-buildings
- Yilmaz'ın aynı ekibinin 2026 hibrit yapı makalesi: 169 bina, "Bakanlık izniyle, makul talep üzerine" [görüldü]. https://link.springer.com/article/10.1007/s10518-026-02689-1

Yerel dosyalar (orkestratörün okuyabileceği; benim aracım xlsx ve taranmış PDF okuyamadı):
- `C:\Users\scryn\.claude\projects\C--Users-scryn-Documents-ScryneOS\467e577f-9066-48ca-bd5a-0080d184b259\tool-results\webfetch-1790755285662-9cbt5v.bin` (ACI133v3.xlsx, zip)
- `...\tool-results\webfetch-1790755099797-z4rf73.xlsx` (Atasever `rapor_final_v2.xlsx`)

## 2. Coşkun vd. 2019 tabloları (Springer, HTML tabloları, iki geçişle okundu)

Kaynak: https://link.springer.com/article/10.1007/s10518-019-00751-9 (tablo 1–4 alt sayfaları). Önemli: modelin bağımlı değişkeni **gözlenen hasar değil**, GABHR (2013) kapsamındaki ayrıntılı analizin sonucu. Göçme oranı >%50 ise "riskli". Formül: BRS = BS + Σ(PSᵢ × değişken değeri). BRS < 0 ise riskli. Bölge örneği makaleden: SC ceza puanı −6, SC4 için uygulanan −24.

**Tablo 1, değişken kodları:**
- N: 1–8.
- SZ: SDS>0,75g → 1; 0,75>SDS≥0,50 → 2; 0,50>SDS≥0,25 → 3; SDS<0,25 → 4.
- SC (Vs30): >700 → 1; 700–400 → 2; 400–200 → 3; <200 → 4.
- AG: tam sayı yaş.
- SS: BA çerçeve → 0; BA çerçeve+perde → 1. Perde tanımı: en/boy oranı >6 olan düşey eleman.
- NS: ayrık → 0; bitişik → 1. Bitişik sayılması için yanında dilatasyonsuz bina olması gerekir.
- SCol, VI, OH, PI, SoftS: yok → 0; var → 1. Tek kısa kolon yeter.
- SLoc (komşu döşeme kotu): aynı kot → 0; farklı → 1.
- Sslop: düz → 0; eğimli → 1.
- CD: 2007 sonrası → 1; 1997–2007 → 2; 1975–1997 → 3; 1975 öncesi → 4.

**Tablo 4, katsayı / SE / ceza puanı** (aynı satırlar iki kez sorgulandı, aynı değerler geldi):

| Değişken | Katsayı | SE | Ceza puanı |
|---|---|---|---|
| N | −0,274 | 0,100 | −27 |
| SZ | −0,297 | 0,061 | −30 |
| SC | −0,061 | 0,077 | −6 |
| AG | −0,018 | 0,107 | −2 |
| SS | −0,082 | 0,076 | −8 |
| NS | −0,146 | 0,084 | −15 |
| SCol | −0,159 | 0,058 | −16 |
| VI | −0,110 | 0,049 | −10 |
| OH | −0,092 | 0,038 | −10 |
| PI | −0,193 | 0,053 | −20 |
| SoftS | −0,220 | 0,042 | −20 |
| SLoc | −0,173 | 0,057 | −17 |
| Sslop | −0,145 | 0,051 | −15 |
| CD | −0,245 | 0,050 | −25 |
| Sabit (BS) | 0,55 | 0,116 | **+55** |

Tablo 3 (marjinal etkiler) da okundu: N 0,234; SZ 1–4 için 0,895/0,745/0,595/0,445; SC 1–4 için 0,657/0,632/0,607/0,582; AG 0,0166; SS 0/1 için 0,520/0,220; NS 0/1 için 0,202/0,411; SCol 0,892; VI 0,643; OH 0,524; PI 0,834; SoftS 0,426; SLoc 0,411; Sslop 0,645; CD 1–4 için 0,285/0,222/0,453/0,635.

Makale genelinde başarı: eğitimde ~%83, testte ~%81 doğru sınıflama [dolaylı].

## 3. RYTEİE 2019 ve TBDY (S2)

**(a) RYTEİE 2019 Ek-A.** Resmî Gazete 16.02.2019, sayı 30688 [görüldü]: https://www.resmigazete.gov.tr/eskiler/2019/02/20190216-1.htm. Ek PDF: https://www.resmigazete.gov.tr/eskiler/2019/02/20190216-1-1.pdf. İndirdim ama JBIG2 taranmış görüntü olduğu için metin çıkmadı. Yerel kopya: `...\tool-results\webfetch-1790754703479-wxtala.pdf`.
- ÇŞB kopyası: https://webdosya.csb.gov.tr/db/altyapi/icerikler/ek-2-ryteie-20190705155915.PDF. Bende "unable to verify the first certificate" hatası verdi, okunamadı.
- Ek-A başlığı (dolaylı, arama özeti): "Binaların Bölgesel Deprem Risk Dağılımını Belirlemek için Kullanılabilecek Basitleştirilmiş Yöntemler". Kapsam 1–8 kat, <25 m.
- Aynı kaynaktan "Tablo A.1 Taban ve Yapısal Sistem Puanı" adı geçiyor (dolaylı). Bu tablo, olumsuzluk puanları ve tehlike tablosu için sayısal değer **çıkaramadım**.
- Olası okunabilir kopya: Uludağ tezi https://acikerisim.uludag.edu.tr/server/api/core/bitstreams/25d2ea4d-3987-4a4c-bfc3-f73ce72757a9/content. Yerel kopya `...\tool-results\webfetch-1790754724639-25ka9n.pdf`. Aracım bir kez "Ek-A tabloları var" dedi, sayısal değer verdi sayılmaz. Güvenilmez, okunmadı say.
- Bakanlığın diğer PDF'leri: https://webdosya.csb.gov.tr/db/altyapi/icerikler/2-deprem-yer-hareket--20190424093841.pdf (deprem yer hareketi), https://webdosya.csb.gov.tr/db/altyapi/icerikler/1-genel-20211104105053.pdf (genel).
- OCR veya PDF görüntüleme gerekli.

**(b) TBDY-2018.** Resmî PDF: https://www.afad.gov.tr/kurumlar/afad.gov.tr/2309/files/TBDY_2018.pdf (7 MB, yerel: `...\tool-results\webfetch-1790754674588-5bxnw1.pdf`). Metin katmanı çıkmadı. Tablo değerleri Vikikaynak'tan okundu (https://tr.wikisource.org/wiki/T%C3%BCrkiye_Bina_Deprem_Y%C3%B6netmeli%C4%9Fi/Ek/B%C3%B6l%C3%BCm_2). Fs bir arama özetiyle de aynı çıktı. Ara değerlerde doğrusal enterpolasyon.

Tablo 2.1, Fs (SS: ≤0,25 / 0,50 / 0,75 / 1,00 / 1,25 / ≥1,50):
- ZA: 0,8 0,8 0,8 0,8 0,8 0,8
- ZB: 0,9 0,9 0,9 0,9 0,9 0,9
- ZC: 1,3 1,3 1,2 1,2 1,2 1,2
- ZD: 1,6 1,4 1,2 1,1 1,0 1,0
- ZE: 2,4 1,7 1,3 1,1 0,9 0,8
- ZF: sahaya özel analiz

Tablo 2.2, F1 (S1: ≤0,10 / 0,20 / 0,30 / 0,40 / 0,50 / ≥0,60):
- ZA: 0,8 0,8 0,8 0,8 0,8 0,8
- ZB: 0,8 0,8 0,8 0,8 0,8 0,8
- ZC: 1,5 1,5 1,5 1,5 1,5 1,4
- ZD: 2,4 2,2 2,0 1,9 1,8 1,7
- ZE: 4,2 3,3 2,8 2,4 2,2 2,0
- ZF: sahaya özel analiz

F1 için ZD ve ZE ayrı bir arama özetiyle de tutarlı. ZC son sütunun 1,4 olması yalnızca tek kaynakta.

## 4. Çelişkiler / belirsizlikler

- **Coşkun Tablo 4 iç tutarlılığı:** Katsayı×100 ile ceza puanı bazı satırlarda uyuşmuyor. SoftS −0,220 için −22 beklenirdi ama −20 basılı. OH −0,092 → −10, PI −0,193 → −20. Aracım aynı değerleri iki kez verdi. Makale PDF'inden teyit edilmeli.
- **SZ/SC kod yönü:** Tablo 1'de SZ=1 en yüksek tehlike, Tablo 4'te SZ katsayısı negatif. Kodun BRS'te nasıl kullanıldığı (ters çevirme var mı) makale metninden teyit gerekir. Bunu analiz etmedim.
- **RYTEİE Ek-A = Coşkun tablosu mu?** Doğrulanmadı. Sizin listenizdeki "görünen kalite" Coşkun'un 14 değişkeninde yok (Coşkun'da AG ve CD ayrı). Ek-A'nın gerçek tablosunu okumadan eşitlemeyin.
- **Atasever:** Dataverse toplama tarihini "9–16 Şubat 2025" yazıyor. Dosya zaman damgaları 20230210 ve makale 9–17 Şubat 2023 diyor, büyük olasılıkla Dataverse yazım hatası. Bina sayısı 1.308 (tam veri) ile 1.733 (toplam saha) arasında değişiyor.
- **Yilmaz portalı:** Portal olduğu makale özetinde var, URL'yi doğrulayamadım. `ataseverk.github.io/maras_eq_data` Atasever'in kendi haritası, Yilmaz'ın portalı değil.
- **Sucuoğlu–Yazgan/Özcebe:** Bina sayıları (454/477/~500) farklı çalışmalardan. Aynı veri tabanının sürümleri mi ayrı setler mi, doğrulanmadı.

## 5. Öneri (bulgudan ayrı)

1. **Öncelik: ACI-133 (Zenodo 13386343).** Kısa kolon, yumuşak kat, düzensizlik, kat, yaş, konum ve hasar sınıfı aynı satırda olduğu için RYTEİE'nin kusur parametrelerini ölçebilecek tek indirilebilir set. Ölçülemeyecek olanlar: nizam, zemin eğimi, görünen kalite (listede yok, doğrulanmadı). Önce xlsx sütunlarını açıp bakın. Örneklem hasar-yanlı olduğundan gerçek isabet oranı değil, sıralama gücü (AUC gibi) ölçülebilir.
2. **İkinci: Atasever (Harvard, 1.308 bina, ~739 BA).** BA alt kümesi koordinat, kat ve yapım döneminden N, CD ve tehlike parametrelerini verebilir. Kusurlar için fotoğraflardan elle etiketleme gerekir. `rapor_final_v2.xlsx` sütunlarını önce açın. CC BY-NC-ND kişisel, ticari olmayan kullanımda sorun değil.
3. **Yilmaz/MoEUCC (2,15 milyon):** Portalı bulunursa kat, yıl, sistem ve konumla N, CD ve SDS ölçülebilir. Kusur alanı yok, çerçeve/perde ayrımı belirsiz. Veri Bakanlık iznine bağlı görünüyor.
4. **Genel uyarı:** Coşkun modelinin hedefi ayrıntılı analiz sonucu. Hasar verisiyle geriye dönük test bu ölçütten farklı bir şeyi ölçer.

Sources:
- https://zenodo.org/records/13386343
- https://doi.org/10.7910/DVN/OQCPWF
- https://ataseverk.github.io/maras_eq_data/
- https://doi.org/10.1061/AOMJAH.AOENG-0041
- https://datacenterhub.org/deedsdv/publications/view/332
- https://link.springer.com/article/10.1007/s10518-019-00751-9
- https://tr.wikisource.org/wiki/T%C3%BCrkiye_Bina_Deprem_Y%C3%B6netmeli%C4%9Fi/Ek/B%C3%B6l%C3%BCm_2
- https://www.resmigazete.gov.tr/eskiler/2019/02/20190216-1.htm
- https://www.afad.gov.tr/kurumlar/afad.gov.tr/2309/files/TBDY_2018.pdf
- https://www.nature.com/articles/s41598-025-21320-y
- https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2022.840192/full
- https://doi.org/10.7910/DVN/AYZI3L
- https://zenodo.org/records/18437501
- https://api.datacite.org/dois/10.17603/ds2-33fj-c878
- https://link.springer.com/article/10.1007/s10518-026-02689-1
