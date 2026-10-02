// Tarayıcının bağlantı durumu; çevrimdışıyken panel ne çalışıp ne çalışmadığını söyler.
import { useSyncExternalStore } from 'react'

function abone(degisti: () => void) {
  window.addEventListener('online', degisti)
  window.addEventListener('offline', degisti)
  return () => {
    window.removeEventListener('online', degisti)
    window.removeEventListener('offline', degisti)
  }
}

export const useCevrimici = () =>
  useSyncExternalStore(
    abone,
    () => navigator.onLine,
    () => true,
  )
