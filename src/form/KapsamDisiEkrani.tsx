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
        Binanızın profesyonel incelemesi için Çevre, Şehircilik ve İklim Değişikliği Bakanlığı’nın lisans
        verdiği kuruluşlara başvurabilirsiniz. Bu kuruluşların listesini ilinizdeki Çevre, Şehircilik ve İklim
        Değişikliği İl Müdürlüğü’nden öğrenebilirsiniz.
      </p>
      <Button variant="outline" className="h-11 justify-start" onClick={onDegistir}>
        <ArrowLeft data-icon="inline-start" />
        Cevabımı değiştir
      </Button>
    </section>
  )
}
