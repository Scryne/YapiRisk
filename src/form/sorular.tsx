// Formun soruları: metin, seçenekler ve Şekil A.1 çizimleri. Tanımlar RYTEİE Ek-A.2.1.1 maddelerinden ve Şekil A.1'den
// (ek s. 30, 32–33) sade dile çevrildi. Seçenek değerleri taslağa `oku`/`yaz` ile bağlanır.
import type { ComponentType } from 'react'
import type { Kusur } from '@/yontem/ryteie'
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
      { deger: 'ZA', etiket: 'ZA', aciklama: 'Sağlam, sert kaya.' },
      { deger: 'ZB', etiket: 'ZB', aciklama: 'Az ayrışmış, orta sağlam kaya.' },
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
