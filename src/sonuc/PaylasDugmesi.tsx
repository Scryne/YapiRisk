// Değerlendirmeyi apartmandaki diğer maliklerle paylaşmak: telefonda sistemin paylaşım menüsü, değilse panoya kopya.
import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function PaylasDugmesi({ adres }: { adres: string }) {
  const [durum, setDurum] = useState<'bos' | 'kopyalandi' | 'hata'>('bos')

  const paylas = async () => {
    const veri = {
      title: 'YapiRisk değerlendirmesi',
      text: 'Binamızın deprem riski ön değerlendirmesi',
      url: adres,
    }
    try {
      if (navigator.share && navigator.canShare?.(veri)) {
        await navigator.share(veri)
        return
      }
      await navigator.clipboard.writeText(adres)
      setDurum('kopyalandi')
    } catch (e) {
      // Kullanıcı paylaşım menüsünü kapattıysa hata değil.
      if (!(e instanceof DOMException && e.name === 'AbortError')) setDurum('hata')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button variant="outline" className="h-11" onClick={paylas}>
        {durum === 'kopyalandi' ? <Check data-icon="inline-start" /> : <Share2 data-icon="inline-start" />}
        {durum === 'kopyalandi' ? 'Bağlantı kopyalandı' : 'Komşularınızla paylaşın'}
      </Button>
      <p className="text-body-sm text-pretty text-muted-foreground">
        Bağlantı binanın konumunu ve cevaplarınızı içerir; açan kişi aynı sonucu görür ve kendi gözlemiyle
        cevapları değiştirebilir. Hiçbir sunucuya kaydedilmez.
      </p>
      {durum === 'hata' && (
        <p role="alert" className="text-body-sm text-pretty text-error">
          Bağlantı kopyalanamadı. Adres çubuğundaki bağlantıyı elle kopyalayabilirsiniz:{' '}
          <span className="font-mono text-mono-sm break-all">{adres}</span>
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {durum === 'kopyalandi' ? 'Bağlantı panoya kopyalandı' : ''}
      </p>
    </div>
  )
}
