// Bilgi sayfalarının tek girişi; hangi sayfa olduğu HTML'deki <body data-sayfa> ile seçilir.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Hakkinda } from './Hakkinda'
import { Inceleme } from './Inceleme'
import { servisCalisaniKaydet } from '@/servis-calisani'
import type { SayfaAdi } from './Sayfa'
import { Veri } from './Veri'
import { Yontem } from './Yontem'

const SAYFA = { yontem: Yontem, veri: Veri, inceleme: Inceleme, hakkinda: Hakkinda } satisfies Record<
  SayfaAdi,
  () => unknown
>
const Icerik = SAYFA[document.body.dataset.sayfa as SayfaAdi]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Icerik />
  </StrictMode>,
)

servisCalisaniKaydet()
