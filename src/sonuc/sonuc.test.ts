import { describe, expect, it } from 'vitest'
import type { Taslak } from '@/form/taslak'
import { KUSURLAR } from '@/yontem/ryteie'
import { katkiSatirlari, sonucHesapla, ssOku, supheliMi } from './sonuc'

const taslak: Taslak = {
  malzeme: 'betonarme',
  kat: 4,
  sistem: 'BAC',
  kalite: 'orta',
  kusurlar: {
    ...Object.fromEntries(KUSURLAR.map((k) => [k, false])),
    yumusakKat: true,
    agirCikma: 'bilmiyorum',
  },
  nizam: 'ayrik',
  zemin: 'ZC',
}

describe('sonucHesapla', () => {
  it('cevap eksikse ya da bölge dışındaysa null', () => {
    expect(sonucHesapla({ kusurlar: {} }, 1, null)).toBeNull()
    expect(sonucHesapla(taslak, null, null)).toBeNull()
  })

  it('TDTH S_S girilince tehlike aralığı kalkar; yalnız "bilmiyorum" uçları kalır', () => {
    const eshm = sonucHesapla(taslak, 1.027, null)!
    const tdth = sonucHesapla(taslak, 1.027, 1.158)!
    expect(eshm.d.tehlike.kaynak).toBe('eshm20')
    expect(eshm.d.tehlike.ssAraligi![0]).toBeLessThan(eshm.d.tehlike.ssAraligi![1])
    expect(tdth.d.tehlike.kaynak).toBe('tdth')
    expect(tdth.d.tehlike.ssAraligi).toEqual([1.158, 1.158])
    // Şehzadeler TDTH SS 1,158, ZC → SDS 1,390 → bölge I (S1 raporu).
    expect(tdth.d.tehlike.sdsAraligi[0]).toBeCloseTo(1.39, 3)
    expect(tdth.d.tehlike.bolgeKotu).toBe('I')
    // Ağır çıkma bilinmiyor: 4 kat → 0 … −30
    expect(tdth.d.iyi.pp - tdth.d.kotu.pp).toBe(30)
  })

  it('katkı satırları iki ucun PP toplamını verir', () => {
    const { d } = sonucHesapla(taslak, 1.027, null)!
    const satirlar = katkiSatirlari(d)
    expect(satirlar.reduce((t, s) => t + s.kotu, 0)).toBe(d.kotu.pp)
    expect(satirlar.reduce((t, s) => t + s.iyi, 0)).toBe(d.iyi.pp)
    expect(satirlar.find((s) => s.parametre === 'agirCikma')).toEqual({
      parametre: 'agirCikma',
      kotu: -30,
      iyi: 0,
    })
  })
})

describe('TDTH girişi', () => {
  it.each([
    ['1,158', 1.158],
    ['1.158', 1.158],
    [' 0,9 g ', 0.9],
    ['2', 2],
  ])('%s → %s', (metin, n) => expect(ssOku(metin)).toBe(n))

  it.each(['', 'abc', '0', '-1', '5', '1,2,3', '1e3'])('%s geçersiz', (metin) =>
    expect(ssOku(metin)).toBeNull(),
  )

  it('ESHM20 ile oran 0,6–1,6 dışındaysa şüpheli (S_DS ya da PGA girilmiş olabilir)', () => {
    expect(supheliMi(1.158, 1.027)).toBe(false)
    expect(supheliMi(1.39, 1.027)).toBe(false) // S_DS girilmiş ama fark küçük: yakalanamaz, not
    expect(supheliMi(0.47, 1.027)).toBe(true) // PGA
    expect(supheliMi(3, 1.027)).toBe(true)
  })
})
