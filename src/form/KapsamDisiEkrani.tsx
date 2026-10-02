// K-8: yöntem kapsamı dışındaki binalar puanlanmaz; neden ve profesyonel inceleme yolu yazılır.
import { ArrowLeft } from 'lucide-react'
import type { Ref } from 'react'
import { Button } from '@/components/ui/button'
import type { KapsamDisi } from './taslak'

const NEDENLER: Record<KapsamDisi, string> = {
  celik:
    'YapiRisk’in kullandığı RYTEİE Ek-A hızlı yöntemleri betonarme ve yığma binalar içindir. Yönetmelikte çelik yapılar için bu tür hızlı bir yöntem yok.',
  prefabrik:
    'YapiRisk’in kullandığı RYTEİE Ek-A hızlı yöntemleri betonarme ve yığma binalar içindir. Yönetmelikte prefabrik yapılar için bu tür hızlı bir yöntem yok.',
  kat: 'YapiRisk’in kullandığı RYTEİE Ek-A yöntemi 1 ile 7 serbest katlı betonarme binalar içindir. Daha yüksek binalar bu yöntemle değerlendirilmez.',
  yigmaKat:
    'RYTEİE Ek-A’nın yığma yöntemi 1 ile 5 serbest katlı yığma binalar içindir. Daha yüksek yığma binalar bu yöntemle değerlendirilmez.',
}

interface Props {
  neden: KapsamDisi
  baslikRef: Ref<HTMLHeadingElement>
  onDegistir: () => void
}

export function KapsamDisiEkrani({ neden, baslikRef, onDegistir }: Props) {
  return (
    <section aria-labelledby="kapsam-baslik" className="flex flex-col gap-3">
      <h2
        id="kapsam-baslik"
        ref={baslikRef}
        tabIndex={-1}
        className="text-headline text-balance outline-none"
      >
        Bu bina yöntemin kapsamı dışında
      </h2>
      <p className="text-body-md text-pretty">{NEDENLER[neden]}</p>
      <p className="text-body-sm text-pretty text-muted-foreground">
        Binanızın profesyonel incelemesi için Kentsel Dönüşüm Başkanlığının lisans verdiği kuruluşlara riskli
        yapı tespiti yaptırabilirsiniz. Bu kuruluşları ilinizdeki Çevre, Şehircilik ve İklim Değişikliği İl
        Müdürlüğü’nden ya da ALO 181’den öğrenebilirsiniz.
      </p>
      <a
        href={`${import.meta.env.BASE_URL}inceleme.html`}
        className="self-start text-body-sm text-primary underline-offset-4 hover:underline"
      >
        Süreç adım adım: başvuru, itiraz, haklar
      </a>
      <Button variant="outline" className="h-11 justify-start" onClick={onDegistir}>
        <ArrowLeft data-icon="inline-start" />
        Cevabımı değiştir
      </Button>
    </section>
  )
}
