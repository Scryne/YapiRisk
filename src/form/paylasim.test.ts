import { describe, expect, it } from 'vitest'
import { KUSURLAR } from '@/yontem/ryteie'
import { paylasimOku, paylasimParcasi } from './paylasim'
import type { Taslak } from './taslak'

const taslak: Taslak = {
  malzeme: 'yigma',
  kat: 2,
  kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, false])),
  nizam: 'kosede',
  katSeviyesi: 'bilmiyorum',
  zemin: 'ZC',
  yigma: { tur: 'kusatilmis', mevcutHasar: true, harc: 'bilmiyorum', cati: 'toprak' },
}

describe('paylaşım bağlantısı', () => {
  it('konum, cevaplar ve AFAD değeri gidip geliyor (Türkçe karakterli değerler dahil)', () => {
    const p = {
      secim: { tip: 'nokta' as const, merkez: [27.4303, 38.614] as [number, number] },
      taslak,
      tdthSs: 1.158,
    }
    const parca = paylasimParcasi(p)
    expect(parca).toMatch(/^#paylas=[A-Za-z0-9_-]+$/)
    expect(paylasimOku(parca)).toEqual(p)
  })

  it('bina seçimi noktaya iner, koordinat 6 ondalığa yuvarlanır', () => {
    const parca = paylasimParcasi({
      secim: { tip: 'bina', anahtar: 'x', merkez: [27.43031234567, 38.6141234567], cokgen: [] },
      taslak,
      tdthSs: null,
    })
    expect(paylasimOku(parca)!.secim).toEqual({ tip: 'nokta', merkez: [27.430312, 38.614123] })
  })

  it('bozuk, eski sürüm ya da yabancı değerli bağlantı yok sayılır; tanınmayan cevaplar atılır', () => {
    expect(paylasimOku('#konum=38,27')).toBeNull()
    expect(paylasimOku('#paylas=bozuk!!')).toBeNull()
    const kod = (o: unknown) => `#paylas=${btoa(JSON.stringify(o)).replace(/=+$/, '')}`
    expect(paylasimOku(kod({ v: 2, k: [38, 27], t: {} }))).toBeNull()
    expect(paylasimOku(kod({ v: 1, k: [138, 27], t: {} }))).toBeNull()
    expect(
      paylasimOku(kod({ v: 1, k: [38, 27], t: { kat: 99, sistem: 'celik', kusurlar: {} }, s: 9 })),
    ).toEqual({
      secim: { tip: 'nokta', merkez: [27, 38] },
      taslak: { kusurlar: {} },
      tdthSs: null,
    })
  })
})
