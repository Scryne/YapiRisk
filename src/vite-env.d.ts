/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** MapTiler anahtarı (uydu katmanı). Yoksa uydu düğmesi görünmez. İstemcide açıktır; origin kısıtlıdır. */
  readonly VITE_MAPTILER_ANAHTARI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
