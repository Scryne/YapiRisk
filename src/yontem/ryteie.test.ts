import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { KapsamDisiHatasi, KUSURLAR, katGrubu, puan, type Bolge, type KesinGirdi, type Kusur } from './ryteie'
import { sds, tehlikeBolgesi, type Zemin } from './tehlike'

const kusursuz = (kat: number, ek: Partial<KesinGirdi> = {}): KesinGirdi => ({
  kat,
  sistem: 'BAC',
  kalite: 'iyi',
  kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, false])) as Record<Kusur, boolean>,
  nizam: { tip: 'ayrik' },
  ...ek,
})
const tek = (kat: number, kusur: Kusur) =>
  puan('I', kusursuz(kat, { kusurlar: { ...kusursuz(kat).kusurlar, [kusur]: true } })).pp -
  puan('I', kusursuz(kat)).pp

// Beklenen değerler Resmî Gazete 30688 ek s. 34–35 sayfa görüntüsünden, JSON'dan bağımsız yazıldı.
const TEMSILCI = { '1-2': 1, '3': 3, '4': 4, '5': 5, '6-7': 7 } as const
type Grup = keyof typeof TEMSILCI

describe('Tablo A.1: taban puanı ve yapısal sistem puanı', () => {
  const A1: [Grup, number, number, number, number, number][] = [
    ['1-2', 90, 120, 160, 195, 100],
    ['3', 80, 100, 140, 170, 85],
    ['4', 70, 90, 130, 160, 75],
    ['5', 60, 80, 110, 135, 65],
    ['6-7', 50, 65, 90, 110, 55],
  ]
  it.each(A1)('%s kat', (grup, i, ii, iii, iv, ysp) => {
    const kat = TEMSILCI[grup]
    const bolgeler: Bolge[] = ['I', 'II', 'III', 'IV']
    expect(bolgeler.map((b) => puan(b, kusursuz(kat)).pp)).toEqual([i, ii, iii, iv])
    expect(puan('I', kusursuz(kat, { sistem: 'BACP' })).pp - i).toBe(ysp)
  })
})

describe('Tablo A.3 × A.4: olumsuzluk katkıları', () => {
  // yumuşak kat, görünen kalite, ağır çıkma, düşeyde, planda, kısa kolon, tabii zemin eğimi
  const A4: [Grup, number, number, number, number, number, number, number][] = [
    ['1-2', -10, -10, -10, -5, -5, -5, -3],
    ['3', -20, -10, -20, -10, -10, -5, -3],
    ['4', -30, -15, -30, -15, -10, -5, -3],
    ['5', -30, -25, -30, -15, -10, -5, -3],
    ['6-7', -30, -30, -30, -15, -10, -5, -3],
  ]
  it.each(A4)('%s kat', (grup, yk, kalite, cikma, duseyde, planda, kisa, egim) => {
    const kat = TEMSILCI[grup]
    expect(tek(kat, 'yumusakKat')).toBe(yk)
    expect(tek(kat, 'agirCikma')).toBe(cikma)
    expect(tek(kat, 'duseydeDuzensizlik')).toBe(duseyde)
    expect(tek(kat, 'plandaDuzensizlik')).toBe(planda)
    expect(tek(kat, 'kisaKolon')).toBe(kisa)
    expect(tek(kat, 'zeminEgimi')).toBe(egim)
    const taban = puan('I', kusursuz(kat)).pp
    expect(puan('I', kusursuz(kat, { kalite: 'orta' })).pp - taban).toBe(kalite) // Oᵢ = 1
    expect(puan('I', kusursuz(kat, { kalite: 'kotu' })).pp - taban).toBe(2 * kalite) // Oᵢ = 2
  })

  it.each([1, 3, 4, 5, 7])('yapı nizamı, %i kat: ayrık 0, bitişik aynı/farklı × orta/kenar', (kat) => {
    const taban = puan('I', kusursuz(kat)).pp
    const n = (katSeviyesi: 'ayni' | 'farkli', konum: 'orta' | 'kenar') =>
      puan('I', kusursuz(kat, { nizam: { tip: 'bitisik', katSeviyesi, konum } })).pp - taban
    expect([n('ayni', 'orta'), n('ayni', 'kenar'), n('farkli', 'orta'), n('farkli', 'kenar')]).toEqual([
      0, -10, -5, -15,
    ])
  })
})

describe('kat grubu ve kapsam', () => {
  it('serbest kat adedini gruplar', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(katGrubu)).toEqual(['1-2', '1-2', '3', '4', '5', '6-7', '6-7'])
  })
  it.each([0, 8, 12, 2.5, Number.NaN])('%s kat kapsam dışı', (kat) => {
    expect(() => katGrubu(kat)).toThrow(KapsamDisiHatasi)
  })
})

describe('kalem kalem katkı', () => {
  it('kalemlerin toplamı PP; TP ve YSP ayrı kalem; −0 yok', () => {
    const g = kusursuz(4, {
      sistem: 'BACP',
      kalite: 'kotu',
      nizam: { tip: 'bitisik', katSeviyesi: 'farkli', konum: 'kenar' },
      kusurlar: { ...kusursuz(4).kusurlar, yumusakKat: true, kisaKolon: true },
    })
    const s = puan('II', g)
    expect(s.pp).toBe(90 + 75 - 30 - 30 - 5 - 15)
    expect(s.kalemler.reduce((t, k) => t + k.katki, 0)).toBe(s.pp)
    expect(s.kalemler.find((k) => k.parametre === 'gorunenKalite')).toEqual({
      parametre: 'gorunenKalite',
      deger: 2,
      puan: -15,
      katki: -30,
    })
    expect(s.kalemler.map((k) => k.parametre)).toHaveLength(10)
    expect(s.kalemler.every((k) => !Object.is(k.katki, -0))).toBe(true)
  })
})

describe('K-12 örnekleri (Final-Doküman)', () => {
  it('4 katlı BAÇ, bölge I, kusursuz → 70', () => expect(puan('I', kusursuz(4)).pp).toBe(70))
  it('aynı bina, yumuşak kat + orta kalite → 25', () => {
    const g = kusursuz(4, { kalite: 'orta', kusurlar: { ...kusursuz(4).kusurlar, yumusakKat: true } })
    expect(puan('I', g).pp).toBe(25)
  })
  it('4 katlı BAÇP kusursuz → 145', () => expect(puan('I', kusursuz(4, { sistem: 'BACP' })).pp).toBe(145))
})

type Varsayim = 'ham' | 'ort' | 'kotu'
interface FiksturBina {
  kat: number
  zemin: Zemin
  ssEshm20: number
  perde: boolean
  yumusakKat: boolean
  kisaKolon: boolean
  sonuc: Record<Varsayim, { sds: number; bolge: Bolge; pp: number }>
}

describe('spike eşdeğerliği: ACI-133, 154 bina (spike/S3/ryteie.py)', () => {
  const fikstur = JSON.parse(readFileSync('src/yontem/__fikstur__/aci133-pp.json', 'utf8')) as {
    oranlar: Record<Varsayim, number>
    binalar: FiksturBina[]
  }

  it('fikstür kapsamı: 154 bina, üç bölge, iki zemin', () => {
    expect(fikstur.binalar).toHaveLength(154)
    const bolgeler = new Set(fikstur.binalar.flatMap((b) => Object.values(b.sonuc).map((s) => s.bolge)))
    expect([...bolgeler].sort()).toEqual(['I', 'II', 'III'])
    expect([...new Set(fikstur.binalar.map((b) => b.zemin))].sort()).toEqual(['ZC', 'ZD'])
  })

  it('SDS, bölge ve PP Python ile birebir (3 tehlike varsayımı × 154)', () => {
    const farklar: string[] = []
    let karsilastirma = 0
    fikstur.binalar.forEach((b, i) => {
      for (const [ad, oran] of Object.entries(fikstur.oranlar) as [Varsayim, number][]) {
        const beklenen = b.sonuc[ad]
        const s = sds(b.ssEshm20 / oran, b.zemin)
        const bolge = tehlikeBolgesi(s, b.zemin)
        const pp = puan(
          bolge,
          kusursuz(b.kat, {
            sistem: b.perde ? 'BACP' : 'BAC',
            kusurlar: { ...kusursuz(b.kat).kusurlar, yumusakKat: b.yumusakKat, kisaKolon: b.kisaKolon },
          }),
        ).pp
        karsilastirma++
        if (Math.abs(s - beklenen.sds) > 1e-12 || bolge !== beklenen.bolge || pp !== beklenen.pp) {
          farklar.push(
            `#${i} ${ad}: sds ${s}/${beklenen.sds} bölge ${bolge}/${beklenen.bolge} pp ${pp}/${beklenen.pp}`,
          )
        }
      }
    })
    expect(karsilastirma).toBe(462)
    expect(farklar).toEqual([])
  })
})
