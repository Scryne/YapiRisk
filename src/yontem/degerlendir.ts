// Hesap sözleşmesi (Final-Doküman): tehlike aralığı × "bilmiyorum" uçları → PP aralığı → bant.
import { belirsizParametreler, ucGirdisi, type FormCevaplari } from './aralik'
import { bantSonucu, type BantSonucu } from './bant'
import { puan, type PuanSonucu } from './ryteie'
import { tehlike, type TehlikeGirdisi, type TehlikeSonucu } from './tehlike'

export interface Degerlendirme {
  tehlike: TehlikeSonucu
  /** Kötü uç: en yüksek tehlike + "bilmiyorum"ların olumsuz hali. PP_min. */
  kotu: PuanSonucu
  /** İyi uç: en düşük tehlike + "bilmiyorum"ların olumlu hali. PP_max. */
  iyi: PuanSonucu
  bant: BantSonucu
  /** Puanı iki uca açan "bilmiyorum" cevapları. */
  belirsiz: string[]
}

export function degerlendir(cevaplar: FormCevaplari, tehlikeGirdisi: TehlikeGirdisi): Degerlendirme {
  const t = tehlike(tehlikeGirdisi)
  const kotu = puan(t.bolgeKotu, ucGirdisi(cevaplar, 'kotu'))
  const iyi = puan(t.bolgeIyi, ucGirdisi(cevaplar, 'iyi'))
  return {
    tehlike: t,
    kotu,
    iyi,
    bant: bantSonucu(kotu.pp, iyi.pp),
    belirsiz: belirsizParametreler(cevaplar),
  }
}
