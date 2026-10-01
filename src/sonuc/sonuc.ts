// Formdan sonuca: tehlike kaynağı (ESHM20 tahmini ya da kullanıcının girdiği TDTH S_S'i) × cevaplar → değerlendirme.
import { tamCevaplar, type TamCevaplar, type Taslak } from '@/form/taslak'
import type { BolgeKaydi } from '@/veri/bolge'
import { degerlendir, degerlendirYigma, type Degerlendirme } from '@/yontem/degerlendir'
import type { Parametre } from '@/yontem/ryteie'
import { ilBandi, type TehlikeGirdisi } from '@/yontem/tehlike'

export interface Sonuc {
  tam: TamCevaplar
  d: Degerlendirme
  /** Seçili noktada ESHM20 ızgarasından S_S. */
  ssEshm20: number
  /** Kullanıcının AFAD TDTH raporundan girdiği S_S; yoksa null. */
  tdthSs: number | null
  /** Binanın bulunduğu bölge ve ESHM20–TDTH farkının ölçüldüğü bölgeler (metin için). */
  bolge: BolgeKaydi | null
  olculenBolgeler: BolgeKaydi[]
}

export function sonucHesapla(
  taslak: Taslak,
  ssEshm20: number | null,
  tdthSs: number | null,
  bolge: BolgeKaydi | null = null,
  bolgeler: BolgeKaydi[] = [],
): Sonuc | null {
  const tam = tamCevaplar(taslak)
  if (!tam || ssEshm20 === null) return null
  const t: TehlikeGirdisi =
    tdthSs === null
      ? { kaynak: 'eshm20', ss: ssEshm20, zemin: tam.zemin, bant: ilBandi(bolge?.tdthOran) }
      : { kaynak: 'tdth', ss: tdthSs, zemin: tam.zemin }
  const d = tam.yontem === 'yigma' ? degerlendirYigma(tam.cevaplar, t) : degerlendir(tam.cevaplar, t)
  return { tam, d, ssEshm20, tdthSs, bolge, olculenBolgeler: bolgeler.filter((b) => b.tdthNokta > 0) }
}

export interface KatkiSatiri {
  parametre: Parametre
  /** Kötü uçtaki (PP_min) katkı. */
  kotu: number
  /** İyi uçtaki (PP_max) katkı. */
  iyi: number
}

/** İki ucun kalemleri aynı sırada; satır başına iki katkı. */
export function katkiSatirlari(d: Degerlendirme): KatkiSatiri[] {
  return d.kotu.kalemler.map((k, i) => ({
    parametre: k.parametre,
    kotu: k.katki,
    iyi: d.iyi.kalemler[i].katki,
  }))
}

/** TDTH S_S girişini sayıya çevirir (virgül ya da nokta); geçersizse null. */
export function ssOku(metin: string): number | null {
  const temiz = metin.trim().replace(/\s*g$/i, '').replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(temiz)) return null
  const n = Number(temiz)
  return n > 0 && n <= 4 ? n : null
}

/** Girilen TDTH S_S'i ESHM20'den bu kadar saparsa yanlış satır (SDS, PGA) girilmiş olabilir; uyarılır, engellenmez. */
export const SUPHELI_ORAN = { alt: 0.6, ust: 1.6 } as const
export const supheliMi = (tdthSs: number, ssEshm20: number) => {
  const oran = ssEshm20 / tdthSs
  return oran < SUPHELI_ORAN.alt || oran > SUPHELI_ORAN.ust
}
