// Öncelik bandı: renk tek bilgi taşıyıcısı değil (DESIGN.md). Her bantta metin ve ayrı bir desen örneği var;
// desen SVG olduğu için tarayıcı "arka plan grafikleri"ni yazdırmasa da baskıda görünür.
import { cn } from '@/lib/utils'
import type { Bant } from '@/yontem/bant'
import { BANT_ADI } from './metinler'

const RENK: Record<Bant, string> = {
  yuksek: 'bg-priority-high',
  orta: 'bg-priority-medium',
  dusuk: 'bg-priority-low',
}

/** Yüksek: sık çapraz tarama · Orta: seyrek tek yön tarama · Düşük: nokta. */
export function BantDeseni({ bant, className }: { bant: Bant; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={cn('shrink-0', className)}>
      <rect
        x="0.75"
        y="0.75"
        width="14.5"
        height="14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {bant === 'yuksek' && (
        <path
          d="M0 4 L4 0 M0 8 L8 0 M0 12 L12 0 M0 16 L16 0 M4 16 L16 4 M8 16 L16 8 M12 16 L16 12 M0 12 L4 16 M0 8 L8 16 M0 4 L12 16 M0 0 L16 16 M4 0 L16 12 M8 0 L16 8 M12 0 L16 4"
          stroke="currentColor"
          strokeWidth="1"
        />
      )}
      {bant === 'orta' && (
        <path d="M0 8 L8 0 M0 16 L16 0 M8 16 L16 8" stroke="currentColor" strokeWidth="1.25" />
      )}
      {bant === 'dusuk' &&
        [4, 8, 12].flatMap((x) =>
          [4, 8, 12].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />),
        )}
    </svg>
  )
}

export function BantRozeti({ bant, kucuk = false }: { bant: Bant; kucuk?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-sm whitespace-nowrap text-on-priority print:border print:border-paper-ink print:[print-color-adjust:exact]',
        RENK[bant],
        kucuk ? 'px-1.5 py-0.5 text-label' : 'px-2.5 py-1.5 text-headline',
      )}
    >
      <BantDeseni bant={bant} className={kucuk ? 'size-3.5' : 'size-5'} />
      {BANT_ADI[bant]}
    </span>
  )
}
