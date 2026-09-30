import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { expect, test, type Page } from '@playwright/test'
import { cokgenIcinde, cokgenMerkezi } from '../src/harita/geometri.ts'

// Taban harita dışında üçüncü taraf isteği olmamalı (K-1).
const TABAN_HARITA = 'https://tiles.openfreemap.org/'

function istekleriIzle(page: Page, baseURL: string) {
  const yabanci: string[] = []
  const hatalar: string[] = []
  page.on('request', (r) => {
    const u = r.url()
    if (
      !u.startsWith(baseURL) &&
      !u.startsWith(TABAN_HARITA) &&
      !u.startsWith('data:') &&
      !u.startsWith('blob:')
    )
      yabanci.push(u)
  })
  page.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  page.on('pageerror', (e) => hatalar.push(e.message))
  return { yabanci, hatalar }
}

/** Panelin kapatmadığı harita alanının merkezi; harita merkezi (dolguyla) buraya düşer. */
async function gorunenMerkez(page: Page) {
  const vp = page.viewportSize()!
  const panel = (await page.getByRole('complementary', { name: 'Bina bulma' }).boundingBox())!
  return vp.width >= 768
    ? { x: (panel.x + panel.width + vp.width) / 2, y: vp.height / 2 }
    : { x: vp.width / 2, y: panel.y / 2 }
}

const hazirBekle = (page: Page) =>
  expect(page.getByRole('heading', { name: '1. Binanızı bulun' })).toBeVisible()
const ssOku = async (page: Page) =>
  Number((await page.getByTestId('ss-degeri').textContent())!.replace(/\s*g$/, '').replace(',', '.'))

/** Manisa merkezindeki en kalabalık parçadan tıklanabilir bir binanın merkezi. */
function ornekBina(): [number, number] {
  const dizin = JSON.parse(readFileSync('public/data/manisa/bina/dizin.json', 'utf8')) as {
    parcalar: [number, number, number][]
  }
  // Şehzadeler çevresi (z14: x 9439–9441, y 6283–6285)
  const [x, y] = dizin.parcalar
    .filter(([px, py]) => px >= 9439 && px <= 9441 && py >= 6283 && py <= 6285)
    .sort((a, b) => b[2] - a[2])[0]
  const { binalar } = JSON.parse(
    gunzipSync(readFileSync(`public/data/manisa/bina/${x}/${y}.json.gz`)).toString(),
  ) as {
    binalar: [number, number][][][]
  }
  const alan = (h: [number, number][]) =>
    Math.abs(h.slice(0, -1).reduce((t, p, i) => t + p[0] * h[i + 1][1] - h[i + 1][0] * p[1], 0))
  // Avlulu bloklarda merkez avluya düşer; deliksiz ve merkezi kendi içinde olan en büyük bina.
  const uygun = binalar.filter((b) => b.length === 1 && cokgenIcinde(cokgenMerkezi(b[0]), b))
  const enBuyuk = uygun.reduce((a, b) => (alan(b[0]) > alan(a[0]) ? b : a))
  return cokgenMerkezi(enBuyuk[0])
}

test('mahalle aranıyor, harita gidiyor, binaya dokununca bina seçiliyor', async ({ page, baseURL }) => {
  const { yabanci, hatalar } = istekleriIzle(page, baseURL!)
  await page.goto('/')
  await hazirBekle(page)

  const arama = page.getByRole('combobox', { name: 'Mahalle ya da köy ara' })
  await arama.fill('akincilar sehzadeler')
  await page.getByRole('option', { name: /Akıncılar.*Şehzadeler/ }).click()
  await expect(arama).toHaveValue('Akıncılar, Şehzadeler')
  await expect(page.getByText('Binanızın çizimine dokunun.')).toBeVisible({ timeout: 15_000 })

  const [boylam, enlem] = ornekBina()
  await page.goto(`/#harita=19/${enlem}/${boylam}`)
  // Uçuş bitmeden tıklamak uçuşu keser; harita 19'da durana kadar bekle.
  await expect(page.locator('main')).toHaveAttribute('data-yakinlik', '19.0', { timeout: 20_000 })
  await expect(page.getByText('Binanızın çizimine dokunun.')).toBeVisible()
  // Parçalar yüklenip çizilene kadar bekle, sonra ekranın ortasına (binanın merkezi) dokun.
  await expect(async () => {
    const m = await gorunenMerkez(page)
    await page.mouse.click(m.x, m.y)
    await expect(page.getByRole('heading', { name: 'Seçilen bina' })).toBeVisible({ timeout: 1_000 })
  }).toPass({ timeout: 20_000 })
  expect(await ssOku(page)).toBeGreaterThan(0.5)

  expect(yabanci).toEqual([])
  expect(hatalar).toEqual([])
})

test('arama klavyeyle kullanılıyor: yaz, ok tuşu, Enter', async ({ page }) => {
  await page.goto('/')
  await hazirBekle(page)
  const arama = page.getByRole('combobox', { name: 'Mahalle ya da köy ara' })
  await arama.focus()
  await page.keyboard.type('zafer soma')
  await expect(page.getByRole('option').first()).toContainText('Soma')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Enter')
  await expect(arama).toHaveValue('Zafer, Soma')
  await expect(page.getByRole('option')).toHaveCount(0)
})

test('ayak izi yoksa nokta seçiliyor; bölge dışı nokta uyarı veriyor', async ({ page, baseURL }) => {
  const { yabanci } = istekleriIzle(page, baseURL!)
  await page.goto('/#harita=16/38.9/28.3')
  await hazirBekle(page)
  await expect(page.locator('main')).toHaveAttribute('data-yakinlik', '16.0', { timeout: 20_000 })
  await page.getByRole('button', { name: 'Binam haritada yok, konumu işaretleyeceğim' }).click()
  await expect(page.getByText('Haritada binanızın bulunduğu yere dokunun.')).toBeVisible()
  const m = await gorunenMerkez(page)
  await page.mouse.click(m.x, m.y)
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
  await expect(page.getByTestId('ss-degeri')).toBeVisible()

  await page.goto('/#konum=38.42,27.14') // İzmir, Konak
  await expect(page.getByRole('alert')).toContainText('Manisa sınırının dışında')
  await page.getByRole('button', { name: 'Seçimi kaldır' }).click()
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeHidden()
  expect(yabanci).toEqual([])
})

test('S1: 10 ilçe merkezinde gösterilen SS spike değeriyle ±0,001', async ({ page }) => {
  const oku = (yol: string) =>
    readFileSync(yol, 'utf8')
      .replace(/^﻿/, '')
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((s) => s.split(','))
  const noktalar = oku('spike/S1/tdth-okumalar.csv') // no,ilce,enlem,boylam,…
  const beklenen = new Map(
    oku('spike/S1/sonuc.csv')
      .filter((s) => s[2] === 'SS')
      .map((s) => [s[0], Number(s[3])]),
  )
  expect(noktalar).toHaveLength(10)

  await page.goto('/')
  await hazirBekle(page)
  for (const [no, ilce, enlem, boylam] of noktalar) {
    await page.evaluate((h) => (window.location.hash = h), `konum=${enlem},${boylam}`)
    await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
    await expect(page.locator('main')).toContainText(`${enlem.replace('.', ',')}`)
    const ss = await ssOku(page)
    expect(Math.abs(ss - beklenen.get(no)!), ilce).toBeLessThanOrEqual(0.001)
  }
})

test("uydu katmanı yalnız açılınca MapTiler'a istek atar; logo ve not görünür", async ({ page }) => {
  const maptiler: string[] = []
  page.on('request', (r) => r.url().startsWith('https://api.maptiler.com/') && maptiler.push(r.url()))
  await page.goto('/#harita=18/38.6140/27.4303')
  await hazirBekle(page)
  const dugme = page.getByRole('button', { name: 'Uydu görünümü' })
  test.skip((await dugme.count()) === 0, 'MapTiler anahtarı yok (VITE_MAPTILER_ANAHTARI); uydu düğmesi gizli')

  await expect(page.locator('main')).toHaveAttribute('data-yakinlik', '18.0', { timeout: 20_000 })
  expect(maptiler).toEqual([])

  await dugme.click()
  await expect(dugme).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: 'MapTiler' })).toBeVisible()
  await expect(page.getByText('baktığınız bölge MapTiler')).toBeVisible()
  await expect.poll(() => maptiler.length, { timeout: 15_000 }).toBeGreaterThan(0)
  await expect(page.getByRole('alert')).toHaveCount(0)

  await dugme.click()
  await expect(page.getByRole('link', { name: 'MapTiler' })).toBeHidden()
})
