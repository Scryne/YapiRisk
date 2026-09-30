import { useEffect, useState } from 'react'
import { veriYolu } from '@/veri/bolge'

export type Yuklenen<T> = { durum: 'yukleniyor' } | { durum: 'hata' } | { durum: 'hazir'; veri: T }

/** Bölge paketinden statik JSON (ör. dogrulama.json); sayfa metni bu dosyalardaki sayılarla aynı kalır. */
export function useJson<T>(yol: string): Yuklenen<T> {
  const [durum, setDurum] = useState<Yuklenen<T>>({ durum: 'yukleniyor' })
  useEffect(() => {
    let iptal = false
    fetch(veriYolu(yol))
      .then((y) => (y.ok ? (y.json() as Promise<T>) : Promise.reject(new Error(String(y.status)))))
      .then((veri) => !iptal && setDurum({ durum: 'hazir', veri }))
      .catch(() => !iptal && setDurum({ durum: 'hata' }))
    return () => {
      iptal = true
    }
  }, [yol])
  return durum
}
