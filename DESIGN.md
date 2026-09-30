---
version: alpha
name: YapiRisk
description: Manisa'daki betonarme binalar için RYTEİE 2019 Ek-A tabanlı, sunucusuz deprem riski ön değerlendirme aracı; sonucu hüküm değil "profesyonel inceleme önceliği" olarak gösterir.
---

# YapiRisk

> Google DESIGN.md spec'i (alpha). Kesin token'lar (colors, typography, rounded, spacing, components)
> Faz 1'de gerçek kaynak (Tailwind v4 teması) oluşunca frontmatter'a işlenir; o zamana kadar bu dosya
> yönü ve kuralları taşır. Doğrulama: `npx @google/design.md lint DESIGN.md`.

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

- **Öncelik ölçeği tek ton ailesi:** üç bant (yüksek / orta / düşük öncelik) aynı sıcak tonun (amber →
  koyu turuncu) yoğunluk basamaklarıdır. Trafik ışığı (kırmızı-sarı-yeşil) kullanılmaz: yeşil "güvenli"
  okunur ve yöntem bunu söyleyemez (K-4, K-12). Bant rengi hiçbir zaman tek bilgi taşıyıcısı değildir;
  her bantta metin etiketi ve çizgi deseni de vardır (renk körlüğü, siyah-beyaz baskı).
- **Belirsizlik rengi:** aralık/bant yayılımı nötr, soğuk bir ara tonla (gri-mavi) taralı gösterilir;
  öncelik ölçeğiyle karışmaz.
- **Accent:** tek bir soğuk accent (mavi-camgöbeği) yalnız etkileşim için: odak, seçili bina, birincil
  düğme. Öncelik ölçeğinde kullanılmaz.
- Kesin değerler ve kontrast oranları (koyu cam üstünde 4.5:1) Faz 1'de token olarak eklenir.

## Typography

- **IBM Plex Sans** (metin, arayüz) + **IBM Plex Mono** (puanlar, tablolar, SDS/SS değerleri, kaynak
  künyeleri). Gerekçe: tam Türkçe glif desteği (ı, İ, ş, ğ), teknik/mühendislik karakteri, rakamların
  tabular hizası; açık lisans (OFL), kendi sunucumuzdan servis edilir (K-1: font CDN'i istek sızdırmaz).
- Puan ve katkılar her yerde mono ve sağa hizalı; ondalık ayıracı Türkçe (virgül).

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
