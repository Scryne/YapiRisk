# YapiRisk

Aydın, Denizli, İzmir ve Manisa'daki betonarme ve yığma binalar için deprem riski ön değerlendirmesi. Binanızı
haritada bulursunuz, dışarıdan bakarak cevaplanabilen soruları yanıtlarsınız, resmî RYTEİE 2019 Ek-A yöntemiyle
hesaplanan profesyonel inceleme önceliğini görürsünüz.

Sonuç bir yapı tespiti, rapor ya da resmî belge değildir. Bir binanın depremde nasıl davranacağı hakkında hüküm
vermez; binanın durumunu kesin olarak öğrenmenin yolu, 6306 sayılı Kanun kapsamında yetkili bir kuruluşa riskli yapı
tespiti yaptırmaktır.

## Nasıl çalışır

- **Sunucu yok.** Uygulama tarayıcıda çalışır; seçilen bina, cevaplar ve girilen değerler yalnız o tarayıcıda saklanır.
- **Veri hattı** (`pipeline/`, Python): harita ve bina katmanlarını üretir.
- **Arayüz** (`src/`, React + Vite + TypeScript): harita, soru akışı ve sonuç. Görsel kimlik `DESIGN.md` dosyasında.

Yöntem, isabet ölçümü ve veri lisansları uygulamanın "Yöntem ve isabet" ile "Veri ve lisanslar" sayfalarındadır.

## Geliştirme

```bash
npm ci
npm run dev        # geliştirme sunucusu
npm run build      # tip denetimi + üretim derlemesi
npm run lint
npm test           # birim testleri
npm run test:e2e   # Playwright

cd pipeline && uv run pytest
```

## Durum

Geliştirme tamam; yayın henüz yapılmadı. Yol haritası `docs/Roadmap.md`, proje kararları `docs/Final-Dokuman.md`.
