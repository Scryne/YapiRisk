---
proje: YapiRisk
created: 2026-09-29
modified: 2026-10-01
type: roadmap
status: aktif
---
# YapiRisk — Roadmap

Durum sütunu session-start hook'u tarafından otomatik okunur — format bozulmasın:
⏳ Bekliyor / 🔄 Devam Ediyor / ✅ Tamamlandı.

Dayanak: `docs/Final-Dokuman.md` (stack, mimari, K-12…K-15) ve `docs/Proje-Fikri.md` (K-1…K-11, bitti tanımı).
Tahmin ~22 iş günü; her fazın sonunda "Notlar" doldurulur ve sonraki fazlar gerekiyorsa güncellenir.

| Faz | Adı | Durum | Bitti Kriteri |
| --- | --- | --- | --- |
| 1 | İskelet ve sağlık | ✅ Tamamlandı | Repo GitHub'da (private); CI (lint + typecheck + test + build + boru hattı testi) varsayılan dalda yeşil; `.github/dependabot.yml` (npm + uv); `npm run dev` boş kabuğu açıyor; DESIGN.md token'ları frontmatter'da ve lint geçiyor |
| 2 | Puan motoru | ✅ Tamamlandı | `src/yontem/` RYTEİE Tablo A.1–A.4, Tablo A.2 bölge, TBDY Fs/F1, S1 bandı, "bilmiyorum" aralığı ve K-12 bantları; Vitest resmî tablo hücrelerini ve spike'la eşdeğerliği (ACI-133'teki 154 binanın PP'si Python ile birebir) geçiyor |
| 3 | Veri boru hattı | ✅ Tamamlandı | `pipeline/` tek komutla `public/data/manisa/` üretiyor: tehlike ızgarası, ayak izi parçaları, mahalle dizini, `dogrulama.json`, `kaynak.json` (sürüm, lisans, sha256); iki kez çalıştırınca aynı sha256; `public/data/LISANSLAR.md` |
| 4 | Harita ve bina bulma | ✅ Tamamlandı | Telefonda ve masaüstünde: mahalle aranıyor, harita gidiyor, ayak izine tıklanınca bina seçiliyor, ayak izi yoksa nokta seçiliyor; S1'deki 10 ilçe merkezinde uygulamanın gösterdiği SS, `spike/S1` değerleriyle ±0,001 aynı; ağ panelinde taban harita dışında üçüncü taraf isteği yok |
| 5 | Form | ✅ Tamamlandı | 11 soru Şekil A.1 tabanlı SVG çizimlerle; yığma/çelik/prefabrik ve 8+ kat kapsam dışı mesajına düşüyor; her soruda "Bilmiyorum"; cevaplar `localStorage`'da, "Temizle" siliyor; klavye ve ekran okuyucuyla doldurulabiliyor (`fixing-accessibility` bulgusuz) |
| 6 | Sonuç, rapor ve bilgi sayfaları | ✅ Tamamlandı | Sonuç kartı (bant, aralık, kalem kalem katkı, belirsizlik, isabet notu); TDTH SDS girişi adım adım rehberle; yazdırma görünümü A4'te okunur PDF; Yöntem ve isabet, Veri ve lisanslar, Hakkında/feragat sayfaları; `gorsel-dogrulama` 4 genişlik × tema çıkış 0; Playwright duman testi uçtan uca geçiyor |
| 6.5 | İkinci il paketi | ✅ Tamamlandı | İl Scryne'la seçildi; boru hattı o il için paketi üretiyor (iki kez aynı sha256); S1 benzeri TDTH karşılaştırması o ilde ≥ 5 noktada yapıldı ve bant (0,72–1,25) geçerli ya da yeniden ölçüldü; uygulama il seçiyor, arama ve harita iki ilde çalışıyor; Manisa'ya özgü metinler bölgeden okunuyor |
| 6.6 | Üçüncü il paketi (Aydın) | ✅ Tamamlandı | Boru hattı Aydın paketini üretiyor (iki kez aynı sha256); uygulama üç ilde arıyor ve haritada gösteriyor; Scryne'dan ≥ 5 TDTH okumasıyla S1 bandı (0,72–1,34) Aydın'da geçerli ya da yeniden ölçüldü, `tdthNokta` dolduruldu |
| 7 | Yayın | ⏳ Bekliyor | Faz 6.5 bitti (Scryne'ın kararı, 2026-09-30: yalnız Manisa'yı gösteren site yayına çıkmaz). `yayin-oncesi` çıkış 0 ya da her bulgu kararlı; `fixing-metadata` geçti; Scryne'ın açık onayıyla repo public ve GitHub Pages'te canlı; canlı adreste 10 S1 noktasından biriyle uçtan uca rapor alındı |
| 8 | Gerçek kullanım | ⏳ Bekliyor | Proje-Fikri'deki "bitti = kullanıldı" cümlesi gerçekleşti (Scryne'ın seçtiği ≥ 5 kişi yardımsız rapor aldı, sonucu öncelik olarak doğru okudu); bulgular roadmap'e işlendi |
| 9 | TDTH ızgarası entegrasyonu (tetiklemeli) | ⏳ Bekliyor | Tetik: AFAD CIMER başvurusu olumlu döner. Resmî grid paketlenir, K-5 bandı kapsanan illerde kalkar, S1 karşılaştırması yeniden koşulur |
| 10 | Yığma binalar, RYTEİE Ek-A.2.2 | ✅ Tamamlandı | Koşul (Faz 8 kanıtı) Scryne'ın kararıyla kaldırıldı, 2026-10-01. Yığma yöntemi motor + form + test olarak eklendi; Tablo A.5–A.10 hücreleri JSON'dan bağımsız testte; e2e yığma akışı motorla aynı PP'yi veriyor; isabet Gaziantep yığma verisinde ölçülüp Yöntem sayfasına yazıldı |
| 11 | B2B talep testi (koşullu) | ⏳ Bekliyor | Koşul: v1 bitti. Manisa/Ege'de 3–5 değerleme/dönüşüm ofisiyle görüşme notları; talep varsa v2 kapsamı yazıldı, yoksa proje v1'de kapandı |

## Faz Detayları

Faz 1 ve 8 şablon kuralıdır: biri projenin sessizce çürümesini engeller, öbürü "bitti"yi kullanıma bağlar.
Faz 9–11 olaya bağlıdır; hook bunları "sıradaki iş" saymaz.

### Faz 1: İskelet ve sağlık (~2 gün)
- **İşler:** Vite + React + TS iskeleti; Tailwind v4 + shadcn init (`components.json`), `cn`, Lucide; ESLint +
  Prettier + `tsc --noEmit`; Vitest ve Playwright kurulumu; `pipeline/` ayrı uv projesi (pytest); GitHub Actions
  (lint, typecheck, test, build, `uv run pytest`); `.github/dependabot.yml` (npm `/`, uv `/pipeline`); GitHub'da
  **private** repo (public'e geçiş Faz 7'de, onayla); IBM Plex font dosyaları `public/fonts/` (OFL); DESIGN.md
  token'ları Tailwind temasından frontmatter'a, `npx @google/design.md lint` (09-30'da npx zaman aşımı verdi;
  yerel `npm i -D` ile dene).
- **Bitti Kriteri:** tablodaki satır. CI adımları push'tan önce yerelde koşulur.
- **Notlar:** (2026-09-30)
  - Plandan sapmalar: ESLint yerine Vite şablonunun oxlint'i (+ Prettier); fontlar `public/fonts/` yerine
    `@fontsource` paketlerinden Vite ile paketleniyor (yine kendi sunucumuzdan, latin + latin-ext); token akışı
    ters çevrildi: DESIGN.md frontmatter tek kaynak, `scripts/tokens.mjs` Tailwind `@theme` üretir, `design:lint`
    uyumsuzlukta düşer. Adlı spacing üretilmiyor (`max-w-md` çakışması); spacing token'ları Tailwind'in 4px ölçeği.
  - Playwright duman testi CI'da (Chromium, masaüstü + telefon): font yerelden yükleniyor, konsol hatası ve dış
    istek yok. Faz 4'te taban harita istekleri bu testin izin listesine girer.
  - GitHub Pages için Vite `base` (`/YapiRisk/`) Faz 7'de ayarlanacak; favicon mutlak yolla bağlı.
  - Kapanış: `github.com/Scryne/YapiRisk` (private, `main`); CI run 36698345489 yeşil (web + pipeline).
    gh token'ına `workflow` yetkisi eklendi. `astral-sh/setup-uv` ana sürüm etiketi yayınlamıyor → tam sürüm sabit.
  - Dependabot ilk gün TypeScript 7 (#1) ve @types/node 26 (#2) PR'ları açtı; @types/node ana sürümü artık yok
    sayılıyor (Node 24). TS 7 kararı Scryne'da.

### Faz 2: Puan motoru (~2 gün)
- **İşler:** `src/yontem/ryteie-2019.json` (Tablo A.1–A.4, kaynak künyesiyle), `ryteie.ts` (`puan`, kat grubu,
  1–7 kat koruması), `tehlike.ts` (bilineer ızgara, TBDY Tablo 2.1/2.2 ara değer, Tablo A.2 bölge, S1 bandı
  0,72–1,25, K-9 zemin/sistem "bilmiyorum"), `bant.ts` (K-12, kötü uç), `aralik.ts` ("bilmiyorum" iki uç).
  Spike'taki `ryteie.py`/`aci133_analiz.py` bu fazda referans çıktı üretir (JSON fikstür).
- **Bitti Kriteri:** tablodaki satır; ayrıca 10 S1 noktası için ZC SDS'i TDTH raporlarıyla ±0,001 (S1'deki ölçüm).
- **Notlar:** (2026-09-30)
  - Tablo A.1–A.4 Resmî Gazete ekinin sayfa görüntüsünden yeniden okundu, spike aktarımıyla hücre hücre aynı.
    Testlerdeki beklenen değerler JSON'dan ayrı yazıldı; tabloya sokulan kasıtlı hatalar (A.4, Fs, F1, bant ve A.2
    sınırı) testleri düşürüyor.
  - Eşdeğerlik: 154 bina × 3 tehlike varsayımı (ESHM20 ham, ÷0,89, ÷0,72) = 462 karşılaştırma; SDS 1e-12, bölge
    ve PP birebir. Fikstür `spike/S3/fikstur_uret.py` ile üretilir (yerel ACI-133 verisi gerekir, CI yeniden
    üretmez); koordinat ve bina kimliği içermez.
  - S1: 10 TDTH raporunda ZC SDS ve SD1 ±0,001; ESHM20 bilineer SS/S1/PGA spike değerleriyle 3 ondalık aynı;
    TDTH bölgesi her noktada bandın iyi–kötü ucu arasında (Akhisar: ESHM20 II, bant kötü ucu I = TDTH).
  - Öğrenilen: SDS = Fs·SS tekdüze değil (ZE, 1,19 < SS < 1,25 arasında azalıyor). `sdsAraligi` uç, tablo
    sütunu, parça tepe noktası ve eğri kesişimi adaylarıyla kesin aralık veriyor. ZC/ZD/ZE zarfı gerçek
    tablolarda tekdüze, bu yüzden kesişim adayı yalnız tablo değişirse devreye giriyor (testle ayırt edilemiyor).
  - Tablo A.2'de sınır değer (ör. SDS = 1,0) iki satıra uyuyor; yüksek tehlikeli bölge seçildi.
  - Açık risk: TBDY Fs/F1'in ZD/ZE satırları TDTH ile doğrulanmadı (yalnız ZC). Faz 6'daki TDTH rehberi
    denemesinde Scryne'dan bir ZD raporu alınırsa kapanır.
  - `degerlendir()` hesap sözleşmesini uçtan uca uyguluyor (tehlike → uçlar → PP aralığı → bant); arayüz
    Faz 4–6'da bağlanır.

### Faz 3: Veri boru hattı (~2 gün)
- **İşler:** `pipeline/tehlike.py` (EFEHR `/v1/maps/area`; PGA, SA0.2, SA1.0; model 81, poe 0,002103),
  `ayak_izi.py` (Microsoft quadkey'ler + OSM il sınırı → z14 `.json.gz`, koordinat 6 ondalık),
  `mahalle.py` (Overpass mahalle/köy + ilçe sınırları; `place=*` adı "mahalle" olan çöp kayıtlar elenir, S4),
  `dogrulama.py` (ACI-133 → n, AUC'ler, bant başına ağır hasar oranı), `kaynak.json`, `LISANSLAR.md`.
  Overpass ana sunucusu 504 verebiliyor (S4): yedek sunucu listesi.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30)
  - Tek komut: `cd pipeline && uv run python -m yapirisk_pipeline manisa` (ilk koşu ~10 dk). Ham indirmeler
    `pipeline/.onbellek/` (git dışı); üç koşuda 3.676 çıktı dosyasının sha256'sı aynı.
  - Çıktılar: tehlike ızgarası 16×23 (il sınırı + 0,15° pay), 474.953 bina / 3.669 z14 parçası / 14,5 MB (S4 ile
    aynı sayı), 1.246 mahalle/köy (388 + 858; 52 "mahalle" adlı çöp kayıt elendi; S4'teki 18 örneğin 18'i var),
    `sinir.json`, `bolgeler.json`, `dogrulama.json`, bölge başına `kaynak.json`, `LISANSLAR.md` (CDLA metni dahil).
  - Puan tabloları tek kaynak: pipeline `src/yontem/*.json`'u okur; Python puanı aynı ACI-133 fikstürüyle test
    ediliyor (462 karşılaştırma). Doğrulama S3'ün AUC'lerini birebir üretti (RYTEİE 0,691/0,697/0,695, kat 0,700,
    Hassan–Sozen 0,760).
  - **Faz 6 için bulgu:** bant başına ağır hasar oranı, kötü uç tehlikeyle: perde verisiyle yüksek 2/2, orta
    %77 (31), düşük %61 (121); BAÇ varsayımıyla yüksek %84 (32), orta %60 (122). Yön tutarlı (PP düştükçe oran
    artıyor) ama örneklem hasar keşfi için seçilmiş (%65 ağır hasar) ve Maraş sarsıntısı tasarım düzeyinin çok
    üstünde; "düşük öncelik" güvenli demek değil. Yöntem sayfası ve sonuç kartı bunu açıkça yazmalı.
  - ESHM20 model alanı Suriye sınırında bitiyor: Maraş doğrulama ızgarasında 73 boş hücre. Doğrulamada boş hücreye
    izin var (bilineer yalnız köşeleri dolu hücrede); istemci paketinde ızgara tam olmak zorunda.
  - EFEHR `imt` biçimi `SA[0.20s]`, `SA[1.00s]` (`SA(0.2)` boş döner).

### Faz 4: Harita ve bina bulma (~4–5 gün)
- **İşler:** önce `frontend-sistemi` sırası (DESIGN.md → `frontend-design` + `design-taste` → `baseline-ui`).
  MapLibre + OpenFreeMap koyu stil; yerel mahalle araması (Türkçe normalize, bulanık); görünür z14 parçalarını
  `DecompressionStream` ile yükleme ve önbellek; bina seçimi (poligon merkezi) ve "haritada nokta seç" yedeği;
  masaüstünde sol cam panel, telefonda alt sayfa.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30)
  - Uçtan uca (Playwright, masaüstü + Pixel 7): mahalle arama → harita gider → binaya dokununca bina seçilir;
    nokta modu; bölge dışı uyarı; klavyeyle arama; S1'in 10 ilçe merkezinde gösterilen SS spike ile ±0,001;
    taban harita (tiles.openfreemap.org) dışında dış istek yok. 5 tekrar × 4 paralel işçide 50/50.
  - Tuzaklar (CLAUDE.md'ye yazıldı): MapLibre worker'ı Vite paketlemiyor (`?worker&url` + `setWorkerUrl`);
    MapLibre CSS'i katmansız, Tailwind `absolute`'u eziyor (sarmalayıcı); `setPadding` süren `flyTo`'yu kesiyor
    (dolgu uçuşa verilir); stil yüklenmeden dokunuşta `queryRenderedFeatures` hata fırlatıyordu (korundu).
  - Taban haritanın OSM `building` katmanı kaldırıldı: Microsoft ayak izleriyle çakışıp hangi çizime dokunulacağını
    karıştırıyordu. Telefonda atıf sol üstte, ilk çizimden sonra (i) düğmesine kapanır.
  - Arama: Türkçe katlama + Damerau–Levenshtein; "Mahallesi", "Köyü" ve bölge adı yok sayılır. Bağlantı:
    `#konum=enlem,boylam` (nokta seçer), `#harita=z/enlem/boylam`; uygulama yalnız okur, adrese konum yazmaz.
  - MapLibre (~1 MB) tembel yüklenen ayrı parçada; ana paket 364 KB.
  - Faz 5'e: seçimin `localStorage`'a yazılması ve "Temizle" form işiyle birlikte yapılacak.
  - Ek (Scryne isteği, K-16): isteğe bağlı uydu katmanı (MapTiler), varsayılan kapalı; açmadan MapTiler'a 0 istek,
    açınca logo + gizlilik notu (e2e, anahtar yoksa atlanır). Uydu açıkken taban haritanın yol/alan çizgileri gizlenir,
    etiketler kalır. Manisa'da z17 net, z18 üstü büyütme.

### Faz 5: Form (~4 gün)
- **İşler:** Şekil A.1'den SVG çizimler (K-14; çerçeve/perde, yumuşak kat, düşeyde düzensizlik, ağır çıkma,
  planda düzensizlik, kısa kolon, nizam + kat seviyesi, eğim, serbest kat adedi örnekleri); soru sırası: taşıyıcı
  malzeme ve kat (kapsam ayıklama) → sistem → kusurlar (yumuşak kat en görünür, K-6) → zemin; `ux-writing` ile
  soru metinleri; isteğe bağlı yapım yılı (puana girmez, K-10).
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30)
  - 13 adım, her adımda tek soru: malzeme, kat (kapsam ayıklama) → perde → yumuşak kat (kusurların ilki, K-6) →
    kalite → düşey düzensizlik → ağır çıkma → plan düzensizliği → kısa kolon → nizam (bitişikse döşeme hizası aynı
    adımda) → eğim → zemin sınıfı → isteğe bağlı yapım dönemi (K-10, puana girmez). Sonda özet: her cevap
    değiştirilebilir, ön sonuç (bant + PP aralığı) motordan.
  - Çizimler `src/form/cizimler.tsx`: Şekil A.1 (ek s. 32–33) yeniden çizildi, tek renk, taralı dolgu / dolu perde
    (K-14). Kalite, zemin ve dönem sorularında Şekil A.1'de de çizim yok; metinle.
  - Karar: **kat sorusunda "Bilmiyorum" yok.** Motor tabloyu kat grubuyla seçer, bilinmeyen kat 1–7 arasındaki her
    grubu açar ve sonuç anlamsız genişler; kat binaya bakarak sayılabilir, çizimli örnek (eğimli arazi, gömülü bodrum)
    var. Diğer 12 soruda var.
  - Karar: **malzeme "Bilmiyorum" → betonarme varsayılır**, özette ve sonuçta yazılır (Türkiye'de apartmanların
    çoğu betonarme; kapsam dışına atmak kullanıcıyı boşa çevirirdi). Faz 8'de bu seçimin oranı izlenir.
  - Kayıt: `localStorage` `yapirisk:degerlendirme:v1` (seçim + cevaplar + adım), okunan kayıt doğrulanır, bozuksa
    yok sayılır, depolama kapalıysa sessizce oturum içinde kalır. "Temizle" onay penceresiyle (AlertDialog) siler.
  - Erişilebilirlik (`fixing-accessibility`): yerel radyo grupları (`fieldset`/`legend`), ok tuşları + Enter = İleri,
    adım değişince odak soru başlığına, form kapanınca devam düğmesine; hata `role=alert` + `aria-invalid`; radyo adı
    kısa etiket, açıklama `aria-describedby`. Ekran okuyucu erişilebilirlik ağacıyla doğrulandı (gerçek NVDA/TalkBack
    ile denenmedi → Faz 8'de bir kullanıcıyla).
  - Doğrulama: Vitest 133/133 (taslak → motor, kapsam, kayıt doğrulama, e2e cevap setinin motor değeri);
    Playwright 18/18, iki tekrarda 36/36 (klavyeyle 13 adım → PP −10 … 20 yüksek öncelik; yığma ve 8+ kat kapsam
    dışı; yeniden açınca kaldığı adım; Temizle). Ekran görüntüsü 390/768/1280, `gorsel-dogrulama` çıkış 0.
  - Tuzak: shadcn `Button` `type` vermez → form içinde varsayılan `submit`; radyoda Enter "Haritaya dön"ü
    tetikliyordu. Form içindeki her düğmeye `type="button"` (CLAUDE.md'ye yazıldı).
  - Faz 6'ya: özetteki ön sonuç kutusu sonuç kartına dönüşecek (katkı tablosu, belirsiz kalemler, desenli bant,
    yapım dönemi notu, malzeme varsayımı). Telefonda form paneli 78dvh; harita üstte görünür kalıyor.

### Faz 6: Sonuç, rapor ve bilgi sayfaları (~4 gün)
- **İşler:** sonuç kartı (DESIGN.md: bant başlıkta, puan değil); TDTH rehberi (S1'de Scryne'ın izlediği akış:
  Raporlama → DD-2 → zemin → Değerleri Hesapla → SDS); yazdırma CSS'i (açık tema, cam yok); Yöntem ve isabet
  sayfası (`dogrulama.json`: n = 154, AUC ≈ 0,70, kat sayısı eşdeğerliği, ölçülemeyen kusurlar, bant başına oran
  ve yanlılık notu); Veri ve lisanslar (MapTiler atfı dahil); Hakkında/feragat (6306, "tekil binada kullanılamaz",
  aydınlatma notu: taban harita ve isteğe bağlı MapTiler uydu istekleri). Denetim pasları: `fixing-accessibility`, `fixing-motion-performance` (cam),
  `ux-writing`, `gorsel-dogrulama`; `urun-dogrulama` ile faz kapanışı.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30)
  - Sonuç kartı (`src/sonuc/`): bant rozeti (renk + desen + metin; desen SVG, baskıda da görünür), tek cümlelik
    anlam, PP aralığı, kalem kalem katkı tablosu (iki uç ayrı sütun, farklı olan kalem belirsizlik renginde),
    belirsizlik (S_S/S_DS aralığı, kaynak, "Bilmiyorum" kalemleri, perde ve malzeme varsayımları), isabet notu +
    RYTEİE A.1.1 "tekil binada kullanılamaz" kaydı, yapım dönemi notu (K-10), lisanslı kuruluş yolu, yazdır düğmesi.
  - Karar K-17 (Final-Doküman): TDTH girişi SDS değil S_S; SDS formdaki zeminle hesaplanır, zemin bilinmiyorsa K-9
    aynen. Rehber: e-Devlet ile tdth.afad.gov.tr → Raporlama → koordinat (kopyala düğmesi) → DD-2 → Değerleri Hesapla.
    Okunamayan değer hata, ESHM20'nin 0,6–1,6 katı dışı uyarı (SDS/PGA satırı girilmiş olabilir). Değer seçilen
    konuma bağlı, kayıtta kalır.
  - Rapor: `print:` görünümü, A4, beyaz kâğıt; Chromium PDF'i 2 sayfa, metin katmanlı (pymupdf ile okundu).
  - Bilgi sayfaları Vite çok sayfalı girişle ayrı HTML (`yontem.html`, `veri.html`, `hakkinda.html`): GitHub
    Pages'te yönlendirici gerekmez. Sayılar `dogrulama.json` ve `kaynak.json`'dan okunuyor (e2e JSON ile karşılaştırıyor).
  - Denetimler: `fixing-accessibility` (TDTH uygula/kaldır sonrası odak, yeni sekme uyarısı, içeriğe geç
    bağlantısı; ağaç Playwright ile okundu), `fixing-motion-performance` (AlertDialog örtüsünde animasyonlu tam ekran
    blur kaldırıldı), `gorsel-dogrulama` 4 rota × 4 genişlik × 2 tema çıkış 0, telefonda kaynak tablosu listeye çevrildi.
  - `urun-dogrulama`: CI yerelde yeşil (Vitest 150, pipeline 12), Playwright 24/24 ×2; test gevşetme taraması tek
    bulgu (`hazirBekle` silinmedi, `e2e/yardim.ts`'e taşındı); duman testi: mahalle → binaya dokun → form → sonuç
    (70–90) → TDTH 1,158 → 70 → yeniden yükle → rapor PDF. Kaynak bağlantıları curl ile çözüldü (ESHM20 bağlantısı
    Apache varsayılan sayfası açan servis kökünden DOI'ye çevrildi).
  - Kontrol edilemeyen: TDTH arayüzündeki adım adları e-Devlet girişinin arkasında; S1'de Scryne'ın izlediği akıştan
    yazıldı, yeniden denenmedi → Faz 7/8'de Scryne bir kez rehberle izlesin.
  - Faz 7'ye: `vite.config` `base` (Pages alt yolu) ayarlanınca bilgi sayfası bağlantıları `BASE_URL` ile çalışıyor;
    favicon yolu `/favicon.svg` mutlak, `fixing-metadata`'da ele alınmalı.

### Faz 6.5: İkinci il paketi (~2–3 gün + Scryne'ın TDTH okumaları)
- **Neden:** Scryne 2026-09-30'da yayını erteledi: public repo ve site yalnız Manisa'yı gösterirse konum ipucu olur;
  ikinci bir il eklenince Manisa ürünün bölgelerinden biri olur.
- **İşler:** il seçimi (Scryne); `pipeline` o il için (EFEHR alan sorgusu, Microsoft quadkey'leri, OSM); S1 bandının o
  ilde geçerliliği için Scryne'dan ≥ 5 TDTH okuması (e-Devlet); `bolgeler.json`'a kayıt ve arayüzde il seçimi;
  metinlerdeki "Manisa" ifadelerinin bölge kaydından okunması (K-3 zaten bölgeden bağımsız kod istiyor).
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30, sürüyor)
  - İl: **İzmir** (Scryne). OSM ilişkisi 223167; paket 939.021 bina, 3.437 parça, 28 MB; 30 ilçe, 1.463 mahalle/köy;
    ESHM20 ızgarası 19×26. İki kez üretildi, `kaynak.json` bayt bayt aynı; Manisa paketi değişmedi.
  - Overpass ana sunucusu ve private.coffee "too busy" döndü (HTTP 200 + HTML); `overpass_gecerli` bu cevabı önbelleğe
    almıyor, maps.mail.ru yedeği eklendi.
  - Arayüz çok bölgeli: bütün bölge paketleri açılışta yüklenir (bina parçaları tembel), arama iki ilin
    dizininde, harita iki ilin sınırını ve binalarını çizer, seçimin ili sınırdan bulunur ve tehlike o ilin
    ızgarasından okunur. Kodda il adı yok (K-3): sayfa metinleri ve "AFAD farkı nerede ölçüldü" notu `bolgeler.json`
    (`tdthNokta`) kayıtlarından.
  - e2e 26/26 (İzmir: arama → nokta → sonuç notu "Bu ilde AFAD'la karşılaştırma henüz yapılmadı").
  - TDTH (Scryne, 10 rapor): okumalar SDS/SD1 tutarlılığıyla denetlendi. ESHM20/TDTH oranı 0,81–1,34 (ort. 0,98);
    güvensiz yön sınırı 0,72 tuttu, üst oran Konak'ta 1,25'i aştı → `S1_BANDI` 0,72–1,34 (iki il, 20 nokta). TDTH
    bölgesi 10 noktada da uygulamanın aralığında; yalnız ESHM20 Torbalı'da bölgeyi güvensiz yönde kaydırırdı.
    Ayrıntı `spike/S1/README.md`. Manisa'nın e2e örneği −10 … 20 → −10 … 40 (elverişli uç bölge II).
  - Kapanış: Vitest 163, pipeline 13, e2e 26/26; İzmir kaydı `tdthNokta: 10`, sonuç notu "İzmir'de 10 noktada ölçüldü".

### Faz 6.6: Üçüncü il paketi (Aydın, 2026-10-01)
- **Neden:** Scryne ürün kararlarını devretti (2026-10-01). Aydın: Manisa ve İzmir'e komşu, yüksek tehlikeli (Büyük
  Menderes grabeni), Ege'nin büyük illerinden; bölge bitişik kalıyor.
- **Notlar:**
  - OSM il ilişkisi 223166 (Nominatim; Overpass ana sunucu ve private.coffee bu sırada hata döndü).
  - İl paketlerini tembel yükleme **yapılmadı**: il başına açılış yükü gzip ~50 KB (tehlike, mahalle, sınır, bina
    dizini); üç ilde ~150 KB. Arama ve sınır çizimi zaten bütün illeri istiyor. ~10 ilde yeniden bakılır.
  - CIMER taslağı Türkiye geneli, olmazsa Manisa + İzmir + Aydın istiyor.
  - Paket: 17 ilçe, 871 mahalle/köy, 457.487 bina (2.258 parça, 13 MB), ESHM20 ızgarası 12×22. İki kez üretildi,
    bütün dosyaların sha256'sı aynı; Manisa ve İzmir paketleri değişmedi.
  - Overpass yedeği private.coffee (OSM verisi 2026-07-24) ilçe alan sorgusuna geçerli ama **boş** cevap verdi ve
    önbelleğe girdi (ilk çalıştırmada "0 ilçe, 0 mahalle"). `osm.dolu_overpass_gecerli`: sonucu boş olamayacak
    sorgularda boş cevap sıradaki sunucuya geçer; pytest'e eklendi.
  - Meta açıklamaları ve paylaşım görseli "Aydın, İzmir ve Manisa'daki binalar için".
  - Testler: Vitest bütün bölge paketlerini dolaşıyor (ızgara kutusu, ≥ 500 mahalle, ≥ 15 ilçe, parça dosyası);
    e2e: Aydın'da arama (Camikebir, Kuşadası) → Efeler'de değerlendirme → "Bu ilde AFAD'la karşılaştırma henüz
    yapılmadı; aralık İzmir ve Manisa'da ölçülen farktan geliyor" notu ve raporda il adı.
  - TDTH (Scryne, 10 rapor, 2026-10-01): okumalar SDS/SD1 tutarlılığıyla denetlendi (±0,0005). ESHM20/TDTH oranı
    **0,52–0,97 (ort. 0,76)**: Didim 0,52 ve Çine 0,71 eski güvensiz yön sınırının (0,72) altında; 4/10 noktada ESHM20
    bölgeyi daha az tehlikeli gösteriyor (Didim: AFAD I, ESHM20 III).
  - Karar (K-5 revize): tek ortak bant yerine **il başına bant**, o ilde ölçülen aralık (`bolgeler.json` `tdthOran`,
    dışa yuvarlanmış); alt sınır hiçbir ilde 0,72'nin üstüne çıkmaz (`GUVENSIZ_YON_TAVANI`; İzmir 0,80 → 0,72);
    ölçülmemiş il bütün ölçümlerin birleşimi `S1_BANDI` 0,52–1,34. Gerekçe: fark il ile değişiyor (ort. Manisa 0,89,
    İzmir 0,98, Aydın 0,76); ortak bandı 0,52'ye indirmek Manisa ve İzmir'de her sonucu gereksiz genişletirdi.
  - Etki: Manisa'da üst oran 1,34 → 1,25 (ölçülen); elverişli uç daralıyor, öncelik (kötü uç) değişmiyor. e2e
    betonarme örneği −10 … 40 → −10 … 20 (yüksek), yığma örneği 50 … 70 → 50 … 60 (orta). Aydın'da aralık
    0,97 / 0,52 kat geniş.
  - Testler: S1 testleri üç ilde (`describe.each`): okuma tutarlılığı, kayıttaki aralık ölçümü kapsıyor (≤ 0,01
    geniş), her noktada AFAD bölgesi kötü ve iyi uç arasında; `ilBandi` ve birleşim; e2e Aydın bandının oranı.

### Faz 7: Yayın (~1 gün)
- **İşler:** MapTiler anahtarı GitHub Actions değişkeni `VITE_MAPTILER_ANAHTARI` olarak derlemeye; MapTiler
  panelinde origin kısıtı (`scryne.github.io`) yabancı origin'le denenir. `yayin-oncesi` (git geçmişi, commit kimlikleri noreply, kişisel veri, belge meta verisi;
  `spike/S*/veri` ve `docs/arastirma/kaynak` gitignore'da mı), `fixing-metadata`, Scryne'dan açık onay → repo
  public + Pages; canlı adreste duman testi.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:** (2026-09-30, hazırlık; yayın Scryne'ın onayını bekliyor)
  - `fixing-metadata`: 4 sayfada başlık biçimi, açıklama, canonical, Open Graph + Twitter kartı (`public/og.png`,
    1200×630, Şekil A.1 dilinde), apple-touch-icon, theme-color. Adres `https://scryne.github.io/YapiRisk/`.
  - `vite.config` `base` = `YAPIRISK_TABAN` (yerelde `/`); `/YapiRisk/` ile derlenip önizlendi: harita, veri paketi,
    bilgi sayfaları, `data/LISANSLAR.md` 4xx'siz, konsol hatasız.
  - `.github/workflows/pages.yml`: repo private iken iş atlanır; public olunca her push'ta derleyip dağıtır.
    `VITE_MAPTILER_ANAHTARI` Actions **değişkeni** olarak okunur (Scryne ekleyecek; MapTiler panelinde origin
    `scryne.github.io`).
  - `yayin-oncesi` (`--gecmis`): yüksek bulgu 0, sır 0, commit kimlikleri hep noreply. Orta bulgular: "Manisa"
    (ürünün kapsamı, kodda ve veride zorunlu), TKGM kurumsal e-postası ve `uv.lock` hash'i (yanlış pozitif),
    pazar araştırmasında bir rakip proje anlatılırken geçen üniversite adı (`docs/arastirma/03`, geçmişte de var)
    → Scryne'ın kararı.
  - `spike/S1/veri` izleniyor (ESHM20, CC BY, testler okuyor); S3/S4 verisi ve `docs/arastirma/kaynak` git dışında.
  - Scryne'ın kararları (2026-09-30): (1) araştırma notundaki üniversite adı çıkarıldı ve geçmiş `git filter-repo
    --sensitive-data-removal --replace-text` ile yeniden yazıldı, `main` force push edildi, eski Dependabot dalı
    silindi (PR #1 kapandı). Kalan: GitHub'ın salt okunur `refs/pull/1/head` ve `refs/pull/2/head` referansları eski
    commit'leri tutuyor → public yapmadan önce GitHub Support'tan silinmesi ya da repoyu temiz geçmişle yeniden açmak
    gerekir. (2) Yayın ikinci il paketine kadar ertelendi → Faz 6.5. (3) Hazırlık hazır bekliyor.
  - 2026-09-30 (Scryne): eski `refs/pull` referansları için repo silinip aynı adla temiz geçmişle yeniden açıldı
    (private, wiki kapalı; önce `git bundle` yedeği alındı). Uzakta yalnız `main`; CI yeşil. Yayın Scryne'ın komutunu
    bekliyor. `yayin-oncesi` taramasında "Celal Bayar" eşleşmesi çıkacak: Çeşme'deki mahalle adı (OSM,
    `izmir/mahalleler.json`), okulla ilgisi yok → kasıtlı.

### Faz 8: Gerçek kullanım (~3–4 gün, takvim olarak daha uzun)
- **İşler:** Scryne 5+ kişi seçer; her biri kendi cihazından, yardım almadan bir binayı değerlendirir; sonra tek
  soru: "Sonuç ne diyor?" (doğru cevap: bina hakkında hüküm değil, profesyonel inceleme önceliği). Takıldıkları
  yer, "bilmiyorum" oranları, kapsam dışına düşenler not edilir; Faz 10/11 koşulları buradan okunur.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 9–11 (olaya bağlı)
- **Faz 9:** CIMER başvurusu Scryne'ın kararı (`docs/cimer-dilekce-taslak.md`).
- **Faz 10:** tamamlandı, aşağıda.

### Faz 10: Yığma binalar (2026-10-01)
- **Neden şimdi:** Scryne yayını ve kullanıcı görüşmelerini erteledi, ürünü geliştirmek istedi; Faz 8 koşulu kaldırıldı.
- **Notlar:**
  - Kaynak: Resmî Gazete 30688 ek s. 35–41 (A.2.2 metni s. 35–36, Şekil A.2 formu s. 37–38, Tablo A.5–A.10 s. 39–41).
    ÇŞB'nin 2019-07-05 konsolide Ek-2 metniyle (metin katmanlı) karşılaştırıldı: değerler aynı. RG 30808
    (21.06.2019) değişikliği Ek-A'ya dokunmuyor.
  - Motor: `src/yontem/yigma.ts` + `ryteie-2019-yigma.json`. PP = TP (A.5) + YSP (A.2.2.4: donatısız/karma 0,
    kuşatılmış 30, donatılı 60) + Σ Oᵢ·OPᵢ (A.6–A.10) + düzlem dışı (11–14 toplamı ≥ 3 → −10) + toprak dam (−10).
  - Kararlar (yorum, Yöntem sayfasında yazılı): (1) A.5 sütunu Tablo A.2 bölgesinden (A.2.2.2 ve A.2.2.3-12 zemine
    bağlı diyor; başlıktaki SDS sınırları zayıf zemin satırı), II ve III aynı sütun. (2) Tablo A.8'in beş satırında
    başlık basılmamış (RG ve ÇŞB metninde de); satırlar A.5/A.9 gibi 1–5 kat okundu. İkincil kaynakta teyit bulunamadı.
    (3) Yığma türü "bilmiyorum" → donatısız, iki uçta (A.2.1.1'in benzeri). (4) Diğer "bilmiyorum"lar iki uca;
    belirsiz listesi yalnız puanı gerçekten değiştirenleri sayar (1 katta yumuşak kat 0 puan, düzlem dışı eşiği
    bilinenlerle aşılamıyorsa listeye girmez). (5) K-12 bant sınırları iki yöntemde aynı; yığmada kusursuz en
    elverişsiz bina 70, "PP < 50" anlamı korunuyor. (6) Taşıyıcı duvar tipi (tuğla, kerpiç…) yöntemde puanlanmıyor,
    sorulmuyor.
  - Form: malzeme "Yığma" → 20 adım (Şekil A.2 soruları, ortak sorular: kat, nizam, zemin, dönem). Kat seçenekleri
    aynı; yığmada 6+ kat kapsam dışı (`yigmaKat`). Malzeme "Bilmiyorum" hâlâ betonarme. Kayıt anahtarı v1 kaldı:
    yeni `taslak.yigma` alanı isteğe bağlı, eski kayıtlar olduğu gibi okunuyor.
  - Çizimler: Şekil A.2'den 19 yeni SVG (yığma türü 4, plan 2, duvar miktarı 3 (BO oranı çizimde gerçek), düşey
    boşluk 3, hatıl 3, cephe kat farkı 2, yumuşak kat 2). Döşeme, harç, bağlantı, çatı metinle (şekilde çizim yok).
  - İsabet (S3 ek, `spike/S3/gaziantep_yigma.py`): Gaziantep 414 yığma bina, ağır+ 72. Taban puanı AUC 0,708 (kötü
    uç) / 0,676 (ham), kat 0,515, ESHM20 S_S 0,762. Ayırmayı tehlike yapıyor (Nurdağı %55, Nizip %8). Kusursuz
    sayılınca 411/414 "düşük öncelik", o grupta ağır %17; Yöntem sayfasında "Dikkat" notuyla. Veri NC/ND: yalnız
    toplu sayılar `Yontem.tsx`'te sabit, boru hattına girmedi.
  - Paylaşım görseli: alt başlık "betonarme binalar" yerine "binalar" (görsel yönteme bağlı kalmasın), meta
    açıklamaları "betonarme ve yığma".
  - Doğrulama: Vitest 216 (yığma tablo hücreleri, mutasyonla 2 bozuk hücre yakalandı; taslak/kayıt; e2e cevap
    setinin motor değeri 50–70 orta); Playwright 28/28 (yığma akışı uçtan uca); 390 px iki temada her adımın ekran
    görüntüsü, konsol hatası ve taşma yok; Yöntem sayfası 4 genişlikte taşmasız; yığma raporu A4'te 2 sayfa.
  - Açık: TS 7'ye geçildi (Dependabot #1, aynı gün; CI ve `tsc` hata yakalama denendi). Zemin seçeneklerinde eski
    "Sağlam kaya" ifadesi DESIGN.md dil kuralına takılıyor (Faz 5'ten kalma), dokunulmadı.
- **Faz 11:** talep yoksa v2 yapılmaz; proje v1'de "tamamlandi" olur.
