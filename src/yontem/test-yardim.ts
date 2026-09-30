// Yalnız testler kullanır: spike referans dosyalarını okur.
import { readFileSync } from 'node:fs'
import type { Izgara } from './tehlike'

export function csvOku(yol: string): Record<string, string>[] {
  const [baslik, ...satirlar] = readFileSync(yol, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/)
  const alanlar = baslik.split(',')
  return satirlar.map((s) => Object.fromEntries(s.split(',').map((d, i) => [alanlar[i], d])))
}

/** EFEHR `/v1/maps/area` nokta listesini düzenli ızgaraya çevirir (spike S1 dosyaları). */
export function efehrIzgara(yol: string): Izgara {
  const { points } = JSON.parse(readFileSync(yol, 'utf8')) as {
    points: { lat: number; lon: number; value: number }[]
  }
  const r = (x: number) => Math.round(x * 1e4) / 1e4
  const enlemler = [...new Set(points.map((p) => r(p.lat)))].sort((a, b) => a - b)
  const boylamlar = [...new Set(points.map((p) => r(p.lon)))].sort((a, b) => a - b)
  const degerler = enlemler.map(() => boylamlar.map(() => Number.NaN))
  for (const p of points) degerler[enlemler.indexOf(r(p.lat))][boylamlar.indexOf(r(p.lon))] = p.value
  return { enlemler, boylamlar, degerler }
}
