// Uçtan uca testlerin ortak yardımcıları.
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { expect, type Page } from '@playwright/test'
import { cokgenIcinde, cokgenMerkezi } from '../src/harita/geometri.ts'

// Taban harita dışında üçüncü taraf isteği olmamalı (K-1).
export const TABAN_HARITA = 'https://tiles.openfreemap.org/'

export function istekleriIzle(page: Page, baseURL: string) {
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
export async function gorunenMerkez(page: Page) {
  const vp = page.viewportSize()!
  const panel = (await page.getByRole('complementary', { name: 'Bina bulma' }).boundingBox())!
  return vp.width >= 768
    ? { x: (panel.x + panel.width + vp.width) / 2, y: vp.height / 2 }
    : { x: vp.width / 2, y: panel.y / 2 }
}

export const hazirBekle = (page: Page) =>
  expect(page.getByRole('heading', { name: '1. Binanızı bulun' })).toBeVisible()
export const ssOku = async (page: Page) =>
  Number((await page.getByTestId('ss-degeri').textContent())!.replace(/\s*g$/, '').replace(',', '.'))

/** Manisa merkezindeki en kalabalık parçadan tıklanabilir bir binanın merkezi. */
export function ornekBina(): [number, number] {
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

/**
 * Formu fareyle doldurur: her adımda ilk soru grubunun `sira`'ncı seçeneği; nizam bitişikse ikinci grup da.
 * 12 cevap verilirse isteğe bağlı 13. adım atlanır.
 */
export async function doldur(page: Page, siralar: number[], dosemeSirasi = 0) {
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
export const KUSURSUZ_4_KAT = [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
