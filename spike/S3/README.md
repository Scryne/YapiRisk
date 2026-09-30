# S3 — Doğrulama verisi

**Soru:** RYTEİE 2019 Ek-A puanının (K-4) isabetini geriye dönük ölçmek için yıl + kat + taşıyıcı sistem +
konum + hasar (ve mümkünse görsel kusurlar) içeren, erişilebilir bina bazlı veri var mı? Tutmazsa projenin
"ölçülmüş isabet" farkı düşer (Threads: YapiRisk, İzle 2).

## Aday 1 — Atasever vd., Gaziantep (Harvard Dataverse, doi:10.7910/DVN/OQCPWF)
İncelendi 2026-09-30 (API ile; tablo `veri/gaziantep.xlsx`, fotoğraflar indirilmedi).

- **Lisans:** CC BY-NC-ND 4.0. Ticari olmayan kullanım ve atıfla serbest; türetilmiş veri seti dağıtılamaz.
  İsabet istatistiği yayımlamak sorun değil, veriyi repoda/sitede yeniden dağıtmak değil. v2 B2B (ticari)
  için kullanılamaz.
- **İçerik:** 1.308 bina (`full_data`) + 425 eksik/hatalı kayıt (`missing_data`); saha çalışması 09–16.02.2023;
  14.030 fotoğraf (bina başına klasör) + ÇŞB hasar tespit galerisi bağlantısı (`PhotoCSB`).
- **Alanlar:** Latitude, Longitude, Damage (Non-damaged / Slight / Moderate / Heavy / Urgently Demolish /
  Collapsed / No evaluation), Story Number, Base Area, Structural System, Construction Year, Usage Category,
  Notes (Türkçe serbest metin), ÇŞB formundan taşıyıcı sistem tipi, harç tipi, çatı hasarı.
  **Görsel kusur alanı yok** (yumuşak kat, kısa kolon, çıkma, nizam, kalite); fotoğraflardan elle etiketlenebilir.
- **Dağılım:** 739 betonarme, 444 yığma. Kullanım ağırlıkla kamu: okul 321, ibadethane 228, kamu kurumu 548;
  konut 292. Kat medyanı 1, %75'i ≤ 3. İlçeler Nizip 688, Araban 261, Nurdağı 245 (Nurdağı fay yakını,
  Nizip/Araban uzak).
- **Betonarme binalarda ağır hasar ve üstü** (heavy + urgently demolish + collapsed): 40 / 739; bunların
  31'i ≤ 2 kat. 4+ katlı BA binada ağır hasar ve üstü yalnız 6.

**Değerlendirme:** Konum + yıl + kat + sistem + hasar var, yani RYTEİE'nin "tehlike + bina kimliği" kısmı
ölçülebilir. Ama örnek Manisa'nın hedef stoğunu (3–7 katlı betonarme konut) temsil etmiyor: ağırlıkla 1–2
katlı kamu binası, pozitif (ağır hasar) sınıfta 3+ katlı BA bina çok az. Tek başına "ölçülmüş isabet" iddiasını
taşımaz; yardımcı set.

## Aday 2 — ACI-133 (Hariri-Ardebili 2024, Zenodo 13386343) → **kullanıldı**
- **Lisans:** CC BY 4.0. 242 betonarme bina, 2023 Kahramanmaraş; ACI 133 ekibinin saha verisi.
- **Alanlar:** yaş, kat, kritik kat kolon/perde/dolgu duvar alanları, hasar (5 sınıf N/L/M/S/C, 3 sınıf, kritik
  hasar), kısa kolon (Y/N), yumuşak kat (Y/N), Hassan–Sozen öncelik indeksi, koordinat, Vs30, bina konumunda
  gözlenen yer hareketi (Kriging + ShakeMap).
- **Olmayan RYTEİE girdileri:** görünen kalite, ağır çıkma, düşeyde/planda düzensizlik, nizam, eğim → 0 kabul;
  ölçülen şey **kısmi** puan (kat + tehlike + sistem + yumuşak kat + kısa kolon).

### Sonuç (2026-09-30, `aci133_analiz.py`, `sonuc-aci133.csv`)
Kapsam (1–7 kat) 154 bina; hedef "ağır hasar ve üstü" (3 sınıflı S) 100/154.

| Skor | AUC |
| --- | --- |
| RYTEİE kısmi PP, tehlike ESHM20 ham / ÷0,89 / ÷0,72 | 0,691 / 0,697 / 0,695 |
| RYTEİE kısmi PP, perde tanımı duyarlılığı (min duvar indeksi > 0 … 0,2 %) | 0,707 – 0,724 |
| Yalnız kat sayısı | 0,700 |
| Yalnız yaş | 0,595 |
| Yalnız yumuşak kat | 0,569 (ağır hasar: yumuşak katlı %82, diğerleri %61) |
| Hassan–Sozen PI (kolon/duvar ölçümü ister) | 0,760 |
| Gözlenen PGA (yöntem dışı) | 0,549 |

Kritik hasar hedefi (45/154): RYTEİE 0,615, Hassan–Sozen 0,672. Göçme (4/154) yorumlanamaz.

**Okuma:**
- Veri var ve ölçüm yapılabiliyor → S3'ün sorusu **evet**. "Ölçülmüş isabet" iddiası kurulabilir.
- Ama bu sette RYTEİE kısmi puanı kat sayısından fazlasını söylemiyor (0,70 ≈ 0,70). Nedenleri: binaların
  118/154'ü 6–7 katlı, 148/154'ü tehlike bölgesi I (tehlike terimi test edilemedi), 8 kusurun 5'i veride yok.
- Örneklem yanlı (%65 ağır hasar; hasar keşfi için seçilmiş) → sayı mutlak isabet değil, sıralama gücü.
- Kıyas: literatürde yaş+kat+PGA+Vs30 topluluk modeli AUC 0,81 (Nurdağı/İslahiye, 7.292 bina, farklı set).

## Aday 3+ — kaydedildi, kullanılmadı
Yilmaz vd. 2024 (2,15 M bina; portal URL'si bulunamadı, Bakanlık izni), Pollalis 1999 Düzce/Bolu (1.127 bina,
CC BY-NC-SA, yıl/sistem yok), Elazığ ve İzmir 2020 (kamuya açık değil). Ayrıntı: `docs/arastirma/07`.
