# DURUM — YapiRisk — deprem riski ön değerlendirmesi

> **Ne bu dosya:** sertifika değil **envanter**. Ölçülen gerçek durum; "yok" yazan satır kusur değil, kayıt.
> Faz durumu `docs/Roadmap.md`'de; bu dosya son ölçümü tutar.

**Ölçüm tarihi:** 2026-11-13
**Tek cümle:** Aydın, Denizli, İzmir ve Manisa'da binayı haritada bulup RYTEİE 2019 Ek-A sorularıyla profesyonel
inceleme önceliğini hesaplayan, sunucusuz ve çevrimdışı çalışan web uygulaması. Faz 1–6.9 ve 10 tamam; Faz 7 (yayın)
Scryne'ın onayını bekliyor, proje geçici olarak dondurulmuş (`.claude/state.json`).

## Ne çalışıyor (2026-11-13'te ölçüldü)

- **`npm run ci`:** lint 0/0, `tsc`, `design:lint`, vitest 240/240, `vite build`; boru hattı `ruff` + 14 pytest.
- **Dependabot:** PR #9 (pipeline ruff 0.17.4) ve #10 (npm küçük grup, 9 güncelleme) yerelde birleştirildi, testler yeşil.
- **Playwright:** tam paket 40/40 (masaüstü + Pixel 7, 2,0 dk). Harita döşemesine bağlı senaryolar
  (`cevrimdisi`, `bina-bulma`) `--repeat-each 4` ile 48/48. Çevrimdışı senaryosu yoldaki harita karolarını
  bekliyor (`c0d8526d`); kararsızlık bu turda yeniden üretilemedi, test gevşetilmedi.
- **Gezi:** `vite preview`, 6 rota (harita, Yöntem ve isabet, Veri ve lisanslar, Profesyonel inceleme, Hakkında,
  bilinmeyen adres) × 390/1440 × açık/koyu = 24 kare: taşma 0, konsol 0. Arayüz yalnız koyu temada; açık tema
  isteği de koyu çiziliyor (tasarım kararı).
- **Uçtan uca:** mahalle ara → bina seç → form soruları → sonuç kartı (Orta öncelik, PP 70–90, ESHM20) → TDTH değeri
  girilince tek değer (70) ve kaynak AFAD; e2e `sonuc.spec.ts` bunu dört ilde sınıyor.

## Bilinen sınırlar

- **Harita riski boyamıyor.** Binalar tek soluk renkte, seçilen bina vurgu renginde; risk bandı yalnız sonuç
  panelinde. Bina başına risk verisi yok (değerlendirme kullanıcının cevaplarından çıkıyor), bu yüzden haritada
  risk katmanı bilerek yok.
- **`npm audit`:** 2 yüksek, ikisi de `@google/design.md` 0.4.0 → `zod` ^3 zincirinde (yalnız DESIGN.md lint aracı,
  geliştirme bağımlılığı; yama zod 4'te, üst akım).
- **Bilinmeyen adres:** statik sunucu tek sayfa uygulamaya düştüğü için ayrı 404 sayfası yok; harita açılıyor.
