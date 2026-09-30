import { expect, test, type Page } from '@playwright/test'

const KONUM = { enlem: 38.614, boylam: 27.4303 } // Manisa merkez
const ANAHTAR = 'yapirisk:degerlendirme:v1'

async function formuAc(page: Page) {
  await page.goto(`/#konum=${KONUM.enlem},${KONUM.boylam}`)
  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /taşıyıcı sistemi/ })).toBeFocused()
}

/** Klavyeyle: Tab ile gruba gir, Boşluk ilkini seçer, ↓ sonrakilere geçer. */
async function klavyeyleSec(page: Page, sira: number) {
  await page.keyboard.press('Tab')
  await expect(page.locator('input[type=radio]:focus')).toHaveCount(1)
  await page.keyboard.press('Space')
  for (let i = 0; i < sira; i++) await page.keyboard.press('ArrowDown')
}

test('form klavyeyle baştan sona dolduruluyor; ön sonuç motorla aynı', async ({ page, baseURL }) => {
  const hatalar: string[] = []
  const yabanci: string[] = []
  page.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  page.on('pageerror', (e) => hatalar.push(e.message))
  page.on('request', (r) => {
    const u = r.url()
    if (
      !u.startsWith(baseURL!) &&
      !u.startsWith('https://tiles.openfreemap.org/') &&
      !/^(data|blob):/.test(u)
    )
      yabanci.push(u)
  })
  await formuAc(page)

  // Cevapsız ilerleme: hata sorunun yanında, odak yerinde.
  await page.keyboard.press('Tab')
  await page.keyboard.press('Shift+Tab')
  await page.getByRole('button', { name: 'İleri' }).press('Enter')
  await expect(page.getByRole('alert')).toContainText('Bilmiyorum')

  // Sıra: malzeme, kat, sistem, yumuşak kat, kalite, düşey, çıkma, plan, kısa kolon, nizam, eğim, zemin, dönem.
  const secimler = [0, 3, 2, 1, 1, 0, 2, 0, 0, 1, 0, 5, 2]
  for (const [i, sira] of secimler.entries()) {
    await expect(page.getByText(`Soru ${i + 1} / 13`)).toBeVisible()
    // İlk adımda odak hatalı denemeden İleri'de kaldı; sonraki her adımda yeni sorunun başlığında.
    if (i > 0) await expect(page.getByRole('heading', { level: 2 }).first()).toBeFocused()
    else await page.getByRole('heading', { level: 2 }).first().focus()
    await klavyeyleSec(page, sira)
    if (i === 9) {
      // Bitişik nizam: ikinci soru (döşeme hizası) açılır.
      await expect(page.getByRole('heading', { name: /döşemeleri aynı hizada/ })).toBeVisible()
      await klavyeyleSec(page, 1)
    }
    await page.keyboard.press('Enter')
  }

  await expect(page.getByRole('heading', { name: 'Sonuç', exact: true })).toBeFocused()
  // Motor bu cevap setini Manisa merkezinde −10 … 40 (yüksek öncelik) verir; aynı değerler
  // src/form/taslak.test.ts'te motordan hesaplanıp doğrulanıyor (e2e, JSON içe aktaran motoru yükleyemiyor).
  const tr = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })
  await expect(page.getByTestId('pp-araligi')).toHaveText(`${tr.format(-10)} – ${tr.format(40)}`)
  await expect(page.getByTestId('bant')).toContainText('Yüksek öncelik')
  await expect(page.getByRole('main').getByText('1998–2006', { exact: true })).toBeVisible()

  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})

test('yığma ve 8+ kat kapsam dışı mesajına düşüyor; cevap değiştirilince devam ediliyor', async ({
  page,
}) => {
  await formuAc(page)
  await page.getByRole('radio', { name: /^Yığma/ }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await expect(page.getByRole('heading', { name: 'Bu bina yöntemin kapsamı dışında' })).toBeFocused()
  await expect(page.getByText('yalnız betonarme binalar içindir')).toBeVisible()
  await page.getByRole('button', { name: 'Cevabımı değiştir' }).click()

  await page.getByRole('radio', { name: /^Betonarme/ }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await page.getByRole('radio', { name: '8 veya daha fazla' }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await expect(page.getByText('1 ile 7 serbest katlı')).toBeVisible()
  await page.getByRole('button', { name: 'Cevabımı değiştir' }).click()
  await page.getByRole('radio', { name: '5', exact: true }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await expect(page.getByText('Soru 3 / 13')).toBeVisible()
})

test('cevaplar tarayıcıda kalıyor; Temizle onayla siliyor', async ({ page }) => {
  await formuAc(page)
  await page.getByRole('radio', { name: /^Betonarme/ }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await page.getByRole('radio', { name: '3', exact: true }).check()
  await page.getByRole('button', { name: 'İleri' }).click()
  await expect(page.getByText('Soru 3 / 13')).toBeVisible()
  await page.getByRole('button', { name: 'Haritaya dön' }).click()
  await expect(page.getByRole('button', { name: 'Sorulara devam et (3 / 13)' })).toBeFocused()

  // Adres çubuğunda konum yokken yeniden aç: seçim ve cevaplar kayıttan gelir.
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
  await page.getByRole('button', { name: 'Sorulara devam et (3 / 13)' }).click()
  await page.getByRole('button', { name: 'Geri' }).click()
  await expect(page.getByRole('radio', { name: '3', exact: true })).toBeChecked()

  await page.getByRole('button', { name: 'Temizle' }).click()
  const onay = page.getByRole('alertdialog', { name: 'Değerlendirme silinsin mi?' })
  await onay.getByRole('button', { name: 'Vazgeç' }).click()
  await expect(page.getByRole('radio', { name: '3', exact: true })).toBeChecked()

  await page.getByRole('button', { name: 'Temizle' }).click()
  await onay.getByRole('button', { name: 'Değerlendirmeyi sil' }).click()
  await expect(page.getByRole('heading', { name: '1. Binanızı bulun' })).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeHidden()
  expect(await page.evaluate((k) => localStorage.getItem(k), ANAHTAR)).toBeNull()
})
