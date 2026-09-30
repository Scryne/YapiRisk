import { describe, expect, it } from 'vitest'
import {
  araDeger,
  bilineer,
  f1,
  fs,
  IzgaraDisiHatasi,
  S1_BANDI,
  sd1,
  sds,
  sdsAraligi,
  tehlike,
  tehlikeBolgesi,
  type Zemin,
} from './tehlike'
import { csvOku, efehrIzgara } from './test-yardim'

const ZEMINLER: Zemin[] = ['ZA', 'ZB', 'ZC', 'ZD', 'ZE']

describe('TBDY-2018 Tablo 2.1 / 2.2 hücreleri', () => {
  // Beklenenler docs/arastirma/07 §3(b) aktarımından, JSON'dan bağımsız yazıldı.
  const FS: Record<Zemin, number[]> = {
    ZA: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
    ZB: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
    ZC: [1.3, 1.3, 1.2, 1.2, 1.2, 1.2],
    ZD: [1.6, 1.4, 1.2, 1.1, 1.0, 1.0],
    ZE: [2.4, 1.7, 1.3, 1.1, 0.9, 0.8],
  }
  const F1: Record<Zemin, number[]> = {
    ZA: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
    ZB: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
    ZC: [1.5, 1.5, 1.5, 1.5, 1.5, 1.4],
    ZD: [2.4, 2.2, 2.0, 1.9, 1.8, 1.7],
    ZE: [4.2, 3.3, 2.8, 2.4, 2.2, 2.0],
  }
  it.each(ZEMINLER)('%s', (z) => {
    expect([0.25, 0.5, 0.75, 1.0, 1.25, 1.5].map((ss) => fs(ss, z))).toEqual(FS[z])
    expect([0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((s1) => f1(s1, z))).toEqual(F1[z])
  })

  it('sütunlar arasında doğrusal, uçların dışında sabit', () => {
    expect(fs(0.625, 'ZE')).toBeCloseTo(1.5, 12)
    expect(fs(0.1, 'ZE')).toBe(2.4)
    expect(fs(2.0, 'ZE')).toBe(0.8)
    expect(f1(0.55, 'ZC')).toBeCloseTo(1.45, 12)
    expect(araDeger([0, 1], [10, 20], 0.25)).toBe(12.5)
  })
})

describe('S1: 10 AFAD TDTH raporu (DD-2, ZC)', () => {
  const raporlar = csvOku('spike/S1/tdth-okumalar.csv')

  it('10 okuma var', () => expect(raporlar).toHaveLength(10))

  it.each(raporlar.map((r) => [r.ilce, r] as const))('%s: SDS ve SD1 ±0,001', (_, r) => {
    expect(Math.abs(sds(Number(r.SS), 'ZC') - Number(r.SDS_ZC))).toBeLessThanOrEqual(0.001 + 1e-9)
    expect(Math.abs(sd1(Number(r.S1), 'ZC') - Number(r.SD1_ZC))).toBeLessThanOrEqual(0.001 + 1e-9)
  })

  it('ESHM20 ızgarasından bilineer SS/S1/PGA, spike/S1 değerleriyle (3 ondalık)', () => {
    const izgaralar = {
      SS: efehrIzgara('spike/S1/veri/manisa-SA0.20s.json'),
      S1: efehrIzgara('spike/S1/veri/manisa-SA1.00s.json'),
      PGA: efehrIzgara('spike/S1/veri/manisa-PGA.json'),
    }
    const beklenen = csvOku('spike/S1/sonuc.csv')
    expect(beklenen).toHaveLength(30)
    for (const b of beklenen) {
      const r = raporlar.find((x) => x.no === b.no)!
      const v = bilineer(izgaralar[b.buyukluk as keyof typeof izgaralar], Number(r.enlem), Number(r.boylam))
      expect(Math.abs(v - Number(b.eshm20)), `${b.ilce} ${b.buyukluk}`).toBeLessThanOrEqual(0.0005 + 1e-9)
    }
  })

  it('TDTH bölgesi her noktada ESHM20 + S1 bandının iyi ve kötü ucu arasında', () => {
    const izgara = efehrIzgara('spike/S1/veri/manisa-SA0.20s.json')
    const sira = ['I', 'II', 'III', 'IV']
    for (const r of raporlar) {
      const ss = bilineer(izgara, Number(r.enlem), Number(r.boylam))
      const t = tehlike({ kaynak: 'eshm20', ss, zemin: 'ZC' })
      const gercek = sira.indexOf(tehlikeBolgesi(Number(r.SDS_ZC), 'ZC'))
      expect(sira.indexOf(t.bolgeKotu), r.ilce).toBeLessThanOrEqual(gercek)
      expect(sira.indexOf(t.bolgeIyi), r.ilce).toBeGreaterThanOrEqual(gercek)
    }
  })

  it('S1 kararı: Akhisar ESHM20 ile II, bant kötü ucu TDTH ile aynı I', () => {
    const izgara = efehrIzgara('spike/S1/veri/manisa-SA0.20s.json')
    const akhisar = raporlar.find((r) => r.ilce === 'Akhisar')!
    const ss = bilineer(izgara, Number(akhisar.enlem), Number(akhisar.boylam))
    expect(tehlikeBolgesi(sds(ss, 'ZC'), 'ZC')).toBe('II')
    expect(tehlike({ kaynak: 'eshm20', ss, zemin: 'ZC' }).bolgeKotu).toBe('I')
  })
})

describe('bilineer ızgara', () => {
  const izgara = {
    enlemler: [38, 39],
    boylamlar: [27, 28, 29],
    degerler: [
      [1, 2, 3],
      [3, 4, 5],
    ],
  }
  it('düğümde değerin kendisi, ortada ağırlıklı ortalama', () => {
    expect(bilineer(izgara, 39, 28)).toBe(4)
    expect(bilineer(izgara, 38.5, 28.5)).toBeCloseTo(3.5, 12)
    expect(bilineer(izgara, 38.25, 27)).toBeCloseTo(1.5, 12)
  })
  it('ızgara dışı hata verir', () => {
    expect(() => bilineer(izgara, 37.9, 28)).toThrow(IzgaraDisiHatasi)
    expect(() => bilineer(izgara, 38.5, 29.01)).toThrow(IzgaraDisiHatasi)
  })
})

describe('RYTEİE Tablo A.2 tehlike bölgeleri', () => {
  it.each([
    [1.0, 'ZC', 'I'],
    [0.9999, 'ZD', 'II'],
    [0.75, 'ZE', 'II'],
    [0.7499, 'ZC', 'III'],
    [0.5, 'ZC', 'III'],
    [0.4999, 'ZD', 'IV'],
    [1.2, 'ZA', 'II'],
    [1.0, 'ZB', 'II'],
    [0.9999, 'ZB', 'III'],
    [0.75, 'ZA', 'III'],
    [0.7499, 'ZA', 'IV'],
    [0.5, 'ZB', 'IV'],
    [0.3, 'ZA', 'IV'],
    [1.0, 'bilmiyorum', 'I'],
    [0.6, 'bilmiyorum', 'III'],
  ] as const)('SDS %s, %s → %s', (s, zemin, bolge) => {
    expect(tehlikeBolgesi(s, zemin)).toBe(bolge)
  })
})

describe('K-9: zemin "bilmiyorum"', () => {
  it('SDS, ZC/ZD/ZE katsayılarının en büyüğüyle', () => {
    for (const ss of [0.3, 0.6, 0.9, 1.1, 1.4]) {
      expect(sds(ss, 'bilmiyorum')).toBe(Math.max(sds(ss, 'ZC'), sds(ss, 'ZD'), sds(ss, 'ZE')))
    }
    expect(sds(0.3, 'bilmiyorum')).toBeCloseTo(0.3 * (2.4 - (0.05 / 0.25) * 0.7), 12) // ZE
    expect(sds(1.4, 'bilmiyorum')).toBeCloseTo(1.4 * 1.2, 12) // ZC
  })
  it('hiçbir SS için bilinen bir zeminden daha düşük bölge vermez (kötü yön)', () => {
    const sira = ['I', 'II', 'III', 'IV']
    for (let ss = 0.05; ss <= 2; ss += 0.01) {
      const b = sira.indexOf(tehlikeBolgesi(sds(ss, 'bilmiyorum'), 'bilmiyorum'))
      for (const z of ZEMINLER) expect(b).toBeLessThanOrEqual(sira.indexOf(tehlikeBolgesi(sds(ss, z), z)))
    }
  })
})

describe('SDS aralığı', () => {
  const ornekle = (a: number, b: number, zemin: Zemin | 'bilmiyorum') => {
    const d: number[] = []
    for (let i = 0; i <= 20000; i++) d.push(sds(a + ((b - a) * i) / 20000, zemin))
    return [Math.min(...d), Math.max(...d)]
  }

  it('ZE 1,19–1,25 arasında SDS azalır; aralık bunu yakalar', () => {
    expect(sds(1.25, 'ZE')).toBeLessThan(sds(1.1875, 'ZE'))
    // Tepe noktası (1,1875) aralığın içinde: en büyük değer ne uçta ne tablo sütununda.
    const [, maks] = sdsAraligi(1.1, 1.25, 'ZE')
    expect(maks).toBeCloseTo(1.9 * 1.1875 - 0.8 * 1.1875 ** 2, 12)
    expect(maks).toBeGreaterThan(Math.max(sds(1.1, 'ZE'), sds(1.25, 'ZE')))
  })

  it.each([
    [0.2, 1.7, 'ZE'],
    [0.4, 1.3, 'ZD'],
    [0.6, 0.9, 'ZC'],
    [0.9, 1.4, 'bilmiyorum'],
    [0.1, 2.0, 'bilmiyorum'],
    [0.3, 0.45, 'ZB'],
    [1.1, 1.24, 'ZE'],
  ] as const)('[%s, %s] %s: yoğun örneklemeden dar değil', (a, b, z) => {
    const [min, maks] = sdsAraligi(a, b, z)
    const [oMin, oMaks] = ornekle(a, b, z)
    expect(min).toBeLessThanOrEqual(oMin + 1e-12)
    expect(maks).toBeGreaterThanOrEqual(oMaks - 1e-12)
    expect(oMin - min).toBeLessThan(1e-6)
    expect(maks - oMaks).toBeLessThan(1e-6)
  })
})

describe('tehlike()', () => {
  it('ESHM20: SS bandı SS/1,25 … SS/0,72, kötü uç yüksek SDS', () => {
    const t = tehlike({ kaynak: 'eshm20', ss: 0.722, zemin: 'ZC' })
    expect(t.ssAraligi![0]).toBeCloseTo(0.722 / S1_BANDI.ustOran, 12)
    expect(t.ssAraligi![1]).toBeCloseTo(0.722 / S1_BANDI.altOran, 12)
    expect(t.sdsAraligi[0]).toBeCloseTo(sds(0.722 / 1.25, 'ZC'), 12)
    expect(t.sdsAraligi[1]).toBeCloseTo(sds(0.722 / 0.72, 'ZC'), 12)
    expect([t.bolgeKotu, t.bolgeIyi]).toEqual(['I', 'III'])
  })
  it('TDTH SDS girilince tek değer, bant yok', () => {
    const t = tehlike({ kaynak: 'tdth', sds: 1.172, zemin: 'ZC' })
    expect(t).toEqual({
      kaynak: 'tdth',
      zemin: 'ZC',
      sdsAraligi: [1.172, 1.172],
      bolgeKotu: 'I',
      bolgeIyi: 'I',
    })
  })
})
