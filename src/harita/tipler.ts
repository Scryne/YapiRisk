// Harita bileşeninin dışa açtığı tipler ve sabitler. Harita (MapLibre) ayrı parçada tembel yüklenir;
// bunlar ana pakette kalır.
import type { BinaCokgeni } from '@/veri/parca'

/** Bu yakınlığın altında bina parçası indirilmez ve çizilmez. */
export const BINA_YAKINLIGI = 14

export type Secim =
  | { tip: 'bina'; anahtar: string; merkez: [number, number]; cokgen: BinaCokgeni }
  | { tip: 'nokta'; merkez: [number, number] }

export interface HaritaHedefi {
  merkez: [number, number]
  yakinlik: number
  /** Aynı hedefe ikinci kez gidebilmek için artan sayı. */
  sira: number
}
