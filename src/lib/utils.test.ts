import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('typography token boyutunu renk sınıfıyla birlikte korur', () => {
    expect(cn('text-body-sm', 'text-text-muted')).toBe('text-body-sm text-text-muted')
  })

  it('iki typography token çakışınca sonuncuyu tutar', () => {
    expect(cn('text-body-md', 'text-headline')).toBe('text-headline')
  })

  it('DESIGN.md’deki her typography token cn’e tanıtılmış', () => {
    const on = parse(readFileSync('DESIGN.md', 'utf8').split(/^---\s*$/m)[1])
    for (const ad of Object.keys(on.typography)) {
      expect(cn('text-text', `text-${ad}`)).toBe(`text-text text-${ad}`)
      expect(cn(`text-${ad}`, 'text-body-md')).toBe('text-body-md')
    }
  })
})
