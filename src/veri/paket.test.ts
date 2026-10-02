// Repoya giren bölge paketi (public/data/manisa) istemci motoruyla okunabiliyor ve S1 ölçümleriyle tutarlı.
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { bilineer, type Izgara } from '../yontem/tehlike'
import { csvOku } from '../yontem/test-yardim'

const KOK = 'public/data/manisa'
const oku = <T>(yol: string): T => JSON.parse(readFileSync(`${KOK}/${yol}`, 'utf8')) as T

describe('Manisa tehlike paketi', () => {
  const paket = oku<{ izgaralar: Record<'PGA' | 'SS' | 'S1', Izgara>; yillikAsilmaOlasiligi: number }>(
    'tehlike-eshm20.json',
  )

  it('DD-2 (475 yıl) ve üç büyüklük', () => {
    expect(paket.yillikAsilmaOlasiligi).toBe(0.002103)
    expect(Object.keys(paket.izgaralar).sort()).toEqual(['PGA', 'S1', 'SS'])
  })

  it('10 S1 noktasında bilineer değer spike ile 3 ondalık aynı (±0,001)', () => {
    const noktalar = csvOku('spike/S1/tdth-okumalar.csv')
    const beklenen = csvOku('spike/S1/sonuc.csv')
    for (const b of beklenen) {
      const n = noktalar.find((x) => x.no === b.no)!
      const v = bilineer(
        paket.izgaralar[b.buyukluk as 'PGA' | 'SS' | 'S1'],
        Number(n.enlem),
        Number(n.boylam),
      )
      expect(Math.abs(v - Number(b.eshm20)), `${b.ilce} ${b.buyukluk}`).toBeLessThanOrEqual(0.001)
    }
  })

  it('il sınır kutusunun köşeleri ızgara içinde', () => {
    const { bolgeler } = JSON.parse(readFileSync('public/data/bolgeler.json', 'utf8')) as {
      bolgeler: { kimlik: string; sinirKutusu: [number, number, number, number] }[]
    }
    const [bmin, emin, bmax, emax] = bolgeler.find((b) => b.kimlik === 'manisa')!.sinirKutusu
    for (const [e, b] of [
      [emin, bmin],
      [emin, bmax],
      [emax, bmin],
      [emax, bmax],
    ]) {
      expect(() => bilineer(paket.izgaralar.SS, e, b)).not.toThrow()
    }
  })
})

describe('Manisa ayak izi parçaları', () => {
  const dizin = oku<{ z: number; parcalar: [number, number, number][] }>('bina/dizin.json')

  it('dizindeki her parça var, bina sayıları tutuyor (örneklem)', () => {
    expect(dizin.z).toBe(14)
    const ornek = dizin.parcalar.filter((_, i) => i % 97 === 0)
    for (const [x, y, n] of ornek) {
      const parca = JSON.parse(
        gunzipSync(readFileSync(`${KOK}/bina/${x}/${y}.json.gz`)).toString('utf8'),
      ) as {
        binalar: number[][][][]
      }
      expect(parca.binalar).toHaveLength(n)
    }
  })
})

describe('Manisa mahalle dizini', () => {
  const { kayitlar } = oku<{
    kayitlar: { ad: string; ilce: string; tur: string; konum: [number, number] }[]
  }>('mahalleler.json')

  it('S4 mahalle örnekleri dizinde, çöp "mahalle" kaydı yok', () => {
    const var_ = (ad: string, ilce: string) => kayitlar.some((k) => k.ad === ad && k.ilce === ilce)
    expect(var_('Akıncılar', 'Şehzadeler')).toBe(true)
    expect(var_('Tevfikiye', 'Kırkağaç')).toBe(true)
    expect(var_('Hashoca', 'Akhisar')).toBe(true)
    expect(kayitlar.some((k) => k.ad.toLocaleLowerCase('tr') === 'mahalle')).toBe(false)
  })
})

describe('bütün bölge paketleri', () => {
  const { bolgeler } = JSON.parse(readFileSync('public/data/bolgeler.json', 'utf8')) as {
    bolgeler: { kimlik: string; sinirKutusu: [number, number, number, number] }[]
  }

  it('kayıtta Aydın, Denizli, İzmir ve Manisa var', () => {
    expect(bolgeler.map((b) => b.kimlik).sort()).toEqual(['aydin', 'denizli', 'izmir', 'manisa'])
  })

  it.each(bolgeler.map((b) => [b.kimlik, b] as const))(
    '%s: ızgara kutuyu kapsıyor, dizinler dolu',
    (k, b) => {
      const tehlike = JSON.parse(readFileSync(`public/data/${k}/tehlike-eshm20.json`, 'utf8')) as {
        izgaralar: { SS: Izgara }
      }
      const [bmin, emin, bmax, emax] = b.sinirKutusu
      for (const [e, bo] of [
        [emin, bmin],
        [emin, bmax],
        [emax, bmin],
        [emax, bmax],
      ])
        expect(() => bilineer(tehlike.izgaralar.SS, e, bo)).not.toThrow()
      const { kayitlar } = JSON.parse(readFileSync(`public/data/${k}/mahalleler.json`, 'utf8')) as {
        kayitlar: { ilce: string }[]
      }
      expect(kayitlar.length).toBeGreaterThan(500)
      expect(new Set(kayitlar.map((m) => m.ilce)).size).toBeGreaterThanOrEqual(15)
      const dizin = JSON.parse(readFileSync(`public/data/${k}/bina/dizin.json`, 'utf8')) as {
        parcalar: [number, number, number][]
      }
      const [x, y] = dizin.parcalar[0]
      expect(readFileSync(`public/data/${k}/bina/${x}/${y}.json.gz`).length).toBeGreaterThan(0)
    },
  )
})
