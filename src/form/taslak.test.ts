import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { degerlendir, degerlendirYigma } from '@/yontem/degerlendir'
import { bilineer, ilBandi, type Izgara } from '@/yontem/tehlike'
import { KUSURLAR } from '@/yontem/ryteie'
import yigmaTablo from '@/yontem/ryteie-2019-yigma.json'
import { YIGMA_ALANLARI } from '@/yontem/yigma'
import { KAYIT_ANAHTARI, kayitOku, kayitSil, kayitYaz, taslakDogrula } from './kayit'
import {
  adimlar,
  BETONARME_ADIMLARI,
  bosMu,
  bosTaslak,
  cevaplandi,
  ilkEksik,
  kapsamDisi,
  tamCevaplar,
  TEK_KATTA_ATLANAN,
  YIGMA_ADIMLARI,
  type Taslak,
  type YigmaTaslagi,
} from './taslak'

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

const yigmaDolu = (ek: YigmaTaslagi = {}, t: Partial<Taslak> = {}): Taslak => ({
  malzeme: 'yigma',
  kat: 2,
  kusurlar: {},
  nizam: 'ayrik',
  zemin: 'ZC',
  ...t,
  yigma: {
    tur: 'donatisiz',
    malzemeKalitesi: 'iyi',
    duvarIsciligi: 'iyi',
    mevcutHasar: false,
    plan: 'duzenli',
    duvarMiktari: 'cok',
    yatayHatil: 'duvarUstu',
    boslukDuzeni: 'duzenli',
    cepheKatFarki: false,
    yumusakKat: false,
    doseme: 'betonarme',
    harc: 'cimento',
    duvarDuvar: 'iyi',
    duvarDoseme: 'iyi',
    cati: 'kiremit',
    ...ek,
  },
})

/** Betonarme taslağının motor girdisi (tip daraltmalı). */
function betonarme(t: Taslak) {
  const c = tamCevaplar(t)
  if (c?.yontem !== 'betonarme') throw new Error('betonarme bekleniyordu')
  return c
}

describe('kapsam ayıklama (K-8)', () => {
  it.each([
    [{ malzeme: 'yigma' }, null],
    [{ malzeme: 'yigma', kat: 5 }, null],
    [{ malzeme: 'yigma', kat: 6 }, 'yigmaKat'],
    [{ malzeme: 'yigma', kat: '8+' }, 'yigmaKat'],
    [{ malzeme: 'celik' }, 'celik'],
    [{ malzeme: 'prefabrik' }, 'prefabrik'],
    [{ kat: '8+' }, 'kat'],
    [{ malzeme: 'betonarme', kat: 7 }, null],
    [{ malzeme: 'bilmiyorum', kat: 1 }, null],
  ] as const)('%o → %s', (ek, beklenen) => expect(kapsamDisi({ ...bosTaslak(), ...ek })).toBe(beklenen))

  it('kapsam dışı taslak motora gitmez', () => {
    expect(tamCevaplar(dolu({ malzeme: 'celik' }))).toBeNull()
    expect(tamCevaplar(dolu({ kat: '8+' }))).toBeNull()
    expect(tamCevaplar(yigmaDolu({}, { kat: 6 }))).toBeNull()
  })
})

describe('taslak → motor girdisi', () => {
  it('eksik zorunlu soru varken null, isteğe bağlı yapım dönemi beklenmez', () => {
    expect(tamCevaplar(bosTaslak())).toBeNull()
    expect(tamCevaplar(dolu({ zemin: undefined }))).toBeNull()
    expect(tamCevaplar(dolu())).not.toBeNull()
    expect(ilkEksik(dolu())).toBeNull()
    expect(ilkEksik(dolu({ kalite: undefined }))).toBe(BETONARME_ADIMLARI.indexOf('kalite'))
  })

  it('bitişik nizam döşeme seviyesi cevaplanmadan tamamlanmış sayılmaz', () => {
    expect(cevaplandi(dolu({ nizam: 'bitisik' }), 'nizam')).toBe(false)
    expect(cevaplandi(dolu({ nizam: 'bitisik', katSeviyesi: 'bilmiyorum' }), 'nizam')).toBe(true)
    expect(cevaplandi(dolu({ nizam: 'bilmiyorum' }), 'nizam')).toBe(true)
  })

  it('Şekil A.1 nizamı: bitişik = orta, köşede bitişik = kenar', () => {
    expect(betonarme(dolu({ nizam: 'bitisik', katSeviyesi: 'farkli' })).cevaplar.nizam).toEqual({
      tip: 'bitisik',
      konum: 'orta',
      katSeviyesi: 'farkli',
    })
    expect(betonarme(dolu({ nizam: 'kosede', katSeviyesi: 'ayni' })).cevaplar.nizam).toEqual({
      tip: 'bitisik',
      konum: 'kenar',
      katSeviyesi: 'ayni',
    })
  })

  it('malzeme "bilmiyorum" betonarme varsayılarak değerlendirilir ve işaretlenir', () => {
    expect(tamCevaplar(dolu())!.malzemeVarsayildi).toBe(false)
    expect(tamCevaplar(dolu({ malzeme: 'bilmiyorum' }))!.malzemeVarsayildi).toBe(true)
    expect(tamCevaplar(dolu({ malzeme: 'bilmiyorum' }))!.yontem).toBe('betonarme')
  })

  it('K-12 örneği formdan: 4 katlı BAÇ, bölge I, yumuşak kat + orta kalite → PP 25', () => {
    const t = betonarme(
      dolu({ kalite: 'orta', kusurlar: { ...dolu().kusurlar, yumusakKat: true }, zemin: 'ZC' }),
    )
    const d = degerlendir(t.cevaplar, { kaynak: 'tdth', sds: 1.2, zemin: t.zemin })
    expect(d.kotu.pp).toBe(25)
    expect(d.bant.bant).toBe('yuksek')
  })
})

/** Uygulamanın Manisa'da kullandığı bant (bölge kaydından, sonucHesapla gibi). */
const MANISA_BANDI = ilBandi(
  (
    JSON.parse(readFileSync('public/data/bolgeler.json', 'utf8')) as {
      bolgeler: { kimlik: string; tdthOran: [number, number] }[]
    }
  ).bolgeler.find((b) => b.kimlik === 'manisa')!.tdthOran,
)

const manisaMerkeziSs = () => {
  const { izgaralar } = JSON.parse(readFileSync('public/data/manisa/tehlike-eshm20.json', 'utf8')) as {
    izgaralar: { SS: Izgara }
  }
  return bilineer(izgaralar.SS, 38.614, 27.4303)
}

it('e2e/form.spec.ts cevap seti, Manisa merkezi (38,614; 27,4303): PP −10 … 20, yüksek öncelik', () => {
  const t = betonarme(
    dolu({
      sistem: 'bilmiyorum',
      kalite: 'orta',
      kusurlar: { ...dolu().kusurlar, yumusakKat: true, agirCikma: 'bilmiyorum' },
      nizam: 'bitisik',
      katSeviyesi: 'farkli',
      zemin: 'bilmiyorum',
      donem: '1998-2006',
    }),
  )
  const d = degerlendir(t.cevaplar, {
    kaynak: 'eshm20',
    ss: manisaMerkeziSs(),
    zemin: t.zemin,
    bant: MANISA_BANDI,
  })
  expect([d.kotu.pp, d.iyi.pp, d.bant.bant]).toEqual([-10, 20, 'yuksek'])
})

describe('yığma taslağı (Faz 10)', () => {
  it('yığmada adımlar Şekil A.2 soruları, ortak sorular yerinde', () => {
    expect(adimlar(yigmaDolu())).toBe(YIGMA_ADIMLARI)
    expect(adimlar(dolu())).toBe(BETONARME_ADIMLARI)
    expect(adimlar(dolu({ malzeme: 'bilmiyorum' }))).toBe(BETONARME_ADIMLARI)
    expect(YIGMA_ADIMLARI.slice(0, 2)).toEqual(['malzeme', 'kat'])
    expect(YIGMA_ADIMLARI.slice(-3)).toEqual(['nizam', 'zemin', 'donem'])
    expect(YIGMA_ADIMLARI).toHaveLength(2 + YIGMA_ALANLARI.length + 3)
  })

  it('tam yığma taslağı yığma motoruna gider; eksik alan varken null', () => {
    expect(tamCevaplar(yigmaDolu())!.yontem).toBe('yigma')
    expect(ilkEksik(yigmaDolu())).toBeNull()
    expect(tamCevaplar(yigmaDolu({ cati: undefined }))).toBeNull()
    expect(ilkEksik(yigmaDolu({ cati: undefined }))).toBe(YIGMA_ADIMLARI.indexOf('yigma.cati'))
    expect(cevaplandi(yigmaDolu({ harc: 'bilmiyorum' }), 'yigma.harc')).toBe(true)
  })

  it('malzeme değişince betonarme cevapları yığma girdisine karışmaz', () => {
    const c = tamCevaplar(yigmaDolu({}, { sistem: 'BACP', kusurlar: { yumusakKat: true } }))!
    expect(c.yontem).toBe('yigma')
    expect(c.cevaplar).not.toHaveProperty('sistem')
    expect(c.cevaplar).not.toHaveProperty('kusurlar')
  })

  it('tek katlı yığmada puanı değiştirmeyen iki soru atlanır, nötr değerle girer', () => {
    const tek = yigmaDolu({ yumusakKat: undefined, boslukDuzeni: undefined }, { kat: 1 })
    expect(adimlar(tek)).toHaveLength(YIGMA_ADIMLARI.length - 2)
    expect(adimlar(tek)).not.toContain('yigma.yumusakKat')
    expect(adimlar(tek)).not.toContain('yigma.boslukDuzeni')
    expect(ilkEksik(tek)).toBeNull()
    const c = tamCevaplar(tek)
    if (c?.yontem !== 'yigma') throw new Error('yığma bekleniyordu')
    expect([c.cevaplar.yumusakKat, c.cevaplar.boslukDuzeni]).toEqual([false, 'duzenli'])
    // Atlamanın dayanağı: 1 katta bu iki kalemin puanı (OPᵢ) 0.
    for (const a of Object.keys(TEK_KATTA_ATLANAN) as (keyof typeof TEK_KATTA_ATLANAN)[])
      expect(yigmaTablo.tabloA9[a]['1']).toBe(0)
    expect(adimlar(yigmaDolu({}, { kat: 2 }))).toBe(YIGMA_ADIMLARI)
  })

  it('yığma cevabı olan taslak boş sayılmaz', () => {
    expect(bosMu({ kusurlar: {}, yigma: { cati: 'toprak' } })).toBe(false)
    expect(bosMu({ kusurlar: {}, yigma: {} })).toBe(true)
  })
})

it('e2e/form.spec.ts yığma cevap seti, Manisa merkezi: motorun değeri e2e beklentisine yazıldı', () => {
  // Cevaplar e2e/form.spec.ts "yığma bina" testindekiyle aynı tutulur.
  const t = tamCevaplar(
    yigmaDolu(
      {
        tur: 'bilmiyorum',
        mevcutHasar: true,
        malzemeKalitesi: 'orta',
        duvarIsciligi: 'orta',
        harc: 'camur',
        duvarMiktari: 'orta',
        yatayHatil: 'yok',
        doseme: 'betonarme',
        duvarDuvar: 'kotu',
        duvarDoseme: 'bilmiyorum',
        cati: 'toprak',
      },
      { zemin: 'bilmiyorum' },
    ),
  )
  if (t?.yontem !== 'yigma') throw new Error('yığma bekleniyordu')
  const d = degerlendirYigma(t.cevaplar, {
    kaynak: 'eshm20',
    ss: manisaMerkeziSs(),
    zemin: t.zemin,
    bant: MANISA_BANDI,
  })
  expect([d.kotu.pp, d.iyi.pp, d.bant.bant, d.belirsiz]).toMatchInlineSnapshot(`
    [
      50,
      60,
      "orta",
      [
        "duzlemDisi",
      ],
    ]
  `)
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
      tdthSs: 1.158,
    }
    kayitYaz(kayit)
    expect(kayitOku()).toEqual(kayit)
    kayitSil()
    expect(kayitOku()).toBeNull()
  })

  it('yığma taslağını olduğu gibi okur', () => {
    const kayit = { secim: null, taslak: yigmaDolu({ harc: 'bilmiyorum' }), adim: 7, tdthSs: null }
    kayitYaz(kayit)
    expect(kayitOku()).toEqual(kayit)
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
      adim: BETONARME_ADIMLARI.length,
      tdthSs: null,
    })
  })

  it('yığma alanlarında tanınmayanları atar; adım yığma listesine göre sınırlanır', () => {
    depo.set(
      KAYIT_ANAHTARI,
      JSON.stringify({
        secim: null,
        taslak: {
          malzeme: 'yigma',
          kusurlar: {},
          yigma: { tur: 'kusatilmis', mevcutHasar: true, cati: 'saman', harc: 'bilmiyorum', bilinmeyen: 1 },
        },
        adim: 99,
      }),
    )
    expect(kayitOku()).toEqual({
      secim: null,
      taslak: {
        malzeme: 'yigma',
        kusurlar: {},
        yigma: { tur: 'kusatilmis', mevcutHasar: true, harc: 'bilmiyorum' },
      },
      adim: YIGMA_ADIMLARI.length,
      tdthSs: null,
    })
  })

  it('depolama erişimi hata fırlatırsa kayıt yokmuş gibi davranır', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new DOMException('engelli', 'SecurityError')
      },
    })
    expect(kayitOku()).toBeNull()
    expect(() => kayitYaz({ secim: null, taslak: bosTaslak(), adim: 0, tdthSs: null })).not.toThrow()
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
