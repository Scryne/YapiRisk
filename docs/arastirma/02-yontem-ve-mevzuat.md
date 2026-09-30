---
proje: YapiRisk
created: 2026-09-29
type: arastirma
---
# Puanlama yöntemleri, yapım yılı eşikleri, 6306 mevzuatı, doğrulama verisi

> Ham araştırma raporu (2026-09-29, web araştırması alt ajanı). Bulgular "doğrulandı / dolaylı / doğrulanmadı" diye işaretli; öneri bölümleri yorumdur. Özet ve kararlar: `docs/Proje-Fikri.md`.

**Not:** Birçok PDF kaynak araç tarafından okunamadı, çünkü içerik ikili/sıkıştırılmış geldi. `webdosya.csb.gov.tr` ve `altyapi.csb.gov.tr` sertifika ya da DNS hatası verdi. MDPI, ResearchGate ve ASCE 403 döndü. Bu yüzden Sucuoğlu–Yazgan modifikatör tablosu, P25 formülü ve RYTEİE'nin tam metni birebir çıkarılamadı. Aşağıda "doğrulanmadı" diye işaretlediğim her yer kaynağa erişilemeyen yerdir.

## 1. Cevap
Vatandaş formuyla toplanabilen, yayımlanmış ve kalibre edilmiş tek yöntem ailesi Sucuoğlu–Yazgan(–Yakut) sokaktan tarama yöntemidir. Yapısı FEMA P-154'e benzer: taban puan ve gözlenebilir eksik puanları. RYTEİE 2019 puanlamalı bir ön tarama değil, analiz tabanlı bir tespit yöntemidir. Yasal olarak "riskli yapı tespiti"ni yalnızca Bakanlıkça lisanslı kuruluşlar yapabilir. Yazılım "ön değerlendirme / farkındalık" dilinde kalmalıdır. İBB'nin kendi ön değerlendirmesi de "6306 kapsamında değildir, kesin nitelik arz etmez" der.

## 2. Bulgular

### 2.1 Türkiye yöntemleri

**Sucuoğlu–Yazgan sokaktan tarama**
- **Kapsam:** 1–7 katlı betonarme binalar için iki kademeli yöntemdir. Kademe 1 sokaktan gözleme dayanır. Kademe 2 bodrum ve zemin kat verisi ister. Kaynak: [Springer bölümü, 2003](https://link.springer.com/chapter/10.1007/978-94-010-0021-5_7) (yalnızca arama özeti okundu). Bir ikincil kaynak yöntemin 1999 Düzce depremi sonrası yapılan saha çalışmalarındaki verilerle geliştirildiğini belirtir.
- **Girdiler:** Kat sayısı, yumuşak kat, ağır çıkma, görünen kalite (iyi=0, orta=1, kötü=2), kısa kolon, çarpışma, topografik etki. Kaynak: [Kuet 2026 bildirisi](https://iccesd.kuet.ac.bd/2026/Papers/644.pdf) ve arama özetleri, ikincil.
- **Formül:** PS = BS − Σ(VSM × VS), yani taban puan eksi ceza puanlarıdır. Bir Türkçe kaynakta aynı yapı PP = TP + ΣOPi + YSP olarak yazılmıştır. Kaynak: arama özetleri, ikincil.
- **Taban puan (BS), PGV bölgesine ve kat sayısına göre.** Yalnızca bir arama özetinde görüldü, birincil kaynaktan doğrulanmadı:

| Kat | Bölge I (PGV 60–80) | Bölge II (40–60) | Bölge III (20–40) |
|---|---|---|---|
| 1–2 | 100 | 130 | 150 |
| 3 | 90 | 120 | 140 |
| 4 | 75 | 100 | 120 |
| 5 | 65 | 85 | 100 |
| 6–7 | 60 | 80 | 90 |

- **Ceza tablosu:** Kat sayısına göre değişir. Sadece kırıntılar görüldü: 3 kat için yumuşak kat −10 ve kısa kolon −5; 4 kat için yumuşak kat −15. Kalan değerler doğrulanmadı ve güvenilir değil. **Tam tabloyu birincil yayından çekmek gerekir:** Sucuoğlu, Yazgan, Yakut, "A Screening Procedure for Seismic Risk Assessment in Urban Building Stocks", Earthquake Spectra 23(2), 2007 ([ADS](https://ui.adsabs.harvard.edu/abs/2007EarSp..23..441S/abstract)).
- **Risk eşikleri:** Bir kaynakta PS<30 yüksek, 30–70 orta, 70–100 düşük risk geçer. Bu, Sucuoğlu'nun orijinal eşiği olmayabilir; doğrulanmadı.
- **Kalibrasyon verisi:** 1999 Kocaeli ve Düzce hasar veritabanı, yaklaşık 454–500 bina (kaynaklar 454 ve 477 diyor). Kaynak: [Springer/ADS arama sonuçları](https://link.springer.com/article/10.1007/s11069-007-9187-1).
- **Vatandaş formu için uygunluk:** Yüksek. Ölçüm yok, gözlem var. Ancak yumuşak kat, ağır çıkma ve kısa kolonu eğitimsiz kullanıcı yanlış işaretler. Görsel yardım şarttır.
- **PGA/TBDY uyarlaması var:** Işık, Ulu, Aydın, "A case study on the updates of Turkish RVS methods for RC buildings". Eski yöntemde il bazında puan aynıydı; TBDY-2018 ve "PDRB-2019" ile PGA arttıkça puan düşüyor. Kaynak: [Dergipark](https://dergipark.org.tr/en/pub/beuscitech/issue/66323/1024140). "PDRB-2019"un açılımını doğrulayamadım, tahmin etmedim. Bu makalenin tam metnini okumak gerekir; PGA/SDS tabanlı taban puan formülü orada olmalı.

**RYTEİE 2019 (Ek-2, Resmî Gazete 30688, 16.02.2019)**
- Tarih doğrulandı. Kaynak: [sanalsantiye özeti](https://www.sanalsantiye.com/riskli-binalarin-tespitine-iliskin-esaslar/), ikincil. Metinde "birinci aşama / ön değerlendirme / hızlı tarama" başlığı görünmüyor. İçerik TBDY-2018 spektral ivmeleri, zemin, karot (en az 6) ve yığma inceleme.
- Betonarme kriter: kat bazında göreli ötelenme ve m oranı tabloları, eksenel gerilme (0,65 fcm) ve kesme oranı. Kaynak: [ideCAD yardım](https://help.idecad.com.tr/ideCAD/riskli-betonarme-binanin-belirlenmesi-ryteie-4-4), ikincil.
- Hedef performans: "can güvenliği" ile "göçme öncesi" arası, göçme öncesine yakın. Kaynak: arama özeti, ikincil.
- Puanlı ön tarama bölümü yok gibi görünüyor, ama tam metni okuyamadım. **Doğrulama önerisi:** Ek-2 PDF'ini elle açıp "ön değerlendirme" ifadesini aratın.
- Ayrı bir belge: ÇŞB "Hızlı Deprem Güvenliği Değerlendirme Yöntemleri" (Mayıs 2026, Kamu Binalarında Deprem Dayanımı programı). Yöntemleri karşılaştırdığı anlaşılıyor. Sertifika hatası yüzünden okunamadı. Bu, 2026 tarihli en güncel resmi kaynak olabilir: [PDF](https://webdosya.csb.gov.tr/v2/kamuguclendirme/2026/05/H-zl-De-erlendirme-Yontemleri-20260513143255.pdf). **Elle okunmasını öneririm.**

**İBB Hızlı Tarama**
- Kapsam: 2000 öncesi konut; betonarme en fazla 10 kat, yükseklik en fazla 30 m; yığma en fazla 5 kat. Ekip röleve çıkarır, beton çekici ve donatı korozyonu ölçer, karot almaz. Çıktı A–E deprem güvenlik puanıdır (A ≥100, B 75–100, C 50–75, D 25–50, E 0–25).
- Yasal statü: "Ön değerlendirmedir, kesin nitelik arz etmemektedir, 6306 kapsamında değildir." Kaynak (birincil, İBB): [SSS](https://binatespiti.ibb.istanbul/sikcasorulansorular/), [proje bilgisi](https://binatespiti.ibb.istanbul/projebilgisi/).
- Proje sayfası, 2003 İstanbul Deprem Master Planı'ndaki "ikinci aşama" yöntemine dayandığını söyler. Temmuz 2020'den beri 39.000'den fazla bina incelenmiş.
- Boğaziçi/Kandilli bağlantısı doğrulanamadı; İBB "akademisyenlerle birlikte" der.
- Vatandaş formu için uygun değil, ölçüm gerekir.

**P25 (Bal, Gülay, Tezcan)**
- Kolon, perde ve dolgu duvar alanlarıyla kat sayısı, düzensizlik, malzeme ve zemin girdilerini kullanır. Sonuç "P" puanıdır; 25 ve altı göçme riski olarak tanımlanır.
- 311 hasarlı binayla kalibre edilmiş. Adana-Ceyhan, Bingöl, Düzce ve Marmara verileri, mahkeme arşivlerinden. Yüzde 90 doğruluk iddiası geliştiricilerindir, bağımsız doğrulanmadı. Üç kişilik ekip gerekir. Kaynak: [TÜBİTAK haberi, 11.04.2014](https://tubitak.gov.tr/tr/haber/p25-yontemiyle-binalarin-depreme-dayanikliligi-olculecek).
- Formül alınamadı. Vatandaş formu için uygun değil.

**Hassan–Sozen öncelik indeksi**
- CI = kolon kesit alanı toplamının yarısı ÷ kritik kat üstündeki toplam döşeme alanı. WI = betonarme perde alanı + dolgu duvar alanının 1/10'u, aynı paydaya bölünür. PI = CI + WI. Hassan ve Sozen (1997) minimum CI+WI için %0,25 önermiştir. Kaynak: arama özeti, ikincil.
- WI, PI'dan daha ayırt edici bulunmuş. Vatandaş formu için uygun değil, ölçüm gerekir.

**Özcebe, Sucuoğlu, Yücemen, Yakut, Kubin (Zeytinburnu)**
- Birkaç bin bina için çok kademeli değerlendirmedir. Sokak taraması sonuçları, NATO SfP projesinde geliştirilen ayırım analiziyle tutarlı çıkmış. Kaynak: [TEDU AVESİS kaydı](https://avesis.tedu.edu.tr/yayin/4500a208-55b1-421f-ac9a-ad030332c318/seismic-risk-assessment-of-existing-building-stock-in-istanbul-a-pilot-application-in-zeytinburnu-district), 8NCEE 2006. Puan tablosu alınamadı.

### 2.2 Uluslararası
- **FEMA P-154 (3. baskı, Ocak 2015):** Final skor S, taban skor ve modifikatörlerden oluşur. Tümü rare şiddetli sarsıntıda (MCER) göçme olasılığıyla ilişkilidir. Önerilen kesme skoru S=2,0'dır. Skorlar tipik olarak 0–7 arasındadır. Level 1 formu ve isteğe bağlı Level 2 vardır. Kaynak: [FEMA P-155](https://www.fema.gov/sites/default/files/2020-07/fema_earthquakes_rapid-visual-screening-of-buildings-for-potential-seismic-hazards-supporting-documentation-third-edition-fema-p-155.pdf) (arama alıntısı, tam PDF okunamadı).
  - Sokaktan tarama sınırı: gizli kusurlar görünmez ve tehlikeli sanılan bina yeterli çıkabilir. Kaynak: FEMA 154 metni (arama özeti).
  - C1 taban skoru için yalnızca doğrulanmamış bir özet var (yüksek 2,1; çok yüksek 1,5); tabloyu kullanmayın, PDF'ten alın. Bir cusec.org özetinde "kesme skoru 2,5" yazıyordu; birincil kaynakla çeliştiği için reddettim.
- **Japonya Is:** Is = E0 × SD × T. SD 0,4–1,0 (düzensizlik), T 0,5–1,0 (yaşlanma/hasar). Birinci düzey Es=0,8, ikinci düzey 0,6. Hyogoken-Nanbu sonrası 0,6 sınır kabul edilmiş. Kaynak: [iisee.kenken.go.jp](https://iisee.kenken.go.jp/syndb/data/20181119e18da446.pdf) (arama özeti). Kolon/duvar alanı ve dayanım hesabı gerektirir, formdan toplanamaz.
- **EMS-98:** A–F kırılganlık sınıfı. Betonarme genelde C, yeni yapılar için D. Kaynak: [ICGC](http://www.icgc.cat/en/European-Macroseismic-Scale-1998-EMS-98). Yapım yılı bandına bağlı kırılganlık sınıfı için en basit şemadır.
- **Kırılganlık eğrileri:**
  - Erberik (2008), Engineering Structures 30(5):1360–1374: Düzce hasar veritabanından düşük ve orta katlı betonarme çerçeve eğrileri. PGA mı spektral ivme mi olduğu doğrulanamadı. Kaynak: [METU AVESİS](https://avesis.metu.edu.tr/yayin/c02140b1-48aa-4c24-bfd8-332e05a21554/fragility-based-assessment-of-typical-mid-rise-and-low-rise-rc-buildings-in-turkey).
  - ESRM20 (GEM), 44 ülke, 200'den fazla bina sınıfı, OpenQuake ile açık: [ESRM20](https://repositorio-aberto.up.pt/bitstream/10216/133845/2/387873.pdf).
  - HAZUS: kümülatif lognormal, dört hasar durumu (Slight, Moderate, Extensive, Complete). Kaynak: [HAZUS 6.1 kılavuzu](https://www.fema.gov/sites/default/files/documents/fema_hazus-earthquake-model-technical-manual-6-1.pdf). ABD kodlarına göre kalibredir.
  - Kahramanmaraş sonrası deneysel eğriler de yayımlanmış, örneğin [Springer, 2026](https://link.springer.com/article/10.1007/s10518-026-02689-1).

### 2.3 Yapım yılı eşikleri
- **Yönetmelik tarihleri (birincil):** TBDY-2018 18.03.2018'de yayımlandı, 01.01.2019'da yürürlüğe girdi ([AFAD](https://www.afad.gov.tr/turkiye-bina-deprem-yonetmeligi)). DBYBHY 06.03.2007'de yayımlandı ve 31.12.2018'de yürürlükten kalktı. ABYYHY 1975 ve 1998 (1997/98) ikincil kaynaktan ([Yapı dergisi](https://yapidergisi.com/deprem-yonetmeliklerinin-tarihcesi-ve-mevcut-durum/)).
  - 1975: ayrıntılı süneklik gereklilikleri. 1998: süneklik zorunlu. 2007: mevcut bina değerlendirme bölümü.
  - Bir çalışmada 1975, 1997 ve 2007 kodlarındaki binaların sırasıyla %41, %51 ve %48'inde en az beton dayanımı yönetmelik sınırının altında kalmış; yani yönetmelik yılı tek başına uygulama kalitesini garanti etmez.
- **2023 hasar verisi:**
  - Kahramanmaraş dördüncü gün itibarıyla 1.712.182 binada hasar tespiti yapılmış. Ölçek: ~35.355 yıkık, 179.786 ağır hasarlı. Kaynak: ikincil arama özeti.
  - RC binalarda hasar eski yönetmeliklerden yenisine doğru belirgin azalıyor; TEC-1975'te en fazla, TBEC-2018'de en az. Ancak yeni binalar da yıkıldı: 1998–2007, 2007–2018 ve 2018–2023 dönemlerinde sırasıyla 822, 189 ve 100 RC bina, tasarım talebi/kapasite oranı 1'in üzerinde olmasına rağmen çöktü. Kaynak: arama özeti ([Damage observations, Springer](https://link.springer.com/article/10.1007/s10518-023-01843-3)), tam metin okunamadı.
  - Prof. Alper İlki: 2000 öncesi binaların %1'i yıkılmışken 2000 sonrasında oran binde 2. Kaynak: [Şantiye dergisi, Tem-Ağu 2024](https://www.santiye.com.tr/10-soruda-muhendislik-acisindan-6-subat-depremlerinin-ogrettikleri-6339.html), röportaj, ikincil.
  - Etkilenen 10 ilde hanelerin %51,1'i 2001 sonrası binada oturuyordu (TÜİK, aktaran [Euronews, 10.02.2023](https://tr.euronews.com/2023/02/10/deprem-bolgesinde-halkin-yuzde-51i-2001-sonrasinda-yapilan-binalarda-oturuyordu)).
- **Basit "1998 öncesi" kuralının gücü** (Scientific Reports 2026, ÇŞİDB verisi, Nurdağı ve İslahiye, 7.292 RC bina): Kural %61,5 özgüllüğe ulaşıyor ama 523 güvensiz binanın 289'unu kaçırıyor. Yapım yılı, kat sayısı, PGA, tasarım spektral ivmesi ve VS30 kullanan topluluk modeli ise geri çağırma %88,9, özgüllük %52,8, doğruluk %65,7, AUC 0,81. Kaynak: [PMC13358062](https://pmc.ncbi.nlm.nih.gov/articles/PMC13358062/) (ham veri kamuya açık değil).

### 2.4 Mevzuat
- **6306 md.2 ("riskli yapı") ve md.3:** "Ekonomik ömrünü tamamlamış olan ya da yıkılma veya ağır hasar görme riski taşıdığı ilmî ve teknik verilere dayanılarak tespit edilen yapı". Tespit, "yapı malikleri veya kanuni temsilcileri tarafından, Başkanlıkça lisanslandırılan kurum ve kuruluşlara yaptırılır." Kaynak: [Lexpera](https://www.lexpera.com.tr/mevzuat/kanunlar/afet-riski-altindaki-alanlarin-donusturulmesi-hakkinda-kanun-6306) (metin tarihi doğrulanmadı; Lexpera'daki 15.000 TL ceza tutarı güncel olmayabilir).
- **Kimler yapar:** Lisanslılar, 4708'e göre izin belgeli yapı denetim kuruluşları ve laboratuvar kuruluşlarıdır; her lisanslı kuruluşta en az bir inşaat mühendisi zorunludur. Ülke genelinde yetkilidirler. Kaynak: [ÇŞB Kentsel Dönüşüm Başkanlığı](https://altyapi.csb.gov.tr/riskli-yapi-tespiti-ile-ilgili-kuruluslar) (arama özeti).
  - Başka bir arama özeti bazı kamu kurumları, üniversiteler ve kamu payı en az %40 olan şirketleri de sayar. Bu ikincil kaynağı doğrulayamadım.
- **Başvuru ve itiraz:** Tek bir maliğin başvurusu yeter, masraf maliklere aittir. İtirazı yedi üyeli teknik heyet inceler. Kaynak: [İBB SSS](https://kentseldonusum.ibb.istanbul/sikca-sorulan-sorular/), [ÇŞB arama özeti](https://altyapi.csb.gov.tr/riskli-yapi-sureci-i-104285).
- **Benzer araçların feragatnameleri:**
  - İBB: "Ön değerlendirmedir, 6306 kapsamında değildir."
  - DEPREMBİS: "Sonuçlar kesinlik içermez, yalnızca bilgilendirme ve öngörü amaçlıdır" ve KVKK (6698) atfı. Kaynak: [deprembis.com.tr](https://deprembis.com.tr/v2/).
  - DepremRiskim (Başarsoft) sayfasında açık bir yasal feragat bulunmadı. Kaynak: [Başarsoft](https://www.basarsoft.com.tr/deprem-risk-analizi-ile-binanizi-test-edin/).
- Kapsam dışı bıraktığım konular: KVKK'nin adres/bina verisine uygulanışı, tüketici hukuku ve mühendislik unvanı (6235) yorumu araştırılmadı.

### 2.5 Doğrulama verisi
| Veri | Durum | Kaynak |
|---|---|---|
| Yilmaz vd., 2024, "Regional Building Damage Survey Data on the 2023 Kahramanmaraş…" | 2.153.835 bina. Alanlar: taşıyıcı sistem, hasar durumu, kullanım, yapım yılı, kat sayısı, taban alanı, konum. Verinin bir kısmına web portal üzerinden erişilebiliyor. | [ASCE OPEN](https://ascelibrary.org/doi/10.1061/AOMJAH.AOENG-0041) (403; özetle arama sonucu) |
| Atasever vd., Gaziantep | ~1.700 bina, Harvard Dataverse, DOI 10.7910/DVN/OQCPWF | [Springer](https://link.springer.com/article/10.1007/s13369-025-10991-4) (arama özeti) |
| Liu, 2026 | Bina ayak izi ve uzaktan algılama hasar verileri (ARIA, UNOSAT, Microsoft), CC-BY-4.0. Yapım yılı/kat sayısı yok. | [Zenodo](https://zenodo.org/records/18437501) |
| StEER-EERI ve DesignSafe (PRJ-3824) | Saha gözlemleri | [arama sonucu](https://www.researchgate.net/publication/369754356_StEER-EERI_2023_Mw_78_Kahramanmaras_Turkiye_Earthquake_Sequence_Joint_Preliminary_Virtual_Reconnaissance_Report_PVRR) |
| Düzce/Kocaeli 1999 veri seti (~454–500 bina; Sucuoğlu, Erberik, Yakut) | Yayımlanmış, açık indirilebilir kopya bulunamadı | Springer/ADS |
| ÇŞİDB resmi hasar veritabanı | Ham veri kamuya açık değil | PMC13358062 |
| "DEPREMİN İZİNDEN" | Bulunamadı. Aradığım yerler: genel web araması, Türkçe haber ve açık veri sonuçları. | - |
| xBD | Bu görev için doğrulanmadı. Görüntü tabanlıdır, yapım yılı ve kat sayısı taşımaz; puanlama doğrulamasına uygun değil. | - |

Pratik doğrulama önerisi: Yilmaz portalından yıl, kat ve hasar dağılımını alıp ilk-düzey kuralın sınıf bazında hasar oranıyla uyumunu ölçmek. PGA'yı bina konumundan bağlamak ayrı bir iş.

## 3. Çelişkiler / belirsizlikler
- 2000 sonrası binaların payı: bir kaynakta yıkılan yapıların ~%10'u 2000 sonrası, başka bir arama özetinde ağır hasarlı/göçenlerin %3'ü. Paydalar farklı olabilir. Birincil kaynak bulunamadı.
- İlki'nin "%1 / binde 2" oranları yıkım oranıdır, ağır hasar değil, ve röportajdan geliyor.
- FEMA kesme skoru 2,0 (P-155 alıntısı) ile cusec özetindeki 2,5 çelişiyor; birincil kaynakla 2,0 kabul edildi.
- P25 için "%90 doğruluk" geliştirici iddiası. Bitlis uygulamasında 94 binanın %50'si risksiz, %46'sı detay, %4'ü göçme riskli çıktı ([Dergipark](https://dergipark.org.tr/tr/pub/baunfbed/issue/24792/261932)); bu doğrulama değil.
- Sucuoğlu ceza tablosu ve eşikleri: farklı kaynaklarda farklı varyantlar var, birincil kaynak okunamadı.
- Elazığ 2020'de 67 binayla karşılaştırma: Kanada yöntemi hasarı en iyi yansıtmış, FEMA RVS Sucuoğlu'ndan daha temkinli, RYTEİE sonuçları Sucuoğlu'nunkine yakın çıkmış. Küçük örnek, tek olay. Kaynak: [PAJES 2022](https://dergipark.org.tr/tr/pub/pajes/article/1136926).

## 4. Öneri (bulgudan ayrı)
1. **Ana iskelet:** FEMA P-154 mantığı (taban skor × düzeltici çarpanlar) ile Sucuoğlu–Yazgan gözlem parametrelerini birleştirin. Sucuoğlu'nun PGV bölgeli taban puanlarını doğrudan TDTH PGA'ya bağlamayın. Işık vd.'nin PGA tabanlı güncellemesini ve orijinal 2007 tablosunu okuyup yeniden kalibre edin.
2. **Yapım yılı:** 1975 / 1998 / 2007 / 2018 bantlarını EMS-98 tarzı kırılganlık sınıfı olarak kullanın. Yıl tek başına kalın bir filtre olsun, ama 2023'te yeni binalar da yıkıldığı için "güvenli" etiketi vermeyin.
3. **Vatandaş formu girdileri:** Yıl, kat sayısı, yumuşak kat, ağır çıkma, kısa kolon, görünen kalite, çarpışma, eğim; hepsi fotoğraflı açıklamalı ve "bilmiyorum" seçenekli. P25, Hassan–Sozen, Is ve İBB yöntemi ölçüm gerektirdiği için kapsam dışı; en fazla "mühendise başvur" yönlendirmesi olarak anılsın.
4. **Çıktı:** Sayısal "risk puanı" yerine 3–5 bantlı "ön değerlendirme öncelik sınıfı". Dil: "riskli / değil" yok; "profesyonel inceleme önceliği". Metin: "6306 kapsamında riskli yapı tespiti değildir; lisanslı kuruluşlara başvurulmalıdır", İBB feragatine paralel.
5. **Kalibrasyon:** Yilmaz portal verisi ve Gaziantep Dataverse setiyle AUC ve duyarlılık ölçün. Referans taban çizgisi: yaş kuralının kaçırma oranı (289/523 ≈ %55) ve 0,81 AUC.

**En büyük metodolojik riskler:**
- Yüzde 0,81 civarı AUC tavanı ve düşük özgüllük: çok yanlış alarm, yine de çok kaçırma. Bu bir öncelik aracıdır, hüküm aracı değil.
- Kullanıcı beyanı hatası, özellikle yumuşak kat/kısa kolon algısı.
- Zemin ve saha etkisi eksikliği: TDTH PGA/SS/S1 verir ama VS30/zemin sınıfı ve bölgesel etkiler (Nurdağı gibi) ayrı bir belirsizliktir.
- Kalibrasyon verisinin çoğu ham halde kapalı; ÇŞİDB verisi kamuya açık değil.
- Etiket riski: "risk puanı" ifadesi, kullanıcı tarafından tespit olarak okunabilir.

Sonraki adım: Sucuoğlu 2007 Earthquake Spectra makalesinin tablolarını ve ÇŞB Mayıs 2026 belgesini elle açıp doğrulayın.
