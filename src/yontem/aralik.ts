// "Bilmiyorum" cevapları puanı iki uca açar (Final-Doküman, hesap sözleşmesi):
// sistem bilinmiyorsa BAÇ (RYTEİE A.2.1.1, iki uçta da); diğer olumsuzluklarda kötü uç "var", iyi uç "yok".
import tablo from './ryteie-2019.json'
import {
  KUSURLAR,
  katGrubu,
  nizamPuani,
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
function sec<T>(secenekler: T[], katki: (s: T) => number, uc: Uc): T {
  return secenekler.reduce((a, b) => {
    const [ka, kb] = [katki(a), katki(b)]
    return uc === 'kotu' ? (kb < ka ? b : a) : kb > ka ? b : a
  })
}

function nizamUcu(cevap: Cevap<NizamCevabi>, kat: number, uc: Uc): Nizam {
  const grup = katGrubu(kat)
  const katki = (n: Nizam) => {
    const { deger, puan } = nizamPuani(grup, n)
    return deger * puan
  }
  const bitisikler = (s: Cevap<KatSeviyesi>, k: Cevap<Konum>): Nizam[] =>
    (s === 'bilmiyorum' ? seviyeler : [s]).flatMap((katSeviyesi) =>
      (k === 'bilmiyorum' ? konumlar : [k]).map((konum) => ({ tip: 'bitisik' as const, katSeviyesi, konum })),
    )
  if (cevap === 'bilmiyorum')
    return sec<Nizam>([{ tip: 'ayrik' }, ...bitisikler('bilmiyorum', 'bilmiyorum')], katki, uc)
  if (cevap.tip === 'ayrik') return cevap
  return sec(bitisikler(cevap.katSeviyesi, cevap.konum), katki, uc)
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
export function belirsizParametreler(cevaplar: FormCevaplari): string[] {
  const liste: string[] = []
  if (cevaplar.kalite === 'bilmiyorum') liste.push('gorunenKalite')
  for (const k of KUSURLAR) if (cevaplar.kusurlar[k] === 'bilmiyorum') liste.push(k)
  const n = cevaplar.nizam
  if (
    n === 'bilmiyorum' ||
    (n.tip === 'bitisik' && (n.katSeviyesi === 'bilmiyorum' || n.konum === 'bilmiyorum'))
  )
    liste.push('yapiNizami')
  return liste
}
