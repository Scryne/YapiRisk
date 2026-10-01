import { describe, expect, it } from 'vitest'
import { degerlendirYigma } from './degerlendir'
import { KapsamDisiHatasi, type Bolge } from './ryteie'
import {
  duzlemDisiDegeri,
  yigmaBelirsizParametreler,
  yigmaPuani,
  yigmaUcGirdisi,
  YIGMA_ALANLARI,
  type YigmaCevaplari,
  type YigmaGirdi,
  type YigmaParametre,
} from './yigma'

const kusursuz = (kat: number, ek: Partial<YigmaGirdi> = {}): YigmaGirdi => ({
  kat,
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
  nizam: { tip: 'ayrik' },
  ...ek,
})
const fark = (kat: number, ek: Partial<YigmaGirdi>, bolge: Bolge = 'I') =>
  yigmaPuani(bolge, kusursuz(kat, ek)).pp - yigmaPuani(bolge, kusursuz(kat)).pp
const katki = (bolge: Bolge, g: YigmaGirdi, p: YigmaParametre) =>
  yigmaPuani(bolge, g).kalemler.find((k) => k.parametre === p)!.katki

// Beklenen değerler Resmî Gazete 30688 ek s. 39–41 sayfa görüntüsünden, JSON'dan bağımsız yazıldı.
describe('Tablo A.5: taban puanı', () => {
  it.each([
    [1, 110, 120, 130],
    [2, 100, 110, 120],
    [3, 90, 100, 110],
    [4, 80, 90, 100],
    [5, 70, 80, 90],
  ])('%i kat', (kat, i, iiiii, iv) => {
    const bolgeler: Bolge[] = ['I', 'II', 'III', 'IV']
    expect(bolgeler.map((b) => yigmaPuani(b, kusursuz(kat)).pp)).toEqual([i, iiiii, iiiii, iv])
  })

  it('Tablo A.2 bölgeleri II ve III aynı sütuna düşer', () => {
    expect(yigmaPuani('II', kusursuz(3)).sutun).toBe('II-III')
    expect(yigmaPuani('III', kusursuz(3)).sutun).toBe('II-III')
    expect(yigmaPuani('I', kusursuz(3)).sutun).toBe('I')
  })
})

describe('A.2.2.4: yapısal sistem puanı', () => {
  it.each([
    ['donatisiz', 0],
    ['karma', 0],
    ['kusatilmis', 30],
    ['donatili', 60],
  ] as const)('%s → %i', (tur, ysp) => expect(fark(2, { tur })).toBe(ysp))
})

describe('Tablo A.6 × A.7: mevcut durum ve kalite (kattan bağımsız)', () => {
  it.each([1, 3, 5])('%i kat', (kat) => {
    expect([fark(kat, { malzemeKalitesi: 'orta' }), fark(kat, { malzemeKalitesi: 'kotu' })]).toEqual([
      -10, -20,
    ])
    expect([fark(kat, { duvarIsciligi: 'orta' }), fark(kat, { duvarIsciligi: 'kotu' })]).toEqual([-5, -10])
    expect(fark(kat, { mevcutHasar: true })).toBe(-5)
  })
})

describe('Tablo A.6 × A.8: planda olumsuzluklar (satırlar 1–5 kat)', () => {
  it.each([
    [1, -5, -5, -5],
    [2, -10, -5, -5],
    [3, -10, -10, -5],
    [4, -15, -10, -5],
    [5, -20, -15, -5],
  ])('%i kat: geometri %i, duvar miktarı %i, hatıl %i', (kat, geo, dm, hatil) => {
    expect([fark(kat, { plan: 'duzensiz' }), fark(kat, { plan: 'asiriDuzensiz' })]).toEqual([geo, 2 * geo])
    expect([fark(kat, { duvarMiktari: 'orta' }), fark(kat, { duvarMiktari: 'az' })]).toEqual([dm, 2 * dm])
    expect(fark(kat, { yatayHatil: 'yok' })).toBe(hatil)
    expect(fark(kat, { yatayHatil: 'pencereUstu' })).toBe(0)
  })
})

describe('Tablo A.6 × A.9: düşeyde olumsuzluklar', () => {
  it.each([
    [1, 0, -5, 0],
    [2, -5, -5, -5],
    [3, -5, -5, -5],
    [4, -10, -5, -10],
    [5, -10, -5, -10],
  ])('%i kat: boşluk %i, cephe %i, yumuşak kat %i', (kat, bosluk, cephe, yk) => {
    expect([fark(kat, { boslukDuzeni: 'azDuzenli' }), fark(kat, { boslukDuzeni: 'duzensiz' })]).toEqual([
      bosluk,
      2 * bosluk,
    ])
    expect(fark(kat, { cepheKatFarki: true })).toBe(cephe)
    expect(fark(kat, { yumusakKat: true })).toBe(yk)
  })
})

describe('Tablo A.10: nizam ve kat seviyesi', () => {
  it.each([1, 3, 5])(
    '%i kat: ayrık 0, orta-aynı 0, kenar-aynı −5, orta-farklı −5, kenar-farklı −10',
    (kat) => {
      const n = (katSeviyesi: 'ayni' | 'farkli', konum: 'orta' | 'kenar') =>
        fark(kat, { nizam: { tip: 'bitisik', katSeviyesi, konum } })
      expect([n('ayni', 'orta'), n('ayni', 'kenar'), n('farkli', 'orta'), n('farkli', 'kenar')]).toEqual([
        0, -5, -5, -10,
      ])
    },
  )
})

describe('A.2.2.9 ve A.2.2.12: düzlem dışı davranış', () => {
  it('11–14 numaralı değerlerin toplamı 3 ya da daha fazlaysa Oᵢ = 1, OPᵢ = −10', () => {
    const iki = { doseme: 'ahsap', harc: 'camur', duvarDuvar: 'iyi', duvarDoseme: 'iyi' } as const
    expect(duzlemDisiDegeri(iki)).toBe(0)
    expect(fark(3, iki)).toBe(0)
    expect(duzlemDisiDegeri({ ...iki, duvarDuvar: 'kotu' })).toBe(1)
    expect(fark(3, { ...iki, duvarDuvar: 'kotu' })).toBe(-10)
    expect(fark(3, { doseme: 'volto', harc: 'yok', duvarDuvar: 'kotu', duvarDoseme: 'kotu' })).toBe(-10)
  })

  it('kireç, çamur ve harçsız duvar aynı değeri alır; betonarme döşeme ve çimento harç 0', () => {
    for (const harc of ['kirec', 'camur', 'yok'] as const)
      expect(duzlemDisiDegeri({ doseme: 'ahsap', harc, duvarDuvar: 'kotu', duvarDoseme: 'iyi' })).toBe(1)
    expect(
      duzlemDisiDegeri({ doseme: 'betonarme', harc: 'cimento', duvarDuvar: 'kotu', duvarDoseme: 'kotu' }),
    ).toBe(0)
  })
})

describe('A.2.2.13: toprak dam', () => {
  it('yalnız toprak çatı −10', () => {
    expect(fark(2, { cati: 'toprak' })).toBe(-10)
    for (const cati of ['kiremit', 'sac', 'beton'] as const) expect(fark(2, { cati })).toBe(0)
  })
})

describe('uçtan uca örnek (elle hesaplandı)', () => {
  it('2 kat, bölge I, çok kusurlu: PP = 10', () => {
    const g = kusursuz(2, {
      malzemeKalitesi: 'orta', // 1 · −10
      duvarIsciligi: 'kotu', // 2 · −5
      mevcutHasar: true, // −5
      plan: 'duzensiz', // 1 · −10
      duvarMiktari: 'az', // 2 · −5
      yatayHatil: 'yok', // −5
      boslukDuzeni: 'azDuzenli', // 1 · −5
      cepheKatFarki: true, // −5
      doseme: 'ahsap',
      harc: 'camur',
      duvarDuvar: 'kotu', // 1 + 1 + 1 ≥ 3 → −10
      cati: 'toprak', // −10
      nizam: { tip: 'bitisik', katSeviyesi: 'farkli', konum: 'kenar' }, // −10
    })
    const s = yigmaPuani('I', g)
    expect(s.pp).toBe(100 - 10 - 10 - 5 - 10 - 10 - 5 - 5 - 5 - 10 - 10 - 10)
    expect(s.pp).toBe(10)
    expect(s.kalemler.reduce((t, k) => t + k.katki, 0)).toBe(s.pp)
    expect(s.kalemler.every((k) => !Object.is(k.katki, -0))).toBe(true)
  })

  it('kusursuz donatılı 1 katlı bina, bölge IV: 130 + 60', () => {
    expect(yigmaPuani('IV', kusursuz(1, { tur: 'donatili' })).pp).toBe(190)
  })
})

describe('kapsam', () => {
  it.each([0, 6, 7, 2.5])('%s kat kapsam dışı', (kat) => {
    expect(() => yigmaPuani('I', kusursuz(kat))).toThrow(KapsamDisiHatasi)
    expect(() => yigmaPuani('I', kusursuz(kat))).toThrow(/1–5/)
  })
})

describe('"bilmiyorum" uçları', () => {
  const bilinen = (ek: Partial<YigmaCevaplari> = {}): YigmaCevaplari => ({ ...kusursuz(3), ...ek })
  const hepsiBilinmiyor = (): YigmaCevaplari =>
    ({
      kat: 3,
      nizam: 'bilmiyorum',
      ...Object.fromEntries(YIGMA_ALANLARI.map((a) => [a, 'bilmiyorum'])),
    }) as YigmaCevaplari

  it('cevapların hepsi biliniyorsa iki uç aynı', () => {
    expect(yigmaUcGirdisi(bilinen(), 'kotu')).toEqual(yigmaUcGirdisi(bilinen(), 'iyi'))
    expect(yigmaBelirsizParametreler(bilinen())).toEqual([])
  })

  it('bina türü bilinmiyorsa iki uçta da donatısız (YSP = 0) ve belirsiz sayılmaz', () => {
    const c = bilinen({ tur: 'bilmiyorum' })
    expect(yigmaUcGirdisi(c, 'kotu').tur).toBe('donatisiz')
    expect(yigmaUcGirdisi(c, 'iyi').tur).toBe('donatisiz')
    expect(yigmaBelirsizParametreler(c)).toEqual([])
  })

  it('her şey bilinmiyorsa kötü uç en olumsuz, iyi uç kusursuz bina', () => {
    const c = hepsiBilinmiyor()
    const kotu = yigmaUcGirdisi(c, 'kotu')
    const iyi = yigmaUcGirdisi(c, 'iyi')
    // 3 kat, bölge I: 90 − 20 − 10 − 5 − 20 − 20 − 5 − 10 − 5 − 5 − 10 − 10 − 10
    expect(yigmaPuani('I', kotu).pp).toBe(-40)
    expect(yigmaPuani('I', iyi).pp).toBe(90)
    expect(katki('I', kotu, 'duzlemDisi')).toBe(-10)
    expect(katki('I', kotu, 'yapiNizami')).toBe(-10)
    expect(katki('I', iyi, 'duzlemDisi')).toBe(0)
    expect(yigmaBelirsizParametreler(c).sort()).toEqual(
      [
        'yumusakKat',
        'mevcutHasar',
        'malzemeKalitesi',
        'duvarIsciligi',
        'duzlemDisi',
        'planGeometrisi',
        'duvarMiktari',
        'boslukDuzeni',
        'yatayHatil',
        'cepheKatFarki',
        'toprakDam',
        'yapiNizami',
      ].sort(),
    )
  })

  it('düzlem dışı: bilinen iki olumsuzluk + bir "bilmiyorum" kötü uçta eşiği geçer', () => {
    const c = bilinen({ doseme: 'ahsap', harc: 'kirec', duvarDuvar: 'bilmiyorum' })
    expect(katki('I', yigmaUcGirdisi(c, 'kotu'), 'duzlemDisi')).toBe(-10)
    expect(katki('I', yigmaUcGirdisi(c, 'iyi'), 'duzlemDisi')).toBe(0)
    expect(yigmaBelirsizParametreler(c)).toEqual(['duzlemDisi'])
  })

  it('puanı değiştirmeyen "bilmiyorum" belirsiz sayılmaz', () => {
    expect(
      yigmaBelirsizParametreler({ ...kusursuz(1), yumusakKat: 'bilmiyorum', boslukDuzeni: 'bilmiyorum' }),
    ).toEqual([])
    expect(yigmaBelirsizParametreler(bilinen({ harc: 'bilmiyorum' }))).toEqual([])
    expect(
      yigmaBelirsizParametreler(
        bilinen({ nizam: { tip: 'bitisik', konum: 'orta', katSeviyesi: 'bilmiyorum' } }),
      ),
    ).toEqual(['yapiNizami'])
  })

  it('bitişik, döşeme hizası bilinmiyor: köşede −10 ile −5, ortada −5 ile 0', () => {
    const kenar = bilinen({ nizam: { tip: 'bitisik', konum: 'kenar', katSeviyesi: 'bilmiyorum' } })
    expect(katki('I', yigmaUcGirdisi(kenar, 'kotu'), 'yapiNizami')).toBe(-10)
    expect(katki('I', yigmaUcGirdisi(kenar, 'iyi'), 'yapiNizami')).toBe(-5)
    const orta = bilinen({ nizam: { tip: 'bitisik', konum: 'orta', katSeviyesi: 'bilmiyorum' } })
    expect(katki('I', yigmaUcGirdisi(orta, 'kotu'), 'yapiNizami')).toBe(-5)
    expect(katki('I', yigmaUcGirdisi(orta, 'iyi'), 'yapiNizami')).toBe(0)
  })
})

describe('degerlendirYigma(): uçtan uca', () => {
  it('TDTH SDS 0,8 ZC → bölge II, II-III sütunu; bant kötü uçtan', () => {
    const d = degerlendirYigma(
      { ...kusursuz(2), malzemeKalitesi: 'bilmiyorum' },
      { kaynak: 'tdth', sds: 0.8, zemin: 'ZC' },
    )
    expect(d.yontem).toBe('yigma')
    expect(d.tehlike.bolgeKotu).toBe('II')
    expect([d.kotu.pp, d.iyi.pp]).toEqual([90, 110])
    expect(d.bant).toEqual({ bant: 'orta', yayilim: ['orta', 'dusuk'] })
    expect(d.belirsiz).toEqual(['malzemeKalitesi'])
  })

  it('ESHM20 bandı iki bölgeye düşerse taban puanı da iki uca açılır', () => {
    // SS 1,0 / ZC: SDS aralığı bölge I ile II'yi kapsar.
    const d = degerlendirYigma(kusursuz(1), { kaynak: 'eshm20', ss: 1.0, zemin: 'ZC' })
    expect(d.tehlike.bolgeKotu).toBe('I')
    expect(d.tehlike.bolgeIyi).not.toBe('I')
    expect(d.kotu.pp).toBe(110)
    expect(d.iyi.pp).toBe(120)
  })
})
