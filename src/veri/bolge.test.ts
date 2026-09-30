import { describe, expect, it } from 'vitest'
import { tehlikeFarkiNotu } from '@/sonuc/metinler'
import { adlarListesi, bulunma, type BolgeKaydi } from './bolge'

describe('Türkçe il adı yardımcıları', () => {
  it.each([
    ['Manisa', 'Manisa’da'],
    ['İzmir', 'İzmir’de'],
    ['Aydın', 'Aydın’da'],
    ['Muş', 'Muş’ta'],
    ['Tokat', 'Tokat’ta'],
    ['Ordu', 'Ordu’da'],
    ['Düzce', 'Düzce’de'],
    ['İzmir ve Manisa', 'İzmir ve Manisa’da'],
  ])('%s → %s', (ad, beklenen) => expect(bulunma(ad)).toBe(beklenen))

  it('il listesi', () => {
    expect(adlarListesi([])).toBe('')
    expect(adlarListesi(['Manisa'])).toBe('Manisa')
    expect(adlarListesi(['İzmir', 'Manisa'])).toBe('İzmir ve Manisa')
    expect(adlarListesi(['Aydın', 'İzmir', 'Manisa'])).toBe('Aydın, İzmir ve Manisa')
  })
})

describe('tehlike farkı notu (S1 ölçümü bölge kaydından)', () => {
  const kayit = (ad: string, tdthNokta: number): BolgeKaydi => ({
    kimlik: ad.toLowerCase(),
    ad,
    merkez: [0, 0],
    yakinlik: 8,
    sinirKutusu: [0, 0, 1, 1],
    tdthNokta,
  })
  const manisa = kayit('Manisa', 10)
  const izmir = kayit('İzmir', 0)

  it('ölçülen ilde nokta sayısı', () =>
    expect(tehlikeFarkiNotu({ bolge: manisa, olculenBolgeler: [manisa] })).toBe(
      'AFAD’ın resmî değeriyle farkı Manisa’da 10 noktada ölçüldü ve aralığa katıldı',
    ))

  it('ölçülmeyen ilde aralığın nereden geldiği', () =>
    expect(tehlikeFarkiNotu({ bolge: izmir, olculenBolgeler: [manisa] })).toBe(
      'Bu ilde AFAD’la karşılaştırma henüz yapılmadı; aralık Manisa’da ölçülen farktan geliyor',
    ))
})
