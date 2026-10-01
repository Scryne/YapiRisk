// Değerlendirme yalnız bu tarayıcıda saklanır (K-1): seçilen bina, cevaplar, kalınan adım. "Temizle" siler.
// Okunan kayıt güvenilmez sayılır: tanınmayan alan ya da değer atılır, kayıt bozuksa hiç yokmuş gibi davranılır.
import type { Secim } from '@/harita/tipler'
import type { BinaCokgeni } from '@/veri/parca'
import { KUSURLAR } from '@/yontem/ryteie'
import tablo from '@/yontem/ryteie-2019-yigma.json'
import { YIGMA_ALANLARI, type YigmaAlani } from '@/yontem/yigma'
import { adimlar, bosTaslak, type Taslak, type YigmaTaslagi } from './taslak'

export const KAYIT_ANAHTARI = 'yapirisk:degerlendirme:v1'

export interface Kayit {
  secim: Secim | null
  taslak: Taslak
  /** adimlar(taslak) içindeki konum; uzunluğu = özet. */
  adim: number
  /** Kullanıcının girdiği AFAD TDTH S_S değeri (seçili konum için); yoksa null. */
  tdthSs: number | null
}

const BILMIYORUM = 'bilmiyorum'
const secenek =
  <T extends string | number | boolean>(...izinli: T[]) =>
  (x: unknown): T | 'bilmiyorum' | undefined =>
    x === BILMIYORUM || izinli.includes(x as T) ? (x as T | 'bilmiyorum') : undefined

const alanlar = {
  malzeme: secenek('betonarme', 'yigma', 'celik', 'prefabrik'),
  sistem: secenek('BAC', 'BACP'),
  kalite: secenek('iyi', 'orta', 'kotu'),
  nizam: secenek('ayrik', 'bitisik', 'kosede'),
  katSeviyesi: secenek('ayni', 'farkli'),
  zemin: secenek('ZA', 'ZB', 'ZC', 'ZD', 'ZE'),
  donem: secenek('once-1975', '1975-1997', '1998-2006', '2007-2018', '2019-sonra'),
} as const
const varYok = secenek(true, false)

/** Yığma alanlarının izinli değerleri: tablodaki seçenekler, var/yok alanlarda true/false. */
const yigmaAlanlari = Object.fromEntries(
  YIGMA_ALANLARI.map((a) => {
    if (a === 'tur') return [a, secenek('donatisiz', 'kusatilmis', 'donatili', 'karma')]
    if (a === 'mevcutHasar' || a === 'cepheKatFarki' || a === 'yumusakKat') return [a, varYok]
    return [a, secenek(...Object.keys(tablo.tabloA6[a]))]
  }),
) as Record<YigmaAlani, (x: unknown) => unknown>

const nesne = (x: unknown): Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x) ? (x as Record<string, unknown>) : {}

export function taslakDogrula(x: unknown): Taslak {
  const ham = nesne(x)
  const t: Taslak = bosTaslak()
  for (const [ad, dogrula] of Object.entries(alanlar)) {
    const d = dogrula(ham[ad])
    if (d !== undefined) Object.assign(t, { [ad]: d })
  }
  if (ham.kat === '8+' || (Number.isInteger(ham.kat) && (ham.kat as number) >= 1 && (ham.kat as number) <= 7))
    t.kat = ham.kat as Taslak['kat']
  const kusurlar = nesne(ham.kusurlar)
  for (const k of KUSURLAR) {
    const d = varYok(kusurlar[k])
    if (d !== undefined) t.kusurlar[k] = d
  }
  const yigma = nesne(ham.yigma)
  const y: YigmaTaslagi = {}
  for (const a of YIGMA_ALANLARI) {
    const d = yigmaAlanlari[a](yigma[a])
    if (d !== undefined) Object.assign(y, { [a]: d })
  }
  if (Object.keys(y).length) t.yigma = y
  return t
}

const koordinat = (x: unknown): x is [number, number] =>
  Array.isArray(x) && x.length === 2 && x.every((n) => typeof n === 'number' && Number.isFinite(n))

function secimDogrula(x: unknown): Secim | null {
  const s = nesne(x)
  if (!koordinat(s.merkez)) return null
  if (s.tip === 'nokta') return { tip: 'nokta', merkez: s.merkez }
  const cokgenGecerli =
    Array.isArray(s.cokgen) &&
    s.cokgen.every((halka) => Array.isArray(halka) && halka.length >= 4 && halka.every(koordinat))
  if (s.tip === 'bina' && typeof s.anahtar === 'string' && cokgenGecerli)
    return { tip: 'bina', anahtar: s.anahtar, merkez: s.merkez, cokgen: s.cokgen as BinaCokgeni }
  return null
}

/** Tarayıcı depolaması gizli pencerede ya da engelliyken hata fırlatabilir; o zaman kayıt yokmuş gibi. */
function depo(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function kayitOku(): Kayit | null {
  try {
    const metin = depo()?.getItem(KAYIT_ANAHTARI)
    if (!metin) return null
    const ham = nesne(JSON.parse(metin))
    const taslak = taslakDogrula(ham.taslak)
    const son = adimlar(taslak).length
    const adim = Number.isInteger(ham.adim) ? Math.min(Math.max(ham.adim as number, 0), son) : 0
    const tdthSs =
      typeof ham.tdthSs === 'number' && ham.tdthSs > 0 && ham.tdthSs <= 4 && secimDogrula(ham.secim)
        ? ham.tdthSs
        : null
    return { secim: secimDogrula(ham.secim), taslak, adim, tdthSs }
  } catch {
    return null
  }
}

export function kayitYaz(k: Kayit) {
  try {
    depo()?.setItem(KAYIT_ANAHTARI, JSON.stringify(k))
  } catch {
    // Kota dolu ya da depolama kapalı: değerlendirme bu oturumda sürer, yalnız kalıcı olmaz.
  }
}

export function kayitSil() {
  try {
    depo()?.removeItem(KAYIT_ANAHTARI)
  } catch {
    // Depolama kapalıysa silinecek bir şey de yok.
  }
}
