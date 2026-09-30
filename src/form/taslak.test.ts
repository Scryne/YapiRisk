import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { degerlendir } from '@/yontem/degerlendir'
import { bilineer, type Izgara } from '@/yontem/tehlike'
import { KUSURLAR } from '@/yontem/ryteie'
import { KAYIT_ANAHTARI, kayitOku, kayitSil, kayitYaz, taslakDogrula } from './kayit'
import { ADIMLAR, bosTaslak, cevaplandi, ilkEksik, kapsamDisi, tamCevaplar, type Taslak } from './taslak'

const dolu = (ek: Partial<Taslak> = {}): Taslak => ({
  malzeme: 'betonarme',
  kat: 4,
  sistem: 'BAC',
  kalite: 'iyi',
  kusurlar: Object.fromEntries(KUSURLAR.map((k) => [k, false])),
  nizam: 'ayrik',
  zemin: 'ZC',
  ...ek,
})

describe('kapsam ayıklama (K-8)', () => {
  it.each([
    [{ malzeme: 'yigma' }, 'yigma'],
    [{ malzeme: 'celik' }, 'celik'],
    [{ malzeme: 'prefabrik' }, 'prefabrik'],
    [{ kat: '8+' }, 'kat'],
    [{ malzeme: 'betonarme', kat: 7 }, null],
    [{ malzeme: 'bilmiyorum', kat: 1 }, null],
  ] as const)('%o → %s', (ek, beklenen) => expect(kapsamDisi({ ...bosTaslak(), ...ek })).toBe(beklenen))

  it('kapsam dışı taslak motora gitmez', () => {
    expect(tamCevaplar(dolu({ malzeme: 'yigma' }))).toBeNull()
    expect(tamCevaplar(dolu({ kat: '8+' }))).toBeNull()
  })
})

describe('taslak → motor girdisi', () => {
  it('eksik zorunlu soru varken null, isteğe bağlı yapım dönemi beklenmez', () => {
    expect(tamCevaplar(bosTaslak())).toBeNull()
    expect(tamCevaplar(dolu({ zemin: undefined }))).toBeNull()
    expect(tamCevaplar(dolu())).not.toBeNull()
    expect(ilkEksik(dolu())).toBeNull()
    expect(ilkEksik(dolu({ kalite: undefined }))).toBe(ADIMLAR.indexOf('kalite'))
  })

  it('bitişik nizam döşeme seviyesi cevaplanmadan tamamlanmış sayılmaz', () => {
    expect(cevaplandi(dolu({ nizam: 'bitisik' }), 'nizam')).toBe(false)
    expect(cevaplandi(dolu({ nizam: 'bitisik', katSeviyesi: 'bilmiyorum' }), 'nizam')).toBe(true)
    expect(cevaplandi(dolu({ nizam: 'bilmiyorum' }), 'nizam')).toBe(true)
  })

  it('Şekil A.1 nizamı: bitişik = orta, köşede bitişik = kenar', () => {
    expect(tamCevaplar(dolu({ nizam: 'bitisik', katSeviyesi: 'farkli' }))!.cevaplar.nizam).toEqual({
      tip: 'bitisik',
      konum: 'orta',
      katSeviyesi: 'farkli',
    })
    expect(tamCevaplar(dolu({ nizam: 'kosede', katSeviyesi: 'ayni' }))!.cevaplar.nizam).toEqual({
      tip: 'bitisik',
      konum: 'kenar',
      katSeviyesi: 'ayni',
    })
  })

  it('malzeme "bilmiyorum" betonarme varsayılarak değerlendirilir ve işaretlenir', () => {
    expect(tamCevaplar(dolu())!.malzemeVarsayildi).toBe(false)
    expect(tamCevaplar(dolu({ malzeme: 'bilmiyorum' }))!.malzemeVarsayildi).toBe(true)
  })

  it('K-12 örneği formdan: 4 katlı BAÇ, bölge I, yumuşak kat + orta kalite → PP 25', () => {
    const t = tamCevaplar(
      dolu({ kalite: 'orta', kusurlar: { ...dolu().kusurlar, yumusakKat: true }, zemin: 'ZC' }),
    )!
    const d = degerlendir(t.cevaplar, { kaynak: 'tdth', sds: 1.2, zemin: t.zemin })
    expect(d.kotu.pp).toBe(25)
    expect(d.bant.bant).toBe('yuksek')
  })
})

it('e2e/form.spec.ts cevap seti, Manisa merkezi (38,614; 27,4303): PP −10 … 20, yüksek öncelik', () => {
  const t = tamCevaplar(
    dolu({
      sistem: 'bilmiyorum',
      kalite: 'orta',
      kusurlar: { ...dolu().kusurlar, yumusakKat: true, agirCikma: 'bilmiyorum' },
      nizam: 'bitisik',
      katSeviyesi: 'farkli',
      zemin: 'bilmiyorum',
      donem: '1998-2006',
    }),
  )!
  const { izgaralar } = JSON.parse(readFileSync('public/data/manisa/tehlike-eshm20.json', 'utf8')) as {
    izgaralar: { SS: Izgara }
  }
  const ss = bilineer(izgaralar.SS, 38.614, 27.4303)
  const d = degerlendir(t.cevaplar, { kaynak: 'eshm20', ss, zemin: t.zemin })
  expect([d.kotu.pp, d.iyi.pp, d.bant.bant]).toEqual([-10, 20, 'yuksek'])
})

describe('kayıt (localStorage)', () => {
  let depo: Map<string, string>
  beforeEach(() => {
    depo = new Map()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => depo.get(k) ?? null,
        setItem: (k: string, v: string) => depo.set(k, v),
        removeItem: (k: string) => depo.delete(k),
      },
    })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('yazılanı okur, siler', () => {
    const kayit = {
      secim: { tip: 'nokta' as const, merkez: [27.43, 38.61] as [number, number] },
      taslak: dolu({ nizam: 'bitisik', katSeviyesi: 'bilmiyorum', donem: '1998-2006' }),
      adim: 5,
    }
    kayitYaz(kayit)
    expect(kayitOku()).toEqual(kayit)
    kayitSil()
    expect(kayitOku()).toBeNull()
  })

  it('bozuk ya da yabancı değerleri atar', () => {
    depo.set(KAYIT_ANAHTARI, '{bozuk')
    expect(kayitOku()).toBeNull()

    depo.set(
      KAYIT_ANAHTARI,
      JSON.stringify({
        secim: { tip: 'bina', anahtar: 'x', merkez: [1, 2], cokgen: 'yok' },
        taslak: { kat: 9, sistem: 'celik', kalite: 'orta', kusurlar: { kisaKolon: 'evet', agirCikma: true } },
        adim: 99,
      }),
    )
    expect(kayitOku()).toEqual({
      secim: null,
      taslak: { kalite: 'orta', kusurlar: { agirCikma: true } },
      adim: ADIMLAR.length,
    })
  })

  it('depolama erişimi hata fırlatırsa kayıt yokmuş gibi davranır', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new DOMException('engelli', 'SecurityError')
      },
    })
    expect(kayitOku()).toBeNull()
    expect(() => kayitYaz({ secim: null, taslak: bosTaslak(), adim: 0 })).not.toThrow()
    expect(() => kayitSil()).not.toThrow()
  })

  it('taslakDogrula boş girdide boş taslak verir', () => {
    expect(taslakDogrula(null)).toEqual(bosTaslak())
    expect(taslakDogrula({ kat: '8+', kusurlar: { yumusakKat: 'bilmiyorum' } })).toEqual({
      kat: '8+',
      kusurlar: { yumusakKat: 'bilmiyorum' },
    })
  })
})
