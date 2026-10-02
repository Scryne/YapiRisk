// K-5: ESHM20 tahmini yerine AFAD Türkiye Deprem Tehlike Haritası (TDTH) değeri girilirse tehlike aralığı kalkar.
// TDTH'nin açık servisi yok; değer kullanıcının e-Devlet ile aldığı rapordan elle girilir. S_S zeminden bağımsızdır,
// SDS formdaki zeminle hesaplanır (Final-Doküman K-17).
import { Check, Copy, ExternalLink } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ondalik } from './metinler'
import { ssOku, supheliMi } from './sonuc'

const g3 = ondalik(3)
const TDTH_ADRESI = 'https://tdth.afad.gov.tr'

interface Props {
  /** Sonuç kartındaki çağrının açıp odaklayabilmesi için. */
  id?: string
  merkez: [number, number]
  ssEshm20: number
  tdthSs: number | null
  onTdth: (ss: number | null) => void
}

export function TdthGirisi({ id: disId, merkez, ssEshm20, tdthSs, onTdth }: Props) {
  const id = useId()
  const [metin, setMetin] = useState('')
  const [hata, setHata] = useState(false)
  const [kopyalandi, setKopyalandi] = useState(false)
  // Değer uygulanınca ya da kaldırılınca tetikleyen düğme ekrandan kalkar; odak yeni duruma taşınır.
  const kullanilanRef = useRef<HTMLParagraphElement>(null)
  const ozetRef = useRef<HTMLElement>(null)
  const odakBekliyor = useRef(false)
  useEffect(() => {
    if (!odakBekliyor.current) return
    odakBekliyor.current = false
    ;(tdthSs === null ? ozetRef.current : kullanilanRef.current)?.focus()
  }, [tdthSs])
  const [boylam, enlem] = merkez
  // TDTH formu noktalı ondalık bekler.
  const koordinat = `${enlem.toFixed(5)}, ${boylam.toFixed(5)}`

  const uygula = (e: FormEvent) => {
    e.preventDefault()
    const ss = ssOku(metin)
    setHata(ss === null)
    if (ss !== null) {
      odakBekliyor.current = true
      onTdth(ss)
      setMetin('')
    }
  }

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(koordinat)
      setKopyalandi(true)
    } catch {
      setKopyalandi(false)
    }
  }

  if (tdthSs !== null)
    return (
      <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        <p ref={kullanilanRef} tabIndex={-1} className="text-body-sm text-pretty outline-none">
          Resmî değer kullanılıyor: S<sub>S</sub>{' '}
          <span className="font-mono text-mono-sm tabular-nums">{g3.format(tdthSs)} g</span> (AFAD TDTH).
        </p>
        {supheliMi(tdthSs, ssEshm20) && (
          <p className="text-body-sm text-pretty text-error">
            Bu değer ESHM20 tahmininden ({g3.format(ssEshm20)} g) çok farklı. Rapordaki S<sub>DS</sub> ya da
            PGA satırını değil, S<sub>S</sub> satırını girdiğinizden emin olun.
          </p>
        )}
        <Button
          variant="outline"
          className="h-11 self-start"
          onClick={() => {
            odakBekliyor.current = true
            onTdth(null)
          }}
        >
          Resmî değeri kaldır
        </Button>
      </div>
    )

  return (
    <details id={disId} className="group rounded-md border border-border">
      <summary
        ref={ozetRef}
        className="flex min-h-11 cursor-pointer items-center px-3 text-body-sm font-medium marker:text-muted-foreground"
      >
        Resmî tehlike değeriyle kesinleştirin
      </summary>
      <div className="flex flex-col gap-3 px-3 pb-3">
        <p className="text-body-sm text-pretty text-muted-foreground">
          AFAD’ın Türkiye Deprem Tehlike Haritası binanızın konumu için resmî S<sub>S</sub> değerini verir.
          Değeri girerseniz tehlike aralığı kalkar. e-Devlet girişinden sonra bir dakikadan kısa sürer.
        </p>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-body-sm text-pretty marker:text-muted-foreground">
          <li>
            <a
              href={TDTH_ADRESI}
              target="_blank"
              rel="noopener"
              className="text-primary underline underline-offset-4"
            >
              tdth.afad.gov.tr
              <ExternalLink className="ml-0.5 inline size-3.5 align-[-2px]" aria-hidden="true" />
              <span className="sr-only"> (yeni sekmede açılır)</span>
            </a>{' '}
            adresine e-Devlet şifrenizle girin.
          </li>
          <li>
            “Raporlama” bölümünde konum olarak bu koordinatı girin:
            <span className="mt-1 flex items-center gap-2">
              <code className="font-mono text-mono-sm tabular-nums">{koordinat}</code>
              <Button variant="ghost" size="sm" className="h-9" onClick={kopyala}>
                {kopyalandi ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
              </Button>
            </span>
          </li>
          <li>Deprem yer hareketi düzeyi olarak DD-2’yi seçin.</li>
          <li>
            Herhangi bir zemin sınıfı seçin; S<sub>S</sub> zeminden etkilenmez.
          </li>
          <li>
            “Değerleri Hesapla”ya basın ve rapordaki S<sub>S</sub> değerini aşağıya yazın.
          </li>
        </ol>
        <form onSubmit={uygula} noValidate className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-ss`} className="text-label">
            TDTH raporundaki S<sub>S</sub> (g)
          </label>
          <div className="flex gap-2">
            <Input
              id={`${id}-ss`}
              inputMode="decimal"
              autoComplete="off"
              value={metin}
              onChange={(e) => {
                setMetin(e.target.value)
                setHata(false)
              }}
              aria-invalid={hata || undefined}
              aria-describedby={`${id}-ipucu${hata ? ` ${id}-hata` : ''}`}
              className="h-11 flex-1 font-mono"
            />
            <Button type="submit" className="h-11">
              Değeri kullan
            </Button>
          </div>
          <p id={`${id}-ipucu`} className="text-body-sm text-muted-foreground">
            Örnek: 1,158
          </p>
          {hata && (
            <p id={`${id}-hata`} role="alert" className="text-body-sm text-pretty text-error">
              Bu bir S<sub>S</sub> değeri olarak okunamadı. 0 ile 4 arasında bir sayı girin, örneğin 1,158.
            </p>
          )}
        </form>
        <p aria-live="polite" className="sr-only">
          {kopyalandi ? 'Koordinat kopyalandı' : ''}
        </p>
      </div>
    </details>
  )
}
