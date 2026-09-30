import { describe, expect, it } from 'vitest'
import { baglantiOku } from './baglanti'
import { cokgenIcinde, cokgenMerkezi, geometriIcinde } from './geometri'

describe('cokgenMerkezi', () => {
  it('kare ve L biçimli çokgenin alan merkezi', () => {
    const kare: [number, number][] = [
      [27, 38],
      [27.001, 38],
      [27.001, 38.001],
      [27, 38.001],
      [27, 38],
    ]
    const [x, y] = cokgenMerkezi(kare)
    expect(x).toBeCloseTo(27.0005, 9)
    expect(y).toBeCloseTo(38.0005, 9)
    // L: 2×1 alt dikdörtgen + 1×1 üst kare → merkez (5/6, 5/6) birim
    const L: [number, number][] = [
      [0, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [0, 2],
      [0, 0],
    ]
    const [lx, ly] = cokgenMerkezi(L)
    expect(lx).toBeCloseTo(5 / 6, 12)
    expect(ly).toBeCloseTo(5 / 6, 12)
  })
  it('dejenere halkada köşelerin ortalaması', () => {
    expect(
      cokgenMerkezi([
        [1, 1],
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([1, 1])
  })
})

describe('cokgenIcinde / geometriIcinde', () => {
  const dis = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ]
  const delik = [
    [4, 4],
    [6, 4],
    [6, 6],
    [4, 6],
    [4, 4],
  ]
  it('delik dışarıda sayılır', () => {
    expect(cokgenIcinde([2, 2], [dis, delik])).toBe(true)
    expect(cokgenIcinde([5, 5], [dis, delik])).toBe(false)
    expect(cokgenIcinde([11, 5], [dis])).toBe(false)
  })
  it('MultiPolygon', () => {
    const g = { type: 'MultiPolygon' as const, coordinates: [[dis], [dis.map(([x, y]) => [x + 20, y])]] }
    expect(geometriIcinde([25, 5], g)).toBe(true)
    expect(geometriIcinde([15, 5], g)).toBe(false)
  })
})

describe('baglantiOku', () => {
  it('konum ve harita parçalarını okur, [boylam, enlem] döner', () => {
    expect(baglantiOku('#konum=38.6140,27.4303')).toEqual({ tip: 'konum', merkez: [27.4303, 38.614] })
    expect(baglantiOku('#harita=17/38.61/27.43')).toEqual({
      tip: 'harita',
      merkez: [27.43, 38.61],
      yakinlik: 17,
    })
  })
  it('bozuk ya da boş değerleri yok sayar', () => {
    for (const h of [
      '',
      '#',
      '#konum=abc',
      '#konum=95,27',
      '#konum=,27',
      '#harita=40/38/27',
      '#harita=17/38',
    ]) {
      expect(baglantiOku(h), h).toBeNull()
    }
  })
})
