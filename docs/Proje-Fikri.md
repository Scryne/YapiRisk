---
proje: YapiRisk
created: 2026-09-29
type: proje-fikri
status: taslak
---
# YapiRisk — Proje Fikri

**Köken:** Fikir 2026-09-29'daki İP konu seçimi oturumunda Aria'dan çıktı ("Bina Deprem Riski Ön
Değerlendirme", GES teklif aracının yedeği olarak). Scryne okul projesine almadı, kişisel proje olarak
yapıyor. Orijinal tarif: konum işaretlenir → AFAD tehlike haritasından değer çekilir → bina yaşı, kat,
yapı türüyle birleşip standart bir yöntemle risk puanı çıkar. O gün açık kalan soru: "AFAD verisi
sorgulanabilir mi?" Cevap aşağıda: **hayır, otomatik olarak değil.**

Araştırma (2026-09-29, dört kol) ham haliyle `docs/arastirma/` altında; kaynak URL'leri orada.

## Problem

Türkiye'de bir binanın deprem riskini öğrenmenin resmî yolu, lisanslı kuruluşa riskli yapı tespiti
yaptırmak: 23.000–100.000 TL, haftalar sürer, sonucu yıkım sürecini başlatabilir. Maliklerin çoğu bu
yüzden hiç başlamıyor. Arada, "binam öncelikli mi, profesyonele gitmeli miyim?" sorusuna kaynaklı ve
dürüst cevap veren bir ön değerlendirme katmanı işe yarar.

Bu katman boş değil (bkz. Rakipler), ama mevcut araçların ortak zaafları var: yöntemleri kapalı ya da
ABD'nin FEMA-154'ünden uyarlanmış, TBDY-2018 tehlike değerlerine kalibre değil, isabetleri gerçek
hasar verisiyle ölçülüp yayımlanmamış. En yaygın bireysel araç (Başarsoft DepremRiskim) iOS'ta 3,0/5,
2023'ten beri güncellenmemiş.

Manisa bağlamı: Akhisar 2020 (305 ağır hasarlı yapı), Sındırgı 2025 (Manisa'da 105 bina ağır
hasarlı/yıkık). 15 Eylül 2026 Manisa İRAP çalıştayı: incelenen ~15 bin yapının %38'i yüksek riskli,
Şehzadeler'de ~%60. TMMOB İMO Manisa (Ağu 2026): şeffaf, güncel bir yapı stoku envanteri yok.

## Hedef Kullanıcı

- **v1: birey.** Kendi oturduğu, alacağı ya da kiralayacağı binayı merak eden malik/kiracı. Ücretsiz.
- **v2: B2B ön eleme.** Emlak değerleme ofisleri, kentsel dönüşüm firmaları, emlakçılar: onlarca
  adresi "profesyonel inceleme önceliği"ne göre sıralamak. Araştırmadaki tek gerçek boşluk bu (toplu
  giriş; TDTH'de API yok, her adres tek tek e-Devlet sorgusu). **Talep kanıtsız**; v1 sonrası Manisa/Ege'de
  3–5 ofisle görüşülerek ölçülür. Talep çıkmazsa v2 yapılmaz.

## Araştırmanın fikri değiştirdiği yerler

| Orijinal varsayım | Bulgu | Karar önerisi |
| --- | --- | --- |
| Tehlike değeri AFAD TDTH'den otomatik çekilir | TDTH'de API, WMS ya da indirilebilir grid yok; e-Devlet girişi zorunlu. Otomasyonu e-Devlet kimlik doğrulamasını aşmak demek | Otomatik değer: **ESHM20** (EFEHR REST API, CC BY 4.0). Resmî değer: kullanıcı TDTH'den okuduğu PGA'yı isterse elle girer, rapor ikisini ayırır. EFEHR 30.09.2026'da yeni platforma geçiyor, spike S1 |
| Bina yaşı/kat otomatik gelebilir | TKGM otomatik sorguyu ve ticari kullanımı yasaklıyor; OSM'de `start_date` Türkiye'de 666 bina, `building:levels` ~%3 | Yaş ve kat **kullanıcıdan**. Ayak izi (haritada bina seçimi) Microsoft GlobalMLBuildingFootprints'ten (Türkiye 5,8 M, CDLA Permissive 2.0) |
| "Standart bir yöntem" var | **Var ve resmî: RYTEİE 2019 Ek-A** (09-30, ÇŞB 2025 "Hızlı Deprem Güvenliği Değerlendirme Yöntemleri" belgesinden; `docs/arastirma/05`). Dışarıdan gözlenebilen 8 olumsuzluk parametresi + kat sayısı + yapısal sistem, taban puanı doğrudan **TBDY SDS + zemin sınıfı**na bağlı, tüm tablolar elde. Yönetmelik kaydı: bölgesel önceliklendirme içindir, "tekil binada risk değerlendirme amaçlı kullanılamaz". Sucuoğlu–Yazgan–Yakut tabloları da elde (tehlikeden bağımsız, 3–6 kat) | K-4: temel RYTEİE Ek-A, çapraz kontrol Sucuoğlu–Yazgan–Yakut. Işık vd. uyarlamasına gerek kalmadı |
| Çıktı "risk puanı" | 6306'ya göre riskli yapı tespitini yalnız lisanslı kuruluş yapar. İBB bile kendi aracına "ön değerlendirmedir, 6306 kapsamında değildir" yazıyor. En iyi bilinen model bile AUC ~0,81 | Çıktı sayısal hüküm değil, **3–5 bantlı "profesyonel inceleme önceliği"**; "riskli/güvenli" kelimesi yok. Yeni bina bile "güvenli" etiketi almaz (2023'te 2018 sonrası 100 RC bina çöktü) |
| ML/yapay zekâ farkı | Etiket (gözlenmiş hasar) tek depreme bağlı; kullanıcı 38 özellik bilmez; "yapay zekâ ile bina riski" iddiası zaten dolu (BEUN, Bursa, StructurAI+) | v1 **kural tabanlı**, her kalemin katkısı raporda görünür. ML yalnız doğrulama tarafında kıyas olarak |

**LLM/TypeSafe notu:** Puanlama hesap ve kuraldır, kodun işi. Hasar tahmini "dünyanın ne yapacağı"
sorusudur; Jev'in zayıf olduğu eksen (ScryneQuant K-074…077). v1'de LLM yok.

## Fark (neden mevcut araçlardan farklı)

1. **Açık yöntem:** hangi makalenin hangi tablosu, her girdinin puana katkısı raporda.
2. **TBDY-2018'e bağlı tehlike:** taban puan konumun SDS'i ve zemin sınıfından (RYTEİE Ek-A), il bazında sabit değil.
3. **Ölçülmüş isabet:** skor 2023 Kahramanmaraş hasar verisine karşı geriye dönük test edilir, sonuç
   (duyarlılık/özgüllük, kaçırılan oran) sitede yayımlanır. Rakiplerin hiçbiri bunu yapmıyor.
4. **Dürüst çerçeve:** "profesyonel inceleme önceliği", lisanslı kuruluşa yönlendirme, "bilmiyorum"
   seçeneği belirsizliği büyütür, gizlemez.
5. **Görsel yardımlı form:** yumuşak kat, ağır çıkma, kısa kolon gibi kalemler çizim/fotoğraf
   örnekleriyle sorulur (eğitimsiz kullanıcının en büyük hata kaynağı).

## v1: Kapsam ve "Bitti" Tanımı
<!-- 2026-09 denetimi: büyük kapsamla başlayan projeler (AEGIS, FabrikaOS v2) yarım kaldı;
     "testler yeşil" çoğu projede "ürün çalışıyor" demek değildi. Bu bölüm denetimde kapanır. -->
- **Süre tavanı:** v1 en fazla ~4 haftalık iş. Sığmıyorsa v1 küçülür, gerisi v2'ye gider.
- **Bitti = kullanıldı (taslak):** Scryne ve en az 5 gerçek kişi Manisa'daki kendi binalarını
  değerlendirip PDF rapor aldı; **ve** skor 2023 hasar verisine karşı ölçüldü, sonuç raporda ve sitede
  yazıyor. Testlerin yeşil olması bu cümlenin yerine geçmez.
- **Temel özellikler:**
  1. Haritada bina seçimi + adres arama (ayak izi katmanı, Manisa ili).
  2. Konum tehlike değeri: önceden hesaplanmış ESHM20 grid'inden (sürümlü statik dosya) + isteğe
     bağlı elle TDTH PGA girişi; zemin sınıfı kullanıcı beyanı ya da "bilmiyorum" (USGS Vs30 yalnız ipucu).
  3. Görsel yardımlı bina formu: yapım yılı, kat, taşıyıcı sistem, yumuşak kat, ağır çıkma, kısa
     kolon, görünen kalite, bitişik nizam/çarpışma, eğim. Her soruda "bilmiyorum".
  4. Puanlama motoru: RYTEİE 2019 Ek-A (K-4) + Sucuoğlu–Yazgan–Yakut çapraz kontrolü; saf fonksiyon,
     birim testli, yöntem tabloları veri dosyasında; çıktı öncelik bandı + kalem kalem katkı + belirsizlik
     notu ("bilmiyorum" cevapları puanı aralığa çevirir: en iyi–en kötü durum).
  5. Geriye dönük doğrulama betiği ve sonuç sayfası.
  6. Türkçe PDF rapor: girdiler, kaynaklar, feragat, lisanslı kuruluşa başvuru yolu.

## Kapsam Dışı

- Fotoğraftan özellik çıkarımı (v2 adayı; yalnız kullanıcının onayladığı öneri olarak, skoru kendisi
  belirlemez). Türk apartman fotoğrafında VLM doğruluğunu ölçen çalışma yok, ölçmeden girmez.
- Google Street View: önbellek/türetme/baskı kısıtları. Gerekirse Mapillary (CC BY-SA).
- B2B toplu giriş, API, ofis paneli (v2, talep testine bağlı).
- ML hasar modeli, "yapay zekâ ile risk" iddiası.
- TKGM/e-Devlet entegrasyonu, TDTH otomasyonu.
- Resmî tespit ya da "riskli/güvenli" hükmü.
- Mobil uygulama (web, telefonda iyi çalışan).

## Riskli Varsayımlar — finalize etmeden spike

| # | Varsayım | Spike | Tutmazsa |
| --- | --- | --- | --- |
| S1 | **Kapandı (09-30), yarı tuttu:** grid çekiliyor (Manisa 3 × 330 nokta, ~51 KB, <3 dk) ama ESHM20 TDTH'nin ortalama %11 altında, 10 noktanın 3'ünde RYTEİE bölgesi güvensiz yönde değişiyor → K-5. Ayrıntı `spike/S1/README.md`. ~~ESHM20 Türkiye koordinatında PGA döndürür, Manisa grid'i çekilebilir ve TDTH'ye yakındır~~ | 30.09 platform geçişinden sonra EFEHR API'den 10 Manisa noktası çek; aynı noktaları Scryne TDTH'den elle okusun; farkı ölç; Manisa sınırında grid çekim süresi ve dosya boyutunu ölç (K-2) | Tehlike yalnız elle TDTH girişi olur, ya da GEM (NC lisansı: ticari yol kapanır) |
| S2 | ~~Yöntem tabloları elde edilebilir~~ **büyük ölçüde kapandı (09-30):** ÇŞB belgesi indirildi, RYTEİE Ek-A ve Sucuoğlu–Yazgan–Yakut tabloları aktarıldı | Kalan: (a) Tablo 24'ün son satırı ve Tablo 26 sütun eşlemesi RYTEİE Resmî Gazete asıl metnine karşı; (b) SDS = Fs·SS için TBDY-2018 Tablo 2.1 zemin katsayıları (ZC satırı 09-30'da 10 TDTH raporuyla doğrulandı; ZA/ZB/ZD/ZE kaldı); (c) Coşkun–Aldemir–Şahmaran ceza tablosu asıl makaleden | (a) doğrulanamazsa belirsiz hücreler raporda işaretlenir |
| S3 | Doğrulama için yıl + kat + konum + hasar içeren erişilebilir veri var | Yilmaz vd. 2024 portalı (2,15 M bina) ve Gaziantep Dataverse setine (DOI 10.7910/DVN/OQCPWF) bak | "Ölçülmüş isabet" farkı düşer; yöntem doğrulaması literatür atfına iner |
| S4 | Manisa'da ayak izi + adres araması kullanılabilir isabette | 50 gerçek Manisa adresinde Photon/Nominatim + Microsoft ayak izi eşleşmesi | Akış "haritada bina tıkla"ya kurulur, adres ikincil olur |

Kıyas tabanı (literatür): 7.292 binalık Nurdağı/İslahiye çalışmasında yaş+kat+PGA+Vs30 topluluk modeli
AUC 0,81, recall %88,9, özgüllük %52,8; "1998 öncesi" kuralı güvensiz binaların %55'ini kaçırıyor.

## Rakipler (özet; tam tablo `docs/arastirma/03-pazar-ve-rakipler.md`)

| Araç | Ne yapar | Zaaf |
| --- | --- | --- |
| AFAD TDTH | Koordinat → PGA, zemin, fay | Bina bilgisi yok, API yok |
| İBB Depreme Yenilme | Konum+yıl+kat+düzensizlik → FEMA-154 tipi skor | İstanbul odaklı, yöntem kapalı |
| İBB Bina Tespiti | Saha ekibiyle A–E sınıfı | Yalnız İstanbul, aylarca bekleme |
| Başarsoft DepremRiskim | Harita + foto + FEMA-154 skor | 3,0/5, 2023'ten beri güncellenmiyor |
| BEUN Yapı Analiz | Fotoğraf + konum → YZ raporu | Doğrulama verisi yayımlanmamış |
| Manisa BB + CBÜ ücretsiz test | Saha taraması, 600 bin bağımsız bölüm hedefi | Sonuçlara bireysel erişim belirsiz |
| Cadastrum (eklenti) | İlan sitelerinde konum riski | Bina bazlı yapısal risk yok |

## Mevzuat ve Veri Koruma

- **6306:** Tespit yalnız lisanslı kuruluş (lisans harcı 2026'da 125.000 TL + KDV). Rapor dili: "6306
  kapsamında riskli yapı tespiti değildir; kesin sonuç için lisanslı kuruluşa başvurun."
- **KVKK:** Adres (ve v2'de fotoğraf) kişisel veri. v1'de hesap yok; girdiler tarayıcıda kalırsa
  sunucuda kişisel veri tutulmaz (tercih edilen). Tutulursa aydınlatma metni; VERBİS muafiyet eşiği
  (<50 çalışan, <100 M TL) altında ama diğer yükümlülükler geçerli.
- **Lisanslar:** ESHM20/EFSM20 CC BY 4.0 (atıf), Microsoft ayak izleri CDLA Permissive 2.0, OSM ODbL.
  Kullanılmaz: MTA Diri Fay (ticari yasak, yazılı izin), GEM haritası (NC), TKGM servisleri.

## Kararlar

| # | Karar (2026-09-30, Scryne yetki verdi, Aria karar verdi) | Gerekçe |
| --- | --- | --- |
| K-1 | **v1 sunucusuz: girdiler yalnız tarayıcıda** (localStorage). Hesap, kayıt, sunucu tarafı kişisel veri yok. Rapor tarayıcıda üretilir. | KVKK yükü sıfıra iner (adres sunucuya hiç gelmez), aydınlatma metni kısa kalır; statik site olarak bedava barınır, bakım ve güvenlik yüzeyi yok. 4 haftalık v1'e sığar. B2B (v2) sunucu isterse o zaman eklenir; v1'de ona hazırlık yapılmaz. |
| K-2 | **Tehlike değeri çalışma anında API'den değil, önceden hesaplanmış grid'den.** Bir derleme betiği ESHM20'yi EFEHR'den bölge için bir kez çeker, sürümlü statik dosyaya yazar (model sürümü + çekim tarihi raporda). | EFEHR bugün platform değiştiriyor, SLA yok, CORS bilinmiyor; kullanıcı isteğini üçüncü tarafa bağlamak kırılganlık. Grid tekrarlanabilir (aynı bina hep aynı değeri alır), çevrimdışı çalışır, adres dışarı sızmaz (K-1 ile tutarlı). |
| K-3 | **v1 coğrafi kapsamı: Manisa ili.** Yöntem ve kod bölgeden bağımsız yazılır; yeni il = yeni veri paketi (grid + ayak izi), kod değişmez. | "Bitti" cümlesi zaten Manisa'daki kullanıcılara bağlı; bağlam güçlü (Akhisar 2020, Sındırgı 2025, İRAP %38). Tüm Türkiye ayak izi 5,8 M bina (yüzlerce MB) ve ülke çapı grid spike'ı büyütür; Manisa'da ikisi de küçük ve S1/S4 tek ilde ölçülebilir. Genişleme v1 sonrası veri işi. |

| K-4 | **Temel yöntem RYTEİE 2019 Ek-A; Sucuoğlu–Yazgan–Yakut çapraz kontrol olarak raporda.** Yöntemin 100 eşiği kullanıcıya hüküm olarak gösterilmez; öncelik bantları PP dağılımı ve S3 doğrulamasıyla kalibre edilir. Rapor, yönetmeliğin "tekil binada kullanılamaz" kaydını açıkça yazar. | Resmî, Türkiye'ye özgü, TBDY SDS'ine bağlı ve tüm girdileri dışarıdan gözlenebilir: vatandaş formuna birebir uyar. Ama Manisa gibi bölge I/II'de kusursuz BA çerçeve bina bile TP ≤ 90 < 100 alır; eşik ayırt etmez, sıralama eder. ÇŞB belgesi de yöntemlerin Maraş verisiyle kalibre edilip doğruluk oranlarının ölçülmesini öneriyor: projenin farkı bu boşluğa oturuyor. |

| K-5 | **Tehlike değeri iki kademeli (S1 sonucu, spike'ın önceden yazılmış karar kuralına göre).** Varsayılan: ESHM20 grid'i + S1'de ölçülen belirsizlik bandı (gerçek SS ∈ SS_ESHM20 / [1,25 … 0,72]); bant iki RYTEİE bölgesine düşüyorsa puan aralık olarak verilir ve rapor **kötü durumu** öne koyar. Kullanıcı TDTH raporundaki SDS'i girerse bant kapanır, tek değer kullanılır; arayüz TDTH'ye adım adım yol gösterir. | ESHM20 ortalama %11 düşük ve 3/10 noktada bölgeyi güvensiz yönde kaydırıyor; ham haliyle kullanmak binayı olduğundan güvenli gösterir. TDTH otomatik alınamıyor. Bant, bilinen belirsizliği gizlemeden gösterir ("bilmiyorum" cevaplarıyla aynı mantık, K-4). TDTH ızgarasının yasal bir kaynağı bulunursa K-5 yeniden açılır. 09-30 araştırması (`docs/arastirma/06`): açık grid, API ya da OpenQuake paketi yok; GEM'in açık EMME14'ü TDTH değil (benzer sapma beklenir), EMME2 v2026 kısıtlı lisanslı; ideCAD'in çevrimdışı değerleri kendi türetmesi olabilir. Tek yasal yol AFAD'a CIMER/bilgi edinme başvurusu (sonucu belirsiz). |

## Açık Sorular

1. ~~ÇŞB belgesi resmî yöntem veriyor mu?~~ → Evet, K-4. Kalan doğrulamalar S2'de.
2. ~~Girdiler nerede durur?~~ → K-1.
3. ~~CORS/proxy mi grid mi?~~ → K-2.
4. Yayın: public repo + canlı site mi? (Kurallar: repo ve site kişisel veri taşımaz; `yayin-oncesi` kapısı.)
5. "Bitti" cümlesindeki 5 kişi kim olacak; B2B talep görüşmeleri v1 bittiğinde mi, paralel mi?
6. ~~Coğrafi kapsam?~~ → K-3.
7. AFAD'a CIMER üzerinden Manisa TDTH grid talebi yapılsın mı? (Dışarı giden resmî başvuru, Scryne'ın kararı; ücretsiz, cevap süresi yasal olarak kısa ama sonuç belirsiz. Olumlu dönerse K-5'teki bant kalkar.)
