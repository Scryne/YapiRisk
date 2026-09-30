// DESIGN.md frontmatter → src/styles/tokens.css (Tailwind v4 @theme).
// Kesin değerlerin tek kaynağı DESIGN.md; bu dosya elle düzenlenmez.
// `--check`: dosyayı yazmaz, güncel değilse 1 ile çıkar (CI).
import { readFileSync, writeFileSync } from 'node:fs'
import { lint } from '@google/design.md/linter'
import { parse } from 'yaml'

const HEDEF = 'src/styles/tokens.css'
const kaynak = readFileSync('DESIGN.md', 'utf8')

const rapor = lint(kaynak)
if (rapor.summary.errors > 0 || rapor.summary.warnings > 0) {
  console.error(JSON.stringify(rapor.findings, null, 2))
  process.exit(1)
}

const on = parse(kaynak.split(/^---\s*$/m)[1])
const satirlar = []
const ekle = (ad, deger) => satirlar.push(`  --${ad}: ${deger};`)

for (const [ad, deger] of Object.entries(on.colors)) ekle(`color-${ad}`, deger.toLowerCase())

// Yazı aileleri: sans ve mono, typography token'larından türetilir.
const aileler = new Set(Object.values(on.typography).map((t) => t.fontFamily))
for (const aile of aileler) {
  const mono = /mono/i.test(aile)
  ekle(
    `font-${mono ? 'mono' : 'sans'}`,
    `"${aile}", ${mono ? 'ui-monospace, monospace' : 'system-ui, sans-serif'}`,
  )
}

// Her typography token'ı tek bir `text-<ad>` sınıfı: boyut + satır yüksekliği + ağırlık + aralık.
for (const [ad, t] of Object.entries(on.typography)) {
  ekle(`text-${ad}`, t.fontSize)
  if (t.lineHeight != null) ekle(`text-${ad}--line-height`, t.lineHeight)
  if (t.fontWeight != null) ekle(`text-${ad}--font-weight`, t.fontWeight)
  if (t.letterSpacing != null) ekle(`text-${ad}--letter-spacing`, t.letterSpacing)
}

for (const [ad, deger] of Object.entries(on.rounded)) ekle(`radius-${ad}`, deger)

// Aralıklar Tailwind'in 4px tabanlı ölçeğine oturmalı (p-1, p-2, p-4…); adlı spacing üretilmez,
// çünkü `max-w-md` gibi sınıflarla çakışır.
for (const [ad, deger] of Object.entries(on.spacing)) {
  const px = Number.parseFloat(deger)
  if (!String(deger).endsWith('px') || px % 4 !== 0) {
    console.error(`spacing.${ad} = ${deger}: 4px'in katı olmalı`)
    process.exit(1)
  }
}

const css = `/* DESIGN.md'den üretildi (npm run tokens). Elle düzenleme. */\n@theme {\n${satirlar.join('\n')}\n}\n`

if (process.argv.includes('--check')) {
  const mevcut = readFileSync(HEDEF, 'utf8').replace(/\r\n/g, '\n')
  if (mevcut !== css) {
    console.error(`${HEDEF} DESIGN.md ile uyumsuz; npm run tokens çalıştır.`)
    process.exit(1)
  }
} else {
  writeFileSync(HEDEF, css)
}
