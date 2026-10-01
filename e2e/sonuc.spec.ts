import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { gorunenMerkez, hazirBekle, istekleriIzle, ornekBina } from './yardim.ts'

/**
 * Formu fareyle doldurur: her adımda ilk soru grubunun `sira`'ncı seçeneği; nizam bitişikse ikinci grup da.
 * 12 cevap verilirse isteğe bağlı 13. adım atlanır.
 */
async function doldur(page: Page, siralar: number[], dosemeSirasi = 0) {
  for (const [i, sira] of siralar.entries()) {
    await expect(page.getByText(`Soru ${i + 1} / 13`)).toBeVisible()
    await page.locator('fieldset').first().getByRole('radio').nth(sira).check()
    if ((await page.locator('fieldset').count()) > 1)
      await page.locator('fieldset').nth(1).getByRole('radio').nth(dosemeSirasi).check()
    await page.getByRole('button', { name: /İleri|Atla|gözden geçir/ }).click()
  }
  // İsteğe bağlı yapım dönemi cevapsız geçilir.
  if (siralar.length < 13) await page.getByRole('button', { name: 'Cevapları gözden geçir' }).click()
  await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeFocused()
}

// Betonarme, 4 kat, perde yok, kusursuz, iyi kalite, ayrık, düz, ZC, dönem atlanır.
const KUSURSUZ_4_KAT = [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]

test('duman: mahalle → bina → form → sonuç → TDTH → rapor', async ({ page, baseURL }) => {
  const { yabanci, hatalar } = istekleriIzle(page, baseURL!)
  await page.goto('/')
  await hazirBekle(page)
  const arama = page.getByRole('combobox', { name: 'Mahalle ya da köy ara' })
  await arama.fill('akincilar sehzadeler')
  await page.getByRole('option', { name: /Akıncılar.*Şehzadeler/ }).click()

  const [boylam, enlem] = ornekBina()
  await page.goto(`/#harita=19/${enlem}/${boylam}`)
  await expect(page.locator('main')).toHaveAttribute('data-yakinlik', '19.0', { timeout: 20_000 })
  await expect(async () => {
    const m = await gorunenMerkez(page)
    await page.mouse.click(m.x, m.y)
    await expect(page.getByRole('heading', { name: 'Seçilen bina' })).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 20_000 })

  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await doldur(page, KUSURSUZ_4_KAT)

  // Kusursuz 4 katlı çerçeve: taban puanı bölge I'de 70, II'de 90. ESHM20 bandı iki bölgeye değiyor.
  const kart = page.getByTestId('sonuc-karti')
  await expect(kart.getByTestId('bant')).toHaveText('Orta öncelik')
  await expect(kart.getByTestId('pp-araligi')).toHaveText('70 – 90')
  await expect(kart.getByTestId('ss-kullanilan')).toContainText('–')
  await expect(kart).toContainText('Kaynak: ESHM20')

  // Resmî değer: TDTH S_S girilince aralık kalkar ve kayıtta kalır.
  await kart.getByText('Resmî tehlike değeriyle kesinleştirin').click()
  await kart.getByLabel(/TDTH raporundaki/).fill('1,158')
  await kart.getByRole('button', { name: 'Değeri kullan' }).click()
  await expect(kart.getByTestId('ss-kullanilan')).toHaveText('1,158 g')
  // S_S 1,158, ZC → S_DS 1,390 → bölge I: tek değer.
  await expect(kart.getByTestId('pp-araligi')).toHaveText('70')
  await expect(kart).toContainText('Kaynak: AFAD Türkiye Deprem Tehlike Haritası')
  await page.reload()
  await page.getByRole('button', { name: 'Cevaplarımı göster' }).click()
  await expect(page.getByTestId('ss-kullanilan')).toHaveText('1,158 g')

  // Rapor: baskıda ekran arayüzü gizli, rapor görünür; A4 PDF 1–3 sayfa.
  await page.emulateMedia({ media: 'print' })
  const rapor = page.getByRole('article')
  await expect(rapor).toBeVisible()
  await expect(page.locator('main')).toBeHidden()
  await expect(rapor).toContainText('Orta öncelik')
  await expect(rapor).toContainText('Haritadan seçilen bina')
  await expect(rapor).toContainText('AFAD Türkiye Deprem Tehlike Haritası (DD-2)')
  const pdf = await page.pdf({ format: 'A4' })
  expect(pdf.subarray(0, 4).toString()).toBe('%PDF')
  const sayfa = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0
  expect(sayfa).toBeGreaterThanOrEqual(1)
  expect(sayfa).toBeLessThanOrEqual(3)

  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})

test('TDTH girişi: okunamayan değer hata verir, şüpheli değer uyarır, kaldırılınca aralık döner', async ({
  page,
}) => {
  await page.goto('/#konum=38.6140,27.4303')
  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await doldur(page, KUSURSUZ_4_KAT)
  const kart = page.getByTestId('sonuc-karti')
  await kart.getByText('Resmî tehlike değeriyle kesinleştirin').click()
  const alan = kart.getByLabel(/TDTH raporundaki/)

  await alan.fill('bir virgül iki')
  await alan.press('Enter')
  await expect(kart.getByRole('alert')).toContainText('okunamadı')
  await expect(alan).toHaveAttribute('aria-invalid', 'true')

  // PGA satırı girilmiş gibi: kabul edilir ama uyarılır.
  await alan.fill('0,47')
  await alan.press('Enter')
  await expect(kart).toContainText('ESHM20 tahmininden')
  // Tetikleyen düğme ekrandan kalktı; odak yeni durumu anlatan metinde.
  await expect(kart.getByText(/Resmî değer kullanılıyor/)).toBeFocused()
  await kart.getByRole('button', { name: 'Resmî değeri kaldır' }).click()
  await expect(kart.getByTestId('ss-kullanilan')).toContainText('–')
  await expect(kart.getByText('Resmî tehlike değeriyle kesinleştirin')).toBeFocused()
})

test('bilgi sayfaları: panelden açılıyor, sayılar veri dosyalarıyla aynı', async ({ page, baseURL }) => {
  const { yabanci, hatalar } = istekleriIzle(page, baseURL!)
  const dogrulama = JSON.parse(readFileSync('public/data/dogrulama.json', 'utf8')) as {
    nKapsam: number
    auc: { ryteie_ortalama: number }
  }
  const kaynak = JSON.parse(readFileSync('public/data/manisa/kaynak.json', 'utf8')) as {
    dosyalar: Record<string, string>
  }

  await page.goto('/')
  await hazirBekle(page)
  await page.getByRole('link', { name: 'Yöntem ve isabet' }).click()
  await expect(page).toHaveTitle('Yöntem ve isabet · YapiRisk')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yöntem ve isabet')
  await expect(page.getByRole('link', { name: 'Yöntem ve isabet' })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('main')).toContainText(`${dogrulama.nKapsam} bina`)
  await expect(page.getByRole('main')).toContainText(
    dogrulama.auc.ryteie_ortalama.toFixed(3).replace('.', ','),
  )

  await page.getByRole('link', { name: 'Veri ve lisanslar' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Veri ve lisanslar')
  await expect(page.getByRole('main')).toContainText(kaynak.dosyalar['tehlike-eshm20.json'])

  await page.getByRole('link', { name: 'Hakkında' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hakkında')
  await expect(page.getByRole('main')).toContainText(
    'tek bir binada risk değerlendirmesi amacıyla kullanılamaz',
  )

  await page.getByRole('link', { name: 'YapiRisk', exact: true }).click()
  await hazirBekle(page)
  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})

test('ikinci il: İzmir mahallesi aranıyor, tehlike İzmir ızgarasından, fark notu İzmir ölçümünü gösteriyor', async ({
  page,
  baseURL,
}) => {
  const { yabanci, hatalar } = istekleriIzle(page, baseURL!)
  await page.goto('/')
  await hazirBekle(page)
  const arama = page.getByRole('combobox', { name: 'Mahalle ya da köy ara' })
  await arama.fill('alsancak')
  await page.getByRole('option', { name: /Alsancak.*Konak/ }).click()
  await expect(arama).toHaveValue('Alsancak, Konak')

  // Alsancak'ta bir nokta: bölge İzmir, S_S İzmir ızgarasından (Manisa ızgarası bu noktayı kapsamaz).
  await page.goto('/#konum=38.4392,27.1438')
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
  await expect(page.getByTestId('ss-degeri')).toBeVisible()
  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await doldur(page, KUSURSUZ_4_KAT)
  await expect(page.getByTestId('sonuc-karti')).toContainText(
    'AFAD’ın resmî değeriyle farkı İzmir’de 10 noktada ölçüldü ve aralığa katıldı',
  )
  await page.emulateMedia({ media: 'print' })
  await expect(page.getByRole('article')).toContainText('İzmir')

  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})

test('üçüncü il: Aydın mahallesi aranıyor; AFAD farkı ölçülmediği için not diğer illerin ölçümünü gösteriyor', async ({
  page,
  baseURL,
}) => {
  const { yabanci, hatalar } = istekleriIzle(page, baseURL!)
  await page.goto('/')
  await hazirBekle(page)
  const arama = page.getByRole('combobox', { name: 'Mahalle ya da köy ara' })
  await arama.fill('camikebir')
  await page.getByRole('option', { name: /Camikebir.*Kuşadası/ }).click()
  await expect(arama).toHaveValue('Camikebir, Kuşadası')

  // Aydın merkezi (Efeler): bölge Aydın, S_S Aydın ızgarasından.
  await page.goto('/#konum=37.8444,27.8458')
  await expect(page.getByTestId('ss-degeri')).toBeVisible()
  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await doldur(page, KUSURSUZ_4_KAT)
  await expect(page.getByTestId('sonuc-karti')).toContainText(
    'Bu ilde AFAD’la karşılaştırma henüz yapılmadı; aralık İzmir ve Manisa’da ölçülen farktan geliyor',
  )
  await page.emulateMedia({ media: 'print' })
  await expect(page.getByRole('article')).toContainText('Aydın')

  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})
