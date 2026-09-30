import { createCn } from 'cn/config'

// DESIGN.md typography token'ları `text-<ad>` olarak font-size grubundadır; tanıtılmazsa
// cn onları renk sanıp `text-body-sm text-text-muted` birleşiminde boyutu siler.
const YAZI_TOKENLARI = ['display', 'headline', 'body-md', 'body-sm', 'label', 'mono-md', 'mono-sm']

export const cn = createCn({
  extend: { classGroups: { 'font-size': [{ text: YAZI_TOKENLARI }] } },
})
