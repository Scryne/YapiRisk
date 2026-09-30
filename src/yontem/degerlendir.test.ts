import { describe, expect, it } from 'vitest'
import { belirsizParametreler, ucGirdisi, type FormCevaplari } from './aralik'
import { bant, bantSonucu } from './bant'
import { degerlendir } from './degerlendir'
import { KUSURLAR, puan, type Kusur } from './ryteie'

const cevap = (ek: Partial<FormCevaplari> = {}): FormCevaplari => ({
  kat: 4,
  sistem: 'BAC',
  kalite: 'iyi',
  kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, false])) as Record<Kusur, boolean>,
  nizam: { tip: 'ayrik' },
  ...ek,
})
const hepsiBilinmiyor = (): FormCevaplari => ({
  kat: 4,
  sistem: 'bilmiyorum',
  kalite: 'bilmiyorum',
  kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, 'bilmiyorum'])) as Record<Kusur, 'bilmiyorum'>,
  nizam: 'bilmiyorum',
})

describe('bant (K-12)', () => {
  it.each([
    [-100, 'yuksek'],
    [49, 'yuksek'],
    [49.99, 'yuksek'],
    [50, 'orta'],
    [99, 'orta'],
    [100, 'dusuk'],
    [220, 'dusuk'],
  ] as const)('PP %s → %s', (pp, b) => expect(bant(pp)).toBe(b))

  it('bant kötü uçtan; yayılım değdiği bantları sırayla verir', () => {
    expect(bantSonucu(25, 25)).toEqual({ bant: 'yuksek', yayilim: ['yuksek'] })
    expect(bantSonucu(45, 70)).toEqual({ bant: 'yuksek', yayilim: ['yuksek', 'orta'] })
    expect(bantSonucu(30, 145)).toEqual({ bant: 'yuksek', yayilim: ['yuksek', 'orta', 'dusuk'] })
    expect(bantSonucu(100, 145)).toEqual({ bant: 'dusuk', yayilim: ['dusuk'] })
    expect(() => bantSonucu(70, 25)).toThrow(RangeError)
  })
})

describe('"bilmiyorum" uçları', () => {
  it('bilinen cevaplar iki uçta da aynı', () => {
    const c = cevap({ kalite: 'orta', nizam: { tip: 'bitisik', katSeviyesi: 'ayni', konum: 'kenar' } })
    expect(ucGirdisi(c, 'kotu')).toEqual(ucGirdisi(c, 'iyi'))
    expect(belirsizParametreler(c)).toEqual([])
  })

  it('sistem "bilmiyorum" iki uçta da BAÇ (A.2.1.1), belirsizlik sayılmaz', () => {
    const c = cevap({ sistem: 'bilmiyorum' })
    expect(ucGirdisi(c, 'kotu').sistem).toBe('BAC')
    expect(ucGirdisi(c, 'iyi').sistem).toBe('BAC')
    expect(belirsizParametreler(c)).toEqual([])
  })

  it('hepsi "bilmiyorum": kötü uç tüm kusurlar var + kötü kalite + bitişik farklı kenar', () => {
    const c = hepsiBilinmiyor()
    const kotu = ucGirdisi(c, 'kotu')
    const iyi = ucGirdisi(c, 'iyi')
    expect(kotu.kalite).toBe('kotu')
    expect(iyi.kalite).toBe('iyi')
    expect(Object.values(kotu.kusurlar).every(Boolean)).toBe(true)
    expect(Object.values(iyi.kusurlar).some(Boolean)).toBe(false)
    expect(kotu.nizam).toEqual({ tip: 'bitisik', katSeviyesi: 'farkli', konum: 'kenar' })
    expect(iyi.nizam).toEqual({ tip: 'ayrik' })
    // 4 kat, bölge I: 70 − 30 − 2·15 − 30 − 15 − 10 − 5 − 3 − 15
    expect(puan('I', kotu).pp).toBe(70 - 30 - 30 - 30 - 15 - 10 - 5 - 3 - 15)
    expect(puan('I', iyi).pp).toBe(70)
    expect(belirsizParametreler(c)).toEqual(['gorunenKalite', ...KUSURLAR, 'yapiNizami'])
  })

  it('bitişik ama kat seviyesi bilinmiyor: yalnız o boyut açılır', () => {
    const c = cevap({ nizam: { tip: 'bitisik', katSeviyesi: 'bilmiyorum', konum: 'orta' } })
    expect(ucGirdisi(c, 'kotu').nizam).toEqual({ tip: 'bitisik', katSeviyesi: 'farkli', konum: 'orta' })
    expect(ucGirdisi(c, 'iyi').nizam).toEqual({ tip: 'bitisik', katSeviyesi: 'ayni', konum: 'orta' })
    expect(belirsizParametreler(c)).toEqual(['yapiNizami'])
  })

  it('her "bilmiyorum" PP aralığını yalnız genişletir: kötü uç ≤ her gerçek seçenek ≤ iyi uç', () => {
    const c = cevap({ kalite: 'bilmiyorum', kusurlar: { ...cevap().kusurlar, kisaKolon: 'bilmiyorum' } })
    const [min, maks] = [puan('I', ucGirdisi(c, 'kotu')).pp, puan('I', ucGirdisi(c, 'iyi')).pp]
    for (const kalite of ['iyi', 'orta', 'kotu'] as const) {
      for (const kisaKolon of [true, false]) {
        const kesin = ucGirdisi(cevap(), 'iyi')
        const pp = puan('I', { ...kesin, kalite, kusurlar: { ...kesin.kusurlar, kisaKolon } }).pp
        expect(pp).toBeGreaterThanOrEqual(min)
        expect(pp).toBeLessThanOrEqual(maks)
      }
    }
  })
})

describe('degerlendir(): uçtan uca', () => {
  it('TDTH girilmiş, her şey bilinen 4 katlı BAÇ kusursuz: tek değer 70, orta öncelik', () => {
    const d = degerlendir(cevap(), { kaynak: 'tdth', sds: 1.39, zemin: 'ZC' })
    expect([d.kotu.pp, d.iyi.pp]).toEqual([70, 70])
    expect(d.bant).toEqual({ bant: 'orta', yayilim: ['orta'] })
    expect(d.belirsiz).toEqual([])
  })

  it('ESHM20 bandı bölge I–III: aralık 70 … 130, bant kötü uçtan orta, düşüğe yayılıyor', () => {
    const d = degerlendir(cevap(), { kaynak: 'eshm20', ss: 0.722, zemin: 'ZC' })
    expect([d.tehlike.bolgeKotu, d.tehlike.bolgeIyi]).toEqual(['I', 'III'])
    expect([d.kotu.pp, d.iyi.pp]).toEqual([70, 130])
    expect(d.bant).toEqual({ bant: 'orta', yayilim: ['orta', 'dusuk'] })
  })

  it('yumuşak kat + orta kalite (K-12 örneği): yüksek öncelik', () => {
    const c = cevap({ kalite: 'orta', kusurlar: { ...cevap().kusurlar, yumusakKat: true } })
    const d = degerlendir(c, { kaynak: 'tdth', sds: 1.2, zemin: 'ZD' })
    expect(d.kotu.pp).toBe(25)
    expect(d.bant.bant).toBe('yuksek')
  })

  it('zemin ve her şey bilinmiyor: kötü uç en elverişsiz, iyi uç kusursuz BAÇ', () => {
    const d = degerlendir(hepsiBilinmiyor(), { kaynak: 'eshm20', ss: 1.027, zemin: 'bilmiyorum' })
    expect(d.tehlike.bolgeKotu).toBe('I')
    expect(d.kotu.pp).toBe(70 - 138)
    expect(d.iyi.pp).toBe(puan(d.tehlike.bolgeIyi, ucGirdisi(hepsiBilinmiyor(), 'iyi')).pp)
    expect(d.bant.bant).toBe('yuksek')
    expect(d.belirsiz).toHaveLength(8)
  })

  it('8 kat kapsam dışı hatası verir', () => {
    expect(() => degerlendir(cevap({ kat: 8 }), { kaynak: 'tdth', sds: 1, zemin: 'ZC' })).toThrow(/1–7/)
  })
})
