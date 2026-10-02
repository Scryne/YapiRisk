import { useDeferredValue, useMemo, useState } from 'react'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import type { MahalleKaydi } from '@/veri/bolge'
import { aramaDizini, mahalleAra } from './mahalle-ara'

interface Props {
  kayitlar: MahalleKaydi[]
  bolgeAdi: string
  onSec: (kayit: MahalleKaydi) => void
}

const TUR_ADI = { mahalle: 'mahalle', koy: 'köy' } as const

export function MahalleArama({ kayitlar, bolgeAdi, onSec }: Props) {
  const dizin = useMemo(() => aramaDizini(kayitlar), [kayitlar])
  const [sorgu, setSorgu] = useState('')
  const [acik, setAcik] = useState(false)
  const ertelenen = useDeferredValue(sorgu)
  const sonuclar = useMemo(() => mahalleAra(dizin, ertelenen, { bolgeAdi }), [dizin, ertelenen, bolgeAdi])
  const listeGorunur = acik && sorgu.trim().length >= 2

  return (
    <Command shouldFilter={false} label="Mahalle ya da köy ara" className="bg-transparent p-0">
      <CommandInput
        value={sorgu}
        onValueChange={(v) => {
          setSorgu(v)
          setAcik(true)
        }}
        onFocus={() => setAcik(true)}
        placeholder="Mahalle ya da köy adı"
        aria-label="Mahalle ya da köy ara"
      />
      {/* Liste DOM'da hep durur: giriş kutusunun aria-controls'u var olan bir öğeyi göstersin. */}
      <CommandList className={listeGorunur ? 'mt-1' : 'hidden'}>
        {listeGorunur && (
          <>
            <CommandEmpty className="px-2 py-3 text-left text-body-sm text-pretty text-muted-foreground">
              Bu adla bir mahalle ya da köy bulunamadı. Yazımı kontrol edin ya da yalnız adın başını yazın.
            </CommandEmpty>
            {sonuclar.map(({ kayit }) => (
              <CommandItem
                key={`${kayit.ad}|${kayit.ilce}|${kayit.konum.join(',')}`}
                value={`${kayit.ad}|${kayit.ilce}|${kayit.konum.join(',')}`}
                onSelect={() => {
                  setSorgu(`${kayit.ad}, ${kayit.ilce}`)
                  setAcik(false)
                  onSec(kayit)
                }}
              >
                {/* Bileşenin gizli onay ikonu da ml-auto aldığından satır kendi içinde yayılır. */}
                <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                  <span className="truncate">{kayit.ad}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {kayit.ilce} · {TUR_ADI[kayit.tur]}
                  </span>
                </span>
              </CommandItem>
            ))}
          </>
        )}
      </CommandList>
    </Command>
  )
}
