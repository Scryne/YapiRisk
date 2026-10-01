// "Bilmiyorum" cevapları puanı iki uca açar (Final-Doküman, hesap sözleşmesi):
// sistem bilinmiyorsa BAÇ (RYTEİE A.2.1.1, iki uçta da); diğer olumsuzluklarda kötü uç "var", iyi uç "yok".
import tablo from './ryteie-2019.json'
import {
  KUSURLAR,
  katGrubu,
  nizamPuani,
  type BetonarmeParametre,
  type Kalite,
  type KatSeviyesi,
  type KesinGirdi,
  type Konum,
  type Kusur,
  type Nizam,
  type Sistem,
} from './ryteie'

export type Cevap<T> = T | 'bilmiyorum'

export type NizamCevabi =
  { tip: 'ayrik' } | { tip: 'bitisik'; katSeviyesi: Cevap<KatSeviyesi>; konum: Cevap<Konum> }

export interface FormCevaplari {
  /** Serbest kat adedi; "bilmiyorum" yok, kapsamı belirler. */
  kat: number
  sistem: Cevap<Sistem>
  kalite: Cevap<Kalite>
  kusurlar: Record<Kusur, Cevap<boolean>>
  nizam: Cevap<NizamCevabi>
}

export type Uc = 'kotu' | 'iyi'

const kaliteler = Object.keys(tablo.tabloA3.gorunenKalite) as Kalite[]
const seviyeler: KatSeviyesi[] = ['ayni', 'farkli']
const konumlar: Konum[] = ['orta', 'kenar']

/** Bir ucun seçimi: kötü uçta katkısı en küçük (en olumsuz), iyi uçta en büyük seçenek. */
export function sec<T>(secenekler: T[], katki: (s: T) => number, uc: Uc): T {
  return secenekler.reduce((a, b) => {
    const [ka, kb] = [katki(a), katki(b)]
    return uc === 'kotu' ? (kb < ka ? b : a) : kb > ka ? b : a
  })
}

/** Nizam cevabının açabileceği kesin nizamlar ("bilmiyorum" alanları her seçeneğe açılır). */
export function nizamAdaylari(cevap: Cevap<NizamCevabi>): Nizam[] {
  const bitisikler = (s: Cevap<KatSeviyesi>, k: Cevap<Konum>): Nizam[] =>
    (s === 'bilmiyorum' ? seviyeler : [s]).flatMap((katSeviyesi) =>
      (k === 'bilmiyorum' ? konumlar : [k]).map((konum) => ({ tip: 'bitisik' as const, katSeviyesi, konum })),
    )
  if (cevap === 'bilmiyorum') return [{ tip: 'ayrik' }, ...bitisikler('bilmiyorum', 'bilmiyorum')]
  if (cevap.tip === 'ayrik') return [cevap]
  return bitisikler(cevap.katSeviyesi, cevap.konum)
}

/** Nizam "bilmiyorum" içeriyor mu (puanı iki uca açar). */
const nizamBelirsiz = (n: Cevap<NizamCevabi>) =>
  n === 'bilmiyorum' || (n.tip === 'bitisik' && (n.katSeviyesi === 'bilmiyorum' || n.konum === 'bilmiyorum'))

function nizamUcu(cevap: Cevap<NizamCevabi>, kat: number, uc: Uc): Nizam {
  const grup = katGrubu(kat)
  const katki = (n: Nizam) => {
    const { deger, puan } = nizamPuani(grup, n)
    return deger * puan
  }
  return sec(nizamAdaylari(cevap), katki, uc)
}

/** Cevapları verilen uca göre kesin girdiye çevirir. */
export function ucGirdisi(cevaplar: FormCevaplari, uc: Uc): KesinGirdi {
  const grup = katGrubu(cevaplar.kat)
  const kalite =
    cevaplar.kalite === 'bilmiyorum'
      ? sec(kaliteler, (k) => tablo.tabloA3.gorunenKalite[k] * tablo.tabloA4.gorunenKalite[grup], uc)
      : cevaplar.kalite
  const kusurlar = Object.fromEntries(
    KUSURLAR.map((k) => {
      const c = cevaplar.kusurlar[k]
      return [k, c === 'bilmiyorum' ? uc === 'kotu' : c]
    }),
  ) as Record<Kusur, boolean>
  return {
    kat: cevaplar.kat,
    sistem: cevaplar.sistem === 'bilmiyorum' ? 'BAC' : cevaplar.sistem,
    kalite,
    kusurlar,
    nizam: nizamUcu(cevaplar.nizam, cevaplar.kat, uc),
  }
}

/** Cevaplarda puanı iki uca açan "bilmiyorum" var mı (sistem hariç: o tek değere çözülür). */
export function belirsizParametreler(cevaplar: FormCevaplari): BetonarmeParametre[] {
  const liste: BetonarmeParametre[] = []
  if (cevaplar.kalite === 'bilmiyorum') liste.push('gorunenKalite')
  for (const k of KUSURLAR) if (cevaplar.kusurlar[k] === 'bilmiyorum') liste.push(k)
  if (nizamBelirsiz(cevaplar.nizam)) liste.push('yapiNizami')
  return liste
}
