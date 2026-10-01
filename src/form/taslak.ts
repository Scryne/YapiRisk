// Formun yarım kalabilen hali (taslak) ve motor girdisine çevrimi. Soru sırası Roadmap Faz 5: kapsam ayıklama
// (malzeme, kat) → sistem → kusurlar (yumuşak kat önce, K-6) → nizam → zemin → isteğe bağlı yapım dönemi (K-10).
// Yığma binada (Faz 10) sistem ve kusurların yerine Şekil A.2'nin soruları gelir; ortak sorular aynı kalır.
import type { Cevap, FormCevaplari, NizamCevabi } from '@/yontem/aralik'
import type { Yontem } from '@/yontem/degerlendir'
import { KUSURLAR, type Kalite, type KatSeviyesi, type Kusur, type Sistem } from '@/yontem/ryteie'
import type { ZeminCevabi } from '@/yontem/tehlike'
import { YIGMA_ALANLARI, type YigmaAlani, type YigmaAlanlari, type YigmaCevaplari } from '@/yontem/yigma'

export type Malzeme = 'betonarme' | 'yigma' | 'celik' | 'prefabrik'
/** Şekil A.1 "Yapı nizamı": bitişik = iki yanı komşu (orta), köşede bitişik = tek yanı (kenar). */
export type NizamSecimi = 'ayrik' | 'bitisik' | 'kosede'
/** Deprem yönetmeliklerinin yürürlük dönemleri: 1975, 1998, 2007, 2019 (TBDY). Puana girmez (K-10). */
export type Donem = 'once-1975' | '1975-1997' | '1998-2006' | '2007-2018' | '2019-sonra'
/** 1–7 serbest kat ya da kapsam dışı "8 veya daha fazla". */
export type KatCevabi = number | '8+'
export type YigmaTaslagi = Partial<{ [A in YigmaAlani]: Cevap<YigmaAlanlari[A]> }>

export interface Taslak {
  malzeme?: Cevap<Malzeme>
  kat?: KatCevabi
  sistem?: Cevap<Sistem>
  kalite?: Cevap<Kalite>
  kusurlar: Partial<Record<Kusur, Cevap<boolean>>>
  nizam?: Cevap<NizamSecimi>
  /** Yalnız bitişik ve köşede bitişik binalarda sorulur. */
  katSeviyesi?: Cevap<KatSeviyesi>
  zemin?: ZeminCevabi
  donem?: Cevap<Donem>
  /** Yalnız yığma binada sorulanlar. */
  yigma?: YigmaTaslagi
}

export const bosTaslak = (): Taslak => ({ kusurlar: {} })

export const bosMu = (t: Taslak) =>
  Object.keys(t.kusurlar).length === 0 &&
  Object.keys(t.yigma ?? {}).length === 0 &&
  Object.entries(t).every(([k, v]) => k === 'kusurlar' || k === 'yigma' || v === undefined)

export const BETONARME_ADIMLARI = [
  'malzeme',
  'kat',
  'sistem',
  'yumusakKat',
  'kalite',
  'duseydeDuzensizlik',
  'agirCikma',
  'plandaDuzensizlik',
  'kisaKolon',
  'nizam',
  'zeminEgimi',
  'zemin',
  'donem',
] as const

export type YigmaAdimi = `yigma.${YigmaAlani}`
export const YIGMA_ADIMLARI = [
  'malzeme',
  'kat',
  ...YIGMA_ALANLARI.map((a) => `yigma.${a}` as const),
  'nizam',
  'zemin',
  'donem',
] as const satisfies readonly (YigmaAdimi | (typeof BETONARME_ADIMLARI)[number])[]

export type Adim = (typeof BETONARME_ADIMLARI)[number] | YigmaAdimi

/** Bina yığmaysa Şekil A.2'nin soruları; değilse (malzeme bilinmiyorsa da) betonarme. */
export const yontem = (t: Taslak): Yontem => (t.malzeme === 'yigma' ? 'yigma' : 'betonarme')

/**
 * Tek katlı yığmada puanı hiç değiştirmeyen sorular (Tablo A.9, 1 kat: boşluk düzeni ve yumuşak kat OPᵢ = 0).
 * Sorulmaz; cevap yoksa bu nötr değerle motora girer.
 */
export const TEK_KATTA_ATLANAN = {
  yumusakKat: false,
  boslukDuzeni: 'duzenli',
} as const satisfies YigmaTaslagi
const TEK_KAT_YIGMA_ADIMLARI = YIGMA_ADIMLARI.filter((a) => !(a.slice('yigma.'.length) in TEK_KATTA_ATLANAN))

export const adimlar = (t: Taslak): readonly Adim[] =>
  yontem(t) === 'betonarme' ? BETONARME_ADIMLARI : t.kat === 1 ? TEK_KAT_YIGMA_ADIMLARI : YIGMA_ADIMLARI

const kusurMu = (a: Adim): a is Kusur => (KUSURLAR as readonly string[]).includes(a)
export const yigmaAlani = (a: Adim): YigmaAlani | null =>
  a.startsWith('yigma.') ? (a.slice('yigma.'.length) as YigmaAlani) : null

/** İsteğe bağlı adımlar cevapsız geçilebilir. */
export const istegeBagli = (a: Adim) => a === 'donem'

export function cevaplandi(t: Taslak, a: Adim): boolean {
  if (kusurMu(a)) return t.kusurlar[a] !== undefined
  const y = yigmaAlani(a)
  if (y) return t.yigma?.[y] !== undefined
  if (a === 'nizam')
    return (
      t.nizam !== undefined &&
      (t.nizam === 'ayrik' || t.nizam === 'bilmiyorum' || t.katSeviyesi !== undefined)
    )
  return t[a as Exclude<Adim, Kusur | YigmaAdimi | 'nizam'>] !== undefined
}

export type KapsamDisi = 'celik' | 'prefabrik' | 'kat' | 'yigmaKat'

/** K-8: RYTEİE Ek-A betonarme 1–7, yığma (Ek-A.2.2) 1–5 serbest kat içindir; çelik ve prefabrik için yöntem yok. */
export function kapsamDisi(t: Taslak): KapsamDisi | null {
  if (t.malzeme === 'celik' || t.malzeme === 'prefabrik') return t.malzeme
  if (t.malzeme === 'yigma' && (t.kat === '8+' || (typeof t.kat === 'number' && t.kat > 5))) return 'yigmaKat'
  if (t.kat === '8+') return 'kat'
  return null
}

function nizamCevabi(t: Taslak): Cevap<NizamCevabi> {
  if (t.nizam === undefined || t.nizam === 'bilmiyorum') return 'bilmiyorum'
  if (t.nizam === 'ayrik') return { tip: 'ayrik' }
  return {
    tip: 'bitisik',
    konum: t.nizam === 'bitisik' ? 'orta' : 'kenar',
    katSeviyesi: t.katSeviyesi ?? 'bilmiyorum',
  }
}

interface OrtakCevaplar {
  zemin: ZeminCevabi
  /** Malzeme "bilmiyorum": betonarme varsayılarak değerlendirildi, sonuçta yazılır. */
  malzemeVarsayildi: boolean
  /** İsteğe bağlı; puana girmez (K-10). */
  donem?: Cevap<Donem>
}

export type TamCevaplar = OrtakCevaplar &
  ({ yontem: 'betonarme'; cevaplar: FormCevaplari } | { yontem: 'yigma'; cevaplar: YigmaCevaplari })

/** Zorunlu sorular cevaplanmış ve bina kapsamdaysa motor girdisi; değilse null. */
export function tamCevaplar(t: Taslak): TamCevaplar | null {
  if (kapsamDisi(t) || !adimlar(t).every((a) => istegeBagli(a) || cevaplandi(t, a))) return null
  if (typeof t.kat !== 'number') return null
  const ortak = { zemin: t.zemin!, malzemeVarsayildi: t.malzeme === 'bilmiyorum', donem: t.donem }
  if (yontem(t) === 'yigma')
    return {
      ...ortak,
      yontem: 'yigma',
      cevaplar: {
        kat: t.kat,
        nizam: nizamCevabi(t),
        ...(Object.fromEntries(
          YIGMA_ALANLARI.map((a) => [
            a,
            t.yigma?.[a] ??
              (t.kat === 1 ? TEK_KATTA_ATLANAN[a as keyof typeof TEK_KATTA_ATLANAN] : undefined),
          ]),
        ) as Omit<YigmaCevaplari, 'kat' | 'nizam'>),
      },
    }
  return {
    ...ortak,
    yontem: 'betonarme',
    cevaplar: {
      kat: t.kat,
      sistem: t.sistem!,
      kalite: t.kalite!,
      kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, t.kusurlar[k]!])) as Record<Kusur, Cevap<boolean>>,
      nizam: nizamCevabi(t),
    },
  }
}

/** İlk cevapsız zorunlu adım; hepsi cevaplıysa null. */
export function ilkEksik(t: Taslak): number | null {
  const i = adimlar(t).findIndex((a) => !istegeBagli(a) && !cevaplandi(t, a))
  return i < 0 ? null : i
}
