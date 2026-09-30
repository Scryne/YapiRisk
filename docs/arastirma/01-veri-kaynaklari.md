---
proje: YapiRisk
created: 2026-09-29
type: arastirma
---
# Veri kaynakları: tehlike, zemin, fay, bina verisi, DASK

> Ham araştırma raporu (2026-09-29, web araştırması alt ajanı). Bulgular "doğrulandı / dolaylı / doğrulanmadı" diye işaretli; öneri bölümleri yorumdur. Özet ve kararlar: `docs/Proje-Fikri.md`.

# Bina Deprem Riski projesi: veri kaynakları raporu (erişim tarihi: 2026-09-29)

## 1. Cevap
AFAD TDTH'den koordinatla Ss/S1/PGA/PGV almak için resmî API yok. Uygulama e-Devlet girişi istiyor ve ham grid indirilemiyor. GitHub'da bunu yapan araç da bulamadım. Programatik erişebildiğim tek tehlike kaynağı ESHM20 (EFEHR'nin yeni REST API'si). Bu, TBDY-2018 değil, Avrupa modeli. Bina yaşı ve kat sayısını hukuka uygun ve otomatik almanın yolu yok. Bu iki alan kullanıcıdan girdi olarak alınmalı. OSM kapsamı çok düşük, TKGM ise otomatik sorguyu yasaklıyor.

## 2. Tablo

| Kaynak | Ne verir | Erişim yolu | Lisans / koşul | Doğrulama | URL |
|---|---|---|---|---|---|
| AFAD TDTH (TBDY-2018 haritası) | Koordinat bazlı PGA, PGV, Ss, S1 (DD-1..DD-4) | Yalnız web arayüzü. `tdth.afad.gov.tr` isteği e-Devlet OAuth girişine yönlendiriyor. Resmî API, indirme, WMS/WFS bulamadım. | Sitede TDTH'ye özel kullanım koşulu bulamadım. e-Devlet sayfası genel "Gizlilik, Kullanım ve Telif" metnine atıf yapıyor. | Giriş yönlendirmesi ve e-Devlet sayfasındaki giriş şartı bizzat görüldü. XHR/JSON endpoint'i ve arayüz çıktı alanları doğrulanmadı. | https://tdth.afad.gov.tr/ , https://www.turkiye.gov.tr/afad-turkiye-deprem-tehlike-haritalari , https://www.afad.gov.tr/turkiye-deprem-tehlike-haritasi |
| GitHub'da TDTH aracı | TDTH çeken açık kaynak araç | Bulunamadı | - | GitHub repo arama API'siyle "tdth", "afad deprem tehlike", "tbdy afad" tarandı, TDTH çeken araç çıkmadı. Kod araması yapılamadı. | https://api.github.com/search/repositories?q=tbdy+spectrum |
| ESHM20, EFEHR yeni REST API | Nokta bazlı hazard curve, harita değeri, UHS, EC8 tasarım spektrumu; PGA/SA | REST/JSON. Ankara ve Karadeniz-Türkiye koordinatlarıyla `/v1/models` çağrısı ESHM20 (id 81) döndürdü. `/v1/maps` çağrım denemem 422 verdi, parametre adları doğrulanmadı. | CC BY 4.0. Model referansı kaya, TBDY zemin düzeltmesi içermez. | OpenAPI şeması ve modeller çağrısı bizzat görüldü. Türkiye için curve/map değerleri çekilemedi. | https://efehr-services.ethz.ch/api/openapi.json |
| ESHM20 girdi verisi | Model girdi setleri | GitLab indirme | CC BY 4.0 | Bizzat görüldü | https://gitlab.seismo.ethz.ch/efehr/eshm20 |
| GEM Global Seismic Hazard Map v2026.1 | Global PGA (475 yıl, kaya) | Vektör/raster indirme | CC BY-NC-SA 4.0. Ticari kullanım için ayrı lisans. Atlas API abonelik, fiyat görülmedi. | Bizzat görüldü (viewer ve ürün sayfası). Türkiye grid'i indirilmedi. | https://www.globalquakemodel.org/product/global-seismic-hazard-map |
| USGS Global Vs30 Mosaic | Vs30 (medyan + std), 30 arc-sn (~900 m) | COG GeoTIFF, GMT grd (631 MB) | CC0 / kamu malı | Bizzat görüldü. Türkiye için bölgesel inset yok (tam inset listesi görülemedi, dolaylı). Slope-tabanlı proxy, 900 m çözünürlük parsel ölçeği için kaba. | https://www.usgs.gov/data/us-geological-survey-global-vs30-mosaic , https://earthquake.usgs.gov/data/vs30/ |
| Türkiye'ye özel Vs30 (akademik) | Jeoloji + topografya tabanlı Vs30 | Yalnız yayın (Springer, ResearchGate) | Belirsiz | Yalnız arama sonucunda görüldü. Grid indirilebilirliği doğrulanmadı. | https://link.springer.com/content/pdf/10.1007/978-3-031-57659-1_12 |
| İBB Deprem Zemin (İstanbul) | 0.005° Vs30 grid, mikrobölgeleme | İBB portalı. Açık veri portalında veri talebi kayıtları var. | Belirsiz | Dolaylı (arama özeti). Sadece İstanbul. | https://depremzemin.ibb.istanbul/tr/istanbul-ili-mikrobolgeleme-projeleri |
| AFAD/MTA ülke çapında zemin sınıfı (ZA-ZF) | - | Açık, ülke çapı veri bulamadım | - | Bulunamadı | - |
| MTA Diri Fay Haritası 2026 | 485 fay, 1:25.000 esaslı | Sayfa "shp ve kmz formatında hazırlanmıştır" diyor ama indirme bağlantısı görmedim. Yerbilimleri portalı vektörün istek üzerine ücretli alınabileceğini söylüyor. | Ticari kullanım yasak, kaynakça zorunlu, yazılı izin olmadan çoğaltılamaz/dağıtılamaz. Resmî belge değil. | Bizzat görüldü, ama kamuya açık indirme doğrulanmadı. | https://www.mta.gov.tr/v3.0/hizmetler/diri-fay-haritalari , https://yerbilimleri.mta.gov.tr/anasayfa.aspx |
| EFSM20 (Avrupa fay modeli, Türkiye dahil) | Deprem üretebilen (M≥5,5) faylar | GeoJSON/SHP indirme, WFS | CC BY 4.0 | Yalnız arama özetinde görüldü, birincil sayfa açılmadı. | https://doi.org/10.13127/efsm20 , https://seismofaults.eu/efsm20data |
| AFAD deprem olay servisi | Kalıcı katalog: konum, büyüklük, derinlik, il/ilçe | REST/JSON. `deprem.afad.gov.tr/apiv2/event/filter` 302 ile `servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter` adresine gidiyor. 2026-09-01 için gerçek kayıt döndü. Parametreler: start, end, minlat/maxlat/minlon/maxlon, lat/lon/maxrad, limit, offset, orderby. | Lisans/oran limiti resmî kaynaktan görülmedi. Anahtar gerekmedi. | Filter çağrısı bizzat görüldü. `/latest` 404 verdi (gateway yolunda), 500 kayıt iddiası doğrulanmadı. Parametre listesi bir topluluk gist'inden. | https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter , https://gist.github.com/caglarsarikaya/6681df1b963d5c617d22dd54b3f6e651 |
| Kandilli (KOERI) | Son depremler, EIDA dalga formu/istasyon | Resmî JSON API görmedim. lst0.asp HTML'i scrape ediliyor (topluluk sarmalayıcıları). EIDA'da fdsnws station ve dataselect var. Event servisini doğrulayamadım. | Boğaziçi Üniv. telifi, kaynak gösterilerek kullanım. Ticari kullanım için yazılı izin (topluluk API'lerinin beyanı). | Dolaylı. lst0.asp ve resmî sayfa bağlantı hatası verdi. | http://www.koeri.boun.edu.tr/sismo/2/data-request/ , https://eida.koeri.boun.edu.tr/fdsnws/ |
| TKGM parsel (cbsapi / parselsorgu) | Ada/parsel, alan, nitelik, geometri. Bina yaşı/kat yok. | Web uygulaması herkese açık. cbsapi.tkgm.gov.tr uç noktaları (`.../megsiswebapi.v3.1/api/parsel`, `idariYapi`) topluluk kodlarında var. Denediğim `/parsel/{lat}/{lon}` yolu 404 verdi. | Koşullar: servislere TKGM izni olmadan doğrudan/dolaylı erişim yasak, resmî işlemlerde kullanılamaz, ticari kullanım yasak. Protokolle servis paylaşımı: cbs@tkgm.gov.tr. | Kullanım koşulları bizzat görüldü. Uç nokta yanıtı doğrulanmadı. | https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1/ , https://cbs.tkgm.gov.tr/uygulama.aspx |
| MAKS / UAVT / e-Devlet yapı bilgisi | Adres/bina kimliği | Açık toplu bina özniteliği API'si bulamadım. Yapı Kayıt Belgesi kişiye özel (mülk sahibi). | - | Dolaylı (arama sonuçları) | https://adres.nvi.gov.tr/Home |
| OpenStreetMap Türkiye | Bina ayak izi. `building:levels` ve `start_date` etiketleri seyrek. | Overpass, Geofabrik, HOT export | ODbL | Overpass sayımı 2026-09-29 (ways, `area ISO3166-1=TR`): `building:levels` 166.140, `height` 75.439, `start_date` 666. Toplam bina sayısı zaman aşımına uğradı. Toplam ~5,3 M (yalnız arama özeti, doğrulanmadı) varsayımıyla `levels` ~%3, `start_date` ihmal edilebilir. Bina yaşı yok sayılmalı. | https://overpass-api.de/api/interpreter |
| Microsoft GlobalMLBuildingFootprints | Ayak izi (+ ~174 M yüksekli). Türkiye'ye 2025-02-28'de 5,8 M eklendi. | CSV.gz (satır satır GeoJSON), dataset-links.csv | CDLA Permissive 2.0 | Bizzat görüldü (README, güncelleme 2026-08-13). Türkiye'deki yükseklik kapsamı doğrulanmadı. | https://github.com/microsoft/GlobalMLBuildingFootprints |
| Google Open Buildings V3 / 2.5D Temporal | Ayak izi ve yükseklik | - | CC BY-4.0 / ODbL | Türkiye kapsam dışı (kapsam sayfası bizzat görüldü). | https://sites.research.google/gr/open-buildings/ |
| Overture Maps buildings | OSM+Microsoft+Google birleşimi; `height`, `num_floors` | GeoParquet | ODbL / kaynağa göre | Yalnız arama özeti. Türkiye'de öznitelik doluluğu doğrulanmadı. | https://docs.overturemaps.org/guides/buildings/ |
| DASK tarife | 7 risk grubu × 2 yapı tarzı (betonarme/diğer); m² birim bedeli | Sayfada tablo, veri indirme yok. Risk grubu il/ilçe/mahalle sorgusuyla tek tek görülüyor. | Referans olarak kullanılabilir, ama toplu liste yok. | Tarife sayfası ve interaktif harita bizzat görüldü. | https://dask.gov.tr/tr/tarife-ve-primler , https://dask.gov.tr/tr/interaktif-deprem-haritasi |

DASK tarife oranları (‰): Betonarme 2,82 / 2,51 / 2,13 / 2,00 / 1,50 / 1,07 / 0,73 (I-VII). Diğer 4,96 / 4,25 / 3,73 / 3,49 / 2,79 / 1,86 / 1,09. Ek katsayılar (aynı sayfa): 2000 öncesi +%10, ≤3 kat -%10, ≥8 kat +%10.

## 3. Çelişkiler / belirsizlikler
- **EFEHR kapatma tarihi (kritik):** efehrcms.ethz.ch web-services sayfasında şu notu gördüm: "The EFEHR Hazard web services are being migrated to a unified platform. A beta is available at efehr-services.ethz.ch/api/docs. This API will be decommissioned on 30 September 2026." Portal notu: "unified platform goes live on 30 September 2026". "This API" hangi API'yi kastediyor net değil. Bugün `efehr-services.ethz.ch` çalışıyor. Yarın yeni platformun canlıya geçmesi bekleniyor. Yayınlanmış yeni URL/şema değişebilir. Yarın tekrar kontrol edin. `hazard.efehr.org` TLS sertifika hatası verdi, o sayfayı okuyamadım.
- **DASK birim bedelleri:** Sayfada 01.10.2026 tarihli birim bedeller (12.039 / 8.026 TL) bugünden önce yayınlanmış. Bir arama özeti 01.09.2026 için 11.737 / 7.825 TL veriyor. Sayfa "01 Ocak 2025 itibariyle" cümlesini de taşıyor. Ne zaman geçerli olduğu net değil. Fiyat sabitlenmeden önce dask.gov.tr'den yeniden okuyun.
- **MTA fay verisi:** Bir sayfa shp/kmz formatında hazırlandığını yazıyor, diğeri vektörün istek üzerine ücretle verildiğini. Kamu indirme bağlantısı görmedim.
- **AFAD event API:** Eski URL 302 ile yeni bir gateway'e taşınmış. Belgelenmiş yayın yok. Topluluk dokümanları eski URL'yi kullanıyor.
- **TDTH güncelliği:** Harita 2019'da yürürlüğe girdi. Haberler MTA Fay Haritası-2026 sonrası TDTH ve TBDY'nin güncellenmesi gerektiğini söylüyor. Resmî yenileme duyurusu bulmadım.
- **ESHM20 ve Türkiye:** GEM, ESHM20'nin Türkiye'yi kapsadığını ama GEM'in ayrı bir Türkiye modeli olduğunu yazıyor. ESHM20'nin kaya referansı TDTH'nin ZB (Vs30=760 m/s) referansıyla birebir aynı olmayabilir (TDTH referansı yalnız ikincil kaynakta gördüm).

## 4. Öneri (bulgudan ayrı)
**Proje için en sağlam veri yığını:**
1. Tehlike: kullanıcıdan AFAD TDTH'den okuduğu PGA/Ss/S1'i manuel girmesi (resmî ve TBDY ile uyumlu). Yedek/otomatik: EFEHR ESHM20 REST API (CC BY, JSON). Arayüzde "AFAD resmî değeri değildir" diye işaretleyin.
2. Zemin: kullanıcı beyanı (ZA-ZF) + USGS Vs30 (CC0) yalnız ön tahmin olarak.
3. Fay uzaklığı: EFSM20 (CC BY, GeoJSON/WFS). MTA verisi indirme ve lisans netleşmeden kullanılmamalı.
4. Bina ayak izi: Microsoft/Overture/OSM (kat/yükseklik varsa yardımcı olarak). Yaş ve kat sayısı kullanıcıdan istenmeli.
5. DASK: risk grubu ve tarife yapısı yalnız kavramsal referans. Toplu risk grubu listesi kamuya açık değil.
6. Tarihsel katalog: AFAD event API. Kandilli yalnız yedek/ikincil.

**En büyük 3 veri riski:**
1. **TDTH'ye otomatik erişim yok.** e-Devlet girişi zorunlu, endpoint/grid/lisans yok. Scrape'lemek e-Devlet kimlik doğrulamasını aşmayı gerektirir. Resmî değerin otomasyonu bu yolla yapılamaz.
2. **Bina yaşı/kat sayısı otomatik yasal kaynağı yok.** TKGM otomatik sorguyu yasaklıyor, OSM'de `start_date` ~666 kayıt, `building:levels` ~166 bin ve toplam binaya göre çok düşük. Puanın iki ana girdisi kullanıcı beyanına bağlı olacak.
3. **Zemin ve fay verisi zayıf/kısıtlı.** Vs30 için Türkiye'de açık, ülke çapı, ince çözünürlüklü kaynak yok (USGS ~900 m). MTA fay verisi ticari kullanıma kapalı ve indirmesi doğrulanmadı. Proje ticarileşirse MTA, GEM (CC BY-NC-SA) ve TKGM koşulları tekrar değerlendirilmeli.

## Kaynaklar
- https://tdth.afad.gov.tr/
- https://www.turkiye.gov.tr/afad-turkiye-deprem-tehlike-haritalari
- https://www.afad.gov.tr/turkiye-deprem-tehlike-haritasi
- https://www.aa.com.tr/tr/gundem/afaddan-turkiye-deprem-tehlike-haritasina-iliskin-bilgilendirme/3558806
- https://efehr-services.ethz.ch/api/openapi.json
- https://efehrcms.ethz.ch/en/web-services/
- https://gitlab.seismo.ethz.ch/efehr/eshm20
- https://www.globalquakemodel.org/product/global-seismic-hazard-map
- https://www.globalquakemodel.org/product/europe-hazard
- https://www.usgs.gov/data/us-geological-survey-global-vs30-mosaic
- https://earthquake.usgs.gov/data/vs30/
- https://www.mta.gov.tr/v3.0/hizmetler/diri-fay-haritalari
- https://yerbilimleri.mta.gov.tr/anasayfa.aspx
- https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter
- https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1/
- https://cbs.tkgm.gov.tr/uygulama.aspx
- https://github.com/microsoft/GlobalMLBuildingFootprints
- https://sites.research.google/gr/open-buildings/
- https://dask.gov.tr/tr/tarife-ve-primler
- https://dask.gov.tr/tr/interaktif-deprem-haritasi
- https://overpass-api.de/api/interpreter
