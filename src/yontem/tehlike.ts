// Tehlike: ESHM20 ızgarasından SS, TBDY-2018 zemin katsayıları (Tablo 2.1/2.2), RYTEİE Tablo A.2 bölgesi
// ve S1'de ölçülen ESHM20 → TDTH belirsizlik bandı (K-5, K-9).
import ryteie from './ryteie-2019.json'
import tbdy from './tbdy-2018.json'
import type { Bolge } from './ryteie'

export type Zemin = 'ZA' | 'ZB' | 'ZC' | 'ZD' | 'ZE'
export type ZeminCevabi = Zemin | 'bilmiyorum'

/** K-9: zemin bilinmiyorsa bölge için zayıf zemin grubu, katsayı için bu grubun en büyüğü. */
export const BILINMEYEN_ZEMIN_ADAYLARI: readonly Zemin[] = ['ZC', 'ZD', 'ZE']

/** SS_ESHM20 / SS_TDTH oran aralığı: gerçek SS ∈ [SS_ESHM20 / ustOran ; SS_ESHM20 / altOran]. */
export interface S1Bandi {
  altOran: number
  ustOran: number
}

/**
 * S1: oran il il ölçüldü (10'ar ilçe merkezi): Manisa 0,72 … 1,25, İzmir 0,80 … 1,34, Aydın 0,52 … 0,97. Fark ile
 * değişiyor (ortalama 0,89 / 0,98 / 0,76), bu yüzden her ilde kendi bandı kullanılır. Ölçülmemiş ilde bütün
 * ölçümlerin birleşimi: bu sabit.
 */
export const S1_BANDI: S1Bandi = { altOran: 0.52, ustOran: 1.34 }

/**
 * Güvensiz yön sınırının tavanı: 10 noktalık ölçüm ilin en kötü noktasını kaçırabilir, bu yüzden hiçbir ilde alt oran
 * ilk iki ilde doğrulanan 0,72'nin üstüne çıkmaz (İzmir'de ölçülen 0,80 yerine 0,72).
 */
export const GUVENSIZ_YON_TAVANI = 0.72

/** Bir ilin bandı; ölçülmemişse birleşik bant. */
export function ilBandi(olculen: readonly [number, number] | null | undefined): S1Bandi {
  if (!olculen) return S1_BANDI
  return { altOran: Math.min(olculen[0], GUVENSIZ_YON_TAVANI), ustOran: olculen[1] }
}

/** Düzenli enlem/boylam ızgarası; `degerler[i][j]` = `enlemler[i]`, `boylamlar[j]` (ikisi de artan). */
export interface Izgara {
  enlemler: number[]
  boylamlar: number[]
  degerler: number[][]
}

export class IzgaraDisiHatasi extends Error {
  constructor(enlem: number, boylam: number) {
    super(`Nokta tehlike ızgarasının dışında: ${enlem}, ${boylam}`)
    this.name = 'IzgaraDisiHatasi'
  }
}

function aralikBul(eksen: number[], x: number): [number, number] {
  if (x < eksen[0] || x > eksen[eksen.length - 1]) return [-1, -1]
  let i = 0
  while (i < eksen.length - 2 && x > eksen[i + 1]) i++
  return [i, i + 1]
}

export function bilineer(izgara: Izgara, enlem: number, boylam: number): number {
  const [i0, i1] = aralikBul(izgara.enlemler, enlem)
  const [j0, j1] = aralikBul(izgara.boylamlar, boylam)
  if (i0 < 0 || j0 < 0) throw new IzgaraDisiHatasi(enlem, boylam)
  const ty = (enlem - izgara.enlemler[i0]) / (izgara.enlemler[i1] - izgara.enlemler[i0])
  const tx = (boylam - izgara.boylamlar[j0]) / (izgara.boylamlar[j1] - izgara.boylamlar[j0])
  const v = izgara.degerler
  return (v[i0][j0] * (1 - tx) + v[i0][j1] * tx) * (1 - ty) + (v[i1][j0] * (1 - tx) + v[i1][j1] * tx) * ty
}

/** TBDY tablo okuması: sütunlar arasında doğrusal, uçların dışında sabit. */
export function araDeger(xs: number[], ys: number[], x: number): number {
  if (x <= xs[0]) return ys[0]
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1]
  let i = 0
  while (x > xs[i + 1]) i++
  return ys[i] + ((x - xs[i]) / (xs[i + 1] - xs[i])) * (ys[i + 1] - ys[i])
}

export const fs = (ss: number, zemin: Zemin) => araDeger(tbdy.tablo21.ss, tbdy.tablo21.fs[zemin], ss)
export const f1 = (s1: number, zemin: Zemin) => araDeger(tbdy.tablo22.s1, tbdy.tablo22.f1[zemin], s1)

const adaylar = (zemin: ZeminCevabi): readonly Zemin[] =>
  zemin === 'bilmiyorum' ? BILINMEYEN_ZEMIN_ADAYLARI : [zemin]

/** SDS = Fs · SS; zemin bilinmiyorsa aday zeminlerin en büyüğü. */
export const sds = (ss: number, zemin: ZeminCevabi) => Math.max(...adaylar(zemin).map((z) => fs(ss, z) * ss))

/** SD1 = F1 · S1; zemin bilinmiyorsa aday zeminlerin en büyüğü. */
export const sd1 = (s1: number, zemin: ZeminCevabi) => Math.max(...adaylar(zemin).map((z) => f1(s1, z) * s1))

/** RYTEİE Tablo A.2. Zemin bilinmiyorsa zayıf zemin (ZC/ZD/ZE) satırları kullanılır. */
export function tehlikeBolgesi(sdsDegeri: number, zemin: ZeminCevabi): Bolge {
  const { kayaZemin, zayifZemin, digerleri } = ryteie.tabloA2
  const grup = zemin !== 'bilmiyorum' && kayaZemin.zeminler.includes(zemin) ? kayaZemin : zayifZemin
  for (const [esik, bolge] of grup.esikler) {
    if (sdsDegeri >= (esik as number)) return bolge as Bolge
  }
  return digerleri as Bolge
}

/**
 * SS ∈ [a, b] iken SDS(SS)'in kesin en küçük ve en büyük değeri.
 * Her zemin için Fs parçalı doğrusal olduğundan SDS = Fs · SS parça parça ikinci derecedendir ve tekdüze
 * değildir (ör. ZE, 1,19 < SS < 1,25 arasında azalır). Aday noktalar: uçlar, tablo sütunları, her parçanın
 * tepe noktası ve iki zeminin eğrilerinin kesişimi; aralarında zarf tekdüzedir.
 */
export function sdsAraligi(a: number, b: number, zemin: ZeminCevabi): [number, number] {
  const xs = tbdy.tablo21.ss
  const zeminler = adaylar(zemin)
  const noktalar = new Set<number>([a, b, ...xs])

  const parcalar = (z: Zemin) =>
    xs.slice(0, -1).map((x0, i) => {
      const x1 = xs[i + 1]
      const [y0, y1] = [tbdy.tablo21.fs[z][i], tbdy.tablo21.fs[z][i + 1]]
      const egim = (y1 - y0) / (x1 - x0)
      return { x0, x1, sabit: y0 - egim * x0, egim } // Fs = sabit + egim · SS
    })

  for (const z of zeminler) {
    for (const p of parcalar(z)) {
      // (sabit + egim·s)·s tepe noktası: s = −sabit / (2·egim)
      if (p.egim !== 0) noktalar.add(-p.sabit / (2 * p.egim))
    }
  }
  for (const z1 of zeminler) {
    for (const z2 of zeminler) {
      if (z1 >= z2) continue
      const p1 = parcalar(z1)
      const p2 = parcalar(z2)
      p1.forEach((p, i) => {
        const q = p2[i]
        if (p.egim !== q.egim) noktalar.add((q.sabit - p.sabit) / (p.egim - q.egim))
      })
      // Tablo dışında Fs sabit; eğriler ya çakışır ya kesişmez.
    }
  }

  const degerler = [...noktalar].filter((s) => s >= a && s <= b).map((s) => sds(s, zemin))
  return [Math.min(...degerler), Math.max(...degerler)]
}

/**
 * ESHM20 S_S'i S1 bandıyla aralığa açılır. TDTH (AFAD) değeri kesindir: rapordaki S_S girilirse SDS formdaki
 * zeminle hesaplanır (zemin bilinmiyorsa K-9 adayları), SDS girilirse olduğu gibi kullanılır.
 */
export type TehlikeGirdisi =
  | { kaynak: 'eshm20'; ss: number; zemin: ZeminCevabi; /** Varsayılan S1_BANDI. */ bant?: S1Bandi }
  | { kaynak: 'tdth'; ss: number; zemin: ZeminCevabi }
  | { kaynak: 'tdth'; sds: number; zemin: ZeminCevabi }

export interface TehlikeSonucu {
  kaynak: TehlikeGirdisi['kaynak']
  zemin: ZeminCevabi
  /** ESHM20 kaynaklıysa kullanılan oran bandı. */
  bant?: S1Bandi
  /** ESHM20'de S1 bandıyla tahmini TDTH S_S aralığı; TDTH S_S girildiyse tek değer. SDS girildiyse yok. */
  ssAraligi?: [number, number]
  sdsAraligi: [number, number]
  /** Kötü uç: en yüksek SDS'in bölgesi. */
  bolgeKotu: Bolge
  /** İyi uç: en düşük SDS'in bölgesi. */
  bolgeIyi: Bolge
}

export function tehlike(girdi: TehlikeGirdisi): TehlikeSonucu {
  if (girdi.kaynak === 'tdth' && 'ss' in girdi) {
    const sdsAr = sdsAraligi(girdi.ss, girdi.ss, girdi.zemin)
    return {
      kaynak: 'tdth',
      zemin: girdi.zemin,
      ssAraligi: [girdi.ss, girdi.ss],
      sdsAraligi: sdsAr,
      bolgeKotu: tehlikeBolgesi(sdsAr[1], girdi.zemin),
      bolgeIyi: tehlikeBolgesi(sdsAr[0], girdi.zemin),
    }
  }
  if (girdi.kaynak === 'tdth') {
    const b = tehlikeBolgesi(girdi.sds, girdi.zemin)
    return {
      kaynak: 'tdth',
      zemin: girdi.zemin,
      sdsAraligi: [girdi.sds, girdi.sds],
      bolgeKotu: b,
      bolgeIyi: b,
    }
  }
  const bant = girdi.bant ?? S1_BANDI
  const ssAraligi: [number, number] = [girdi.ss / bant.ustOran, girdi.ss / bant.altOran]
  const sdsAr = sdsAraligi(ssAraligi[0], ssAraligi[1], girdi.zemin)
  return {
    kaynak: 'eshm20',
    zemin: girdi.zemin,
    bant,
    ssAraligi,
    sdsAraligi: sdsAr,
    bolgeKotu: tehlikeBolgesi(sdsAr[1], girdi.zemin),
    bolgeIyi: tehlikeBolgesi(sdsAr[0], girdi.zemin),
  }
}
