---
proje: YapiRisk
created: 2026-09-29
modified: 2026-09-30
type: proje-fikri
status: denetlendi
---
# YapiRisk — Proje Fikri

**Köken:** Fikir 2026-09-29'daki İP konu seçimi oturumunda Aria'dan çıktı ("Bina Deprem Riski Ön
Değerlendirme", GES teklif aracının yedeği). Scryne okul projesine almadı, kişisel proje olarak yapıyor.
Orijinal tarif: konum işaretlenir → AFAD tehlike haritasından değer çekilir → bina bilgileriyle
birleşip standart bir yöntemle puan çıkar. Araştırma ve dört spike bu tarifin iki varsayımını değiştirdi
(AFAD verisi otomatik alınamıyor, "standart yöntem" resmî RYTEİE Ek-A çıktı).

Kaynaklar: `docs/arastirma/01–07` (ham araştırma), `spike/S1–S4` (ölçümler). Denetim: 2026-09-30.

## Problem

Türkiye'de bir binanın deprem riskini öğrenmenin resmî yolu lisanslı kuruluşa riskli yapı tespiti
yaptırmak: 23.000–100.000 TL, haftalar sürer, sonucu yıkım sürecini başlatabilir. Maliklerin çoğu bu yüzden
hiç başlamıyor. "Binam öncelikli mi, profesyonele gitmeli miyim?" sorusuna kaynaklı ve dürüst cevap veren
bir ön değerlendirme katmanı işe yarar.

Bu katman boş değil (bkz. Rakipler), ama mevcut araçların yöntemleri kapalı ya da FEMA-154 uyarlaması,
TBDY-2018 tehlike değerlerine bağlı değil, isabetleri ölçülüp yayımlanmamış. ÇŞB'nin kendi 2025 rehberi de
hızlı yöntemlerin Maraş verisiyle kalibre edilip doğruluk oranlarının ölçülmesini ve maliklerin web/mobil
uygulamayla veri girmesini öneriyor.

Manisa bağlamı: Akhisar 2020 (305 ağır hasarlı yapı), Sındırgı 2025 (Manisa'da 105 bina ağır hasarlı/yıkık),
Manisa İRAP (15.09.2026): incelenen ~15 bin yapının %38'i yüksek riskli, Şehzadeler'de ~%60.

## Hedef Kullanıcı

- **v1: birey.** Manisa'da oturduğu, alacağı ya da kiralayacağı betonarme binayı merak eden malik/kiracı. Ücretsiz.
- **v2 (koşullu): B2B ön eleme.** Değerleme ve kentsel dönüşüm ofisleri için toplu giriş. Talep kanıtsız;
  v1 bittikten sonra Manisa/Ege'de 3–5 ofisle görüşülür, talep çıkmazsa yapılmaz.

## Ne yapar (v1)

Kullanıcı mahallesini arar, haritada binasına tıklar, görsel yardımlı kısa bir formu doldurur. Araç RYTEİE
2019 Ek-A yöntemiyle performans puanını hesaplar ve **3 bantlı "profesyonel inceleme önceliği"** verir; her
girdinin puana katkısını, belirsizliği ve yöntemin ölçülmüş isabetini gösterir; kaynaklı bir rapor üretir ve
lisanslı kuruluşa başvuru yolunu anlatır. "Riskli/güvenli" hükmü vermez.

## Fark

1. **Resmî ve açık yöntem:** RYTEİE 2019 Ek-A, tabloları Resmî Gazete'den; her kalemin katkısı raporda.
2. **TBDY-2018'e bağlı tehlike:** taban puan konumun SDS'i ve zemin sınıfından, belirsizliği bantla gösterilir.
3. **Ölçülüp açıkça yazılmış isabet (K-6):** 2023 Maraş verisinde AUC ≈ 0,70, kat sayısının tek başına aynı
   gücü taşıdığı ve ölçülemeyen kusurlar dahil. Rakiplerin hiçbiri isabet yayımlamıyor.
4. **Dürüst çerçeve:** öncelik bandı, "bilmiyorum" belirsizliği büyütür, lisanslı kuruluşa yönlendirme.
5. **Görsel yardımlı form:** kusurlar yönetmeliğin kendi çizimleriyle (Şekil A.1) sorulur.

## v1: Kapsam ve "Bitti" Tanımı

- **Süre tavanı:** ~4 hafta (Faz 1 iskelet dahil). Tahmin: iskelet + CI 2 gün, harita + mahalle arama +
  ayak izi parçaları 4–5 gün, tehlike paketi + bant 2 gün, form + çizimler 4 gün, puan motoru + testler
  2 gün (spike'ta hazır), sonuç + rapor 3 gün, isabet sayfası 1 gün, gerçek kullanım 3–4 gün → ~22 iş günü.
- **Bitti = kullanıldı:** Scryne'ın seçtiği en az 5 kişi, Manisa'daki gerçek bir betonarme binayı **yardım
  almadan** değerlendirip rapor aldı ve "sonuç ne diyor" sorusuna doğru cevap verdi (bandın hüküm değil öncelik
  olduğunu anladı); bulgular roadmap'e işlendi. Testlerin yeşil olması bu cümlenin yerine geçmez.
- **Temel özellikler:**
  1. **Bina bulma (K-7):** Photon ile mahalle araması → harita → Microsoft ayak izine tıklama; ayak izi yoksa
     haritada nokta seçme.
  2. **Tehlike (K-2, K-5, K-9):** sürümlü ESHM20 ızgarasından SS + S1'de ölçülen belirsizlik bandı; kullanıcı
     TDTH raporundaki SDS'i isterse girer (arayüz adım adım anlatır), bant kapanır.
  3. **Form:** kat (serbest kat adedi), yapısal sistem (perde var mı), görünen kalite, yumuşak kat, düşeyde
     düzensizlik, ağır çıkma, planda düzensizlik, kısa kolon, yapı nizamı (bitişik: kat seviyesi aynı/farklı,
     orta/kenar), zemin eğimi, zemin sınıfı. Her soruda Şekil A.1 çizimi ve "bilmiyorum". Yapım yılı
     isteğe bağlı, **puana girmez** (K-10).
  4. **Puan motoru (K-4):** RYTEİE Ek-A saf fonksiyon, tablolar veri dosyasında, birim testli; "bilmiyorum"
     ve tehlike bandı puanı en iyi–en kötü aralığına çevirir.
  5. **Sonuç ve rapor:** 3 bant (kötü durum öne), kalem kalem katkı, belirsizlik, yöntem ve isabet notu,
     6306 feragati, lisanslı kuruluş yolu; tarayıcıdan yazdırılabilir/PDF.
  6. **Yöntem ve isabet sayfası:** RYTEİE açıklaması, S3 ölçümü (veri seti, n, AUC, sınırlar), veri kaynakları
     ve lisanslar.

## Kapsam Dışı (v1)

- **Yığma, çelik, prefabrik ve 8+ katlı binalar (K-8):** yöntem kapsamı dışında mesajı + lisanslı kuruluş yolu.
  Yığma (RYTEİE Ek-A.2.2, 1–5 kat) v1.1 adayı.
- **Sucuoğlu–Yazgan–Yakut çapraz kontrolü (K-4 revize):** yalnız 3–6 kat, tehlikeden bağımsız, test edilmedi;
  ikinci puan kullanıcıyı karıştırır.
- Kapı numarasıyla adres araması (S4: Manisa'da veri yok).
- Fotoğraftan özellik çıkarımı; Street View (lisans); ML hasar modeli, "yapay zekâ ile risk" iddiası.
- Hesap, sunucu, kişisel veri saklama (K-1); TKGM/e-Devlet entegrasyonu, TDTH otomasyonu.
- B2B toplu giriş/API (v2, koşullu); Manisa dışı iller (yeni veri paketi, kod değişmez); mobil uygulama.
- Resmî tespit ya da "riskli/güvenli" hükmü.

## Kararlar

Scryne 09-29'da yön kararlarını verdi (ad YapiRisk, önce bireysel sonra B2B), 09-30'da diğerleri için
"sen karar ver / tüm yetki sende" dedi.

| # | Karar | Gerekçe |
| --- | --- | --- |
| K-1 | **Sunucusuz statik site; girdiler yalnız tarayıcıda.** Hesap yok, rapor tarayıcıda üretilir. | Adres sunucuya hiç gelmez, KVKK yükü sıfıra iner; bedava barınır, güvenlik yüzeyi yok. v2 sunucu isterse o zaman. |
| K-2 | **Tehlike ızgarası önceden çekilip sürümlü statik dosya olur.** Model sürümü ve çekim tarihi raporda. | EFEHR'in SLA'sı yok; tekrarlanabilir, çevrimdışı, adres dışarı gitmez. S1: Manisa 3 × 330 nokta, ~51 KB, <3 dk. |
| K-3 | **v1 kapsamı Manisa ili.** Kod bölgeden bağımsız, yeni il = yeni veri paketi. **Revize (2026-09-30, Scryne):** yayından önce ikinci bir il paketi eklenir (Roadmap Faz 6.5); yalnız Manisa'yı gösteren public site konum ipucu olur. | Kullanıcılar ve bağlam Manisa'da; veri paketleri küçük (S1, S4). |
| K-4 | **Tek yöntem: RYTEİE 2019 Ek-A (betonarme).** Resmî metinde eşik yok (A.2.1.8, puanlar sıralanır); "PP < 100 riskli" yalnız ÇŞB/ARUP rehberinde → hüküm olarak gösterilmez. Rapor "tekil binada kullanılamaz" kaydını yazar. Denetimde Sucuoğlu–Yazgan–Yakut çıkarıldı. | Resmî, Türkiye'ye özgü, SDS'e bağlı, tüm girdiler dışarıdan gözlenebilir. Manisa'da (bölge I/II) kusursuz BA çerçeve bile TP ≤ 90 alır; eşik ayırmaz, sıralar. |
| K-5 | **Tehlike iki kademeli.** Varsayılan ESHM20 + S1 bandı (gerçek SS ∈ SS_ESHM20 / [1,25 … 0,72]; **2026-09-30 İzmir'deki 10 noktayla [1,34 … 0,72]**, güvensiz yön sınırı değişmedi); bant iki bölgeye düşerse puan aralık olur, kötü durum öne çıkar. TDTH SDS'i girilirse tek değer. | S1: ESHM20 TDTH'nin ort. %11 altında, 3/10 noktada bölge güvensiz yönde kayıyor. TDTH'nin yasal açık kaynağı yok (`arastirma/06`); tek yol CIMER (taslak `docs/cimer-dilekce-taslak.md`). |
| K-6 | **Fark "ölçülüp açıkça yazılmış isabet"; en fazla 3 bant.** Yumuşak kat formda en görünür soru. | S3: ACI-133'te kısmi RYTEİE AUC ≈ 0,70 = kat sayısı; 5 kusur ve tehlike terimi test edilemedi. 5 bant sahte hassasiyet olur. |
| K-7 | **Bina bulma: mahalle ara → harita → binaya tıkla.** (Finalizasyonda K-13: arama Photon yerine yerel OSM mahalle dizini.) Microsoft ayak izi z14 parçalı gzip (Manisa 474.953 bina, 15,3 MB). | S4: OSM'de il genelinde 779 kapı no, sokakların %8'i adlı; mahalle araması Photon 18/18. |
| K-8 | **v1 yalnız betonarme, 1–7 serbest kat.** Diğerleri "kapsam dışı" mesajı alır. | RYTEİE Ek-A betonarme yöntemi 1–7 kat içindir; yığma ayrı yöntem (v1.1). 4 haftaya sığdırmak. |
| K-9 | **Zemin sınıfı "bilmiyorum" → kötü durum:** bölge için ZC/ZD/ZE grubu, SDS için bu üçünden en büyük Fs. Taşıyıcı sistem "bilmiyorum" → BAÇ (resmî kural A.2.1.1). USGS Vs30 yalnız ipucu olarak gösterilir. | Çoğu kullanıcı zemini bilmez; bilinmeyen belirsizlik güvenli yöne değil öncelik yönüne çözülür, resmî metnin sistem kuralıyla aynı mantık. |
| K-10 | **Yapım yılı puana girmez; isteğe bağlı bilgi olarak yönetmelik dönemi notunu besler.** | RYTEİE yılı kullanmıyor; S3'te yaş tek başına AUC 0,595. Resmî yöntemi değiştirmek "resmî ve açık" farkını bozar. |
| K-11 | **Hedef yayın: public repo + statik site** (ör. GitHub Pages). Yayın anı `yayin-oncesi` kapısı ve Scryne'ın o anki onayıyla; repo ve site kişisel veri taşımaz, commit kimliği noreply. NC/ND lisanslı ham veri repoya girmez. | "Bitti" 5 kişinin kendi cihazından kullanmasını gerektiriyor; isabet sayfası kamuya açık olmalı. |

## Spike Sonuçları

| # | Soru | Sonuç | Karar |
| --- | --- | --- | --- |
| S1 | ESHM20, TDTH'nin yerini tutar mı? | Izgara çekiliyor; ama ort. %11 düşük, 3/10 bölge değişimi (güvensiz yön). ZC zemin katsayıları doğrulandı. | K-2, K-5 |
| S2 | Yöntem tabloları elde mi? | RYTEİE Ek-A A.1–A.4 Resmî Gazete'den doğrulandı; TBDY Fs/F1 tüm zeminler elde; Coşkun vd. Tablo 4 elde. | K-4, K-9 |
| S3 | İsabet ölçülebilir mi? | ACI-133 (242 BA, CC BY): kısmi puan AUC ≈ 0,70, kat sayısı da 0,70; Hassan–Sozen (ölçüm ister) 0,76. | K-6 |
| S4 | Kullanıcı binasını bulabilir mi? | Kapı no araması yok, mahalle araması var; ayak izi 474.953 bina, 15,3 MB parçalı. | K-7 |

Kıyas (literatür, farklı set): Nurdağı/İslahiye 7.292 binada yaş + kat + PGA + Vs30 topluluk modeli AUC 0,81.

## Rakipler (özet; tam tablo `docs/arastirma/03-pazar-ve-rakipler.md`)

| Araç | Ne yapar | Zaaf |
| --- | --- | --- |
| AFAD TDTH | Koordinat → SS, S1, PGA, SDS | Bina bilgisi yok, API yok |
| İBB Depreme Yenilme | Konum + yıl + kat + düzensizlik → FEMA-154 tipi skor | İstanbul odaklı, isabet yayımlanmamış |
| İBB Bina Tespiti | Saha ekibiyle A–E sınıfı (PERA) | Yalnız İstanbul, aylarca bekleme |
| Başarsoft DepremRiskim | Harita + foto + FEMA-154 skor | 3,0/5, 2023'ten beri güncellenmiyor |
| BEUN Yapı Analiz | Fotoğraf + konum → YZ raporu | Doğrulama verisi yayımlanmamış |
| Manisa BB + CBÜ ücretsiz test | Saha taraması | Sonuçlara bireysel erişim belirsiz |

## Mevzuat, Veri Koruma, Lisans

- **6306:** Tespit yalnız lisanslı kuruluş. Rapor dili: "6306 kapsamında riskli yapı tespiti değildir;
  RYTEİE Ek-A yöntemi bölgesel önceliklendirme içindir, tekil binada kesin sonuç vermez; lisanslı kuruluşa
  başvurun."
- **KVKK:** K-1 ile sunucuda kişisel veri yok. Photon'a giden mahalle araması ve harita parçası istekleri
  üçüncü tarafa gider (IP); aydınlatma notunda yazılır.
- **Lisanslar:** ESHM20 CC BY 4.0 (atıf), Microsoft ayak izleri CDLA Permissive 2.0, OSM/Photon ODbL (atıf),
  ACI-133 CC BY 4.0. Şekil A.1 çizimleri Resmî Gazete'de yayımlanmış mevzuat eki (FSEK md. 31 kapsamı, finalizasyonda
  teyit). Gaziantep seti (CC BY-NC-ND) yalnız yerel analiz. Kullanılmaz: MTA Diri Fay, GEM haritası (NC), TKGM.

## Açık Sorular

1. CIMER başvurusu (Scryne'ın kararı; taslak hazır). Olumlu dönerse K-5'teki bant kalkar.
2. ~~3 bandın PP sınırları~~ → K-12 (Final-Doküman).
3. ~~Şekil A.1 kullanım serbestliği~~ → K-14, FSEK md. 31 mevzuat metninden teyit edildi.

Finalizasyon kararları K-12…K-15 ve stack: `docs/Final-Dokuman.md`.
