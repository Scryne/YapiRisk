import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { MahalleKaydi } from '@/veri/bolge'
import { aramaDizini, duzeltmeUzakligi, katla, mahalleAra } from './mahalle-ara'

const { kayitlar } = JSON.parse(readFileSync('public/data/manisa/mahalleler.json', 'utf8')) as {
  kayitlar: MahalleKaydi[]
}
const dizin = aramaDizini(kayitlar)
const ilk = (sorgu: string) => mahalleAra(dizin, sorgu, { bolgeAdi: 'Manisa' })[0]?.kayit

describe('katla', () => {
  it('Türkçe harfleri ve büyük/küçük harfi katlar', () => {
    expect(katla('Şehzadeler')).toBe('sehzadeler')
    expect(katla('IŞIKLAR İçhisar')).toBe('isiklar ichisar')
    expect(katla('  Onüç  Eylül, Soma ')).toBe('onuc eylul soma')
    expect(katla('Gölmarmara')).toBe(katla('GOLMARMARA'))
  })
})

describe('duzeltmeUzakligi', () => {
  it('ekleme, silme, değiştirme, bitişik yer değiştirme', () => {
    expect(duzeltmeUzakligi('tevfikiye', 'tevfikye', 2)).toBe(1)
    expect(duzeltmeUzakligi('akincilar', 'akicnilar', 2)).toBe(1)
    expect(duzeltmeUzakligi('kula', 'kuka', 2)).toBe(1)
    expect(duzeltmeUzakligi('abc', 'xyzw', 1)).toBe(2)
  })
})

describe('mahalleAra (gerçek Manisa dizini)', () => {
  it('S4 örneklerini "X Mahallesi, İlçe" yazımıyla ilk sırada bulur', () => {
    expect(ilk('Akıncılar Mahallesi, Şehzadeler')).toMatchObject({ ad: 'Akıncılar', ilce: 'Şehzadeler' })
    expect(ilk('Tevfikiye Kırkağaç')).toMatchObject({ ad: 'Tevfikiye', ilce: 'Kırkağaç' })
    expect(ilk('Hashoca, Akhisar')).toMatchObject({ ad: 'Hashoca', ilce: 'Akhisar' })
    expect(ilk('Zafer Mahallesi, Soma, Manisa')).toMatchObject({ ad: 'Zafer', ilce: 'Soma' })
    expect(ilk('İçhisar Köyü')).toMatchObject({ ad: 'İçhisar' })
  })

  it('Türkçe karaktersiz ve yazım hatalı yazımı bulur', () => {
    expect(ilk('akincilar')).toMatchObject({ ad: 'Akıncılar' })
    expect(ilk('tevfikye')).toMatchObject({ ad: 'Tevfikiye' })
    expect(ilk('ichisar demirci')).toMatchObject({ ad: 'İçhisar', ilce: 'Demirci' })
  })

  it('yazarken önek eşleşmesi çalışır', () => {
    expect(mahalleAra(dizin, 'akın').some((s) => s.kayit.ad === 'Akıncılar')).toBe(true)
  })

  it('ilçe belirteci aynı adlı mahalleleri ayırır', () => {
    const zaferler = kayitlar.filter((k) => k.ad === 'Zafer')
    expect(zaferler.length).toBeGreaterThan(1)
    for (const z of zaferler) expect(ilk(`zafer ${z.ilce}`)).toMatchObject({ ad: 'Zafer', ilce: z.ilce })
  })

  it('eşleşmeyen belirteç sonucu dışarıda bırakır, boş sorgu boş döner', () => {
    expect(mahalleAra(dizin, 'qqqqzzzz')).toEqual([])
    expect(mahalleAra(dizin, '   ')).toEqual([])
    expect(mahalleAra(dizin, 'zafer qqqqzzzz')).toEqual([])
  })

  it('en fazla 8 sonuç, puana göre azalan', () => {
    const s = mahalleAra(dizin, 'yeni')
    expect(s.length).toBeLessThanOrEqual(8)
    for (let i = 1; i < s.length; i++) expect(s[i - 1].puan).toBeGreaterThanOrEqual(s[i].puan)
  })
})
