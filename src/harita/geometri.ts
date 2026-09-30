// Küçük düzlemsel geometri: bina ölçeğinde boylam/enlem düzlem sayılabilir.

type Halka = [number, number][]

/** Dış halkanın alan ağırlıklı merkezi; dejenere halkada köşelerin ortalaması. */
export function cokgenMerkezi(dis: Halka): [number, number] {
  let a = 0
  let cx = 0
  let cy = 0
  const [x0, y0] = dis[0]
  for (let i = 0; i < dis.length - 1; i++) {
    // Sayısal kararlılık için ilk köşeye göre ötelenmiş koordinatlar.
    const [x1, y1] = [dis[i][0] - x0, dis[i][1] - y0]
    const [x2, y2] = [dis[i + 1][0] - x0, dis[i + 1][1] - y0]
    const k = x1 * y2 - x2 * y1
    a += k
    cx += (x1 + x2) * k
    cy += (y1 + y2) * k
  }
  if (Math.abs(a) < 1e-18) {
    const n = dis.length
    return [dis.reduce((t, p) => t + p[0], 0) / n, dis.reduce((t, p) => t + p[1], 0) / n]
  }
  return [x0 + cx / (3 * a), y0 + cy / (3 * a)]
}

function halkaIcinde([x, y]: [number, number], halka: number[][]): boolean {
  let icinde = false
  for (let i = 0, j = halka.length - 1; i < halka.length; j = i++) {
    const [xi, yi] = halka[i]
    const [xj, yj] = halka[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) icinde = !icinde
  }
  return icinde
}

/** Nokta çokgende mi (ilk halka dış, diğerleri delik). */
export function cokgenIcinde(nokta: [number, number], halkalar: number[][][]): boolean {
  return halkaIcinde(nokta, halkalar[0]) && !halkalar.slice(1).some((d) => halkaIcinde(nokta, d))
}

export function geometriIcinde(
  nokta: [number, number],
  geometri:
    { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] },
): boolean {
  return geometri.type === 'Polygon'
    ? cokgenIcinde(nokta, geometri.coordinates)
    : geometri.coordinates.some((c) => cokgenIcinde(nokta, c))
}
