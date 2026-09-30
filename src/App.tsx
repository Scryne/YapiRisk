export default function App() {
  return (
    <main className="relative h-dvh overflow-hidden">
      {/* Faz 4: MapLibre haritası bu alanı doldurur. */}
      <div aria-hidden="true" className="absolute inset-0 bg-background" />
      <section className="absolute top-4 left-4 w-[min(22rem,calc(100%-2rem))] rounded-lg border border-border bg-surface p-4 supports-[backdrop-filter]:bg-glass supports-[backdrop-filter]:backdrop-blur-md">
        <h1 className="text-headline">YapiRisk</h1>
        <p className="mt-1 text-body-sm text-pretty text-muted-foreground">
          Manisa&apos;daki betonarme binalar için deprem riski ön değerlendirmesi. Sonuç bir hüküm değil,
          profesyonel inceleme önceliğidir.
        </p>
      </section>
    </main>
  )
}
