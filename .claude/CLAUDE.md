# YapiRisk

Bu proje Scryne'ın Proje Çalışma Akışı'nı takip eder (bkz. global `~/.claude/CLAUDE.md`, ve
detaylı gerekçeler için ScryneOS vault'unda `🧠 500-Knowledge/Proje-Calisma-Akisi.md`).

## Durum

Şu anki aşama `.claude/state.json` içinde tutulur, `session-start` hook'u her oturum başında
bunu okuyup bağlama enjekte eder — nerede kaldığımızı sormana gerek kalmaz. Bir aşama
bittiğinde `asama` alanını sırayla güncelle: `fikir` → `denetim` → `finalizasyon` → `roadmap`
→ `uygulama` → `tamamlandi`. Aynı anda ScryneOS vault'undaki
`🏰 300-Projects/YapiRisk.md` index notunu da güncelle (frontmatter `asama`/`modified` +
`**Aşama:**` satırı — vault oturumu bunu okuyarak projeyi bilir).

Hook'lar (`.claude/hooks/`) `proje-baslat` şablonunun birebir kopyasıdır; burada elle
değiştirilmez. Kanonik roadmap `docs/Roadmap.md` dışında bir dosyaysa `state.json`'a
`"roadmap": "docs/<dosya>.md"` yazılır, iki hook da onu okur.

## Dosyalar

- `docs/Proje-Fikri.md` — fikir, kapsam, bitti tanımı, K-1…K-11 (denetlendi)
- `docs/arastirma/` — 2026-09-29 derin araştırması (veri, yöntem/mevzuat, pazar, teknik), kaynaklı ham raporlar
- `docs/Final-Dokuman.md` — nihai kararlar (teknoloji stack, mimari, riskler)
- `docs/Roadmap.md` — fazlı yol haritası; her faz "Durum" sütunuyla takip edilir, hook bunu
  otomatik okur
- `DESIGN.md` (proje kökünde) — bu projeye özel frontend kimliği. Kesin değerler
  frontmatter'da, gerekçe Markdown'da.

## Başlarken (2026-09-30 itibarıyla)

- **Kararların yeri:** K-1…K-11 `docs/Proje-Fikri.md`, K-12…K-17 + stack + mimari `docs/Final-Dokuman.md`.
  Bir kararı değiştirmeden önce ilgili satırı oku; değişirse aynı tabloda güncelle.
- **Spike'lar referanstır:** `spike/S1–S4/README.md` ölçümleri, `spike/S3/ryteie.py` puan fonksiyonunun
  Python sürümü (Faz 2'de TS portunun eşdeğerlik referansı). `spike/*/veri/` git dışında; README'lerdeki
  kaynaklardan yeniden indirilebilir.
- **Birincil kaynaklar (git dışı, yerel):** `docs/arastirma/kaynak/` — RYTEİE Resmî Gazete eki (taranmış;
  Ek-A s. 30–35, Şekil A.1 s. 32–33, yığma s. 35–36; metin katmanı yok, sayfa görüntüsü olarak oku) ve ÇŞB 2025
  hızlı yöntemler rehberi.
- **Git:** yerel kimlik noreply (`218348029+Scryne@users.noreply.github.com`) ayarlı; remote
  `github.com/Scryne/YapiRisk` (**private**), varsayılan dal `main`. Public'e geçiş yalnız Faz 7'de Scryne'ın açık onayıyla.
- **Uydu anahtarı:** kökte `.env` (git dışı) içinde `VITE_MAPTILER_ANAHTARI=`; Scryne'ın MapTiler hesabı. Yoksa uydu
  düğmesi görünmez, uydu e2e testi atlanır (CI'da böyle). K-16.
- **Komutlar:** `npm run ci` (lint + typecheck + design:lint + test + build), `npm run test:e2e`, `npm run tokens`
  (DESIGN.md → `src/styles/tokens.css`; token elle yazılmaz); pipeline: `cd pipeline && uv run pytest`.
- **Tuzaklar (bu projede yaşandı):**
  - EFEHR `/v1/maps` nokta sorgusu noktayı değil 10×10 ızgarayı döndürür → `/v1/maps/area` kullan;
    SA sorguları 70–120 sn sürer (arka planda çalıştır).
  - Overpass ana sunucusu 504 verebiliyor → `https://overpass.private.coffee/api/interpreter` yedeği.
  - EFEHR `imt` parametresi `SA[0.20s]` / `SA[1.00s]` biçiminde; `SA(0.2)` hata vermeden boş liste döner. ESHM20
    model alanı Suriye sınırında bitiyor (Maraş ızgarasında boş hücre).
  - `du` 3.669 küçük parçayı küme boyutuyla 22 MB gösteriyor; gerçek toplam 14,5 MB (`find -printf %s`).
  - Windows konsolunda Python çıktısında Türkçe bozuluyorsa `PYTHONIOENCODING=utf-8`; dosyalar UTF-8'dir.
  - MapLibre 6 worker'ını kendi dosyasının yanında arar, Vite paketlemez ("Worker failed to load") →
    `import url from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'` + `setWorkerUrl(url)`, `worker.format: 'es'`.
  - MapLibre CSS'i katmansız; `.maplibregl-map { position: relative }` Tailwind'in katmanlı `absolute`'unu ezer →
    harita kabını mutlak konumlu sarmalayıcıya koy; denetim stillerini `.maplibregl-map` önekiyle yaz.
  - `map.setPadding` süren `flyTo`'yu keser (telefonda panel boyu değişince) → dolguyu `flyTo({ padding })` ile ver.
    Haritaya tıklamak da uçuşu durdurur: testte `main[data-yakinlik]` hedefe ulaşmadan tıklama.
  - shadcn `add` mevcut dosya için soru sorar ve stdin kapalıysa durur → `(printf 'n
'; sleep 60) | npx shadcn add ...`.
  - Bash `while read` ile dosyadan URL okurken `\r` ve son satırda newline eksikliği satır kaybettirdi →
    `tr -d '\r'`, dosyayı `\n` ile bitir.
  - Windows'ta `design.md` komutu (npx ya da npm bin) kökteki `DESIGN.md` dosyasını açmaya çalışıp asılı kalıyor
    (09-30'daki "zaman aşımı" buydu) → her zaman `designmd` takma adını kullan (`npm run design:lint`).
  - `@google/design.md` 0.4.0 ayrıştırıcısı birimsiz `lineHeight` ve `fontFeature`'ı düşürüyor, `export` da
    `font-display` ağırlık/aile çakışması üretiyor → token'lar `scripts/tokens.mjs` ile YAML'dan üretilir.
  - shadcn artık `cn` paketinden import ediyor; özel `text-<token>` sınıflarını renk sanıp boyutu siliyor →
    `@/lib/utils`'teki yapılandırılmış `cn` kullanılır, oxlint `"cn"` importunu yasaklar (`shadcn add` sonrası düzelt).
  - shadcn `Button` `type` vermez: `<form>` içinde `submit` olur, radyoda Enter ilk düğmeyi ("Haritaya dön") tetikledi →
    form içindeki gönderme dışı her düğmeye `type="button"`.
  - e2e motoru (`src/yontem/*`) içe aktaramaz: JSON importu Node ESM'de `with { type: 'json' }` ister → beklenen değeri
    Vitest'te motordan hesaplayıp e2e'ye sabit yaz (ör. `taslak.test.ts` ↔ `form.spec.ts`). e2e'de göreli import `.ts` uzantılı.
  - Playwright `page.pdf()` baskı ortamını kullanır; öncesinde `emulateMedia({ media: 'screen' })` kalırsa ekran basılır.
  - `document.fonts.check()` font hiç tanımlı değilse de `true` döner → font testi yüklenen yüzlere bakar.
  - OSM'de Manisa'da "mahalle" adlı çöp `place` düğümleri var → mahalle dizininde ele.
  - TDTH değerleri yalnız e-Devlet ile, Scryne'ın elinden alınır (Raporlama → DD-2 → zemin → Değerleri
    Hesapla; çıktı PDF'inde metin katmanı yok, görüntü olarak okunur).

## Frontend

Taban disiplin ve araç sırası global `frontend-sistemi` skill'inde (burada tekrarlanmaz; UI işinden önce yükle). Projeye
özel karakteri kökteki `DESIGN.md` belirler ve çelişkide global varsayılanı ezer.
