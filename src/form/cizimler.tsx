// RYTEİE 2019 Şekil A.1'den (Resmî Gazete 16.02.2019, 30688, ek s. 32–33) yeniden çizilen şematik çizimler (K-14).
// Tek renk (currentColor), ince çizgi; dolgu duvar taralı, betonarme perde dolu. Çizimler süstür: anlamı yanındaki
// metin taşır, bu yüzden ekran okuyucudan gizlidir.
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const INCE = 1.25
const KALIN = 2.5

function Svg({
  viewBox,
  className,
  children,
}: {
  viewBox: string
  className?: string
  children: (tarama: string) => ReactNode
}) {
  const id = useId().replace(/:/g, '')
  const tarama = `${id}-tarama`
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      className={cn('block h-auto w-full', className)}
    >
      <defs>
        <pattern id={tarama} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
        </pattern>
      </defs>
      {children(`url(#${tarama})`)}
    </svg>
  )
}

const cizgi = (w = INCE) => ({ strokeWidth: w, vectorEffect: 'non-scaling-stroke' as const })

interface Cerceve {
  /** Sol alt köşe x'i ve zemin y'si. */
  x: number
  y: number
  acikliklar: number[]
  /** Kat yükseklikleri, alttan yukarı. */
  katlar: number[]
  tarama: string
  dolgu?: (kat: number, aciklik: number) => boolean
  perde?: (kat: number, aciklik: number) => boolean
  /** Bu katta bu kolon yok (düşeyde devam etmeyen kolon). */
  kolonYok?: (kat: number, kolon: number) => boolean
}

/** Şekil A.1 düşey kesit dili: kalın kolon ve kiriş, taralı dolgu duvar, dolu perde. */
function cerceve({ x, y, acikliklar, katlar, tarama, dolgu, perde, kolonYok }: Cerceve) {
  const xs = acikliklar.reduce<number[]>((a, w) => [...a, a[a.length - 1] + w], [x])
  const ys = katlar.reduce<number[]>((a, h) => [...a, a[a.length - 1] - h], [y])
  const parcalar: ReactNode[] = []
  katlar.forEach((_, k) =>
    acikliklar.forEach((_, j) => {
      const [x0, x1, y0, y1] = [xs[j], xs[j + 1], ys[k + 1], ys[k]]
      if (perde?.(k, j))
        parcalar.push(
          <rect key={`p${k}-${j}`} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="currentColor" />,
        )
      else if (dolgu?.(k, j))
        parcalar.push(
          <rect
            key={`d${k}-${j}`}
            x={x0}
            y={y0}
            width={x1 - x0}
            height={y1 - y0}
            fill={tarama}
            stroke="none"
          />,
        )
    }),
  )
  katlar.forEach((_, k) =>
    xs.forEach((cx, c) => {
      if (!kolonYok?.(k, c))
        parcalar.push(<line key={`k${k}-${c}`} x1={cx} y1={ys[k]} x2={cx} y2={ys[k + 1]} {...cizgi(KALIN)} />)
    }),
  )
  ys.slice(1).forEach((ky, k) =>
    parcalar.push(<line key={`b${k}`} x1={xs[0]} y1={ky} x2={xs[xs.length - 1]} y2={ky} {...cizgi(KALIN)} />),
  )
  return parcalar
}

const Zemin = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <line x1={x1} y1={y} x2={x2} y2={y} {...cizgi()} opacity={0.7} />
)

const Yazi = ({
  x,
  y,
  children,
  boyut = 7,
}: {
  x: number
  y: number
  children: ReactNode
  boyut?: number
}) => (
  <text
    x={x}
    y={y}
    fill="currentColor"
    stroke="none"
    fontSize={boyut}
    textAnchor="middle"
    fontFamily="inherit"
  >
    {children}
  </text>
)

const hep = () => true

/** Pencereli dolgu duvar: dış dikdörtgen eksi delikler (evenodd), delikler arkaplanı gösterir. */
const delikliDuvar = (
  x: number,
  y: number,
  w: number,
  h: number,
  delikler: [number, number, number, number][],
) => [[x, y, w, h], ...delikler].map(([a, b, c, d]) => `M${a} ${b} h${c} v${d} h${-c} Z`).join(' ')

// ——— Taşıyıcı malzeme ———

export const Betonarme = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 32, y: 80, acikliklar: [28, 28], katlar: [20, 20, 20], tarama: t, dolgu: hep })}
        <Zemin x1={14} x2={106} y={80} />
      </>
    )}
  </Svg>
)

export const Yigma = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        <path
          d={delikliDuvar(32, 30, 56, 50, [
            [40, 36, 10, 13],
            [70, 36, 10, 13],
            [40, 61, 10, 13],
            [70, 61, 10, 13],
          ])}
          fill={t}
          fillRule="evenodd"
          {...cizgi()}
        />
        <rect x={32} y={30} width={56} height={50} {...cizgi(KALIN)} />
        <line x1={32} y1={55} x2={88} y2={55} {...cizgi()} />
        <Zemin x1={14} x2={106} y={80} />
      </>
    )}
  </Svg>
)

export const Celik = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 32, y: 80, acikliklar: [28, 28], katlar: [20, 20, 20], tarama: t })}
        {[80, 60, 40].map((y) => (
          <path key={y} d={`M32 ${y} L60 ${y - 20} M60 ${y} L32 ${y - 20}`} {...cizgi()} />
        ))}
        <Zemin x1={14} x2={106} y={80} />
      </>
    )}
  </Svg>
)

export const Prefabrik = () => (
  <Svg viewBox="0 0 120 90">
    {() => (
      <>
        <path d="M22 80 V46 L60 32 L98 46 V80" {...cizgi(KALIN)} />
        <line x1={22} y1={46} x2={98} y2={46} {...cizgi()} />
        {[41, 60, 79].map((x) => (
          <line key={x} x1={x} y1={46} x2={x} y2={50} {...cizgi()} />
        ))}
        <Zemin x1={10} x2={110} y={80} />
      </>
    )}
  </Svg>
)

// ——— Serbest kat adedi (nₛₖ) ———

function KatOrnegi({ egimli }: { egimli: boolean }) {
  const katlar = egimli ? 6 : 5
  const h = 13
  const zemin = 100
  const x = 42
  return (
    <Svg viewBox="0 0 120 120">
      {(t) => (
        <>
          {egimli ? (
            <>
              {cerceve({ x, y: zemin, acikliklar: [18, 18], katlar: Array(katlar).fill(h), tarama: t })}
              <line x1={20} y1={zemin - 2 * h + 4} x2={102} y2={zemin + 4} {...cizgi()} opacity={0.7} />
            </>
          ) : (
            <>
              <rect x={x} y={zemin} width={36} height={h} fill={t} stroke="none" />
              <rect x={x} y={zemin} width={36} height={h} {...cizgi(KALIN)} />
              <Yazi x={x - 8} y={zemin + h - 3}>
                B
              </Yazi>
              {cerceve({ x, y: zemin, acikliklar: [18, 18], katlar: Array(katlar).fill(h), tarama: t })}
              <path d={`M18 ${zemin} H${x} M${x + 36} ${zemin} H102`} {...cizgi()} opacity={0.7} />
            </>
          )}
          {Array.from({ length: katlar }, (_, k) => (
            <Yazi key={k} x={x + 27} y={zemin - k * h - 4}>
              {k + 1}
            </Yazi>
          ))}
        </>
      )}
    </Svg>
  )
}
export const KatEgimli = () => <KatOrnegi egimli />
export const KatBodrumlu = () => <KatOrnegi egimli={false} />

// ——— Yapısal sistem ———

export const BaCerceve = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 32, y: 80, acikliklar: [28, 28], katlar: [20, 20, 20], tarama: t })}
        <Zemin x1={14} x2={106} y={80} />
      </>
    )}
  </Svg>
)

export const BaCercevePerde = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({
          x: 24,
          y: 80,
          acikliklar: [26, 10, 26],
          katlar: [20, 20, 20],
          tarama: t,
          perde: (_, j) => j === 1,
        })}
        <Zemin x1={10} x2={110} y={80} />
      </>
    )}
  </Svg>
)

// ——— Yumuşak / zayıf kat ———

export const YumusakKatYok = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 32, y: 80, acikliklar: [28, 28], katlar: [20, 20, 20], tarama: t, dolgu: hep })}
        <Zemin x1={14} x2={106} y={80} />
      </>
    )}
  </Svg>
)

export const YumusakKatVar = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({
          x: 32,
          y: 84,
          acikliklar: [28, 28],
          katlar: [28, 17, 17],
          tarama: t,
          dolgu: (k) => k > 0,
        })}
        <Zemin x1={14} x2={106} y={84} />
      </>
    )}
  </Svg>
)

// ——— Düşeyde düzensizlik ———

export const DuseydeDuzenli = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 27, y: 82, acikliklar: [22, 22, 22], katlar: [16, 16, 16, 16], tarama: t })}
        <Zemin x1={12} x2={108} y={82} />
      </>
    )}
  </Svg>
)

/** Şekil A.1'deki dört düzensizlik: konsola oturan kolon, devam etmeyen kolon, kolona oturan perde, kesintili perde. */
export const DuseydeDuzensiz = () => {
  const ortak = { y: 80, acikliklar: [20, 20], katlar: [16, 16, 16, 16] }
  return (
    <Svg viewBox="0 0 240 90">
      {(t) => (
        <>
          {/* Konsol ucuna oturan kolon: zemin katta sağ kolon yok, üst katlar konsolun ucunda. */}
          {cerceve({ ...ortak, x: 10, tarama: t, kolonYok: (k, c) => k === 0 && c === 2 })}
          {/* Alt katta devam etmeyen kolon. */}
          {cerceve({ ...ortak, x: 68, tarama: t, kolonYok: (k, c) => k === 0 && c === 1 })}
          {/* Kolon üzerine oturan perde: perde zemin katta kesiliyor. */}
          {cerceve({ ...ortak, x: 126, tarama: t, perde: (k, j) => k > 0 && j === 0 })}
          {/* Düşeyde süreksiz perde: perde katlar arasında yer değiştiriyor. */}
          {cerceve({ ...ortak, x: 184, tarama: t, perde: (k, j) => (k < 2 ? j === 0 : j === 1) })}
          <Zemin x1={2} x2={238} y={80} />
        </>
      )}
    </Svg>
  )
}

// ——— Ağır çıkma ———

function Cikma({ agir }: { agir: boolean }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {cerceve({
            x: 30,
            y: 82,
            acikliklar: [24, 24],
            katlar: [18, 18, 18, 18],
            tarama: t,
            dolgu: (k) => k > 0,
          })}
          {agir
            ? // Üst katlar zemin katın dışına taşıyor, taşan kısım duvarla kapalı.
              [1, 2, 3].map((k) => (
                <g key={k}>
                  <rect x={78} y={82 - (k + 1) * 18} width={18} height={18} fill={t} stroke="none" />
                  <path d={`M78 ${82 - k * 18} H96 V${82 - (k + 1) * 18} H78`} {...cizgi(KALIN)} />
                </g>
              ))
            : // Hafif balkon: yalnız döşeme ve korkuluk.
              [1, 2, 3].map((k) => (
                <path key={k} d={`M78 ${82 - k * 18} H88 V${82 - k * 18 - 7}`} {...cizgi()} />
              ))}
          <Zemin x1={12} x2={108} y={82} />
        </>
      )}
    </Svg>
  )
}
export const CikmaYok = () => <Cikma agir={false} />
export const CikmaVar = () => <Cikma agir />

// ——— Planda düzensizlik (kuşbakışı) ———

export const PlanDuzenli = () => (
  <Svg viewBox="0 0 120 70">
    {() => (
      <>
        <rect x={10} y={16} width={42} height={38} {...cizgi(KALIN)} />
        <path d="M68 16 H96 V26 H110 V54 H78 V44 H68 Z" {...cizgi(KALIN)} />
      </>
    )}
  </Svg>
)

export const PlanDuzensiz = () => (
  <Svg viewBox="0 0 180 70">
    {() => (
      <>
        <path d="M8 56 L20 14 H44 L54 56 Z" {...cizgi(KALIN)} />
        <path d="M66 14 H84 V38 H108 V56 H66 Z" {...cizgi(KALIN)} />
        <path d="M118 56 V42 H132 V30 H146 V16 H164 L174 56 Z" {...cizgi(KALIN)} />
      </>
    )}
  </Svg>
)

// ——— Kısa kolon ———

function KisaKolon({ var: varMi }: { var: boolean }) {
  const [sol, sag, ust, alt] = [30, 90, 16, 80]
  const bant = 38 // dolgu duvarın bittiği yükseklik (kısa kolonda)
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {varMi ? (
            <>
              <rect x={sol} y={bant} width={sag - sol} height={alt - bant} fill={t} stroke="none" />
              <line x1={sol} y1={bant} x2={sag} y2={bant} {...cizgi()} />
              {/* Serbest kalan kısa kolon boyu */}
              <path
                d={`M${sag + 8} ${ust} V${bant} M${sag + 5} ${ust} H${sag + 11} M${sag + 5} ${bant} H${sag + 11}`}
                {...cizgi()}
              />
            </>
          ) : (
            <>
              <path
                d={delikliDuvar(sol, ust, sag - sol, alt - ust, [[50, 34, 20, 20]])}
                fill={t}
                fillRule="evenodd"
                stroke="none"
              />
              <rect x={50} y={34} width={20} height={20} {...cizgi()} />
            </>
          )}
          <path d={`M${sol} ${alt + 4} V${ust - 6} M${sag} ${alt + 4} V${ust - 6}`} {...cizgi(KALIN)} />
          <path d={`M${sol - 12} ${ust} H${sag + 12}`} {...cizgi(KALIN)} />
          <Zemin x1={12} x2={108} y={alt} />
        </>
      )}
    </Svg>
  )
}
export const KisaKolonYok = () => <KisaKolon var={false} />
export const KisaKolonVar = () => <KisaKolon var />

// ——— Yapı nizamı (kuşbakışı; bizim bina çarpı işaretli, komşular taralı) ———

function Nizam({ sol, sag }: { sol: boolean; sag: boolean }) {
  return (
    <Svg viewBox="0 0 120 50">
      {(t) => (
        <>
          {sol && <rect x={15} y={10} width={30} height={30} fill={t} {...cizgi()} />}
          {sag && <rect x={75} y={10} width={30} height={30} fill={t} {...cizgi()} />}
          <rect x={45} y={10} width={30} height={30} {...cizgi(KALIN)} />
          <path d="M45 10 L75 40 M75 10 L45 40" {...cizgi()} />
        </>
      )}
    </Svg>
  )
}
export const NizamAyrik = () => <Nizam sol={false} sag={false} />
export const NizamBitisik = () => <Nizam sol sag />
export const NizamKosede = () => <Nizam sol sag={false} />

/** Bitişik iki binanın döşemeleri: aynı hizada ya da kaçık (komşunun döşemesi kolona vuruyor). */
function DosemeSeviyesi({ farkli }: { farkli: boolean }) {
  const komsu = farkli ? [74, 50, 26] : [66, 42, 18]
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {cerceve({ x: 16, y: 84, acikliklar: [42], katlar: [18, 24, 24], tarama: t })}
          <rect x={62} y={10} width={42} height={74} fill={t} stroke="none" />
          {komsu.map((y) => (
            <rect key={y} x={62} y={y - 3} width={42} height={6} fill="currentColor" />
          ))}
          <line x1={62} y1={10} x2={62} y2={84} {...cizgi()} />
          <Zemin x1={6} x2={114} y={84} />
        </>
      )}
    </Svg>
  )
}
export const DosemeAyni = () => <DosemeSeviyesi farkli={false} />
export const DosemeFarkli = () => <DosemeSeviyesi farkli />

// ——— Tabii zemin eğimi ———

function Egim({ dik }: { dik: boolean }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) =>
        dik ? (
          <>
            {cerceve({ x: 44, y: 54, acikliklar: [16, 16], katlar: [14, 14, 14], tarama: t, dolgu: hep })}
            {/* ~35° yamaç; bina yüksek tarafta, alçak taraftaki kolon uzuyor. */}
            <line x1={10} y1={30} x2={110} y2={100} {...cizgi()} opacity={0.7} />
            <path d="M60 54 V65 M76 54 V76" {...cizgi(KALIN)} />
          </>
        ) : (
          <>
            {cerceve({ x: 44, y: 76, acikliklar: [16, 16], katlar: [14, 14, 14], tarama: t, dolgu: hep })}
            <Zemin x1={8} x2={112} y={76} />
          </>
        )
      }
    </Svg>
  )
}
export const EgimYok = () => <Egim dik={false} />
export const EgimVar = () => <Egim dik />

// ——— Yığma binalar: RYTEİE 2019 Şekil A.2'den (ek s. 38) yeniden çizildi. Taralı = yığma duvar, dolu = betonarme. ———

/** Dikdörtgen boşluk: sol x, genişlik, yükseklik ve bulunduğu katın döşemesinden yüksekliği. */
type Bosluk = [x: number, genislik: number, yukseklik: number, alt: number]

interface Cephe {
  x: number
  /** Zemin çizgisi. */
  y: number
  w: number
  katH: number
  /** Her kattaki boşluklar, alttan yukarı. */
  katlar: Bosluk[][]
  tarama: string
}

/** Yığma cephe: taralı duvar, boşluklar arkaplanı gösterir, kat çizgileri ince. */
function cephe({ x, y, w, katH, katlar, tarama }: Cephe) {
  const ust = y - katlar.length * katH
  const delikler = katlar.flatMap((k, i) =>
    k.map(([bx, bw, bh, alt]) => [bx, y - i * katH - alt - bh, bw, bh] as [number, number, number, number]),
  )
  return (
    <>
      <path
        d={delikliDuvar(x, ust, w, katlar.length * katH, delikler)}
        fill={tarama}
        fillRule="evenodd"
        stroke="none"
      />
      {delikler.map(([a, b, c, d]) => (
        <rect key={`${a}-${b}`} x={a} y={b} width={c} height={d} {...cizgi()} />
      ))}
      {katlar.slice(1).map((_, i) => (
        <line key={i} x1={x} y1={y - (i + 1) * katH} x2={x + w} y2={y - (i + 1) * katH} {...cizgi()} />
      ))}
      <rect x={x} y={ust} width={w} height={katlar.length * katH} {...cizgi(KALIN)} />
    </>
  )
}

/** Şekil A.2 "Yığma bina türü": tek katlı duvar, bir kapı ve bir pencere. */
const KAPI_PENCERE: Bosluk[] = [
  [36, 12, 26, 0],
  [66, 16, 12, 14],
]

export const YigmaDonatisiz = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cephe({ x: 24, y: 80, w: 72, katH: 40, katlar: [KAPI_PENCERE], tarama: t })}
        <Zemin x1={12} x2={108} y={80} />
      </>
    )}
  </Svg>
)

export const YigmaDonatili = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cephe({ x: 24, y: 80, w: 72, katH: 40, katlar: [KAPI_PENCERE], tarama: t })}
        {/* Duvar içindeki düşey ve yatay donatı */}
        {[29, 54, 61, 90].map((x) => (
          <line key={x} x1={x} y1={42} x2={x} y2={78} {...cizgi()} />
        ))}
        <line x1={26} y1={48} x2={94} y2={48} {...cizgi()} />
        <Zemin x1={12} x2={108} y={80} />
      </>
    )}
  </Svg>
)

export const YigmaKusatilmis = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cephe({ x: 24, y: 80, w: 72, katH: 40, katlar: [KAPI_PENCERE], tarama: t })}
        {/* Betonarme kuşatma: köşe ve ara kolonları, üst hatıl */}
        {[24, 56, 92].map((x) => (
          <rect key={x} x={x} y={40} width={4} height={40} fill="currentColor" />
        ))}
        <rect x={24} y={40} width={72} height={4} fill="currentColor" />
        <Zemin x1={12} x2={108} y={80} />
      </>
    )}
  </Svg>
)

export const YigmaKarma = () => (
  <Svg viewBox="0 0 120 90">
    {(t) => (
      <>
        {cerceve({ x: 20, y: 80, acikliklar: [20, 20], katlar: [20, 20], tarama: t, dolgu: hep })}
        {cephe({ x: 60, y: 80, w: 40, katH: 20, katlar: [[[70, 12, 9, 6]], [[70, 12, 9, 6]]], tarama: t })}
        <Zemin x1={8} x2={112} y={80} />
      </>
    )}
  </Svg>
)

// Planda düzensizlik: yığmada üç düzey (Şekil A.2), düzenli çizim betonarmeyle ortak.
export const PlanYamukL = () => (
  <Svg viewBox="0 0 120 70">
    {() => (
      <>
        <path d="M8 56 L20 14 H44 L54 56 Z" {...cizgi(KALIN)} />
        <path d="M66 14 H84 V38 H108 V56 H66 Z" {...cizgi(KALIN)} />
      </>
    )}
  </Svg>
)

export const PlanCokGirintili = () => (
  <Svg viewBox="0 0 120 70">
    {() => (
      <path d="M10 56 V42 H24 V30 H38 V16 H56 V28 H70 V20 H86 V36 H100 V44 H110 V56 Z" {...cizgi(KALIN)} />
    )}
  </Svg>
)

// Duvar miktarı: zemin kat cephesi; boşluk uzunluğu / cephe uzunluğu (BO) çizimde de bu oranda.
function DuvarMiktari({ bosluklar }: { bosluklar: Bosluk[] }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {cephe({ x: 20, y: 80, w: 80, katH: 36, katlar: [bosluklar], tarama: t })}
          <Zemin x1={8} x2={112} y={80} />
        </>
      )}
    </Svg>
  )
}
/** BO = 22 / 80 ≈ 0,28 */
export const DuvarCok = () => (
  <DuvarMiktari
    bosluklar={[
      [32, 10, 24, 0],
      [66, 12, 12, 12],
    ]}
  />
)
/** BO = 40 / 80 = 0,5 */
export const DuvarOrta = () => (
  <DuvarMiktari
    bosluklar={[
      [26, 14, 12, 12],
      [53, 12, 24, 0],
      [80, 14, 12, 12],
    ]}
  />
)
/** BO = 58 / 80 ≈ 0,73 */
export const DuvarAz = () => (
  <DuvarMiktari
    bosluklar={[
      [24, 28, 26, 0],
      [62, 30, 26, 0],
    ]}
  />
)

// Düşey boşluk düzeni: iki katlı cephe, pencerelerin alt alta gelişi.
function Bosluklar({ alt, ust }: { alt: Bosluk[]; ust: Bosluk[] }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {cephe({ x: 22, y: 82, w: 76, katH: 28, katlar: [alt, ust], tarama: t })}
          <Zemin x1={10} x2={110} y={82} />
        </>
      )}
    </Svg>
  )
}
const pencere = (x: number): Bosluk => [x, 12, 12, 9]
export const BoslukDuzenli = () => (
  <Bosluklar
    alt={[pencere(30), [54, 12, 20, 0], pencere(78)]}
    ust={[pencere(30), pencere(54), pencere(78)]}
  />
)
export const BoslukAzDuzenli = () => (
  <Bosluklar
    alt={[pencere(30), [54, 12, 20, 0], pencere(78)]}
    ust={[pencere(30), pencere(62), pencere(78)]}
  />
)
export const BoslukDuzensiz = () => (
  <Bosluklar
    alt={[pencere(28), [48, 12, 20, 0], pencere(80)]}
    ust={[pencere(38), pencere(66), [84, 8, 16, 7]]}
  />
)

// Yatay hatıl: duvarı saran betonarme kuşak (dolu bant).
function Hatil({ konum }: { konum: 'pencere' | 'duvar' | null }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) => (
        <>
          {cephe({ x: 24, y: 80, w: 72, katH: 40, katlar: [KAPI_PENCERE], tarama: t })}
          {konum === 'pencere' && <rect x={24} y={51} width={72} height={4} fill="currentColor" />}
          {konum === 'duvar' && <rect x={24} y={40} width={72} height={4} fill="currentColor" />}
          <Zemin x1={12} x2={108} y={80} />
        </>
      )}
    </Svg>
  )
}
export const HatilPencereUstu = () => <Hatil konum="pencere" />
export const HatilDuvarUstu = () => <Hatil konum="duvar" />
export const HatilYok = () => <Hatil konum={null} />

// Cepheye göre kat farklılığı: yan görünüş; sol yanı toprağa gömülü bina solda 1, sağda 2 kat gösterir.
function CepheKatFarki({ var: varMi }: { var: boolean }) {
  return (
    <Svg viewBox="0 0 120 90">
      {(t) =>
        varMi ? (
          <>
            {cephe({
              x: 40,
              y: 80,
              w: 44,
              katH: 24,
              katlar: [[[56, 12, 10, 8]], [[56, 12, 10, 8]]],
              tarama: t,
            })}
            <path d="M8 56 H40 V80" {...cizgi()} opacity={0.7} />
            <path d="M84 80 H112" {...cizgi()} opacity={0.7} />
            <Yazi x={24} y={50}>
              1 kat
            </Yazi>
            <Yazi x={98} y={50}>
              2 kat
            </Yazi>
          </>
        ) : (
          <>
            {cephe({
              x: 40,
              y: 80,
              w: 44,
              katH: 24,
              katlar: [[[56, 12, 10, 8]], [[56, 12, 10, 8]]],
              tarama: t,
            })}
            <Zemin x1={8} x2={112} y={80} />
          </>
        )
      }
    </Svg>
  )
}
export const CepheKatFarkiYok = () => <CepheKatFarki var={false} />
export const CepheKatFarkiVar = () => <CepheKatFarki var />

// Yumuşak kat (yığma): zemin katta duvarın yerini geniş boşluk almış.
export const YigmaYumusakYok = () => (
  <Bosluklar
    alt={[pencere(30), [54, 12, 20, 0], pencere(78)]}
    ust={[pencere(30), pencere(54), pencere(78)]}
  />
)
export const YigmaYumusakVar = () => (
  <Bosluklar alt={[[28, 64, 22, 0]]} ust={[pencere(30), pencere(54), pencere(78)]} />
)
