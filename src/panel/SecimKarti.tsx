import { TriangleAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Secim } from '@/harita/tipler'

const sayi = (basamak: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: basamak, maximumFractionDigits: basamak })
const koordinat = sayi(5)
const ivme = sayi(3)

interface Props {
  secim: Secim
  bolgeAdi: string
  /** Bölge dışındaysa null. */
  ss: number | null
  onKaldir: () => void
}

export function SecimKarti({ secim, bolgeAdi, ss, onKaldir }: Props) {
  const [boylam, enlem] = secim.merkez
  return (
    <section aria-labelledby="secim-baslik" className="rounded-md border border-border bg-background/40 p-3">
      <div className="flex items-start gap-2">
        <h2 id="secim-baslik" className="text-label text-balance">
          {secim.tip === 'bina' ? 'Seçilen bina' : 'Seçilen nokta'}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-mt-1 -mr-1 ml-auto"
          onClick={onKaldir}
          aria-label="Seçimi kaldır"
        >
          <X />
        </Button>
      </div>
      <p className="mt-1 font-mono text-mono-sm text-muted-foreground tabular-nums">
        {koordinat.format(enlem)}, {koordinat.format(boylam)}
      </p>

      {ss === null ? (
        <p role="alert" className="mt-3 flex gap-2 text-body-sm text-pretty text-error">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Bu nokta {bolgeAdi} sınırının dışında. YapiRisk şimdilik yalnız {bolgeAdi} için tehlike verisi
          taşıyor.
        </p>
      ) : (
        <dl className="mt-3 grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1">
          <dt className="text-body-sm text-muted-foreground">
            Kısa periyot spektral ivme, S<sub>S</sub>
          </dt>
          <dd className="text-right font-mono text-mono-md tabular-nums" data-testid="ss-degeri">
            {ivme.format(ss)} g
          </dd>
          <dd className="col-span-2 text-body-sm text-pretty text-muted-foreground">
            Kaynak: ESHM20 (Avrupa modeli, 475 yıl, kaya). AFAD&apos;ın resmî değeri değildir; farkı sonuçta
            aralık olarak gösterilir.
          </dd>
        </dl>
      )}
    </section>
  )
}
