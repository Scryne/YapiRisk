// Formun yarım kalabilen hali (taslak) ve motor girdisine çevrimi. Soru sırası Roadmap Faz 5: kapsam ayıklama
// (malzeme, kat) → sistem → kusurlar (yumuşak kat önce, K-6) → nizam → zemin → isteğe bağlı yapım dönemi (K-10).
import type { Cevap, FormCevaplari, NizamCevabi } from '@/yontem/aralik'
import { KUSURLAR, type Kalite, type KatSeviyesi, type Kusur, type Sistem } from '@/yontem/ryteie'
import type { ZeminCevabi } from '@/yontem/tehlike'

export type Malzeme = 'betonarme' | 'yigma' | 'celik' | 'prefabrik'
/** Şekil A.1 "Yapı nizamı": bitişik = iki yanı komşu (orta), köşede bitişik = tek yanı (kenar). */
export type NizamSecimi = 'ayrik' | 'bitisik' | 'kosede'
/** Deprem yönetmeliklerinin yürürlük dönemleri: 1975, 1998, 2007, 2019 (TBDY). Puana girmez (K-10). */
export type Donem = 'once-1975' | '1975-1997' | '1998-2006' | '2007-2018' | '2019-sonra'
/** 1–7 serbest kat ya da kapsam dışı "8 veya daha fazla". */
export type KatCevabi = number | '8+'

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
}

export const bosTaslak = (): Taslak => ({ kusurlar: {} })

export const bosMu = (t: Taslak) =>
  Object.keys(t.kusurlar).length === 0 &&
  Object.entries(t).every(([k, v]) => k === 'kusurlar' || v === undefined)

export const ADIMLAR = [
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
export type Adim = (typeof ADIMLAR)[number]

const kusurMu = (a: Adim): a is Kusur => (KUSURLAR as readonly string[]).includes(a)

/** İsteğe bağlı adımlar cevapsız geçilebilir. */
export const istegeBagli = (a: Adim) => a === 'donem'

export function cevaplandi(t: Taslak, a: Adim): boolean {
  if (kusurMu(a)) return t.kusurlar[a] !== undefined
  if (a === 'nizam')
    return (
      t.nizam !== undefined &&
      (t.nizam === 'ayrik' || t.nizam === 'bilmiyorum' || t.katSeviyesi !== undefined)
    )
  return t[a] !== undefined
}

export type KapsamDisi = 'yigma' | 'celik' | 'prefabrik' | 'kat'

/** K-8: RYTEİE Ek-A betonarme yöntemi yalnız betonarme ve 1–7 serbest kat içindir. */
export function kapsamDisi(t: Taslak): KapsamDisi | null {
  if (t.malzeme === 'yigma' || t.malzeme === 'celik' || t.malzeme === 'prefabrik') return t.malzeme
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

export interface TamCevaplar {
  cevaplar: FormCevaplari
  zemin: ZeminCevabi
  /** Malzeme "bilmiyorum": betonarme varsayılarak değerlendirildi, sonuçta yazılır. */
  malzemeVarsayildi: boolean
}

/** Zorunlu sorular cevaplanmış ve bina kapsamdaysa motor girdisi; değilse null. */
export function tamCevaplar(t: Taslak): TamCevaplar | null {
  if (kapsamDisi(t) || !ADIMLAR.every((a) => istegeBagli(a) || cevaplandi(t, a))) return null
  if (typeof t.kat !== 'number') return null
  return {
    cevaplar: {
      kat: t.kat,
      sistem: t.sistem!,
      kalite: t.kalite!,
      kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, t.kusurlar[k]!])) as Record<Kusur, Cevap<boolean>>,
      nizam: nizamCevabi(t),
    },
    zemin: t.zemin!,
    malzemeVarsayildi: t.malzeme === 'bilmiyorum',
  }
}

/** İlk cevapsız zorunlu adım; hepsi cevaplıysa null. */
export function ilkEksik(t: Taslak): number | null {
  const i = ADIMLAR.findIndex((a) => !istegeBagli(a) && !cevaplandi(t, a))
  return i < 0 ? null : i
}
