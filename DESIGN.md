---
version: alpha
name: YapiRisk
description: Manisa'daki betonarme binalar için RYTEİE 2019 Ek-A tabanlı, sunucusuz deprem riski ön değerlendirme aracı; sonucu hüküm değil "profesyonel inceleme önceliği" olarak gösterir.
colors:
  primary: "#4CC3E0"
  on-primary: "#051A21"
  background: "#0A0F14"
  surface: "#111922"
  glass: "#111922B8"
  line: "#FFFFFF1F"
  text: "#E6EBEF"
  text-muted: "#9BA8B4"
  priority-high: "#E86A26"
  priority-medium: "#EE9A2E"
  priority-low: "#F2C46D"
  on-priority: "#1B0F06"
  uncertainty: "#8FA0B8"
  error: "#F28B82"
  paper: "#FFFFFF"
  paper-ink: "#111111"
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline:
    fontFamily: IBM Plex Sans
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.01em
  mono-md:
    fontFamily: IBM Plex Mono
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: '"tnum"'
  mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: '"tnum"'
rounded:
  sm: 6px
  md: 10px
  lg: 14px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
  glass-panel:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
  glass-panel-fallback:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  panel-caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
  panel-border:
    backgroundColor: "{colors.line}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 44px
  priority-high:
    backgroundColor: "{colors.priority-high}"
    textColor: "{colors.on-priority}"
    typography: "{typography.headline}"
    rounded: "{rounded.sm}"
  priority-medium:
    backgroundColor: "{colors.priority-medium}"
    textColor: "{colors.on-priority}"
    typography: "{typography.headline}"
    rounded: "{rounded.sm}"
  priority-low:
    backgroundColor: "{colors.priority-low}"
    textColor: "{colors.on-priority}"
    typography: "{typography.headline}"
    rounded: "{rounded.sm}"
  uncertainty-band:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.uncertainty}"
    typography: "{typography.mono-sm}"
  score:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.mono-md}"
  field-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
  print-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.body-sm}"
  page-title:
    textColor: "{colors.text}"
    typography: "{typography.display}"
---

# YapiRisk

> Google DESIGN.md spec'i (alpha). Kesin değerler yalnız frontmatter'da; `npm run tokens` bunları
> `src/styles/tokens.css`'e (Tailwind v4 `@theme`) aktarır, uygulama o dosyayı kullanır. Elle token
> yazılmaz. Doğrulama: `npm run design:lint`.

## Overview

Taban disiplin global frontend sisteminden gelir (dark glassmorphism: blur, border, kontrast, performans).
Bu dosya YapiRisk'i ayıran katmanı kaydeder.

- **Mood:** sakin, ciddi, mühendislik defteri. Kullanıcı binasının güvenliğini merak eden, belki endişeli
  biri; arayüz korkutmaz, pazarlamaz, heyecan yaratmaz. Ton bir teknik rapor ile bir harita arasında.
- **Cam neyin üstünde:** haritanın. Taban harita koyu; arama, form ve sonuç panelleri haritanın üstünde
  yüzen cam yüzeyler. Gradient mesh arkaplan yalnız haritanın olmadığı sayfalarda (Yöntem, Hakkında).
- **Farklılaştırıcı detay:** yönetmeliğin kendi çizim dili. Şekil A.1'den yeniden çizilen ince çizgili,
  tek renkli şematik bina çizimleri (çerçeve, perde, yumuşak kat, çıkma) formun ve sonuç kartının görsel
  omurgası; illüstrasyon, stok ikon ya da 3B bina yok.
- **Rapor:** yazdırma görünümü açık tema, beyaz kâğıt, siyah metin; cam ve gradient yazdırılmaz.

## Colors

- **Zemin:** `background` saf siyah değil, mavimsi mürekkep; koyu taban haritayla aynı aileden, cam
  panellerin arkasında harita "okunur" kalsın diye.
- **Cam:** `glass` = `surface` %72 opaklıkta, blur 12px. `backdrop-filter` yoksa `glass-panel-fallback`
  (opak `surface`). Kenar `line` (beyaz %12), camın ışık yakalayan kenarı; etkileşimli sınır da budur.
- **Öncelik ölçeği tek ton ailesi:** `priority-high` / `priority-medium` / `priority-low` aynı sıcak tonun
  (koyu turuncu → amber) yoğunluk basamaklarıdır; üçünün de üstünde `on-priority` koyu metin (≥ 5,8:1).
  Trafik ışığı (kırmızı-sarı-yeşil) kullanılmaz: yeşil "güvenli" okunur ve yöntem bunu söyleyemez
  (K-4, K-12). Bant rengi hiçbir zaman tek bilgi taşıyıcısı değildir; her bantta metin etiketi ve çizgi
  deseni de vardır (renk körlüğü, siyah-beyaz baskı).
- **Belirsizlik rengi:** `uncertainty` (gri-mavi) aralık/bant yayılımını taralı gösterir; öncelik ölçeğiyle
  karışmaz.
- **Accent:** `primary` (camgöbeği) yalnız etkileşim için: odak, seçili bina, birincil düğme. Öncelik
  ölçeğinde kullanılmaz.
- **Hata:** `error` yalnız form doğrulama metninde; öncelik ölçeğiyle karışmasın diye pembe-kırmızı.
- **Kontrast (surface üstünde):** `text` 14,8:1, `text-muted` 7,3:1, `primary` 8,6:1, `uncertainty` 6,7:1,
  `priority-high` 5,5:1; `on-primary` accent üstünde 8,7:1.

## Typography

- **IBM Plex Sans** (metin, arayüz) + **IBM Plex Mono** (puanlar, tablolar, SDS/SS değerleri, kaynak
  künyeleri). Gerekçe: tam Türkçe glif desteği (ı, İ, ş, ğ), teknik/mühendislik karakteri, rakamların
  tabular hizası; açık lisans (OFL), uygulamayla birlikte paketlenir (K-1: font CDN'i istek sızdırmaz).
- Puan ve katkılar her yerde mono (`mono-md`, `mono-sm`, `tnum`) ve sağa hizalı; ondalık ayıracı Türkçe
  (virgül).

## Layout

- 4px tabanlı aralık ölçeği (`spacing`). Panel iç boşluğu `md`, bölümler arası `lg`.
- Dokunma hedefleri en az 44px (`button-primary.height`).

## Shapes

- Köşeler ölçülü: bant etiketi `sm`, düğme ve alan `md`, cam panel `lg`. Hap/tam yuvarlak kullanılmaz;
  teknik rapor tonuyla çelişir.

## Components

- **Sonuç kartı:** önce bant (büyük metin + desen), altında tek cümlelik ne demek olduğu, sonra PP aralığı,
  sonra kalem kalem katkı tablosu. Sayısal puan başlığa çıkmaz; bant çıkar.
- **Form soruları:** her soru bir çizim çifti (yok / var) + üç seçenek (Yok / Var / Bilmiyorum); seçim
  büyük dokunma alanlı kartlarla, telefonda tek sütun.
- **Harita panelleri:** masaüstünde solda sabit cam panel, telefonda alttan açılan sayfa (bottom sheet);
  harita her zaman görünür kalır.
- **Kaynak künyesi:** her sayısal değerin yanında küçük bir "kaynak" ipucu (ESHM20, TDTH, RYTEİE Tablo A.x).

## Do's and Don'ts

- "Riskli", "güvenli", "sağlam", "çürük" kelimeleri arayüzde ve raporda geçmez; "öncelik" ve "inceleme" geçer.
- Yeşil renk öncelik ölçeğinde kullanılmaz.
- Bant sonucu animasyonla, sayaçla ya da konfetiyle "açılmaz"; sonuç sakin görünür.
- Glassmorphism yazdırma görünümüne taşınmaz.
- Font, ikon ya da görsel için harici CDN kullanılmaz (K-1).
