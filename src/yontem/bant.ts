// K-12: profesyonel inceleme önceliği bantları. Bant PP aralığının kötü ucuyla (PP_min) seçilir.
export type Bant = 'yuksek' | 'orta' | 'dusuk'

/** PP < 50 yüksek öncelik · 50 ≤ PP < 100 orta · PP ≥ 100 düşük. */
export const BANT_SINIRLARI = { yuksekAlti: 50, ortaAlti: 100 } as const

const SIRA: Bant[] = ['yuksek', 'orta', 'dusuk']

export function bant(pp: number): Bant {
  if (pp < BANT_SINIRLARI.yuksekAlti) return 'yuksek'
  if (pp < BANT_SINIRLARI.ortaAlti) return 'orta'
  return 'dusuk'
}

export interface BantSonucu {
  /** Kötü uçtan (PP_min) seçilen bant. */
  bant: Bant
  /** PP aralığının değdiği bantlar, yüksek öncelikten düşüğe. Tek elemanlıysa aralık bant değiştirmiyor. */
  yayilim: Bant[]
}

export function bantSonucu(ppMin: number, ppMax: number): BantSonucu {
  if (ppMin > ppMax) throw new RangeError(`PP aralığı ters: ${ppMin} > ${ppMax}`)
  const [i, j] = [SIRA.indexOf(bant(ppMin)), SIRA.indexOf(bant(ppMax))]
  return { bant: SIRA[i], yayilim: SIRA.slice(i, j + 1) }
}
