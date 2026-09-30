---
proje: YapiRisk
created: 2026-09-29
type: arastirma
---
# Pazar, rakipler, hedef kitle, fiyatlar, Manisa bağlamı

> Ham araştırma raporu (2026-09-29, web araştırması alt ajanı). Bulgular "doğrulandı / dolaylı / doğrulanmadı" diye işaretli; öneri bölümleri yorumdur. Özet ve kararlar: `docs/Proje-Fikri.md`.

## 1. Cevap

Ücretsiz "tehlike + kaba bina skoru" katmanı Türkiye'de doygun. Bir yanda AFAD TDTH, İBB "Depreme Yenilme" ve Başarsoft DepremRiskim var. Öbür yanda BEUN, Bursa merkezli "yapay zeka" araçları ve belediye ücretsiz tarama programları var. Boşluk üç yerde görünüyor: (a) emlak değerleme, kentsel dönüşüm firması ve sigortacı için toplu ve API tabanlı ön eleme, (b) yerel veriyle (Manisa) birleştirilmiş çıktı, (c) iş akışına bağlanan çıktı. Lisanssız bir araç resmî "riskli yapı tespiti" üretemez ve bu belirsizliği taşıyan bir hizmet piyasada "sadece bilgilendirme" konumunda kalır. Bu üç boşluğun talebi, aşağıdaki bulgulara göre henüz kanıtlanmış değil.

Sorunuzda geçen "Evim Sağlam mı" (ÇŞB), "Binam Güvende mi" (İBB) ve "İBB Deprem Bilgi Sistemi" adlı ürünleri bulamadım. "Evim sağlam mı" bir haber başlığı kalıbı. İBB'nin gerçek ürünleri "Bina Tespiti" ve "Depreme Yenilme".

## 2. Bulgular

### Rakip tablosu

| Ad | Sahibi | Ne yapar | Ücret | Zayıf nokta | URL |
|---|---|---|---|---|---|
| TDTH (Deprem Tehlike Haritası) | AFAD | Koordinat/adres bazlı PGA (475 yıl), zemin sınıfı ve fay bilgisi. e-Devlet girişi ister | Ücretsiz | Bina bilgisi almaz. Risk skoru ve rapor yok. API/kullanım şartlarını bulamadım | https://tdth.afad.gov.tr |
| Bina Tespiti (hızlı tarama) | İBB | Saha ekibi bina başına A–E sınıfı ve deprem güvenlik oranı verir. 2000 öncesi binalar, 2020'den beri, 39 bin+ bina | Ücretsiz | Yalnız İstanbul. Şikâyetvar'da 5 ay ile 2 yıl arası yanıtsız başvurular var. Sonuç resmî işlemde geçmez | https://binatespiti.ibb.istanbul/projebilgisi/ |
| Depreme Yenilme | İBB Kentsel Dönüşüm | Konum, yıl, kat, tür ve düzensizlik girdisiyle FEMA-154 tipi skor | Ücretsiz (görünürde) | Rapor "resmî işlemlerde kullanılmaz". Kullanıcı sayısını bulamadım | https://kentseldonusum.ibb.istanbul/depreme-yenilme/ |
| DepremRiskim | Başarsoft | Haritada bina işaretleme, fotoğraf, FEMA-154 tabanlı skor ve rapor | Ücretsiz | iOS'ta 3,0/5 (63 puan), son sürüm 1.3.0 (1 Eyl 2023). Gizlilik şikâyeti var. Google Play "10K+" (21.449 indirme, ikincil kaynak) | https://apps.apple.com/tr/app/deprem-riskim/id1553023005 |
| Yapı Analiz | Zonguldak BEUN (Prof. Kutoğlu) | Fotoğraf ve konumdan yapay zekâ ile 10–15 dakikada rapor. Kısa kolon, yumuşak kat gibi zayıflıkları ve zemin sınıfını arar | Ücretsiz hesap (haber Haz 2026) | Akademik proje. Kullanıcı sayısı ve doğrulama verisi yok | https://yapianaliz.beun.edu.tr |
| Yapı Deprem Risk Analizi | İnovasyon Yazılım (Bursa/Nilüfer, 2024) | Anket, fotoğraf ve konum girdisi. "24 saatte rapor", "%91,4 doğruluk" iddiası. B2C | Sayfada yok | Doğruluk iddiası doğrulanmamış. Fiyat şeffaf değil | https://yapidepremriskanaliz.com |
| "Yapay Zeka Destekli Yapı Deprem Risk Analizi" | Yapı Denetim ve Deprem Müh. Derneği Bursa | Bina yaşı, kat, malzeme ve adresle 24 dakikada risk skoru. 81 ilde 1 Şub 2025'ten itibaren duyuruldu | Belirtilmemiş | Yukarıdaki siteyle aynı olduğunu doğrulayamadım (ikisi de Bursa) | https://www.gazeteduvar.com.tr/1-subatta-tum-turkiyede-basliyor-deprem-riski-yapay-zekayla-belirlenecek-haber-1753544 |
| Binamod | Binamod (Teknopark İstanbul, kurucu K. Atasever; Founder One yatırımı Mar 2024, tutar açıklanmadı) | Alıcı ve kiracıya bina performans bilgisi, güçlendirme senaryoları. Kurumsal tarafta saha veri toplama yönetimi | 50 TL/sorgu (Teknopark İstanbul haberi, doğrudan fetch edilemedi). Binamod sitesinde yalnız eğitim seti fiyatları var | Sitesi şu an eğitim seti ağırlıklı. Bireysel ödeme isteği kanıtı sınırlı | https://webrazzi.com/2024/03/19/binalarin-deprem-tehlikesini-belirleyen-binamod-founder-onedan-yatirim-aldi/ |
| Cadastrum (Chrome eklentisi) | Özel | Sahibinden/Hepsiemlak ilanı yanında TKGM, e-Plan ve AFAD deprem/taşkın skoru | Ücretsiz katman. Pro ₺499/ay (₺299 erken kuş), Pro+ ₺999/ay | Bina bazlı yapısal risk yok, yalnız konum | https://cadastrum.com.tr |
| Manisa ücretsiz depreme dayanıklılık testi | Manisa BB + yerel üniversite | 17 ilçede 600 bin bağımsız bölüm hedefi. Saha ekibi (40 kişi) ve akademik ekip (10 kişi), 30 milyon TL+ bütçe. Yunusemre ve Şehzadeler'de 103 bin bağımsız bölüm tamamlanmış (rakamın tarihi belirsiz) | Ücretsiz | Bunu aşağıdaki bölümde ele aldım. Sonuçların bireysel erişimini doğrulayamadım | https://www.manisa.bel.tr/Projeler/d4415_ucretsiz-depreme-dayaniklilik-testi.aspx |
| e-Devlet "Riskli Yapı Tespiti" | ÇŞB | Resmî 6306 sürecinin kaydı. Lisanslı kuruluşlar tespiti yapar, kat malikleri öder | Devletin kendisi ücret almıyor. Tespit ücreti aşağıda | Kullanıcıya self-servis skor vermez | https://www.turkiye.gov.tr/csb-riskli-yapi-tespiti-4609 |
| Evveko (kentsel dönüşüm proptech) | 2025'te kurulan girişim | Malike ücretsiz imar analizi, fizibilite ve müteahhit denetimi. Gelir: müteahhit aboneliği ve %3–5 komisyon. İstanbul'da 7 ilçe, Oca–Nis 2026'da 22 bin aktif kullanıcı. Yol haritasında "AI lead qualification" var | Malike ücretsiz | Yalnız İstanbul. Yapısal risk değerlendirmesi ürünü değil | https://webrazzi.com/2026/05/07/bina-sahipleri-ile-denetimden-gecmis-muteahhitleri-bulusturan-kentsel-donusum-platformu-evveko/ |

Ek not (ikincil kaynak): Kentsel Dönüşün ve Müteahhitini Bul gibi eşleştirme platformları da var.

### Uluslararası benzerler

- **ABD, FEMA P-154 RVS ve ROVER (birincil):** ROVER, FEMA'nın ücretsiz mobil yazılımı. Kâğıt tabanlı P-154 ve ATC-20 tarama işini otomatikleştirir. Fotoğraf, konum ve USGS tehlike verisini toplar. v2.0.1 sonrası beta ve kullanıcı grubu ROVER Ready Alliance üzerinden sürüyor. Kaynak: https://www.fema.gov/rapid-observation-vulnerability-and-estimation-risk, https://roverready.atcouncil.org/about
- **Yeni Zelanda (birincil):** IEP yöntemi bina için %NBS ve not verir. Ulusal EPB kaydı var. Bina %34 NBS altındaysa yasal olarak "deprem-riskli" sayılır. Kaynak: https://www.building.govt.nz/managing-buildings/managing-earthquake-prone-buildings/epb-register
- **İtalya (ikincil):** Sismabonus ile 8 sınıflı (A+…G) sismik sınıflandırma ve vergi teşviki. Ücretli yazılımlar var (ACCA EdiLus-CRS, Travilog). Blumatica SismicApp'in basit yöntem modülü ücretsiz. Sınıflandırma, teşvik başvurusuna bağlı olduğu için pazar var. Kaynak: https://www.acca.it/classificazione-sismica-edifici
- **Japonya (birincil, MLIT gözetimli):** "誰でもできるわが家の耐震診断" 10 soruluk ücretsiz öz değerlendirme. Belediyeler ayrıca ücretsiz basit tanı yapıyor. Kaynak: https://www.kenchiku-bosai.or.jp/taishin_portal/daredemo_sp/
- **Sigorta/gayrimenkul risk skoru API'leri (üretici sayfaları, fiyat yok):** Cotality Earthquake Risk Score (1–100, REST API) https://www.cotality.com/solutions/earthquake-risk-solutions; Moody's RMS Location Intelligence (1–10) https://www.moodys.com/web/en/us/who-we-serve/insurance/intelligent-risk-platform/location-intelligence.html; Verisk address-level data. Fiyatlar kamuya açık değil.
- **ABD tüketici tarafı:** EarthquakeScore.ai adres bazlı 0–10 skoru ücretsiz veriyor (USGS verisi). Zillow, Kasım 2025'te ilanlardan iklim risk skorlarını kaldırdı. CRMLS ve acentelerin satış kaybı şikâyeti üzerine oldu. Realtor.com, Redfin ve Homes.com'da skorlar duruyor. Kaynak: https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales

### Hedef kitle gerçekliği

- **Değerleme (SPK lisanslı):** KAP'ta yayımlanmış raporlarda (ikincil özet) deprem bölgesi derecesi, hasar durumu ve varsa riskli yapı/yıkım kararı beyanı yer alıyor. Bina bazlı sayısal deprem skoru veya iskonto metodolojisi bulamadım. Dengedeğerleme sayfası da iskonto formülü vermiyor. Riskli yapı kentsel dönüşümünde SPK lisanslı değerleme raporu şart (ikincil kaynak). SPK "asgari hususlar" PDF'ini okuyamadım, yani "deprem alanı zorunlu mu" sorusu doğrulanmadı. Kaynak: https://www.dengedegerleme.com/deprem-yonetmeligi-ve-yerinde-degerleme/
- **Banka ekspertizi (ikincil):** Bina yaşı, deprem kuşağı ve yapı tipi inceleniyor. 2000 öncesi binalarda kredili satışlar zorlaşıyor. Bu, bina yaşı ve deprem kuşağı kadar kaba bir bilgiye ihtiyacı işaret ediyor ama bir "skor talebi" değil.
- **Kentsel dönüşüm:** Malik başvurusuyla lisanslı kuruluş riskli yapı tespiti yapar ve malikler öder (ikincil hukuk siteleri). Müşteri bulma platformlara kayıyor: Evveko, Kentsel Dönüşün, Müteahhitini Bul. Ulusal veri: 2025'te 30.007 yapı için tespit yapıldı ve 11.940 riskli yapı yıkıldı. 2012–2025 arasında 319.551 tespit ve 291.144 yıkım var (ÇŞB Kentsel Dönüşüm Başkanlığı sayfası erişilemedi, ikincil kaynaktan). TMMOB İMO Manisa Şubesi (Ağu 2026): tüm yapı stokunun risk durumunu gösteren şeffaf, güncel bir envanter yok. Kaynak: https://www.manisamansetgazetesi.com/manisa-haberleri/deprem-riski-biliniyor-ancak-yapi-stoku-hala-belirsiz/619966
- **Emlak ilan siteleri:** Sahibinden, Hepsiemlak ve Emlakjet'te deprem filtresi veya risk rozeti bulamadım. Hepsiemlak'ın bina yaşı filtresi var (ikincil), kendi sayfalarında editoryal deprem rehberleri yayımlıyor. Doğrudan ilan detay ekranını görmedim, bu yüzden "yok" demiyorum, "bulamadım" diyorum. Boşluğu Cadastrum gibi üçüncü taraf eklentiler dolduruyor.
- **DASK/sigorta:** DASK primi yapı tarzı, m² ve 7 risk grubuna göre belirleniyor, bina bazlı yapısal risk kullanmıyor (dask.gov.tr, 2026). Örnek: 100 m² betonarme konut, I. grup 3.310 TL, VII. grup 857 TL/yıl (1 Eyl 2026 tarifesi). TSB'ye göre Haziran 2026'da DASK oranı ~%58, ihtiyari deprem teminatlı poliçe ~%18 (Sigorta Dünyası, 16 Ağu 2026). Poliçe sayısı 11,7 milyon. Tarihi çelişkili (aşağıda). Sigortacıların bina risk verisi kullandığına dair kaynak bulamadım. Kaynak: https://dask.gov.tr/tr/tarife-ve-primler, https://www.sigortadunyasi.com.tr/2026/08/16/deprem-riskine-karsi-sigorta-korumasinda-ihtiyari-police-acigi/

### Fiyat verileri

Tümü ikincil ve ticari kaynaklardan. Resmî tarife bulamadım, fiyatlar serbest pazarlık.

- **Riskli yapı tespiti (Armut, 2026):** 23.000–100.000 TL. Bu sayfaya göre 479 lisanslı firma var. Bir teklifte 3 yapı için 67.500 TL. İstanbul ortalaması 25.000–45.000 TL. Kaynak: https://armut.com/fiyatlari/riskli-yapi-tespiti_45234
- **Bina performans analizi:** 6.000–120.000 TL ortalama (Armut). Üniversite onaylı süreçte 75.000–400.000 TL (bir mühendislik firması sayfası). "Deprem testi" 30.000–250.000 TL. M² başına 40–90 TL bandı. Bunlar bir firma sitesinden.
- **Lisans belgesi bedeli (yanlış okunmasın):** ÇŞB Kentsel Dönüşüm Başkanlığı 2026 birim fiyat listesinde "Riskli Yapı Tespiti Lisans Belgesi" 125.000 TL + KDV (150.000 TL KDV dahil), tüzel kişilere. Bu tespit ücreti değil, firmanın lisans harcı. Resmî tespit yapmak isteyen için giriş bariyeri. Kaynak: https://kdb.gov.tr/files/dosyalar/20263131432237404.pdf (PDF metni doğrudan okunamadı, özet aranan sonuçtan)
- **Ücretsiz ön değerlendirme:** İBB Bina Tespiti (ücretsiz, 2000 öncesi binalar). Tekirdağ BB ücretsiz deprem performans çalışması. Manisa BB ve yerel üniversite ücretsiz test programı. İzmir BB'nin ücretsiz deprem testi haberi de çıktı (doğrulanmadı). Kaynak: https://www.tekirdag.bel.tr/arsiv/39127
- **Finansman:** İklim ve Afetlere Dayanıklı Şehirler Projesi (ÇŞB + Dünya Bankası) riskli yapı dönüşümü için 3 milyon TL'ye kadar kredi veriyor. 12 ay ödemesiz, 180 ay vade, aylık %0,69 faiz. İstanbul, İzmir, Kocaeli, Sakarya, Manisa, Tekirdağ'da uygulanıyor. Kaynak: https://www.manisakulishaber.com/kentsel-donusume-finansal-destek-manisa-listede-basvurular-artti

### Manisa bağlamı

- **Akhisar–Kırkağaç (22 ve 28 Oca 2020, M5,4 ve M4,8):** Manisa Valiliği bilgi notu ve haber: 4 ilçede 305 ağır ve 802 hafif hasarlı yapı. Aynı kaynaklardan başka bir kırılım 275 ağır ve 596 hafif hasarlı konut veriyor. Kaynak: https://www.gunebakis.com.tr/amp/manisadaki-depremde-305-agir-hasarli-yapi-konut-tespit-edildi/12852469
- **Sındırgı (Balıkesir):** M6,1, 10 Ağu 2025. ÇŞB (Kurum, 16 Ağu 2025): Manisa'da 105 bina ve 135 bağımsız bölüm ağır hasarlı veya yıkık (Balıkesir 624 bina, toplam 729 bina, 1.036 bağımsız bölüm). 27 Eki 2025'te ikinci M6,1 daha oldu, Manisa'da hasar sınırlı (4 bina yıkıldı, ikincil kaynak). Kaynak (birincil): https://www.csb.gov.tr/sindirgi-depreminin-ardindan-hasar-tespit-calismalari-tamamlandi-bakanlik-faaliyetleri-42783
- **Manisa İRAP çalıştayı (15 Eyl 2026, Valilik/AFAD):** ~15 bin yapı incelendi. %38 yüksek risk, %34 düşük, %22,93 orta, %3,70 risksiz. Şehzadeler'de ~%60 yüksek risk, Yunusemre'de %24. Yöntem: proje, donatı, mevcut hasar ve fotoğraf. Kaynak: https://www.manisadansondakika.com.tr/manisada-deprem-alarmi-sehzadelerde-binalarin-yuzde-60i-yuksek-riskli
- **Manisa'ya özgü kentsel dönüşüm hacmi:** bulamadım. Bulduğum "14.032 görüşme / 196.324 ön başvuru" rakamları, ilgili haberde İstanbul için referans olarak geçiyor, Manisa'ya ait değil.

### Öğrenci/hobi projeleri doygunluğu

- GitHub'da örnekler var ama düşük etkileşimli: balikesir-deprem-analiz-uygulamasi (0 yıldız, 3 commit; fay mesafesi ve nüfus), DEPREM.DB (zemin sınıfı/Vs30/PGA ile risk skoru), QuakeMind, deprem.tech. Akademik veri seti: RCBuilding (372 bina, derin öğrenme %94,66). Kaynak: https://github.com/GaffariCelik/RCBuilding
- Kurumsal düzeyde yapay zekâ iddiaları: BEUN, Bursa sistemi, Yapı Deprem Risk Analizi, Malatya Turgut Özal Üniv. StructurAI+. Yani "yapay zekâ ile bina riski" iddiası tekelde değil, dolu.
- Basit skor + harita + rapor üretmek teknik olarak kolay ve ücretsiz rakipleri var. "Skor" tek başına fark yaratmıyor.

## 3. Çelişkiler / belirsizlikler

- DASK poliçe sayısı: arama özeti "Eylül 2026, 11,7 milyon" diyor, aynı sayfa (habergo) fetch'te "Eylül 2024" yazıyor. Tarih doğrulanamadı. Yüzde 58 oranı TSB kaynaklı ve tarihi net.
- Akhisar 2020 hasar: 305/802 yapı ile 275/596 konut. Kaynaklar farklı kırılım kullanıyor.
- Binamod fiyatı 50 TL: yalnız Teknopark İstanbul haberinden (403 aldım) ve bir arama özetinden. Binamod'un kendi sitesi başka bir ürünü (eğitim seti) gösteriyor.
- Bursa "yapay zekâ" sistemi ile yapidepremriskanaliz.com aynı mı, doğrulanmadı.
- ÇŞB "Hızlı Deprem Güvenliği Değerlendirme Yöntemleri" belgesi (Mayıs 2026) sertifika hatasıyla açılmadı. İçeriği okunamadı. Resmî bir hızlı yöntem seti yayımladığını gösteriyor olabilir, metodoloji ajanınıza yönlendirin.
- Bakılıp bulunamayanlar: ÇŞB "Evim Sağlam mı", İBB "Binam Güvende mi", "Deprem Bilgi Sistemi" adlı ürün; Sahibinden/Emlakjet birincil sayfaları; TDTH API/kullanım şartları; Manisa'ya özgü dönüşüm hacmi; Manisa BB testinin sonuçlarının bireysel erişimi; İBB, Depreme Yenilme ve BEUN kullanıcı sayıları.

## 4. Boşluk analizi

- **Dolu:** tehlike sorgusu (AFAD), bireysel ücretsiz skor (Depreme Yenilme, DepremRiskim, BEUN), ücretsiz saha taraması (İBB, Manisa BB), saha lisanslı tespit (479 firma bir platformda).
- **Boş görünen (kanıt zayıf, talep test edilmeli):**
  1. Toplu ön eleme. Değerleme firması veya dönüşüm firması yüzlerce adres için tek tek e-Devlet sorgusu yapmak zorunda. TDTH'de API bulamadım.
  2. Yerel veri katmanı. Manisa İRAP ve üniversite verisiyle mahalle/ilçe önceliklendirmesi. Bu verinin kamuya açıklığı belirsiz.
  3. Bina-bazlı veri ile hazırlanmış, iş akışına takılan çıktı (yatırımcı/emlak analizi, dönüşüm lead'i). Cadastrum ve Evveko yakın alanlarda, ama ikisi de yapısal risk skoru üretmiyor.
- **Boş olmayan:** "Kullanıcı bilgi girsin, FEMA-154 tipi skor çıksın" ürünü. İBB ve Başarsoft bunu ücretsiz yapıyor.

## 5. Öneri (bulgulardan ayrı, benim değerlendirmem)

**Gerçekçi konumlanma:** Bireylere doğrudan skor satmak zayıf. Rakipler ücretsiz ve devlet destekli, ilan siteleri ve platformlar da skoru göstermeye isteksiz (Zillow örneği). Daha savunulabilir yol: B2B "ön eleme aracı". Kimin için: küçük değerleme firmaları, yerel emlak ve kentsel dönüşüm ofisleri, bir müteahhit adayı. Hangi problem: onlarca adresi hızlıca "öncelikli/az öncelikli" diye sıralayıp lisanslı tespite yönlendirmek. Neden farklı: toplu adres girişi, açıklanmış metodoloji, "resmî tespit değildir" çerçevesi ve lisanslı firmaya lead devri. İlk adım olarak Manisa ve Ege'de 3–5 değerleme/dönüşüm ofisiyle görüşüp gerçek talebi ölçmek, kod yazmaktan önce gelmeli. Bir alternatif de Evveko gibi bir platforma veri katmanı olarak ortak olmak.

**En büyük 3 pazar riski:**
1. **Ücretsiz kamu rakipleri ve yerel kanibalizasyon.** Manisa BB'nin 600 bin bağımsız bölümü ücretsiz taraması ve İBB'nin bedava ürünleri, bireysel talebi eritiyor. Kurumlar B2B'ye de aynı araçları sunabilir.
2. **Güven ve yasal çerçeve.** Lisanssız araç resmî tespit veremez. Hızlı yöntemlerin doğruluğu akademik olarak tartışmalı. Yanlış "düşük risk" çıktısı itibar ve sorumluluk riski taşır. Rakipler bunu "farkındalık aracı" ibaresiyle aşıyor, ama bu aracı ücretli B2B için yetersiz kılıyor.
3. **Ödeme isteği kanıtsız.** Değerleme raporları deprem için kaba beyan içeriyor, DASK primi bina riskine bağlı değil, ilan siteleri risk göstermek istemiyor. Kentsel dönüşüm firmalarının müşteri bulma sorununu platformlar (Evveko vb.) çözmeye başlamış. Hedef kitlenin ön elemeyi para verip alacağını gösteren bir bulgum yok.

Kullanılan kaynakların tam URL'leri yukarıda satır içinde.

Sources:
- https://tdth.afad.gov.tr
- https://binatespiti.ibb.istanbul/projebilgisi/
- https://kentseldonusum.ibb.istanbul/depreme-yenilme/
- https://apps.apple.com/tr/app/deprem-riskim/id1553023005
- https://www.gazeteduvar.com.tr/1-subatta-tum-turkiyede-basliyor-deprem-riski-yapay-zekayla-belirlenecek-haber-1753544
- https://yapidepremriskanaliz.com
- https://webrazzi.com/2024/03/19/binalarin-deprem-tehlikesini-belirleyen-binamod-founder-onedan-yatirim-aldi/
- https://cadastrum.com.tr
- https://www.manisa.bel.tr/Projeler/d4415_ucretsiz-depreme-dayaniklilik-testi.aspx
- https://www.turkiye.gov.tr/csb-riskli-yapi-tespiti-4609
- https://webrazzi.com/2026/05/07/bina-sahipleri-ile-denetimden-gecmis-muteahhitleri-bulusturan-kentsel-donusum-platformu-evveko/
- https://www.fema.gov/rapid-observation-vulnerability-and-estimation-risk
- https://roverready.atcouncil.org/about
- https://www.building.govt.nz/managing-buildings/managing-earthquake-prone-buildings/epb-register
- https://www.acca.it/classificazione-sismica-edifici
- https://www.kenchiku-bosai.or.jp/taishin_portal/daredemo_sp/
- https://www.cotality.com/solutions/earthquake-risk-solutions
- https://www.moodys.com/web/en/us/who-we-serve/insurance/intelligent-risk-platform/location-intelligence.html
- https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales
- https://www.dengedegerleme.com/deprem-yonetmeligi-ve-yerinde-degerleme/
- https://www.manisamansetgazetesi.com/manisa-haberleri/deprem-riski-biliniyor-ancak-yapi-stoku-hala-belirsiz/619966
- https://dask.gov.tr/tr/tarife-ve-primler
- https://www.sigortadunyasi.com.tr/2026/08/16/deprem-riskine-karsi-sigorta-korumasinda-ihtiyari-police-acigi/
- https://armut.com/fiyatlari/riskli-yapi-tespiti_45234
- https://kdb.gov.tr/files/dosyalar/20263131432237404.pdf
- https://www.tekirdag.bel.tr/arsiv/39127
- https://www.manisakulishaber.com/kentsel-donusume-finansal-destek-manisa-listede-basvurular-artti
- https://www.gunebakis.com.tr/amp/manisadaki-depremde-305-agir-hasarli-yapi-konut-tespit-edildi/12852469
- https://www.csb.gov.tr/sindirgi-depreminin-ardindan-hasar-tespit-calismalari-tamamlandi-bakanlik-faaliyetleri-42783
- https://www.manisadansondakika.com.tr/manisada-deprem-alarmi-sehzadelerde-binalarin-yuzde-60i-yuksek-riskli
- https://github.com/GaffariCelik/RCBuilding
