// Formun soruları: metin, seçenekler ve Şekil A.1 çizimleri. Tanımlar RYTEİE Ek-A.2.1.1 maddelerinden ve Şekil A.1'den
// (ek s. 30, 32–33) sade dile çevrildi. Yığma soruları Ek-A.2.2.3 maddelerinden ve Şekil A.2'den (ek s. 35–38).
// Seçenek değerleri taslağa `oku`/`yaz` ile bağlanır.
import type { ComponentType } from 'react'
import type { Kusur } from '@/yontem/ryteie'
import type { YigmaAlani } from '@/yontem/yigma'
import * as C from './cizimler'
import type { Adim, Taslak } from './taslak'

export interface Secenek {
  deger: string
  etiket: string
  aciklama?: string
  cizim?: ComponentType
  /** Çizim yan yana birkaç örnekten oluşuyorsa kartın tüm genişliğini alır. */
  genisCizim?: boolean
}

export interface Ornek {
  cizim: ComponentType
  aciklama: string
}

export interface Soru {
  adim: Adim
  /** Özet listesinde ve ilerleme başlığında. */
  kisa: string
  soru: string
  ipucu: string
  secenekler: Secenek[]
  /** Seçeneklerin üstünde gösterilen açıklayıcı çizimler. */
  ornekler?: Ornek[]
  /** Seçenekler kısa etiketse (kat) sık ızgara. */
  izgara?: boolean
  oku: (t: Taslak) => string | undefined
  yaz: (t: Taslak, deger: string) => Taslak
  /** "Bilmiyorum" seçeneği yoksa false. */
  bilmiyorum?: string | false
}

const BILMIYORUM = 'bilmiyorum'

/** Düz alan: değer olduğu gibi taslağa yazılır. */
const alan = <K extends 'malzeme' | 'sistem' | 'kalite' | 'zemin' | 'donem'>(k: K) => ({
  oku: (t: Taslak) => t[k] as string | undefined,
  yaz: (t: Taslak, d: string) => ({ ...t, [k]: d }),
})

/** Var/Yok kusuru: "var" → true, "yok" → false. */
const kusur = (k: Kusur) => ({
  oku: (t: Taslak) => {
    const c = t.kusurlar[k]
    return c === undefined ? undefined : c === BILMIYORUM ? BILMIYORUM : c ? 'var' : 'yok'
  },
  yaz: (t: Taslak, d: string) => ({
    ...t,
    kusurlar: { ...t.kusurlar, [k]: d === BILMIYORUM ? BILMIYORUM : d === 'var' },
  }),
})

/** Yığma alanı; var/yok alanlarda "var" → true, "yok" → false. */
const yigma = (a: YigmaAlani, varYok = false) => ({
  oku: (t: Taslak) => {
    const c = t.yigma?.[a]
    if (c === undefined || c === BILMIYORUM || !varYok) return c as string | undefined
    return c ? 'var' : 'yok'
  },
  yaz: (t: Taslak, d: string) => ({
    ...t,
    yigma: { ...t.yigma, [a]: varYok && d !== BILMIYORUM ? d === 'var' : d },
  }),
})

export const SORULAR: Record<Adim, Soru> = {
  malzeme: {
    adim: 'malzeme',
    kisa: 'Taşıyıcı malzeme',
    soru: 'Binanın taşıyıcı sistemi hangi malzemeden?',
    ipucu:
      'Bodruma, otoparka ya da zemin kattaki bir dükkâna bakın. Betonarme binada sıvanmış olsa da duvardan taşan köşeli kolonlar ve tavanda kirişler görünür.',
    secenekler: [
      {
        deger: 'betonarme',
        etiket: 'Betonarme',
        aciklama:
          'Beton kolon ve kirişler, aralarında tuğla ya da briket duvar. Apartmanların çoğu böyledir.',
        cizim: C.Betonarme,
      },
      {
        deger: 'yigma',
        etiket: 'Yığma',
        aciklama:
          'Kolon yok; yükü kalın tuğla, taş ya da briket duvarlar taşır. Çoğunlukla 1–3 katlı eski binalar.',
        cizim: C.Yigma,
      },
      {
        deger: 'celik',
        etiket: 'Çelik',
        aciklama: 'Taşıyıcılar çelik profil. Çoğunlukla işyeri ve sanayi yapıları.',
        cizim: C.Celik,
      },
      {
        deger: 'prefabrik',
        etiket: 'Prefabrik',
        aciklama:
          'Fabrikada üretilip yerinde birleştirilen beton parçalar. Çoğunlukla depo ve fabrika binaları.',
        cizim: C.Prefabrik,
      },
    ],
    bilmiyorum: 'Betonarme varsayılır; sonuçta bu varsayım ayrıca yazılır.',
    ...alan('malzeme'),
  },

  kat: {
    adim: 'kat',
    kisa: 'Serbest kat sayısı',
    soru: 'Binanın kaç katı toprağın üstünde?',
    ipucu:
      'Zemin kat dahil sayın. Dört yanı toprağa gömülü bodrum katlar sayılmaz. Bina eğimli arazideyse alçak taraftan görünen katları sayın.',
    ornekler: [
      { cizim: C.KatEgimli, aciklama: 'Eğimli arazi: alçak taraftan 6 kat görünüyor, 6 sayılır.' },
      { cizim: C.KatBodrumlu, aciklama: 'Dört yanı gömülü bodrum (B) sayılmaz: 5.' },
    ],
    izgara: true,
    secenekler: [
      ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({ deger: String(n), etiket: String(n) })),
      { deger: '8+', etiket: '8 veya daha fazla' },
    ],
    // Kat sayısı binaya bakarak sayılabilir; yöntemin tablosunu o seçer, "bilmiyorum" ile hesap yapılamaz.
    bilmiyorum: false,
    oku: (t) => (t.kat === undefined ? undefined : String(t.kat)),
    yaz: (t, d) => ({ ...t, kat: d === '8+' ? '8+' : Number(d) }),
  },

  sistem: {
    adim: 'sistem',
    kisa: 'Perde duvar',
    soru: 'Binada kolonların yanında perde duvar var mı?',
    ipucu:
      'Perde, kolondan çok daha uzun, duvar gibi yassı bir betonarme elemandır. Çoğunlukla merdiven ve asansör çevresinde ya da bodrumda görünür.',
    secenekler: [
      {
        deger: 'BAC',
        etiket: 'Yalnız kolon ve kiriş',
        aciklama: 'Betonarme çerçeve.',
        cizim: C.BaCerceve,
      },
      {
        deger: 'BACP',
        etiket: 'Perde duvar da var',
        aciklama: 'Betonarme çerçeve ve perde.',
        cizim: C.BaCercevePerde,
      },
    ],
    bilmiyorum: 'Yönetmelik bu durumda perdesiz çerçeveyi esas alır.',
    ...alan('sistem'),
  },

  yumusakKat: {
    adim: 'yumusakKat',
    kisa: 'Yumuşak kat',
    soru: 'Zemin kat, üst katlardan belirgin şekilde boş ya da yüksek mi?',
    ipucu:
      'Üst katlarda kolonların arası duvarla doluyken zemin katta duvar yoksa (dükkân vitrini, açık otopark) ya da zemin kat diğerlerinden belirgin yüksekse buna yumuşak kat denir. Yöntemde puanı en çok düşüren durumlardan biridir.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Zemin kat da üst katlar gibi duvarlı, yüksekliği benzer.',
        cizim: C.YumusakKatYok,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Zemin katta duvar yok ya da çok az, veya zemin kat belirgin yüksek.',
        cizim: C.YumusakKatVar,
      },
    ],
    ...kusur('yumusakKat'),
  },

  kalite: {
    adim: 'kalite',
    kisa: 'Görünen kalite',
    soru: 'Binanın görünen kalitesi ve bakımı nasıl?',
    ipucu:
      'Malzeme ve işçiliğe, bakıma bakın: sıva ve boya, çatlaklar, nem ve pas lekeleri, betonda dökülme. En çok bodrumda ve dış cephede görünür.',
    secenekler: [
      { deger: 'iyi', etiket: 'İyi', aciklama: 'Bakımlı; belirgin çatlak, dökülme ya da nem izi yok.' },
      {
        deger: 'orta',
        etiket: 'Orta',
        aciklama: 'Yer yer sıva çatlağı, boya dökülmesi; kolon ve kirişlerde hasar görünmüyor.',
      },
      {
        deger: 'kotu',
        etiket: 'Kötü',
        aciklama: 'Kolon ya da kirişte çatlak, betonun dökülüp demirin göründüğü yerler, yaygın nem ve pas.',
      },
    ],
    ...alan('kalite'),
  },

  duseydeDuzensizlik: {
    adim: 'duseydeDuzensizlik',
    kisa: 'Düşeyde düzensizlik',
    soru: 'Bir katta kesilen, yer değiştiren ya da çıkmaya oturan kolon veya perde var mı?',
    ipucu:
      'Bir kolon ya da perde alt katta kesiliyorsa, yer değiştiriyorsa ya da bir çıkmanın ucuna oturuyorsa düşeyde düzensizlik vardır. Zemin kattaki dükkânlardan ve dışarıdan bakarak görebilirsiniz.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Kolon ve perdeler temelden çatıya aynı yerde.',
        cizim: C.DuseydeDuzenli,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama:
          'Soldan sağa: çıkma ucuna oturan kolon, alt katta devam etmeyen kolon, kolona oturan perde, kesintili perde.',
        cizim: C.DuseydeDuzensiz,
        genisCizim: true,
      },
    ],
    ...kusur('duseydeDuzensizlik'),
  },

  agirCikma: {
    adim: 'agirCikma',
    kisa: 'Ağır çıkma',
    soru: 'Üst katlar zemin katın dışına taşıyor mu?',
    ipucu:
      'Üst katlar sokağa ya da bahçeye doğru taşarak genişliyor ve taşan kısım duvarla kapatılmış odaysa buna ağır çıkma denir. Açık balkon ağır çıkma sayılmaz.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Üst katlar zemin katla aynı hizada ya da yalnız açık balkon var.',
        cizim: C.CikmaYok,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Üst katlar dışarı taşıyor, taşan kısım kapalı oda.',
        cizim: C.CikmaVar,
      },
    ],
    ...kusur('agirCikma'),
  },

  plandaDuzensizlik: {
    adim: 'plandaDuzensizlik',
    kisa: 'Planda düzensizlik',
    soru: 'Binanın kuşbakışı şekli düzgün mü?',
    ipucu: 'Haritadaki bina çizimine ve binanın çevresine bakın.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Düzgün',
        aciklama: 'Dikdörtgen ya da hafif girintili.',
        cizim: C.PlanDuzenli,
      },
      {
        deger: 'var',
        etiket: 'Düzensiz',
        aciklama: 'Yamuk, L biçimli ya da çok girintili çıkıntılı.',
        cizim: C.PlanDuzensiz,
        genisCizim: true,
      },
    ],
    ...kusur('plandaDuzensizlik'),
  },

  kisaKolon: {
    adim: 'kisaKolon',
    kisa: 'Kısa kolon',
    soru: 'Kolonların arasındaki duvar tavana kadar çıkmayıp üstünde bant pencere mi kalıyor?',
    ipucu:
      'Duvar kolonu yarıya kadar sarıyor, üstünde yatay dar pencere kalıyorsa kolonun yalnız pencere boyu kadar kısmı serbest kalır; buna kısa kolon denir. Bodrum ve zemin katta sık görülür.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Duvarlar tavana kadar çıkıyor, pencereler olağan boyda.',
        cizim: C.KisaKolonYok,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Duvarın üstünde bant pencere var, kolonun serbest kısmı kısa.',
        cizim: C.KisaKolonVar,
      },
    ],
    ...kusur('kisaKolon'),
  },

  // ——— Yığma (RYTEİE Ek-A.2.2) ———

  'yigma.tur': {
    adim: 'yigma.tur',
    kisa: 'Yığma bina türü',
    soru: 'Duvarların çevresinde beton kolon ve hatıl, içinde demir var mı?',
    ipucu:
      'Yığma binada yükü duvarlar taşır. Duvar köşelerinde ince beton kolonlar, kat hizasında beton kuşaklar varsa duvar kuşatılmıştır. Sıvalı duvarda bunlar çoğunlukla sıvasız bir köşeden ya da sıva çatlaklarından görünür.',
    secenekler: [
      {
        deger: 'donatisiz',
        etiket: 'Yalnız duvar',
        aciklama: 'Donatısız yığma. Tuğla, taş ya da briket duvar; içinde demir, çevresinde beton yok.',
        cizim: C.YigmaDonatisiz,
      },
      {
        deger: 'kusatilmis',
        etiket: 'Duvarlar beton kolon ve hatılla çevrili',
        aciklama: 'Kuşatılmış yığma. Duvar parçaları ince betonarme kolon ve kuşakların arasında kalıyor.',
        cizim: C.YigmaKusatilmis,
      },
      {
        deger: 'donatili',
        etiket: 'Duvarların içinde demir var',
        aciklama:
          'Donatılı yığma. Delikli blokların içinden düşey ve yatay demir geçer; dışarıdan nadiren görünür, yapım belgesinde yazar.',
        cizim: C.YigmaDonatili,
      },
      {
        deger: 'karma',
        etiket: 'Bir kısmı betonarme çerçeve',
        aciklama: 'Karma. Taşıyıcıların bir kısmı betonarme kolon ve kiriş, bir kısmı yığma duvar.',
        cizim: C.YigmaKarma,
      },
    ],
    bilmiyorum: 'Yalnız duvar (donatısız) esas alınır; bu tür ek puan almaz.',
    ...yigma('tur'),
  },

  'yigma.yumusakKat': {
    adim: 'yigma.yumusakKat',
    kisa: 'Yumuşak ya da zayıf kat',
    soru: 'Zemin katta duvarların yerini geniş boşluklar mı almış?',
    ipucu:
      'Zemin katta duvarların yerinde geniş dükkân vitrinleri ya da garaj kapıları varsa, ya da zemin kat diğerlerinden belirgin yüksekse zemin kat üst katlardan zayıf kalır.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Zemin kat da üst katlar gibi duvarlı.',
        cizim: C.YigmaYumusakYok,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Zemin katın büyük kısmı açık ya da zemin kat belirgin yüksek.',
        cizim: C.YigmaYumusakVar,
      },
    ],
    ...yigma('yumusakKat', true),
  },

  'yigma.mevcutHasar': {
    adim: 'yigma.mevcutHasar',
    kisa: 'Mevcut hasar',
    soru: 'Taşıyıcı duvarlarda hasar var mı?',
    ipucu:
      'Duvarlarda çapraz ya da boydan boya çatlaklara, köşelerde ayrılmaya, dökülen taş ya da tuğlaya, sarkan döşemeye bakın. Sıvadaki ince kılcal çatlaklar hasar sayılmaz.',
    secenekler: [
      { deger: 'yok', etiket: 'Hayır', aciklama: 'Belirgin çatlak, ayrılma ya da dökülme yok.' },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Duvarda çapraz ya da derin çatlak, köşede ayrılma ya da dökülen parça var.',
      },
    ],
    ...yigma('mevcutHasar', true),
  },

  'yigma.malzemeKalitesi': {
    adim: 'yigma.malzemeKalitesi',
    kisa: 'Duvar malzemesinin kalitesi',
    soru: 'Duvardaki taş, tuğla ya da briketlerin durumu nasıl?',
    ipucu:
      'Sıvasız bir yerden, bodrumdan ya da dış cepheden bakın: parçalar bütün mü, ufalanıyor ya da nemden dağılıyor mu?',
    secenekler: [
      { deger: 'iyi', etiket: 'İyi', aciklama: 'Parçalar bütün ve düzgün; ufalanma ya da kırık yok.' },
      { deger: 'orta', etiket: 'Orta', aciklama: 'Yer yer kırık, aşınmış ya da nemlenmiş parçalar var.' },
      {
        deger: 'kotu',
        etiket: 'Kötü',
        aciklama: 'Parçalar ufalanıyor ya da dağılıyor; çok sayıda kırık ya da eksik parça var.',
      },
    ],
    ...yigma('malzemeKalitesi'),
  },

  'yigma.duvarIsciligi': {
    adim: 'yigma.duvarIsciligi',
    kisa: 'Duvar işçiliği',
    soru: 'Duvar örgüsü düzgün mü?',
    ipucu:
      'Taşların ya da tuğlaların sıralar halinde dizilip dizilmediğine, derzlerin üst üste gelmeden şaşırtmalı gidip gitmediğine, araların harçla dolu olup olmadığına bakın.',
    secenekler: [
      { deger: 'iyi', etiket: 'İyi', aciklama: 'Sıralar düzgün, derzler şaşırtmalı, aralar harçla dolu.' },
      { deger: 'orta', etiket: 'Orta', aciklama: 'Sıralar yer yer bozuk; bazı derzler üst üste ya da boş.' },
      {
        deger: 'kotu',
        etiket: 'Kötü',
        aciklama: 'Örgü düzensiz; parçalar gelişigüzel yığılmış, aralar boş ya da toprakla doldurulmuş.',
      },
    ],
    ...yigma('duvarIsciligi'),
  },

  'yigma.harc': {
    adim: 'yigma.harc',
    kisa: 'Harç',
    soru: 'Taş ya da tuğlaların arasındaki harç ne?',
    ipucu:
      'Derzlere bakın. Çimento harcı gri ve serttir, tırnakla kazınmaz. Kireç harcı beyazımsıdır ve kolay ufalanır. Çamur harç toprak renklidir.',
    secenekler: [
      { deger: 'cimento', etiket: 'Çimento' },
      { deger: 'kirec', etiket: 'Kireç' },
      { deger: 'camur', etiket: 'Çamur' },
      { deger: 'yok', etiket: 'Harç yok', aciklama: 'Taşlar harçsız, kuru örülmüş.' },
    ],
    ...yigma('harc'),
  },

  'yigma.plan': {
    adim: 'yigma.plan',
    kisa: 'Planda düzensizlik',
    soru: 'Binanın kuşbakışı şekli düzgün mü?',
    ipucu: 'Haritadaki bina çizimine ve binanın çevresine bakın.',
    secenekler: [
      {
        deger: 'duzenli',
        etiket: 'Düzenli',
        aciklama: 'Dikdörtgen ya da hafif girintili.',
        cizim: C.PlanDuzenli,
      },
      { deger: 'duzensiz', etiket: 'Düzensiz', aciklama: 'Yamuk ya da L biçimli.', cizim: C.PlanYamukL },
      {
        deger: 'asiriDuzensiz',
        etiket: 'Aşırı düzensiz',
        aciklama: 'Çok sayıda girinti ve çıkıntı.',
        cizim: C.PlanCokGirintili,
      },
    ],
    ...yigma('plan'),
  },

  'yigma.duvarMiktari': {
    adim: 'yigma.duvarMiktari',
    kisa: 'Duvar miktarı',
    soru: 'Zemin katın dış duvarlarında kapı ve pencereler ne kadar yer kaplıyor?',
    ipucu:
      'Binanın ön ve yan cephesine zemin katta bakın. Kapı ve pencere genişliklerinin toplamını cephenin uzunluğuyla karşılaştırın. Boşluk azaldıkça depremi taşıyan duvar artar.',
    secenekler: [
      {
        deger: 'cok',
        etiket: 'Üçte birinden az',
        aciklama: 'Duvar çok: boşluklar cephe uzunluğunun üçte birinden azını kaplıyor.',
        cizim: C.DuvarCok,
      },
      {
        deger: 'orta',
        etiket: 'Üçte biri ile üçte ikisi arası',
        aciklama: 'Duvar orta.',
        cizim: C.DuvarOrta,
      },
      {
        deger: 'az',
        etiket: 'Üçte ikisinden fazla',
        aciklama: 'Duvar az: cephenin çoğu kapı, pencere ya da vitrin.',
        cizim: C.DuvarAz,
      },
    ],
    ...yigma('duvarMiktari'),
  },

  'yigma.boslukDuzeni': {
    adim: 'yigma.boslukDuzeni',
    kisa: 'Pencerelerin düşey düzeni',
    soru: 'Pencere ve kapılar katlar boyunca alt alta mı?',
    ipucu:
      'Cepheye bakın: üst kattaki pencereler alttakilerin tam üstündeyse aralarındaki duvarlar temele kadar kesintisiz iner.',
    secenekler: [
      { deger: 'duzenli', etiket: 'Düzenli', aciklama: 'Hepsi alt alta.', cizim: C.BoslukDuzenli },
      {
        deger: 'azDuzenli',
        etiket: 'Az düzenli',
        aciklama: 'Biri ikisi kaymış, çoğu alt alta.',
        cizim: C.BoslukAzDuzenli,
      },
      {
        deger: 'duzensiz',
        etiket: 'Düzensiz',
        aciklama: 'Katlarda farklı yerlerde, alt alta gelmiyor.',
        cizim: C.BoslukDuzensiz,
      },
    ],
    ...yigma('boslukDuzeni'),
  },

  'yigma.yatayHatil': {
    adim: 'yigma.yatayHatil',
    kisa: 'Yatay hatıl',
    soru: 'Duvarları kat boyunca saran yatay beton kuşak (hatıl) var mı?',
    ipucu:
      'Hatıl, duvarın üstünden ya da pencerelerin üst hizasından binayı çepeçevre dolaşan betonarme kuşaktır. Dış cephede taş ya da tuğladan farklı, yatay bir bant olarak görünür.',
    secenekler: [
      { deger: 'pencereUstu', etiket: 'Pencerelerin üst hizasında', cizim: C.HatilPencereUstu },
      { deger: 'duvarUstu', etiket: 'Duvarın üstünde, döşeme hizasında', cizim: C.HatilDuvarUstu },
      { deger: 'yok', etiket: 'Yok', cizim: C.HatilYok },
    ],
    ...yigma('yatayHatil'),
  },

  'yigma.cepheKatFarki': {
    adim: 'yigma.cepheKatFarki',
    kisa: 'Cepheye göre kat farkı',
    soru: 'Binanın bir cephesinde diğerlerinden fazla kat mı görünüyor?',
    ipucu:
      'Eğimli arazideki ya da bir yanı toprağa gömülü binalarda alçak taraftan bir kat fazla görünür. Binanın etrafında dolaşıp her yandan katları sayın.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır',
        aciklama: 'Her cephede aynı sayıda kat görünüyor.',
        cizim: C.CepheKatFarkiYok,
      },
      {
        deger: 'var',
        etiket: 'Evet',
        aciklama: 'Bir yanı toprağa gömülü; bir cephede daha fazla kat görünüyor.',
        cizim: C.CepheKatFarkiVar,
      },
    ],
    ...yigma('cepheKatFarki', true),
  },

  'yigma.doseme': {
    adim: 'yigma.doseme',
    kisa: 'Döşeme',
    soru: 'Katların arasındaki döşeme ne?',
    ipucu:
      'İçeriden tavana bakın. Betonarme döşeme düz ve tek parçadır. Ahşap döşemede kirişler ve tahtalar görünür. Volto, demir kirişlerin arasına örülmüş küçük tuğla kemerlerdir.',
    secenekler: [
      { deger: 'betonarme', etiket: 'Betonarme', aciklama: 'Düz, tek parça beton tavan.' },
      { deger: 'ahsap', etiket: 'Ahşap', aciklama: 'Ahşap kirişler ve tahta.' },
      { deger: 'volto', etiket: 'Volto', aciklama: 'Demir kirişler arasında tuğla kemerler.' },
    ],
    ...yigma('doseme'),
  },

  'yigma.duvarDuvar': {
    adim: 'yigma.duvarDuvar',
    kisa: 'Duvarların birbirine bağlantısı',
    soru: 'Duvarlar köşelerde ve birleştikleri yerlerde birbirine sıkı bağlı mı?',
    ipucu:
      'Binanın köşelerine ve iç duvarların dış duvara değdiği yerlere bakın. Taş ya da tuğlalar köşede birbirine geçmeli; birleşimde düşey bir çatlak ya da ayrılma bağlantının zayıf olduğunu gösterir.',
    secenekler: [
      { deger: 'iyi', etiket: 'Sıkı bağlı', aciklama: 'Köşelerde parçalar birbirine geçiyor; ayrılma yok.' },
      {
        deger: 'kotu',
        etiket: 'Zayıf',
        aciklama: 'Birleşimde düşey çatlak ya da ayrılma var, ya da duvarlar yalnız yan yana konmuş.',
      },
    ],
    ...yigma('duvarDuvar'),
  },

  'yigma.duvarDoseme': {
    adim: 'yigma.duvarDoseme',
    kisa: 'Döşemenin duvara bağlantısı',
    soru: 'Döşeme duvarlara sıkı bağlı mı?',
    ipucu:
      'Döşemenin duvara oturduğu yere bakın. Duvarın üstünde bir hatıl varsa ve birleşimde çatlak yoksa bağlantı iyidir. Döşeme kirişleri duvara yalnız dayanıyorsa ya da birleşim çatlaksa zayıftır.',
    secenekler: [
      { deger: 'iyi', etiket: 'Sıkı bağlı', aciklama: 'Duvar üstünde hatıl var, birleşimde çatlak yok.' },
      { deger: 'kotu', etiket: 'Zayıf', aciklama: 'Hatıl yok ya da birleşimde çatlak var.' },
    ],
    ...yigma('duvarDoseme'),
  },

  'yigma.cati': {
    adim: 'yigma.cati',
    kisa: 'Çatı',
    soru: 'Çatı neyle örtülü?',
    ipucu:
      'Toprak dam, ahşap kirişlerin üstüne kalın toprak serilmiş düz çatıdır. Çok ağırdır; depremde duvarları zorlar.',
    secenekler: [
      { deger: 'kiremit', etiket: 'Kiremit' },
      { deger: 'sac', etiket: 'Sac' },
      { deger: 'beton', etiket: 'Beton', aciklama: 'Düz beton teras.' },
      { deger: 'toprak', etiket: 'Toprak dam' },
    ],
    ...yigma('cati'),
  },

  nizam: {
    adim: 'nizam',
    kisa: 'Bitişik bina',
    soru: 'Binanın yanında duvar duvara bitişik bina var mı?',
    ipucu:
      'Komşu binayla aranızda boşluk yoksa bitişiktir. Çizimlerde sizin bina çarpı işaretli, komşular taralı.',
    secenekler: [
      { deger: 'ayrik', etiket: 'Yok, dört yanı açık', aciklama: 'Ayrık nizam.', cizim: C.NizamAyrik },
      {
        deger: 'bitisik',
        etiket: 'İki yanında bitişik bina var',
        aciklama: 'Bitişik nizam, sıranın ortası.',
        cizim: C.NizamBitisik,
      },
      {
        deger: 'kosede',
        etiket: 'Yalnız bir yanında bitişik bina var',
        aciklama: 'Sıranın ucu ya da köşe. Depremde çarpışmadan en çok etkilenen konum.',
        cizim: C.NizamKosede,
      },
    ],
    oku: (t) => t.nizam,
    // Ayrık ya da bilinmiyorsa döşeme seviyesi sorusu düşer.
    yaz: (t, d) => ({
      ...t,
      nizam: d as Taslak['nizam'],
      katSeviyesi: d === 'bitisik' || d === 'kosede' ? t.katSeviyesi : undefined,
    }),
  },

  zeminEgimi: {
    adim: 'zeminEgimi',
    kisa: 'Arazi eğimi',
    soru: 'Bina dik bir yamaçta mı?',
    ipucu:
      'Arazinin doğal eğimi 30 dereceden fazlaysa (yürüyerek çıkmakta zorlanacağınız kadar dik) evet deyin. Hafif eğimli sokaklar bu kapsama girmez.',
    secenekler: [
      {
        deger: 'yok',
        etiket: 'Hayır, düz ya da hafif eğimli',
        aciklama: 'Eğim 30 dereceden az.',
        cizim: C.EgimYok,
      },
      { deger: 'var', etiket: 'Evet, dik yamaç', aciklama: 'Eğim 30 dereceden fazla.', cizim: C.EgimVar },
    ],
    ...kusur('zeminEgimi'),
  },

  zemin: {
    adim: 'zemin',
    kisa: 'Zemin sınıfı',
    soru: 'Binanın zemin sınıfını biliyor musunuz?',
    ipucu:
      'Zemin sınıfı (ZA–ZE) binanın zemin etüdü raporunda ya da ruhsat ekinde yazar. Çoğu kişi bilmez; bilmiyorsanız yöntem ZC, ZD ve ZE arasından sonucu en çok etkileyeni kullanır.',
    secenekler: [
      { deger: 'ZA', etiket: 'ZA', aciklama: 'Sert, ayrışmamış kaya.' },
      { deger: 'ZB', etiket: 'ZB', aciklama: 'Az ayrışmış, orta sertlikte kaya.' },
      { deger: 'ZC', etiket: 'ZC', aciklama: 'Çok sıkı kum, çakıl, sert kil ya da çatlaklı zayıf kaya.' },
      { deger: 'ZD', etiket: 'ZD', aciklama: 'Orta sıkı kum, çakıl ya da çok katı kil.' },
      { deger: 'ZE', etiket: 'ZE', aciklama: 'Gevşek kum, çakıl ya da yumuşak kil.' },
    ],
    bilmiyorum: 'Çoğu kullanıcı için doğru seçenek budur.',
    ...alan('zemin'),
  },

  donem: {
    adim: 'donem',
    kisa: 'Yapım dönemi',
    soru: 'Bina hangi yıllarda yapıldı?',
    ipucu:
      'İsteğe bağlı; puanı değiştirmez. Binanın yapıldığı dönemde yürürlükte olan deprem yönetmeliğini sonuçta not olarak gösteririz.',
    secenekler: [
      { deger: 'once-1975', etiket: "1975'ten önce" },
      { deger: '1975-1997', etiket: '1975–1997' },
      { deger: '1998-2006', etiket: '1998–2006' },
      { deger: '2007-2018', etiket: '2007–2018' },
      { deger: '2019-sonra', etiket: '2019 ve sonrası' },
    ],
    ...alan('donem'),
  },
}

/** Bitişik ve köşede bitişik binalarda nizam adımının ikinci sorusu. */
export const KAT_SEVIYESI: Soru = {
  adim: 'nizam',
  kisa: 'Döşeme hizası',
  soru: 'Bitişik binayla katların döşemeleri aynı hizada mı?',
  ipucu:
    'Pencere sıralarına bakın: iki binanın katları aynı yükseklikteyse döşemeler de aynı hizadadır. Katlar kaçıksa depremde komşunun döşemesi kolonlara çarpabilir.',
  secenekler: [
    { deger: 'ayni', etiket: 'Aynı hizada', cizim: C.DosemeAyni },
    {
      deger: 'farkli',
      etiket: 'Kaçık',
      aciklama: 'Komşunun döşemesi kat ortasına geliyor.',
      cizim: C.DosemeFarkli,
    },
  ],
  oku: (t) => t.katSeviyesi,
  yaz: (t, d) => ({ ...t, katSeviyesi: d as Taslak['katSeviyesi'] }),
}

/** Bir cevabın özet etiketi. */
export function cevapEtiketi(soru: Soru, deger: string | undefined): string {
  if (deger === undefined) return 'Cevaplanmadı'
  if (deger === BILMIYORUM) return 'Bilmiyorum'
  return soru.secenekler.find((s) => s.deger === deger)?.etiket ?? deger
}
