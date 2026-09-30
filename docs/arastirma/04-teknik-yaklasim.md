---
proje: YapiRisk
created: 2026-09-29
type: arastirma
---
# Teknik yaklaşım: görüntü/ML literatürü, sokak görüntüsü, harita stack, PDF, KVKK

> Ham araştırma raporu (2026-09-29, web araştırması alt ajanı). Bulgular "doğrulandı / dolaylı / doğrulanmadı" diye işaretli; öneri bölümleri yorumdur. Özet ve kararlar: `docs/Proje-Fikri.md`.

**Cevap:** V1 için kural tabanlı skor öneriyorum. Fotoğraf analizi V1'e ancak "kullanıcının onaylayacağı öneri" olarak girmeli, skoru kendi başına belirlememeli. Google Street View'ı otomatik analiz hattına koymayın: Static API'de önbellekleme yasak, türetilmiş analiz için de açık bir sözleşme riski var. Türkiye'de sokak görüntüsünden kat sayısı, yumuşak kat ve kısa kolon çıkarımı akademik olarak gösterilmiş durumda. Ancak kullanıcı fotoğrafında VLM doğruluğunu ölçen Türkiye'ye özel bir çalışma bulamadım. Elimdeki en yakın veri, Street View üzerinde genel VLM'ler için yaklaşık %70 ortalama doğruluk.

## Bulgular

### 1. Görüntüden bina özelliği çıkarımı

**Birincil kaynak (özet düzeyinde okundu):**
- Yavariabdi vd., *Structures* cilt 80, Ekim 2025. Ayrıntılar:
  - İki adımlı YOLOv5 hattı: yumuşak kat, kısa kolon ve standart kat pencereleri tespit ediliyor, ardından bina yüksekliği tahmin ediliyor.
  - Veri: Google Street View'dan 4500 cephe görüntüsü.
  - Doğruluk sayıları makale özetinde yok, tam metne erişemedim (ScienceDirect 403). Ayrıca Türkiye'de olduğu makale özetinde açıkça yazmıyor, yazarlar Türkiye kaynaklı.
  - https://www.sciencedirect.com/science/article/abs/pii/S2352012425017667
- Adjacent-NET (*Structures*, 2025): Street View Static API'den Türkiye'nin çeşitli bölgelerinden 6170 cephe görüntüsü toplanmış, on farklı CNN ile karşılaştırılmış.
  - Görev yumuşak kat değil, bitişik bina sınıflandırması (çarpışma riski).
  - Özeti yalnız arama sonucundan gördüm, sayfayı açamadım.
  - https://www.sciencedirect.com/science/article/abs/pii/S2352012425001468
- Wang vd., *Earthquake Engineering & Structural Dynamics* (2023): yumuşak kat için Mask R-CNN tabanlı örnek segmentasyonu, yarı otomatik etiketleme.
  - Doğruluk sayılarına ulaşamadım (Wiley ve umich PDF içeriği alınamadı). https://doi.org/10.1002/eqe.3805
- Yu vd., *Earthquake Engineering and Engineering Vibration* (2020): yumuşak kat sınıflandırması için CNN.
  - "En iyi model ResNet50, %85 üstü" ifadesi yalnız arama özetinde geçti. Hangi makaleye ait olduğu kesin değil, ikincil düzeyde tutun. https://link.springer.com/article/10.1007/s11803-020-0598-2
- Pan vd., WACV 2024: CLIP ve SAM ile sıfır-atış (zero-shot) bina niteliği çıkarımı, etiketsiz veriyle çalışıyor. https://arxiv.org/abs/2312.12479
- BRAILS (NHERI SimCenter): açık kaynak, kat sayısı, çatı şekli ve yükseklik modülleri var.
  - Depo "DEPRECATED" işaretli. Son sürüm v3.1.1 (Şubat 2024), halefi BRAILS++. https://github.com/NHERI-SimCenter/BRAILS
- Sel riski için Street View'dan bina niteliği tahmini: kat sayısı F1 %94,6, bina tipi F1 %83,1, temel tipi F1 %78,0 (ASCE, Louisiana).
  - Sonuçlar ABD konut stoğu için. Türkiye'ye taşınabilirliği doğrulanmadı, özet arama sonucundan alındı. https://ascelibrary.org/doi/10.1061/%28ASCE%29CP.1943-5487.0001025
- **VLM doğruluğu:** arXiv 2607.14756 (16 Temmuz 2026). Ayrıntılar:
  - GPT-4o, Claude 3.5 Sonnet ve Gemini 2.0 Flash ile Street View'dan yapı tipi, kullanım ve kat sayısı sınıflandırılmış.
  - Uzman etiketlere karşı ortalama doğruluk yaklaşık %70. En kararlı sonucu Chain-of-Thought istemi vermiş.
  - Nitelik bazında (kat sayısı ayrı) döküm ve şehir bilgisi özet sayfasında yok. PDF okunamadı.
  - https://arxiv.org/abs/2607.14756
- Kahramanmaraş sonrası hasar gözlemi (ikincil, arama özeti): Kahramanmaraş'ta incelenen 52 yapının 43'ünde (%82,7) yumuşak/zayıf kat düzensizliği var. Yaygın neden zemin kat ticari kullanım. Yumuşak kat taraması bu yüzden Türkiye için anlamlı. https://doi.org/10.3390/buildings16061140

**Boşluk (bulunamadı):**
- Kullanıcının kendi çektiği (kontrolsüz açı, mesafe, kapalı cephe) Türk apartman fotoğrafında VLM veya CNN güvenilirliğini ölçen çalışma yok.
- Bu tür fotoğraflarda güvenilirlik hakkında söyleyebileceğim tek şey mantıksal çıkarım: sokak görüntüsü çalışmalarının koşulları (bitişik nizam, ağaç ve araç örtmesi, geniş açı) kullanıcı fotoğrafında da geçerli.
- Taşıyıcı sistem (betonarme ve yığma ayrımı) fotoğraftan ancak kaba düzeyde ayırt edilebilir. Yaş ve donatı kalitesi hiç çıkarılamaz.

### 2. ML ile hasar tahmini ve veri setleri

**Birincil (özet düzeyinde okundu):**
- Gaziantep Nurdağı ve İslahiye, 7292 betonarme bina, resmî ÇŞİDB hasar etiketleri.
  - Girdiler: kat sayısı, yapım yılı, PGA, SDS, VS30 ve iki etkileşim terimi (kat×yıl, yıl×PGA).
  - Model: XGBoost, LightGBM ve CatBoost'un yumuşak oylaması.
  - Sonuç: recall %88,9, specificity %52,8, AUC 0,812. Eşik 0,40'a çekilmiş. SHAP ile en önemli özellik yıl×PGA.
  - Yani yaş, kat ve tehlike ile makul bir ayrım var, ama yanlış alarm oranı yüksek (specificity %52,8). Tek bir depreme ve tek bir bölgeye ait.
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC13358062/ (Nature Sci. Rep. sürümü s41598-026-52799-8, yayın tarihi doğrulanmadı)
- Zenodo "Building damage datasets for the 2023 Türkiye earthquake": CC-BY-4.0, 31 Ocak 2026. Bina ayak izleri (shapefile), beş kaynaktan hasar tahmini (ARIA, UNOSAT, Microsoft, manuel, çalışma yöntemi) ve DEM, fay, litoloji, PGV katmanları.
  - Kat ve yıl niteliği olduğu doğrulanmadı. Uydu türevi etiketler, saha etiketi değil. https://zenodo.org/records/18437501
- ÇŞİDB saha hasar tespiti: 2.153.835 bina denetlenmiş, yedi grup (yapı sistemi, hasar durumu, kullanım, yapım yılı, kat sayısı, taban alanı, konum). Veri "talep üzerine" ÇŞİDB'den, açık indirme yok. https://ascelibrary.org/doi/10.1061/AOMJAH.AOENG-0041
- Kaggle "Turkiye earthquake 2023 damaged buildings": 1237 hasarlı ve 1498 hasarsız bina görüntüsü, tablo verisi değil. Lisans doğrulanmadı. https://www.kaggle.com/datasets/turkertuncer/turkiye-earthquake-2023-damaged-buildings
- Richter's Predictor (DrivenData): Kathmandu Living Labs ve Nepal İstatistik Bürosu anketi.
  - Kullanım koşulu: veri yalnız yarışma amacıyla kullanılabilir, yeniden dağıtılamaz. Ticari ya da ürün kullanımı sınırlı olabilir, şartları okuyun. https://www.drivendata.org/competitions/57/nepal-earthquake/
  - Random Forest micro-F1 yaklaşık 0,715, lider skor 0,7558. Bu sayılar yalnız GitHub ve Medium gibi ikincil kaynaklarda.
- xBD: 850.736 bina, uydu görüntüsü. Lisans CC BY-NC-SA 4.0, ticari kullanım dışında. Sizin girdi tipinizle (tablo) ilgisi yok. https://arxiv.org/pdf/1911.09296

**Kural tabanlı mı ML mi:**
- ML'nin girdisi geçmiş depremin gözlenen hasarı. Sizin ürününüz ise bir deprem öncesi ön değerlendirme yapıyor, yani "risk" etiketi yok.
- Nepal veri seti 38 özellik içeriyor (ikincil kaynak). Kullanıcı yaş, kat, tehlike dışında bu niteliklerin çoğunu bilmez.
- Literatürde (ikincil) hızlı görsel tarama yöntemlerinin (RVS) düzensiz betonarme binalarda değişkenlik gösterdiği ve zayıf stoklarda açığı küçük gösterebildiği, ML'nin ise açıklanabilirlik ve genelleme sorunu taşıdığı belirtiliyor. Bu ikincil bir özet, tek bir birincil kaynak göstermedi.

### 3. Sokak görüntüsü kaynakları

**Google Street View Static API (birincil, Google, 24 Eylül 2026):**
- Önbellekleme kısıtı: "Content pre-fetching, indexing, storing, or caching is generally prohibited, except for place IDs and panorama IDs." Panorama ID'yi süresiz saklayabilirsiniz. https://developers.google.com/maps/documentation/streetview/policies
- Map Tiles API politikası (Street View Static API için değil, aynı ekosistemde): "non-visualization use cases such as image analysis, machine interpretation, object detection or identification, geodata extraction" yasak. "Street View imagery may not be used for print purposes." https://developers.google.com/maps/documentation/tile/policies
  - Yani PDF rapora Street View kadrajı koymak "print" yasağına takılabilir. Bunu Static API kapsamında doğrudan doğrulamadım.
- Genel Maps Platform Şartları'nda "No Scraping" (bölüm 3.2.3), ve "başkalarına ait içerikten türetme yasağı" örnekleri arasında "construct an index of tree locations within a city from Street View imagery" var. Bu ifadeyi arşivlenmiş 30 Ocak 2025 sürümüne ait arama özetinden ve Cesium'un yansıtmasından aldım. Güncel şartlar sayfası (WebFetch kesildi) ve Static API'ye özel şartlar sayfası ise doğrudan okunamadı. https://cloud.google.com/archive/maps-platform/terms-20250130 ve https://cesium.com/legal/terms-for-google/
- Sonuç: Street View için "ML analizi yasak" diye tek bir açık madde bulamadım. Ancak önbellekleme yasağı, türetme yasağı ve kaydedilmemesi kuralı pratikte bir eğitim veri seti kurmayı engelliyor. Tek binaya anlık analiz gri bölgede. Kesin cevap için Google ile yazışma ya da hukukçu gerekir.
- AEA'ya özel: 8 Temmuz 2025'ten itibaren Static API içeriği "With any Map" kullanılamıyor (haritanın yanında/yanında görsel ilişkili gösterim). Türkiye AEA dışı ama hangi şartların Türkiye'ye uygulandığı sayfada belirtilmemiş. https://developers.google.com/maps/comms/eea/street-view-static
- Fiyat (ikincil): 10.000 istek/ay ücretsiz, sonrası 1000 istek başına 7 USD. https://www.woosmap.com/blog/google-maps-api-pricing-breakdown

**Mapillary (birincil, Kullanım Şartları, 15 Şubat 2024):**
- Kullanıcı içeriği CC BY-SA. Görüntüleri yeniden tanımlama veya bulanıklığı kaldırma yasak (yüz ve plaka otomatik bulanıklaştırılıyor).
- Ticari kullanım açıkça "improvement, training, and development of ... algorithms, datasets" için izinli.
- API'yi kullanan uygulama Mapillary'yi "materially supplement" etmeli, yani görüntü sağlayıcıyı yeniden dağıtmamalı. https://www.mapillary.com/terms
- CC BY-SA: Mapillary görüntüsünü rapora koyarsanız atıf ve aynı lisansla paylaşım gerekir. Türetilmiş nitelik verisinin (kat sayısı vb.) SA kapsamına girip girmediği belirsiz, doğrulamadım.
- Türkiye kapsamı: sayısal veri bulunamadı. Yalnızca 2019 tarihli bir blogda İstanbul'da bir mapathon'da 500+ km ve 530.000+ görüntü yüklendiği yazıyor. Güncel yoğunluk için Mapillary API ile bir spike gerekir.

**Yandex (birincil, MapKit Şartları):**
- İstanbul ve Ankara panoramaları var. MapKit şartları panoramayı yalnız programda gösterme amacıyla verir, veriyi başka işlemeyi kısıtlar, ve panorama gösterimi 5 istek sayılır.
- Üçüncü tarafın panorama görüntüsünü analiz etmesine izin verildiğine dair bir şey yok. Türkiye verisi için ayrıca Rusya menşeli sağlayıcı riskinin KVKK yurt dışı aktarımı ile ilişkisi var. https://yandex.com/dev/tariffs/doc/en/mapkit/terms/index

### 4. Harita ve coğrafi stack

- Nominatim (birincil, OSMF): mutlak üst sınır 1 istek/sn, tanımlayıcı User-Agent veya Referer zorunlu, **otomatik tamamlama yasak**, sonuçlar önbelleğe alınmalı. https://operations.osmfoundation.org/policies/nominatim/
- Photon (Apache 2.0, komoot): otomatik tamamlamayı destekliyor. Genel API "extensive usage will be throttled", SLA yok. Sunucusunu kendiniz kurmak gerekebilir. https://github.com/komoot/photon
- OSM tile sunucusu: SLA yok, "production uygulamaları için önerilmez", toplu indirme yasak, atıf zorunlu. https://operations.osmfoundation.org/policies/tiles/
- OpenFreeMap: kayıt, API anahtarı, istek sınırı yok, ticari kullanım serbest. OpenFreeMap, OpenMapTiles ve OSM atfı zorunlu (OpenFreeMap atfı isteğe bağlı). Bağış ile finanse ediliyor, SLA yok. https://openfreemap.org/
- Protomaps/PMTiles: statik dosya, Cloudflare R2 gibi bir depodan MapLibre ile okunur, istek başına ücret yok (ikincil, yaklaşık aylık maliyet örnekleri). https://docs.protomaps.com/deploy/cloudflare
- Türkiye adres kalitesi: OSM'de kapı numarası kapsamı sınırlı, Nominatim adreslerin yaklaşık %70'ini doğru buluyor (ikincil, genel sayı, Türkiye'ye özel değil). Türkiye özelinde ölçüm bulamadım. https://www.geopostcodes.com/blog/nominatim-geocode/
- Bina ayak izi: Microsoft Türkiye için 20.867.942 ayak izi (ikincil özet). OSM'de `building:levels` doluluğu bulunamadı. https://data.nextgis.com/en/region/TR/msbld/
- **PostGIS gerekli mi:** Tehlike değeri nokta sorgusu. Veri önceden hesaplanmış bir grid ya da raster olarak varsa PostGIS gerekmez (statik dosya, SQLite veya bellek içi arama yeter). AFAD'ın TDTH uygulamasına e-Devlet girişi gerekiyor (arama sonucu, teknik API/grid belgesi bulunamadı). Bu erişim ve lisans sorusu sizin görev tanımınızda başka ajanda.

### 5. PDF üretimi (Türkçe karakter)

- WeasyPrint 70.0: Python ≥3.10 ve Pango ≥1.44 gerekir. Windows'ta MSYS2 ile Pango kurulumu gerekiyor. Yazı tipi olarak sistemdeki fontları ya da `@font-face` kullanır. Küçük çıktı (ikincil karşılaştırmada basit belge 8 KB'a karşı Playwright 16 KB). https://doc.courtbouillon.org/weasyprint/stable/first_steps.html ve https://pdf4.dev/blog/playwright-vs-weasyprint
- Playwright `page.pdf`: Chromium, tam CSS (Grid, Flexbox, `@font-face`), ama tarayıcı ikilisi ağır (ikincil kaynak).
- react-pdf: yalnız TTF ve WOFF, varsayılan Helvetica Türkçe karakter için yeterli değil, `Font.register` ile Türkçe destekli bir font (ör. Noto Sans) eklemek gerekiyor. Eksik glyph durumunda render hatası veriyor. https://react-pdf.org/fonts
- Üçünde de sorun font gömme meselesi, biri diğerinden Türkçe'de kesin üstün değil.

### 6. KVKK

- Adres ve fotoğraf kişisel veri sayılır. Yüzü belli fotoğraf kişisel veri, plaka araç sahibine bağlanabildiği için (Kurul kararları ve hukuk yazıları, ikincil) kişisel veri kabul ediliyor. Dolayısıyla yüz ve plaka tam maskeleme gerekçeli. https://avukatistan.com/plakasi-gorunur-arac-fotografi-paylasmak-guvenli-mi (ikincil) ve Kurul karar özetleri https://www.kvkk.gov.tr/Icerik/7143/2021-989
- Aydınlatma (m.10): veri sorumlusunun kimliği, işleme amacı, aktarım, toplama yöntemi ve hukuki sebep, m.11 hakları. https://www.kvkk.gov.tr/Icerik/5443/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESINDE-UYULACAK-USUL-VE-ESASLAR-HAKKINDA-TEBLIG
- VERBİS muafiyeti (birincil, KVKK duyuruları): yıllık çalışan sayısı <50 **ve** bilanço toplamı <100 milyon TL (Kurul kararı 2023/1154, 06.07.2023). Ana faaliyeti özel nitelikli veri işleme olanlar için <10 çalışan ve <10 milyon TL (2025/1572, 04.09.2025; açıklayıcı karar 2025/2393, 25.12.2025). Bilanço esasına göre defter tutmayanlarda yalnız çalışan sayısı ölçütü. https://www.kvkk.gov.tr/Icerik/8577/kisisel-verileri-koruma-kurulunun-04-09-2025-tarihli-ve-2025-1572-sayili-kararinin-uygulama-esaslarina-iliskin-kamuoyu-duyurusu
  - Muafiyet yalnız sicile kayıt yükümlülüğünü kaldırıyor. Aydınlatma, güvenlik ve başvuru cevaplama yükümlülükleri sürüyor (Mondaq özeti, ikincil).
- Yurt dışı aktarım (m.9, 1 Haziran 2024'te yürürlüğe girdi, geçiş süresi 1 Eylül 2024'e kadar): yeterlilik kararı, standart sözleşme (imzadan sonra 5 iş günü içinde bildirim, aksi halde idari para cezası) veya diğer güvenceler. https://www.kvkk.gov.tr/Icerik/7834/6698-Sayili-Kisisel-Verilerin-Korunmasi-Kanununda-Yapilan-Degisiklikler-Hakkinda-Kamuoyu-Duyurusu
  - Çıkarım (kaynak yok): fotoğrafı yurt dışı bir VLM API'sine (OpenAI, Google) gönderirseniz bu m.9 kapsamına girer, ayrıca aydınlatma ve hukuki sebep gerekir.
- Hukuki sebep olarak açık rıza mı, "meşru menfaat" mi kullanılacağı bu araştırmada değerlendirilmedi, hukukçuya danışın.

## Çelişkiler / belirsizlikler

- Yavariabdi vd. için 4500 görüntü, Adjacent-NET için 6170 görüntü. İkisi farklı çalışmalar, karıştırmayın.
- Google şartlarının Street View analizine izni: Map Tiles politikasında yasak açık, Static API için açık bir "ML yasağı" bulamadım, sözleşme metninin güncel tam halini okuyamadım.
- Yumuşak kat doğruluğu %85 (ResNet50) ikincil ve makale eşleşmesi belirsiz. Kat sayısı F1 %94,6 ABD verisinde. Türkiye için karşılaştırılabilir doğrulama sayısı yok.
- Sayfalara erişemediğim için (ScienceDirect ve Wiley 403, Springer ve Nature yönlendirme) birçok makalede doğruluk rakamlarını göremedim.

## Öneri (bulgulardan ayrı, benim yorumum)

**V1 kapsamı:**
- Kural tabanlı skor. Gerekçe: risk etiketi yok, yaş, kat ve tehlike dışı girdi yok, açıklanabilirlik (kural her satırda raporda görünür), ML'nin özel bir depreme bağımlılığı.
- Fotoğraf: V1'de isteğe bağlı, yalnız "öneri" olarak (kat sayısı, zemin katta cephe açıklığı), kullanıcı onaylamadan skora girmez. Yüz ve plaka bulanıklaştırmayı sunucuda yapın, fotoğrafı analizden sonra silin.
- Street View: kullanmayın. Mapillary'yi (CC BY-SA, ticari eğitim izni) ve kullanıcı fotoğrafını tercih edin.

**Önerilen stack:**
- MapLibre + OpenFreeMap (ya da Protomaps/R2), Photon (kendi sunucunuz, otomatik tamamlama için) ve Nominatim'i yalnız ters geocode ve önbellekli kullanım için.
- Tehlike için PostGIS yerine önceden hesaplanmış grid dosyası (veri erişimi çıkarsa).
- PDF: Playwright ya da WeasyPrint, gömülü Noto Sans ile. Windows geliştirmede WeasyPrint kurulumu MSYS2 gerektiriyor, Playwright daha kolay.
- KVKK: aydınlatma metni, m.9 için VLM sağlayıcısı sözleşmesi, VERBİS'ten muaf ama diğer yükümlülükler geçerli.

**Spike ile doğrulanması gereken en riskli 3 varsayım:**
1. **Kullanıcı fotoğrafında VLM güvenilirliği.** 100–200 gerçek Türk apartman fotoğrafına elle etiket koyun (kat sayısı, zemin kat açıklığı). Kat sayısı tam eşleşme ve ±1 oranını, yumuşak kat recall'unu ölçün. Eşik tutmazsa fotoğraf V1'den çıkar.
2. **Skorun ayırt ediciliği.** Kural tabanlı skoru (yaş, kat, PGA) Gaziantep/Kahramanmaraş verisine karşı geriye dönük deneyin (Zenodo CC-BY veri seti kat ve yıl içeriyor mu, kontrol edin, yoksa ÇŞİDB talebi). Gaziantep çalışmasındaki AUC 0,812 bir referans tabandır; kuralınız bunun çok altında kalırsa "risk puanı" iddiası savunulamaz.
3. **Türkiye adres ve bina seçimi.** 50 gerçek adreste Photon/Nominatim isabetini ve bina ayak izi (Microsoft/OSM) ile binayı doğru eşleştirme oranını ölçün. Kapı numarası düzeyi tutmuyorsa akış "haritada bina seç" üzerine kurulmalı. Bu spike, AFAD tehlike verisi erişimi başka ajanda olduğu için onunla birlikte planlanmalı.

Sources:
- https://developers.google.com/maps/documentation/streetview/policies
- https://developers.google.com/maps/documentation/tile/policies
- https://developers.google.com/maps/comms/eea/street-view-static
- https://cloud.google.com/archive/maps-platform/terms-20250130
- https://cesium.com/legal/terms-for-google/
- https://www.mapillary.com/terms
- https://yandex.com/dev/tariffs/doc/en/mapkit/terms/index
- https://operations.osmfoundation.org/policies/nominatim/
- https://operations.osmfoundation.org/policies/tiles/
- https://openfreemap.org/
- https://github.com/komoot/photon
- https://docs.protomaps.com/deploy/cloudflare
- https://doc.courtbouillon.org/weasyprint/stable/first_steps.html
- https://pdf4.dev/blog/playwright-vs-weasyprint
- https://react-pdf.org/fonts
- https://www.sciencedirect.com/science/article/abs/pii/S2352012425017667
- https://www.sciencedirect.com/science/article/abs/pii/S2352012425001468
- https://doi.org/10.1002/eqe.3805
- https://link.springer.com/article/10.1007/s11803-020-0598-2
- https://arxiv.org/abs/2312.12479
- https://github.com/NHERI-SimCenter/BRAILS
- https://ascelibrary.org/doi/10.1061/%28ASCE%29CP.1943-5487.0001025
- https://arxiv.org/abs/2607.14756
- https://doi.org/10.3390/buildings16061140
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13358062/
- https://zenodo.org/records/18437501
- https://ascelibrary.org/doi/10.1061/AOMJAH.AOENG-0041
- https://www.kaggle.com/datasets/turkertuncer/turkiye-earthquake-2023-damaged-buildings
- https://www.drivendata.org/competitions/57/nepal-earthquake/
- https://arxiv.org/pdf/1911.09296
- https://www.kvkk.gov.tr/Icerik/8577/kisisel-verileri-koruma-kurulunun-04-09-2025-tarihli-ve-2025-1572-sayili-kararinin-uygulama-esaslarina-iliskin-kamuoyu-duyurusu
- https://www.kvkk.gov.tr/Icerik/7646/Kamuoyu-Duyurusu-Veri-Sorumlulari-Siciline-Kayit-Yukumlulugune-Iliskin-Istisna-Kriterinde-Degisiklik-Yapilmasi-Hakkinda-
- https://www.kvkk.gov.tr/Icerik/7834/6698-Sayili-Kisisel-Verilerin-Korunmasi-Kanununda-Yapilan-Degisiklikler-Hakkinda-Kamuoyu-Duyurusu
- https://www.kvkk.gov.tr/Icerik/5443/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESINDE-UYULACAK-USUL-VE-ESASLAR-HAKKINDA-TEBLIG
- https://www.kvkk.gov.tr/Icerik/7143/2021-989
- https://avukatistan.com/plakasi-gorunur-arac-fotografi-paylasmak-guvenli-mi
- https://www.mondaq.com/turkey/data-protection/1736820/2026-verb%C4%B0s-kay%C4%B1t-%C4%B0stisnalar%C4%B1-100-milyon-tl-e%C5%9Fi%C4%9Fi-ve-g%C3%BCncel-kurallar
- https://www.woosmap.com/blog/google-maps-api-pricing-breakdown
- https://www.geopostcodes.com/blog/nominatim-geocode/
- https://data.nextgis.com/en/region/TR/msbld/
