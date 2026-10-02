// Hesap sözleşmesi (Final-Doküman): tehlike aralığı × "bilmiyorum" uçları → PP aralığı → bant.
import { belirsizParametreler, ucGirdisi, type FormCevaplari } from './aralik'
import { bant, bantSonucu, type Bant, type BantSonucu } from './bant'
import { puan, type Bolge, type Kalem, type Parametre } from './ryteie'
import { tehlike, type TehlikeGirdisi, type TehlikeSonucu } from './tehlike'
import { yigmaBelirsizParametreler, yigmaPuani, yigmaUcGirdisi, type YigmaCevaplari } from './yigma'

/** RYTEİE Ek-A.2.1 betonarme ya da Ek-A.2.2 yığma. */
export type Yontem = 'betonarme' | 'yigma'

/** Bir ucun puanı; iki yöntemde aynı biçim. */
export interface UcPuani {
  pp: number
  bolge: Bolge
  kalemler: Kalem[]
}

export interface Degerlendirme {
  yontem: Yontem
  tehlike: TehlikeSonucu
  /** Kötü uç: en yüksek tehlike + "bilmiyorum"ların olumsuz hali. PP_min. */
  kotu: UcPuani
  /** İyi uç: en düşük tehlike + "bilmiyorum"ların olumlu hali. PP_max. */
  iyi: UcPuani
  bant: BantSonucu
  /** Puanı iki uca açan "bilmiyorum" cevapları. */
  belirsiz: Parametre[]
  /**
   * Yalnız tehlike belirsizliğinin etkisi: cevapların elverişsiz hali sabitken tehlikenin iki ucundaki öncelik. İkisi
   * farklıysa resmî (AFAD) değer önceliği değiştirebilir.
   */
  tehlikeyleOncelik: { kotu: Bant; iyi: Bant }
}

export function degerlendir(cevaplar: FormCevaplari, tehlikeGirdisi: TehlikeGirdisi): Degerlendirme {
  const t = tehlike(tehlikeGirdisi)
  const kotuCevap = ucGirdisi(cevaplar, 'kotu')
  const kotu = puan(t.bolgeKotu, kotuCevap)
  const iyi = puan(t.bolgeIyi, ucGirdisi(cevaplar, 'iyi'))
  return {
    tehlikeyleOncelik: { kotu: bant(kotu.pp), iyi: bant(puan(t.bolgeIyi, kotuCevap).pp) },
    yontem: 'betonarme',
    tehlike: t,
    kotu,
    iyi,
    bant: bantSonucu(kotu.pp, iyi.pp),
    belirsiz: belirsizParametreler(cevaplar),
  }
}

export function degerlendirYigma(cevaplar: YigmaCevaplari, tehlikeGirdisi: TehlikeGirdisi): Degerlendirme {
  const t = tehlike(tehlikeGirdisi)
  const kotuCevap = yigmaUcGirdisi(cevaplar, 'kotu')
  const kotu = yigmaPuani(t.bolgeKotu, kotuCevap)
  const iyi = yigmaPuani(t.bolgeIyi, yigmaUcGirdisi(cevaplar, 'iyi'))
  return {
    tehlikeyleOncelik: { kotu: bant(kotu.pp), iyi: bant(yigmaPuani(t.bolgeIyi, kotuCevap).pp) },
    yontem: 'yigma',
    tehlike: t,
    kotu,
    iyi,
    bant: bantSonucu(kotu.pp, iyi.pp),
    belirsiz: yigmaBelirsizParametreler(cevaplar),
  }
}
