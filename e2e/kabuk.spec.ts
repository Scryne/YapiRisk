import { expect, test } from '@playwright/test'

test('kabuk açılıyor, font yerelden yükleniyor, konsol hatası yok, dış istek yalnız taban haritaya', async ({
  page,
  baseURL,
}) => {
  const hatalar: string[] = []
  const fontIstekleri: string[] = []
  const disIstekler: string[] = []
  page.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  page.on('pageerror', (e) => hatalar.push(e.message))
  page.on('request', (r) => {
    const u = r.url()
    if (r.resourceType() === 'font') fontIstekleri.push(u)
    // K-1: taban harita (OpenFreeMap) dışında üçüncü taraf isteği yok.
    if (
      !u.startsWith(baseURL!) &&
      !u.startsWith('https://tiles.openfreemap.org/') &&
      !/^(data|blob):/.test(u)
    )
      disIstekler.push(u)
  })

  await page.goto('/')
  await expect(page).toHaveTitle('YapiRisk · Deprem riski ön değerlendirmesi')
  await expect(page.getByRole('heading', { level: 1, name: 'YapiRisk' })).toBeVisible()

  // Türkçe glifler latin-ext yüzünü tetikler; yüklenen yüzlerde IBM Plex Sans olmalı.
  const yuklenenAileler = () =>
    page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''))
    })
  await expect.poll(yuklenenAileler).toContain('IBM Plex Sans')
  // Arayüz fontları kendi sunucumuzdan; harita etiket glifleri (pbf) taban haritadan gelir, font isteği değildir.
  expect(fontIstekleri.filter((u) => !u.startsWith(page.url().split('#')[0].replace(/\/$/, '')))).toEqual([])

  await expect(page.locator('main')).not.toHaveAttribute('data-yakinlik', '0.0', { timeout: 20_000 })
  expect(disIstekler).toEqual([])
  expect(hatalar).toEqual([])
})
