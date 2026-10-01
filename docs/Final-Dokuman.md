---
proje: YapiRisk
created: 2026-09-29
modified: 2026-09-30
type: final-dokuman
status: onaylandi
---
# YapiRisk — Final Doküman

## Özet

YapiRisk, Manisa'daki betonarme binalar için sunucusuz bir deprem riski **ön değerlendirme** aracıdır.
Kullanıcı mahallesini arar, haritada binasına tıklar, yönetmelik çizimleriyle desteklenen kısa bir formu
doldurur; araç RYTEİE 2019 Ek-A (Resmî Gazete 30688) yöntemiyle performans puanını hesaplar ve **3 bantlı
"profesyonel inceleme önceliği"** verir. Tehlike değeri ESHM20'den gelir ve S1'de ölçülen sapma bantla
gösterilir; kullanıcı AFAD TDTH raporundaki SDS'i girerse tek değere iner. Sonuç sayfası her girdinin katkısını,
belirsizliği ve yöntemin 2023 Maraş verisinde ölçülen isabetini (AUC ≈ 0,70) açıkça yazar; "riskli/güvenli"
hükmü vermez, lisanslı kuruluşa yönlendirir. Hiçbir girdi tarayıcıdan çıkmaz. Kapsam, kararlar ve spike
sonuçları: `docs/Proje-Fikri.md` (K-1…K-11); bu doküman K-12…K-15'i ekler ve uygulamanın dayanağıdır.

## Teknoloji Stack

| Katman | Seçim | Gerekçe |
| --- | --- | --- |
| Uygulama | Vite + React + TypeScript, statik çıktı | Sunucu yok (K-1); harita ve form istemcide. Next.js'in SSR/router'ı bu ürüne bir şey katmaz, statik dışa aktarımda MapLibre worker tuzağı biliniyor (vault hafızası). |
| Stil ve bileşen | Tailwind v4 + shadcn (Radix), `cn`; ikon Lucide | Frontend sisteminin taban disiplini (`baseline-ui`, erişilebilir primitive); form ağırlıklı UI'da hazır erişilebilir bileşen. |
| Harita | MapLibre GL JS; taban harita OpenFreeMap (anahtarsız, ticari serbest); isteğe bağlı uydu katmanı MapTiler (K-16) | Açık kaynak, vektör; ayak izi katmanı GeoJSON kaynak olarak eklenir. |
| Bina ayak izi | Microsoft GlobalMLBuildingFootprints → z14 parçalı `.json.gz`, tarayıcıda `DecompressionStream` ile açılır | S4: Manisa 474.953 bina, 15,3 MB, parça medyanı 1,4 KB. Ek araç (tippecanoe) yok; yalnız görünen parçalar çekilir. |
| Mahalle araması | **Yerel dizin** (K-13): OSM mahalle/köy noktaları + ilçe, derlemede üretilir; Türkçe normalize bulanık arama istemcide | Arama üçüncü tarafa gitmez (K-1); S4'te Photon'un döndürdüğü koordinat zaten OSM'nin kendisiydi. |
| Tehlike | ESHM20 (EFEHR) 475 yıl ızgarası, sürümlü statik JSON (K-2) + TBDY Tablo 2.1/2.2 zemin katsayıları | S1, S2. |
| Puan motoru | Saf TypeScript modülü; tablolar `yontem/ryteie-2019.json`'da; Vitest | Spike'taki `ryteie.py`'nin portu; birim testler Resmî Gazete tablolarına ve spike çıktılarına karşı. |
| Rapor | Yazdırma CSS'i (`@media print`), tarayıcıdan "PDF olarak kaydet" | Sunucu ve PDF kütüphanesi gerekmez; Türkçe karakter sorunu yok (sistem/gömülü web fontu). |
| Veri boru hattı | Python + uv, `pipeline/` (Faz 1'de ayrı `pyproject`) | Spike betikleri buradan evrilir; çıktı `public/data/` altına, sürüm ve kaynak meta verisiyle. |
| Test | Vitest (motor, tehlike, bant), Playwright (uçtan uca duman testi) | `urun-dogrulama`: puan motoru resmî tablolara karşı; akış gerçek tarayıcıda. |
| CI / barındırma | GitHub Actions (lint + test + build), GitHub Pages; Dependabot npm + uv | Faz 1 kuralı; ücretsiz statik barındırma (K-11, public repo). |
| LLM | Yok | Puan hesap/kuraldır; hasar tahmini Jev'in zayıf ekseni. Sağlık nöbetinin izleyeceği model kimliği yok. |

## Mimari

```
pipeline/ (Python, derleme anında, ağ erişimi burada)
  tehlike.py    EFEHR /v1/maps/area → public/data/manisa/tehlike-eshm20.json   (PGA, SA0.2, SA1.0; model, poe, çekim tarihi)
  ayak_izi.py   Microsoft quadkey'ler + il sınırı → public/data/manisa/bina/{z14x}/{z14y}.json.gz
  mahalle.py    Overpass (place + ilçe sınırları) → public/data/manisa/mahalleler.json
  dogrulama.py  ACI-133 (CC BY) → public/data/dogrulama.json   (n, AUC'ler, bant oranları; ham veri yayımlanmaz)
  her çıktı: public/data/<bolge>/kaynak.json (lisans, atıf, sürüm, sha256)

src/ (istemci, ağ erişimi yalnız statik dosyalar + taban harita parçaları)
  yontem/     ryteie-2019.json, ryteie.ts (puan), tehlike.ts (Fs/F1, bölge, S1 bandı), bant.ts (K-12);
              yığma (Faz 10): ryteie-2019-yigma.json, yigma.ts
  veri/       bölge paketini yükleyen katman (tehlike ızgarası, mahalle dizini, ayak izi parçaları)
  harita/     MapLibre, ayak izi katmanı, bina seçimi (poligon merkezi) + "noktadan seç" yedeği
  form/       11 soru, Şekil A.1 tabanlı SVG çizimler, "bilmiyorum"
  sonuc/      bant kartı, kalem kalem katkı, belirsizlik, yöntem/isabet notu, lisanslı kuruluş yolu
  rapor/      yazdırma görünümü
  sayfalar/   Ana akış, Yöntem ve isabet, Veri ve lisanslar, Hakkında/feragat
```

**Akış:** mahalle ara → harita mahalleye → binaya tıkla (merkez koordinatı) → tehlike ızgarasından bilineer SS
→ S1 bandı ile SS aralığı → zemin cevabına göre SDS aralığı → RYTEİE bölge(leri) → form cevapları ("bilmiyorum"
en iyi/en kötü) → PP aralığı → bant (kötü durum) → sonuç ve rapor. Durum `localStorage`'da (yalnız tarayıcı);
"Temizle" düğmesi siler.

**Bölgeden bağımsızlık (K-3):** kod hiçbir yerde "Manisa" bilmez; bölge paketi `public/data/<bolge>/` ve bir
`bolgeler.json` kaydı. Yeni il = boru hattını o il için çalıştırmak.

**Hesap sözleşmesi (K-9, K-12):**
- Tehlike: SS_TDTH ∈ [SS_ESHM20 / üst ; SS_ESHM20 / alt], bant il il (K-5 revize 2026-10-02): Manisa 0,72–1,25, İzmir 0,72–1,34 (ölçülen alt 0,80, tavan 0,72), Aydın 0,52–0,97; ölçülmemiş il 0,52–1,34 (30 nokta); kullanıcı TDTH raporundaki S_S'i girerse bu adım atlanır (K-17).
- Zemin "bilmiyorum": bölge için ZC/ZD/ZE grubu; SDS için ZC, ZD, ZE Fs'lerinden en büyüğü.
- Sistem "bilmiyorum": BAÇ (A.2.1.1); yığma türü "bilmiyorum": donatısız (Faz 10). Diğer kusurlarda "bilmiyorum": var/yok iki uç hesaplanır.
- PP aralığı [PP_min, PP_max]; bant PP_min ile belirlenir, aralık iki banda yayılıyorsa sonuç kartında yazar.

## Kararlar (finalizasyon)

| # | Karar | Gerekçe |
| --- | --- | --- |
| K-12 | **Bantlar: Yüksek öncelik PP < 50 · Orta öncelik 50 ≤ PP < 100 · Düşük öncelik PP ≥ 100.** Bant PP aralığının kötü ucuyla seçilir. Renkler tek tonlu yoğunluk ölçeği; yeşil ve "güvenli" yok. Yöntem sayfası her bantta Maraş verisindeki ağır hasar oranını yanlılık notuyla verir. | Veri bant sınırını optimize etmeye yetmiyor (ACI-133'te binaların çoğu 6–7 kat ve bölge I, puanlar kümelenmiş); sınırlar yöntemin yapısına sabitlenir: 100, ÇŞB/ARUP rehberinin "risksiz" eşiği; 50, en yüksek tehlike bölgesinde (I) hiç kusuru olmayan 6–7 katlı BA çerçevenin taban puanı, yani PP < 50 "bu yöntemin en elverişsiz kusursuz binasından da kötü" demek. Yön veride tutarlı: iki sistem tanımında da PP düştükçe ağır hasar oranı artıyor (ör. BAÇ varsayımıyla <50: %84, 50–75: %64). Örnekler: 4 katlı BAÇ, bölge I, kusursuz → 70 (orta); aynı bina yumuşak kat + orta kalite → 25 (yüksek); 4 katlı BAÇP kusursuz → 145 (düşük). |
| K-13 | **Mahalle araması yerel dizinle (K-7 revize: Photon yerine).** | S4'te Photon'un bulduğu koordinatlar OSM'nin kendi noktalarıydı; aynı veri derlemede gömülünce arama çevrimdışı çalışır, IP/adres üçüncü tarafa gitmez, kullanım politikası riski kalkar. Kaybı: yazım hatası toleransı istemci tarafı bulanık aramayla karşılanır. |
| K-14 | **Şekil A.1 çizimleri temiz SVG olarak yeniden çizilir, kaynak gösterilir.** | FSEK md. 31 (mevzuat metninden teyit): resmen yayımlanan yönetmelik, tebliğ ve benzeri düzenleyici metinlerin çoğaltılması ve işlenmesi serbest; RYTEİE Resmî Gazete'de yayımlanmış düzenleyici metin. Tarama 1-bit ve kaba; temiz çizim tema ve baskı için şart. |
| K-15 | **Stack yukarıdaki tablo; bölge paketi dosyaları repoya girer** (tehlike ~51 KB, ayak izi ~15 MB, mahalle dizini küçük), NC/ND ham veri girmez. | K-2 "sürümlü statik dosya"nın doğal hali; derleme CI'da 220 MB indirme gerektirmez. Microsoft (CDLA Permissive 2.0), ESHM20 (CC BY), OSM (ODbL) yeniden dağıtımı atıfla serbest; lisans metinleri `public/data/LISANSLAR.md`. |
| K-16 | **Uydu görünümü isteğe bağlı katman: MapTiler (ücretsiz plan), varsayılan kapalı.** Haritadaki "Uydu" düğmesiyle açılır; açıkken panelde "baktığınız bölge MapTiler'a iletilir" notu görünür. Anahtar istemcide açık, MapTiler panelinde origin kısıtlı; derlemeye `VITE_MAPTILER_ANAHTARI` ile girer, repoya girmez. 256 px karo, en fazla z18. Kota dolarsa katman kapanır, koyu harita devam eder. | Scryne binaları uydu görüntüsünde görmek istedi (2026-09-30). Araştırma (`arastirmaci`, 09-30): anahtarsız ve bina çözünürlüğünde, şartları açık bir kaynak yok; MapTiler Free ticari olmayan kullanımı açıkça kapsıyor, kart istemiyor, aşımda ücret yerine askıya alıyor, ziyaretçi IP'sini işlemediğini belgeliyor. Manisa'da z17'de binalar net, ayak izleriyle örtüşüyor; z19'da pikselleşiyor (ölçüldü). K-1 istisnası kullanıcının açık seçimine bağlı: açmayanın isteği yalnız OpenFreeMap'e gider (e2e ile doğrulanıyor). |
| K-17 | **TDTH girişi SDS değil S_S ile (K-5'in uygulaması).** Kullanıcı AFAD TDTH raporundaki S_S değerini girer; SDS formdaki zeminle TBDY Tablo 2.1'den hesaplanır, zemin bilinmiyorsa K-9 kuralı (ZC/ZD/ZE'nin en büyüğü) aynen işler. Motor SDS girişini de kabul eder. ESHM20'den 0,6–1,6 kat dışında bir değer uyarı verir (SDS ya da PGA satırı girilmiş olabilir), engellemez. Değer seçilen konuma bağlıdır, seçim değişince düşer. | S_S zeminden bağımsızdır; SDS girişi TDTH'de seçilen zeminle formdaki zeminin çelişmesine açık kapı bırakırdı ve zemini bilmeyen kullanıcı TDTH'de ZC/ZD/ZE'yi ayrı ayrı denemek zorunda kalırdı. S1'deki 10 raporda S_S'ten hesaplanan SDS_ZC rapordakiyle ±0,001 aynı (Vitest). |

## Kapsam (v1)

`docs/Proje-Fikri.md` "v1: Kapsam ve Bitti Tanımı" geçerlidir, kesinleşmiştir:
- **Süre tavanı:** ~4 hafta (~22 iş günü tahmini).
- **Bitti = kullanıldı:** Scryne'ın seçtiği en az 5 kişi, Manisa'daki gerçek bir betonarme binayı yardım almadan
  değerlendirip rapor aldı ve sonucun hüküm değil öncelik olduğunu doğru okudu; bulgular roadmap'e işlendi.
- **Özellikler:** bina bulma (K-7, K-13), tehlike + bant (K-2, K-5, K-9), 11 soruluk form (K-8, K-10, K-14),
  puan motoru (K-4), sonuç + rapor (K-12), yöntem ve isabet sayfası (K-6).
- **Yayın:** public repo + GitHub Pages; yayın anı `yayin-oncesi` kapısı ve Scryne'ın onayı (K-11).

## Riskler ve Doğrulamalar

| Risk | Durum | Önlem |
| --- | --- | --- |
| ESHM20 TDTH'den sapıyor | Ölçüldü (S1): ort. %11 düşük, 3/10 bölge değişimi | Bant (K-5), TDTH SDS girişi, kötü durum öne; CIMER başvurusu Scryne'da |
| Yöntemin ayırma gücü sınırlı | Ölçüldü (S3): AUC ≈ 0,70 ≈ kat sayısı | 3 bant (K-6), isabet sayfası, "öncelik" dili |
| Kullanıcı kusurları yanlış işaretler | Ölçülmedi | Şekil A.1 çizimleri, "bilmiyorum" iki uç hesap; Faz son kullanım testinde "sonucu doğru okudu mu" ile gözlenir |
| Yöntem kapsamı dışı binalar (çelik, prefabrik, 8+ kat BA, 6+ kat yığma) | Bilinçli | Formun ilk sorularında ayıklanır, kapsam dışı mesajı (K-8) |
| Kişisel veri | Tasarımla kapalı (K-1, K-13, K-16) | Arama ve hesap istemcide; dışarı yalnız taban harita parçası istekleri, kullanıcı açarsa MapTiler uydu karoları (aydınlatma notunda) |
| Yasal çerçeve (6306) | Araştırıldı | "Tespit değildir" feragati, yönetmeliğin "tekil binada kullanılamaz" kaydı, lisanslı kuruluş yolu |
| Veri kaynağı değişir (EFEHR platform, Microsoft sürüm) | Bilinçli | Paketler sürümlü ve repoda; boru hattı yeniden üretilebilir, `kaynak.json` sha256 |
| MapTiler ücretsiz kotası (100 bin istek, 5 bin oturum/ay) dolar | Bilinçli | Katman kapanır, uyarı; koyu harita ve tüm akış çalışır. Faz 8'de kullanım izlenir |
| Yeni TDTH sürümü (TÜBİTAK projesi) | İzlenecek | Tehlike katmanı modülerdir; resmî grid erişimi olursa K-5 yeniden açılır |

## Kapsam Dışı

`docs/Proje-Fikri.md` "Kapsam Dışı (v1)" bölümü geçerlidir (çelik, prefabrik, kat sınırı aşan binalar, ikinci yöntem, kapı numarası
araması, fotoğraf/ML/Street View, hesap ve sunucu, B2B, Manisa dışı iller, mobil uygulama, resmî hüküm).
