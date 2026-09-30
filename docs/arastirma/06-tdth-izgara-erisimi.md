---
proje: YapiRisk
created: 2026-09-30
type: arastirma
---
# TDTH ızgara verisine yasal erişim

> Ham araştırma raporu (2026-09-30, web araştırması alt ajanı; arama kotası doldu, bazı kalemler açık). S1 sonucu (ESHM20 yetmiyor) üzerine açıldı. Kararlar: `docs/Proje-Fikri.md` K-5.

Bu turdaki araştırma bütçem bitti. Web arama kotası 200/200 doldu ve sonraki aramalar reddedildi. Aşağıda "bizzat görüldü" yalnızca WebFetch'in sayfa metnini bana döndürdüğü durumlarda geçiyor. Springer, ResearchGate, MDPI ve efehr.org açılmadı. PDF'lerin çoğu metne çevrilemedi.

## 1. Cevap

Bulduğum hiçbir yerde TDTH'nin nokta değerlerini veren açık bir API, indirilebilir grid ya da OpenQuake girdi dosyası yok. AFAD'ın sayfaları tek resmî erişim yolu olarak tdth.afad.gov.tr'yi (e-Devlet girişli) gösteriyor. TDTH kaynak modeli (Şeşetyan/Demircioğlu 2018) için açık NRML paketi bulamadım. GEM'in açık Türkiye modeli EMME14, TDTH'nin kendisi değil; aynı ekipten çıkmış ama ayrı bir model. GEM'in yeni EMME2 (v2026) modeli ise kısıtlı lisanslı.

Yasal olarak bulunan tek gerçekçi yol, AFAD'a kurumsal/resmî yazışmayla veri talep etmek. AFAD tarafında hazır bir veri talep formu ya da protokol sayfası bulamadım. Bu yolun sonucu doğrulanmadı.

## 2. Bulgular

### Kalem 1: TDTH modeli ve yayımlanmış grid

| Kaynak | Ne sunuyor | Erişim | Lisans | Doğrulama | URL |
|---|---|---|---|---|---|
| Akkar vd. 2018, BEE 16:3197 | Harita evrimi ve güncel ulusal PSHA özeti | Springer, giriş yönlendirmesi nedeniyle açılamadı | bilinmiyor | Yalnız arama özeti ve künye görüldü. Ek materyal/grid var mı, bakılamadı | https://link.springer.com/article/10.1007/s10518-018-0349-1 |
| Şeşetyan vd. (alan kaynak modeli) ve Demircioğlu vd. (fay/arka plan) | Kaynak model yöntemi | Springer/Akdeniz avesis | bilinmiyor | Dolaylı. Arama özeti OpenQuake kullanıldığını söylüyor, açık NRML/grid deposu bulunamadı | https://link.springer.com/article/10.1007/s10518-016-0005-6 |
| AFAD İngilizce duyuru | Harita 18.03.2018 RG 30364, yürürlük 01.01.2019. UDAP ile AFAD yaptı. "Hazard map is not a risk map" notu var | Yalnız duyuru metni | belirtilmemiş | Bizzat görüldü | https://en.afad.gov.tr/turkeys-new-earthquake-hazard-map-is-published |
| AA, 06.05.2025 (AFAD açıklaması) | 485 aktif fay segmenti, harita e-Devlet üzerinden erişilir, yerel zemin etkisi dahil değil | Yalnız haber | yok | Bizzat görüldü | https://www.aa.com.tr/tr/gundem/afaddan-turkiye-deprem-tehlike-haritasina-iliskin-bilgilendirme/3558806 |
| Zenodo, GEM Global Seismic Hazard Map v2023.1.0 | Küresel PGA-475y kaya rasterı, yaklaşık 6 km aralık. Türkiye dahil, GEM modeli (TDTH değil) | İndirilebilir zip | CC BY-NC-SA 4.0 | Bizzat görüldü | https://zenodo.org/records/8409647 |

Zenodo, figshare, PANGAEA ve UDIM/KOERI için hedefli bir sonuç bulamadım. Bu depolar doğrudan taranmadı, yani "yok" demiyorum, "bulunamadı" diyorum. AFAD'ın 2018 yayını "PGA renk haritası + interaktif uygulama" olarak duyurulmuş. Grid yayımlandığına dair işaret görmedim.

### Kalem 2: OpenQuake girdisi

| Kaynak | Ne sunuyor | Erişim | Lisans | Doğrulama | URL |
|---|---|---|---|---|---|
| GEM MIE ürün sayfası | v2016.1.0 (EMME14) açık. v2026.0.0 (EMME2, Danciu, Styron, Ceylan, Güryuva, Kale, Sandıkkaya vd.) yalnızca "her kullanım için ayrı düzenlenen kısıtlı lisansla" verilir. v2026 için License Request gerekli | v2016: cloud.openquake.org paylaşımı. v2026: talep | v2016 CC BY-SA 4.0. v2026 özel/kısıtlı | Bizzat görüldü (sayfa metni) | https://www.globalquakemodel.org/product/middle-east-hazard |
| GEM MIE katkıcılar sayfası | Model ETH ve Kandilli koordinasyonunda. ODTÜ, Sakarya dahil. Yayınlar BEE 16:3465, 3497, 3535 | Bilgi sayfası | Sayfa altbilgisinde CC BY-NC-SA 4.0 | Bizzat görüldü | https://hazard.openquake.org/gem/contributors.html |
| EFEHR (arama özeti) | EMME14 paketi: NRML kaynak modeli, GMPE mantık ağacı, site listesi, config | efehr.org (sertifika hatası, açılamadı) | CC BY-SA 3.0 (özet) | Dolaylı | http://hazard.efehr.org/en/Documentation/specific-hazard-models/middle-east/hazard-computation-input/ |
| GEM Türkiye ülke profili (TUR.pdf) | GEM haritası | PDF okunamadı | bilinmiyor | Doğrulanmadı | https://downloads.openquake.org/countryprofiles/TUR.pdf |

- **Yeniden üretim:** EMME14'ü OpenQuake ile çalıştırmak TDTH'yi yeniden üretmez. TDTH, AFAD'ın 2018 ulusal modelidir. Alan kaynak modelinin yazarları (Şeşetyan, Demircioğlu, Akkar, Erdik) EMME14 ekibiyle örtüşüyor. Ama EMME14 bölgesel bir modeldir ve girdileri farklıdır. Bu ayrımı arama özetlerinden çıkardım; iki modelin girdi dosyalarını karşılaştırmadım.
- **Sizin sonucunuz:** ESHM20'de gördüğünüz 0,72–1,25 sapmasının EMME14'te de benzer çıkması beklenir. Bunu test etmedim.
- **Denemiş olan var mı:** "TDTH'yi OpenQuake ile yeniden ürettik" diyen bir kaynak bulamadım.

### Kalem 3: AFAD veri talebi / açık veri

| Kaynak | Ne sunuyor | Erişim | Lisans | Doğrulama | URL |
|---|---|---|---|---|---|
| afad.gov.tr TDTH sayfası | Tek erişim: tdth.afad.gov.tr. İndirme, API ve tablo bağlantısı yok | Yalnız e-Devlet | belirtilmemiş | Bizzat görüldü | https://www.afad.gov.tr/turkiye-deprem-tehlike-haritasi |
| tdth.afad.gov.tr | userLogin'den giris.turkiye.gov.tr OAuth2'ye yönleniyor | e-Devlet | kullanım koşulu görülmedi | Bizzat görüldü (yönlendirme) | http://tdth.afad.gov.tr/TDTH |
| afad.gov.tr ana sayfa (gizlilik politikası) | "Bilgi Edinme" CIMER'e yönlendiriyor | CIMER | 4982 kapsamı | Bizzat görüldü | https://www.afad.gov.tr/ |
| AFAD TADAS | Deprem, analiz ve veri indirme platformu. Ivme kayıtları içindir, tehlike gridi değil | Kayıtlı kullanım | belirtilmemiş | Yalnız arama özeti | https://tadas.afad.gov.tr/ |
| TÜBİTAK-AFAD protokolü, AA | Paleosismoloji projesi (2 yıl, 14 üniversite, MTA). Haritayı güncelleyecek girdileri üretir | Haber | yok | Bizzat görüldü | https://www.aa.com.tr/tr/bilim-teknoloji/turkiye-deprem-tehlike-haritasini-guncelleyecek-projede-imzalar-atildi/3038046 |

- **Bulunamadı:** data.gov.tr/açık veri portalında TDTH, AFAD "veri talep formu" ve kurumlar arası protokol. Son aramalar bütçe yüzünden yapılamadı, bu üç madde açık kaldı.
- **TDTH güncellemesi:** TÜBİTAK projesi mevcut haritayı güncellemeyi amaçlıyor. AA haberinin tarihi çıktıda yoktu. Yeni bir harita çıkarsa değerler değişir, entegrasyonu buna göre sürümlemek gerekir.

### Kalem 4: İl/ilçe tablosu

| Kaynak | Ne sunuyor | Erişim | Lisans | Doğrulama | URL |
|---|---|---|---|---|---|
| TBDY-2018 metni (AFAD PDF) | Değerlerin TDTH'den alınacağı belirtiliyor. İl/ilçe tablosu bulunamadı | PDF okunamadı | resmî mevzuat | Doğrulanmadı (metin taranamadı; arama özeti "haritadan al" diyor) | https://www.afad.gov.tr/kurumlar/afad.gov.tr/2309/files/TBDY_2018.pdf |
| Çevre Şehircilik "Riskli Yapılar" esasları | Deprem yer hareketi eki | Sertifika hatası, açılamadı | mevzuat | Doğrulanmadı | https://webdosya.csb.gov.tr/db/altyapi/icerikler/2-deprem-yer-hareket--20190424093841.pdf |
| yapidan.com/deprem-haritasi | 81 il merkezi için "AFAD harita renk bantlarından türetilmiş temsili değerler". Nokta değeri değil, yaklaşık | Açık web | CC BY-SA 4.0 (site beyanı) | Bizzat görüldü, ama ikincil ve yaklaşık | https://yapidan.com/deprem-haritasi/ankara |

Arama sonucu da "tüm ilçe merkezlerini içeren tek bir belge görünmedi" diyordu. Resmî bir ilçe tablosu bulamadım.

### Kalem 5: Üçüncü taraf yazılımlar

| Kaynak | Ne sunuyor | Erişim | Lisans | Doğrulama | URL |
|---|---|---|---|---|---|
| ideCAD (ideYAPI) yardım ve forum | TBDY sihirbazında "çevrimiçi" ve "çevrimdışı" seçenek var. Çevrimdışı: değerleri ideCAD veritabanından/kendi algoritmasıyla hesaplar. Forum (Yasin Tezel, 17.03.2023): "AFAD ve ideYAPI farklı algoritmalar kullandığı için değerlerde ufak farklar olabilir". Çevrimiçi ile çevrimdışı arasındaki fark "çok az" | Yazılım lisansı | Yazılım lisansı, veri lisansı belirtilmemiş | Bizzat görüldü (forum ve yardım) | https://forums.idecad.com.tr/forum/threads/spektrum-tasarimi-%C4%B0le-%C4%B0lg%C4%B0l%C4%B0-b%C4%B0rka%C3%87-soru.14032/ |
| ideCAD yardım | Aynı ifade, farklı sayfada | | | Bizzat görüldü | https://help.idecad.com.tr/ideCAD/afad-haritasindan-alinan-zemin-bilgileri-ile-tbdy- |
| Probina, SAP2000, ETABS, Sta4CAD | AFAD sitesinden elle Ss/S1 girilerek kullanılıyor. Otomatik grid entegrasyonuna dair bir şey bulunamadı | | | Dolaylı (arama özeti) | yukarıdaki arama sonuçları |
| DASK interaktif harita | İl/ilçe/mahalle sorgusuyla risk grubu. Kaynak ve PGA sunumu belirtilmemiş | Web | belirtilmemiş | Bizzat görüldü (kaynak belirsiz) | https://dask.gov.tr/tr/interaktif-deprem-haritası |

**ideCAD çıkarımı (bulgu, kesin değil):** ideCAD'in "çevrimdışı" modu, bir yazılım firmasının TDTH'ye yakın ama AFAD'la birebir aynı olmayan değerleri kendi veritabanında tuttuğunu gösteriyor. Bu veritabanının nereden geldiğine (AFAD lisansı mı, kendi interpolasyonu mu) dair kaynak bulamadım. Forumdaki "farklı algoritma" ifadesi, kendi türetmesi olma ihtimalini artırıyor. "AFAD'dan lisanslı grid var" sonucu bu kanıttan çıkmıyor.

GitHub'da enlem/boylamdan TBDY Ss/S1 veren bir depo bulunamadı.

## 3. Çelişkiler / belirsizlikler

- **EMME14 lisansı:** EFEHR özeti CC BY-SA 3.0 diyor. GEM ürün sayfası v2016.1.0 için CC BY-SA 4.0 diyor. GEM katkıcılar sayfasının altbilgisinde CC BY-NC-SA 4.0 var. Ticari kullanım gündeme gelirse GEM'e doğrulatılmalı.
- **AFAD veri politikası:** bulunamadı, çelişki yok.
- **TDTH e-Devlet zorunluluğu:** haberler ve site yönlendirmesi tutarlı, 2019 ilk yayındaki durum doğrulanmadı.
- **Yapıdan tablosu:** kendi metnine göre renk bandından türetilmiş yaklaşık değer; TDTH nokta değeriyle karıştırılmamalı.

## 4. Öneri (bulgudan ayrı, yorumdur)

1. **En gerçekçi yasal yol:** AFAD Deprem ve Risk Azaltma Genel Müdürlüğü'ne kurumsal yazı veya CIMER bilgi edinme başvurusu. Talep edilecek: Manisa (veya TR geneli) için DD-1..DD-4 Ss/S1/PGA/PGV grid değerleri, kullanım amacı, atıf ve ticari olmayan/olan kullanım şartı. CIMER cevabında "veri paylaşılamaz" çıkma ihtimali yüksek, çünkü AFAD sitesinde açık veri yok. Süre: CIMER yasal cevabı 15 iş günü (4982; bu süreyi kaynakla doğrulamadım), gerçek veri teslimi belirsiz, AFAD ile protokol gerekebilir. Maliyet: başvuru ücretsiz, veri bedeli olup olmadığı bilinmiyor.
2. **Paralel yol, düşük maliyet:** EMME14'ü (açık) ve mümkünse EMME2 v2026'yı (lisans talebiyle) kullanmak, TDTH'yi vermez. Sadece "ön değerlendirme, ±%25 belirsizlik" olarak sunulabilir. Sizin ESHM20 sonucunuz (SS oranı 0,72–1,25, 3/10 noktada bölge değişimi) EMME14 için de benzer beklenir.
3. **Ürün tasarımı:** aracı kullanıcıya TDTH değerini kendi girdirmek (kullanıcı tdth.afad.gov.tr'den kendi Ss/S1'ini kopyalar) hukuken en temiz seçenek, ama e-Devlet oturumunu otomatikleştirmez. Bu, kapsam sınırınızla uyumlu.
4. Yeni bir TDTH sürümü bekleniyor olabilir (TÜBİTAK projesi); veri modelini sürümlemeye açık tutun.

Bu turda bakılamayan ve devam için önerilen noktalar: Akkar 2018 makalesinin "Electronic supplementary material" bölümü (Springer, kurumsal erişimle), EFEHR/EMME14 lisans dosyası, AFAD/ideCAD'e "çevrimdışı veritabanı hangi kaynaktan" sorusu.

Sources:
- https://www.afad.gov.tr/turkiye-deprem-tehlike-haritasi
- https://en.afad.gov.tr/turkeys-new-earthquake-hazard-map-is-published
- https://www.aa.com.tr/tr/gundem/afaddan-turkiye-deprem-tehlike-haritasina-iliskin-bilgilendirme/3558806
- https://www.aa.com.tr/tr/bilim-teknoloji/turkiye-deprem-tehlike-haritasini-guncelleyecek-projede-imzalar-atildi/3038046
- https://www.globalquakemodel.org/product/middle-east-hazard
- https://hazard.openquake.org/gem/contributors.html
- https://zenodo.org/records/8409647
- http://tdth.afad.gov.tr/TDTH
- https://www.afad.gov.tr/
- https://forums.idecad.com.tr/forum/threads/spektrum-tasarimi-%C4%B0le-%C4%B0lg%C4%B0l%C4%B0-b%C4%B0rka%C3%87-soru.14032/
- https://help.idecad.com.tr/ideCAD/afad-haritasindan-alinan-zemin-bilgileri-ile-tbdy-
- https://yapidan.com/deprem-haritasi/ankara
- https://dask.gov.tr/tr/interaktif-deprem-haritasi
