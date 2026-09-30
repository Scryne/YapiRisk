import { expect, test } from '@playwright/test'

test('boş kabuk açılıyor, font yerelden yükleniyor, konsol hatası ve dış istek yok', async ({
  page,
  baseURL,
}) => {
  const hatalar: string[] = []
  const disIstekler: string[] = []
  page.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  page.on('pageerror', (e) => hatalar.push(e.message))
  page.on('request', (r) => !r.url().startsWith(baseURL!) && disIstekler.push(r.url()))

  await page.goto('/')
  await expect(page).toHaveTitle('YapiRisk')
  await expect(page.getByRole('heading', { level: 1, name: 'YapiRisk' })).toBeVisible()

  // Türkçe glifler latin-ext yüzünü tetikler; yüklenen yüzlerde IBM Plex Sans olmalı.
  const yuklenenAileler = () =>
    page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''))
    })
  await expect.poll(yuklenenAileler).toContain('IBM Plex Sans')

  expect(hatalar).toEqual([])
  expect(disIstekler).toEqual([])
})
