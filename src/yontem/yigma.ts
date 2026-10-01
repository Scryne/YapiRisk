// RYTEİE 2019 Ek-A.2.2 yığma performans puanı: PP = TP + YSP + Σ(Oᵢ · OPᵢ) (Denklem A2.1, A.2.2.11).
// Tablolar ryteie-2019-yigma.json'da. "Bilmiyorum" kuralı betonarmeyle aynı (Final-Doküman, hesap sözleşmesi):
// bina türü bilinmiyorsa donatısız (YSP = 0, iki uçta da); diğer parametrelerde kötü uç en olumsuz, iyi uç en
// olumlu seçenek.
import { nizamAdaylari, sec, type Cevap, type NizamCevabi, type Uc } from './aralik'
import tablo from './ryteie-2019-yigma.json'
import { KapsamDisiHatasi, type Bolge, type Kalite, type Kalem, type Nizam } from './ryteie'

export type YigmaTuru = 'donatisiz' | 'kusatilmis' | 'donatili' | 'karma'
export type PlanDuzeni = keyof typeof tablo.tabloA6.plan
export type YatayHatil = keyof typeof tablo.tabloA6.yatayHatil
export type DuvarMiktari = keyof typeof tablo.tabloA6.duvarMiktari
export type BoslukDuzeni = keyof typeof tablo.tabloA6.boslukDuzeni
export type DosemeTipi = keyof typeof tablo.tabloA6.doseme
export type Harc = keyof typeof tablo.tabloA6.harc
export type Baglanti = keyof typeof tablo.tabloA6.duvarDuvar
export type Cati = keyof typeof tablo.tabloA6.cati
/** Tablo A.5 sütunu: Tablo A.2 bölgeleri II ve III aynı sütunda. */
export type YigmaSutunu = keyof (typeof tablo.tabloA5.tabanPuani)['1']

/** Kat ve nizam dışındaki, binaya bakarak cevaplanan alanlar (Şekil A.2 formu). */
export interface YigmaAlanlari {
  tur: YigmaTuru
  malzemeKalitesi: Kalite
  duvarIsciligi: Kalite
  mevcutHasar: boolean
  plan: PlanDuzeni
  duvarMiktari: DuvarMiktari
  yatayHatil: YatayHatil
  boslukDuzeni: BoslukDuzeni
  cepheKatFarki: boolean
  yumusakKat: boolean
  doseme: DosemeTipi
  harc: Harc
  duvarDuvar: Baglanti
  duvarDoseme: Baglanti
  cati: Cati
}
export type YigmaAlani = keyof YigmaAlanlari

/** Formdaki sıra (Şekil A.2'ye yakın; yumuşak kat önde, K-6). */
export const YIGMA_ALANLARI = [
  'tur',
  'yumusakKat',
  'mevcutHasar',
  'malzemeKalitesi',
  'duvarIsciligi',
  'harc',
  'plan',
  'duvarMiktari',
  'boslukDuzeni',
  'yatayHatil',
  'cepheKatFarki',
  'doseme',
  'duvarDuvar',
  'duvarDoseme',
  'cati',
] as const satisfies readonly YigmaAlani[]

/** "Bilmiyorum" içermeyen, puanlanabilir yığma bina. */
export interface YigmaGirdi extends YigmaAlanlari {
  /** Serbest kat adedi (n_sk, Şekil A.2), 1–5. */
  kat: number
  nizam: Nizam
}

export type YigmaCevaplari = { kat: number; nizam: Cevap<NizamCevabi> } & {
  [A in YigmaAlani]: Cevap<YigmaAlanlari[A]>
}

export type YigmaParametre =
  | 'tabanPuani'
  | 'yapisalSistem'
  | 'malzemeKalitesi'
  | 'duvarIsciligi'
  | 'mevcutHasar'
  | 'planGeometrisi'
  | 'duvarMiktari'
  | 'yatayHatil'
  | 'boslukDuzeni'
  | 'cepheKatFarki'
  | 'yumusakKat'
  | 'duzlemDisi'
  | 'toprakDam'
  | 'yapiNizami'

export interface YigmaPuanSonucu {
  pp: number
  bolge: Bolge
  sutun: YigmaSutunu
  kalemler: Kalem[]
}

type KatAnahtari = keyof typeof tablo.tabloA5.tabanPuani

export function yigmaKati(kat: number): KatAnahtari {
  const [enAz, enCok] = tablo.katAraligi
  if (!Number.isInteger(kat) || kat < enAz || kat > enCok) {
    throw new KapsamDisiHatasi(`RYTEİE Ek-A yığma yöntemi 1–5 serbest kat içindir, gelen: ${kat}`)
  }
  return String(kat) as KatAnahtari
}

export const yigmaSutunu = (bolge: Bolge): YigmaSutunu =>
  bolge === 'II' || bolge === 'III' ? 'II-III' : bolge

const O = tablo.tabloA6
const varYok = (b: boolean) => (b ? O.mevcutHasar.var : O.mevcutHasar.yok)

/** A.2.2.9: Tablo A.6'daki 11–14 numaralı değerlerin toplamı eşiği aşarsa düzlem dışı zayıflık var (Oᵢ = 1). */
export function duzlemDisiDegeri(g: Pick<YigmaAlanlari, 'doseme' | 'harc' | 'duvarDuvar' | 'duvarDoseme'>) {
  const toplam =
    O.doseme[g.doseme] + O.harc[g.harc] + O.duvarDuvar[g.duvarDuvar] + O.duvarDoseme[g.duvarDoseme]
  return toplam >= tablo.duzlemDisi.esik ? 1 : 0
}

export function yigmaNizamPuani(n: Nizam): { deger: number; puan: number } {
  if (n.tip === 'ayrik') return { deger: O.yapiNizami.ayrik, puan: 0 }
  return { deger: O.yapiNizami.bitisik, puan: tablo.tabloA10[`${n.katSeviyesi}-${n.konum}`] }
}

export function yigmaPuani(bolge: Bolge, g: YigmaGirdi): YigmaPuanSonucu {
  const kat = yigmaKati(g.kat)
  const sutun = yigmaSutunu(bolge)
  const kalem = (parametre: YigmaParametre, deger: number, puan: number): Kalem => ({
    parametre,
    deger,
    puan,
    // −0 yerine 0: Oᵢ = 0 iken katkı gösterimde "−0" olmasın.
    katki: deger * puan === 0 ? 0 : deger * puan,
  })
  const nizam = yigmaNizamPuani(g.nizam)
  const kalemler: Kalem[] = [
    kalem('tabanPuani', 1, tablo.tabloA5.tabanPuani[kat][sutun]),
    kalem('yapisalSistem', 1, tablo.yapisalSistemPuani[g.tur]),
    kalem('malzemeKalitesi', O.malzemeKalitesi[g.malzemeKalitesi], tablo.tabloA7.malzemeKalitesi),
    kalem('duvarIsciligi', O.duvarIsciligi[g.duvarIsciligi], tablo.tabloA7.duvarIsciligi),
    kalem('mevcutHasar', varYok(g.mevcutHasar), tablo.tabloA7.mevcutHasar),
    kalem('planGeometrisi', O.plan[g.plan], tablo.tabloA8.plan[kat]),
    kalem('duvarMiktari', O.duvarMiktari[g.duvarMiktari], tablo.tabloA8.duvarMiktari[kat]),
    kalem('yatayHatil', O.yatayHatil[g.yatayHatil], tablo.tabloA8.yatayHatil[kat]),
    kalem('boslukDuzeni', O.boslukDuzeni[g.boslukDuzeni], tablo.tabloA9.boslukDuzeni[kat]),
    kalem('cepheKatFarki', varYok(g.cepheKatFarki), tablo.tabloA9.cepheKatFarki[kat]),
    kalem('yumusakKat', varYok(g.yumusakKat), tablo.tabloA9.yumusakKat[kat]),
    kalem('duzlemDisi', duzlemDisiDegeri(g), tablo.duzlemDisi.puan),
    kalem('toprakDam', O.cati[g.cati], tablo.toprakDam.puan),
    kalem('yapiNizami', nizam.deger, nizam.puan),
  ]
  return { pp: kalemler.reduce((t, k) => t + k.katki, 0), bolge, sutun, kalemler }
}

// ——— "Bilmiyorum" uçları ———

const secenekler = <A extends Exclude<YigmaAlani, 'tur' | 'mevcutHasar' | 'cepheKatFarki' | 'yumusakKat'>>(
  a: A,
) => Object.keys(O[a]) as YigmaAlanlari[A][]

/** Cevapları verilen uca göre kesin girdiye çevirir. */
export function yigmaUcGirdisi(c: YigmaCevaplari, uc: Uc): YigmaGirdi {
  const kat = yigmaKati(c.kat)
  /** Tek başına puanlanan alan: seçeneğin katkısı Oᵢ · OPᵢ. */
  const tekil = <
    A extends
      'malzemeKalitesi' | 'duvarIsciligi' | 'plan' | 'duvarMiktari' | 'yatayHatil' | 'boslukDuzeni' | 'cati',
  >(
    a: A,
    op: number,
  ): YigmaAlanlari[A] => {
    const cevap = c[a] as Cevap<YigmaAlanlari[A]>
    if (cevap !== 'bilmiyorum') return cevap
    const deger = O[a] as Record<YigmaAlanlari[A], number>
    return sec(secenekler(a), (s) => deger[s] * op, uc)
  }
  const ikili = (b: Cevap<boolean>) => (b === 'bilmiyorum' ? uc === 'kotu' : b)
  /** Düzlem dışı bileşeni: kendi başına puanı yok, eşiğe katkısı Oᵢ (kötü uçta 1, iyi uçta 0). */
  const bilesen = <A extends 'doseme' | 'harc' | 'duvarDuvar' | 'duvarDoseme'>(a: A): YigmaAlanlari[A] => {
    const cevap = c[a] as Cevap<YigmaAlanlari[A]>
    if (cevap !== 'bilmiyorum') return cevap
    const deger = O[a] as Record<YigmaAlanlari[A], number>
    return sec(secenekler(a), (s) => -deger[s], uc)
  }
  const nizamKatkisi = (n: Nizam) => {
    const { deger, puan } = yigmaNizamPuani(n)
    return deger * puan
  }
  return {
    kat: c.kat,
    tur: c.tur === 'bilmiyorum' ? 'donatisiz' : c.tur,
    malzemeKalitesi: tekil('malzemeKalitesi', tablo.tabloA7.malzemeKalitesi),
    duvarIsciligi: tekil('duvarIsciligi', tablo.tabloA7.duvarIsciligi),
    mevcutHasar: ikili(c.mevcutHasar),
    plan: tekil('plan', tablo.tabloA8.plan[kat]),
    duvarMiktari: tekil('duvarMiktari', tablo.tabloA8.duvarMiktari[kat]),
    yatayHatil: tekil('yatayHatil', tablo.tabloA8.yatayHatil[kat]),
    boslukDuzeni: tekil('boslukDuzeni', tablo.tabloA9.boslukDuzeni[kat]),
    cepheKatFarki: ikili(c.cepheKatFarki),
    yumusakKat: ikili(c.yumusakKat),
    doseme: bilesen('doseme'),
    harc: bilesen('harc'),
    duvarDuvar: bilesen('duvarDuvar'),
    duvarDoseme: bilesen('duvarDoseme'),
    cati: tekil('cati', tablo.toprakDam.puan),
    nizam: sec(nizamAdaylari(c.nizam), nizamKatkisi, uc),
  }
}

/**
 * Puanı iki uca açan "bilmiyorum"ların kalemleri: aynı bölgede iki ucun katkısı farklı olanlar. Bina türü tek değere
 * çözüldüğü, 1 katlı binada yumuşak kat puansız olduğu, düzlem dışı eşiği bilinenlerle aşılamadığı için onlar düşer.
 */
export function yigmaBelirsizParametreler(c: YigmaCevaplari): YigmaParametre[] {
  const [kotu, iyi] = (['kotu', 'iyi'] as const).map((uc) => yigmaPuani('I', yigmaUcGirdisi(c, uc)).kalemler)
  return kotu.filter((k, i) => k.katki !== iyi[i].katki).map((k) => k.parametre as YigmaParametre)
}
