---
proje: YapiRisk
created: 2026-09-29
modified: 2026-09-30
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
| 1 | İskelet ve sağlık | 🔄 Devam Ediyor | Repo GitHub'da (private); CI (lint + typecheck + test + build + boru hattı testi) varsayılan dalda yeşil; `.github/dependabot.yml` (npm + uv); `npm run dev` boş kabuğu açıyor; DESIGN.md token'ları frontmatter'da ve lint geçiyor |
| 2 | Puan motoru | ⏳ Bekliyor | `src/yontem/` RYTEİE Tablo A.1–A.4, Tablo A.2 bölge, TBDY Fs/F1, S1 bandı, "bilmiyorum" aralığı ve K-12 bantları; Vitest resmî tablo hücrelerini ve spike'la eşdeğerliği (ACI-133'teki 154 binanın PP'si Python ile birebir) geçiyor |
| 3 | Veri boru hattı | ⏳ Bekliyor | `pipeline/` tek komutla `public/data/manisa/` üretiyor: tehlike ızgarası, ayak izi parçaları, mahalle dizini, `dogrulama.json`, `kaynak.json` (sürüm, lisans, sha256); iki kez çalıştırınca aynı sha256; `public/data/LISANSLAR.md` |
| 4 | Harita ve bina bulma | ⏳ Bekliyor | Telefonda ve masaüstünde: mahalle aranıyor, harita gidiyor, ayak izine tıklanınca bina seçiliyor, ayak izi yoksa nokta seçiliyor; S1'deki 10 ilçe merkezinde uygulamanın gösterdiği SS, `spike/S1` değerleriyle ±0,001 aynı; ağ panelinde taban harita dışında üçüncü taraf isteği yok |
| 5 | Form | ⏳ Bekliyor | 11 soru Şekil A.1 tabanlı SVG çizimlerle; yığma/çelik/prefabrik ve 8+ kat kapsam dışı mesajına düşüyor; her soruda "Bilmiyorum"; cevaplar `localStorage`'da, "Temizle" siliyor; klavye ve ekran okuyucuyla doldurulabiliyor (`fixing-accessibility` bulgusuz) |
| 6 | Sonuç, rapor ve bilgi sayfaları | ⏳ Bekliyor | Sonuç kartı (bant, aralık, kalem kalem katkı, belirsizlik, isabet notu); TDTH SDS girişi adım adım rehberle; yazdırma görünümü A4'te okunur PDF; Yöntem ve isabet, Veri ve lisanslar, Hakkında/feragat sayfaları; `gorsel-dogrulama` 4 genişlik × tema çıkış 0; Playwright duman testi uçtan uca geçiyor |
| 7 | Yayın | ⏳ Bekliyor | `yayin-oncesi` çıkış 0 ya da her bulgu kararlı; `fixing-metadata` geçti; Scryne'ın açık onayıyla repo public ve GitHub Pages'te canlı; canlı adreste 10 S1 noktasından biriyle uçtan uca rapor alındı |
| 8 | Gerçek kullanım | ⏳ Bekliyor | Proje-Fikri'deki "bitti = kullanıldı" cümlesi gerçekleşti (Scryne'ın seçtiği ≥ 5 kişi yardımsız rapor aldı, sonucu öncelik olarak doğru okudu); bulgular roadmap'e işlendi |
| 9 | TDTH ızgarası entegrasyonu (tetiklemeli) | ⏳ Bekliyor | Tetik: AFAD CIMER başvurusu olumlu döner. Resmî grid paketlenir, K-5 bandı Manisa'da kalkar, S1 karşılaştırması yeniden koşulur |
| 10 | Yığma binalar, RYTEİE Ek-A.2.2 (koşullu) | ⏳ Bekliyor | Koşul: Faz 8'de kapsam dışı mesajı kullanıcıların önemli bir kısmını geri çeviriyor. Yığma yöntemi motor + form + test olarak eklendi |
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

### Faz 2: Puan motoru (~2 gün)
- **İşler:** `src/yontem/ryteie-2019.json` (Tablo A.1–A.4, kaynak künyesiyle), `ryteie.ts` (`puan`, kat grubu,
  1–7 kat koruması), `tehlike.ts` (bilineer ızgara, TBDY Tablo 2.1/2.2 ara değer, Tablo A.2 bölge, S1 bandı
  0,72–1,25, K-9 zemin/sistem "bilmiyorum"), `bant.ts` (K-12, kötü uç), `aralik.ts` ("bilmiyorum" iki uç).
  Spike'taki `ryteie.py`/`aci133_analiz.py` bu fazda referans çıktı üretir (JSON fikstür).
- **Bitti Kriteri:** tablodaki satır; ayrıca 10 S1 noktası için ZC SDS'i TDTH raporlarıyla ±0,001 (S1'deki ölçüm).
- **Notlar:**

### Faz 3: Veri boru hattı (~2 gün)
- **İşler:** `pipeline/tehlike.py` (EFEHR `/v1/maps/area`; PGA, SA0.2, SA1.0; model 81, poe 0,002103),
  `ayak_izi.py` (Microsoft quadkey'ler + OSM il sınırı → z14 `.json.gz`, koordinat 6 ondalık),
  `mahalle.py` (Overpass mahalle/köy + ilçe sınırları; `place=*` adı "mahalle" olan çöp kayıtlar elenir, S4),
  `dogrulama.py` (ACI-133 → n, AUC'ler, bant başına ağır hasar oranı), `kaynak.json`, `LISANSLAR.md`.
  Overpass ana sunucusu 504 verebiliyor (S4): yedek sunucu listesi.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 4: Harita ve bina bulma (~4–5 gün)
- **İşler:** önce `frontend-sistemi` sırası (DESIGN.md → `frontend-design` + `design-taste` → `baseline-ui`).
  MapLibre + OpenFreeMap koyu stil; yerel mahalle araması (Türkçe normalize, bulanık); görünür z14 parçalarını
  `DecompressionStream` ile yükleme ve önbellek; bina seçimi (poligon merkezi) ve "haritada nokta seç" yedeği;
  masaüstünde sol cam panel, telefonda alt sayfa.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 5: Form (~4 gün)
- **İşler:** Şekil A.1'den SVG çizimler (K-14; çerçeve/perde, yumuşak kat, düşeyde düzensizlik, ağır çıkma,
  planda düzensizlik, kısa kolon, nizam + kat seviyesi, eğim, serbest kat adedi örnekleri); soru sırası: taşıyıcı
  malzeme ve kat (kapsam ayıklama) → sistem → kusurlar (yumuşak kat en görünür, K-6) → zemin; `ux-writing` ile
  soru metinleri; isteğe bağlı yapım yılı (puana girmez, K-10).
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 6: Sonuç, rapor ve bilgi sayfaları (~4 gün)
- **İşler:** sonuç kartı (DESIGN.md: bant başlıkta, puan değil); TDTH rehberi (S1'de Scryne'ın izlediği akış:
  Raporlama → DD-2 → zemin → Değerleri Hesapla → SDS); yazdırma CSS'i (açık tema, cam yok); Yöntem ve isabet
  sayfası (`dogrulama.json`: n = 154, AUC ≈ 0,70, kat sayısı eşdeğerliği, ölçülemeyen kusurlar, bant başına oran
  ve yanlılık notu); Veri ve lisanslar; Hakkında/feragat (6306, "tekil binada kullanılamaz", aydınlatma notu:
  taban harita istekleri). Denetim pasları: `fixing-accessibility`, `fixing-motion-performance` (cam),
  `ux-writing`, `gorsel-dogrulama`; `urun-dogrulama` ile faz kapanışı.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 7: Yayın (~1 gün)
- **İşler:** `yayin-oncesi` (git geçmişi, commit kimlikleri noreply, kişisel veri, belge meta verisi;
  `spike/S*/veri` ve `docs/arastirma/kaynak` gitignore'da mı), `fixing-metadata`, Scryne'dan açık onay → repo
  public + Pages; canlı adreste duman testi.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 8: Gerçek kullanım (~3–4 gün, takvim olarak daha uzun)
- **İşler:** Scryne 5+ kişi seçer; her biri kendi cihazından, yardım almadan bir binayı değerlendirir; sonra tek
  soru: "Sonuç ne diyor?" (doğru cevap: bina hakkında hüküm değil, profesyonel inceleme önceliği). Takıldıkları
  yer, "bilmiyorum" oranları, kapsam dışına düşenler not edilir; Faz 10/11 koşulları buradan okunur.
- **Bitti Kriteri:** tablodaki satır.
- **Notlar:**

### Faz 9–11 (olaya bağlı)
- **Faz 9:** CIMER başvurusu Scryne'ın kararı (`docs/cimer-dilekce-taslak.md`).
- **Faz 10:** yığma yöntemi Ek-A.2.2 (1–5 kat, Tablo A.5 ve sonrası) Resmî Gazete ekinde s. 35–36.
- **Faz 11:** talep yoksa v2 yapılmaz; proje v1'de "tamamlandi" olur.
