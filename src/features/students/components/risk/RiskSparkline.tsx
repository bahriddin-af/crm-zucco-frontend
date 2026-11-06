import { RISK_SCORE } from '../../constants/studentRiskConstants'
import type { StudentRiskHistoryPoint } from '../../types/studentRiskTypes'

/** SVG koordinatalar tizimi (viewBox) — kenglik CSS orqali moslashadi. */
const VIEW_WIDTH = 300
const VIEW_HEIGHT = 80
const PADDING = 4

interface RiskSparklineProps {
  points: StudentRiskHistoryPoint[]
  /** Ekran o'quvchilari uchun tavsif. */
  label: string
}

const toX = (index: number, count: number) =>
  count <= 1 ? VIEW_WIDTH / 2 : PADDING + (index * (VIEW_WIDTH - PADDING * 2)) / (count - 1)

const toY = (score: number) => VIEW_HEIGHT - PADDING - (score / RISK_SCORE.MAX) * (VIEW_HEIGHT - PADDING * 2)

/** Xavf bali o'zgarishi: o'rta va yuqori daraja chegaralari punktir chiziq bilan. Kutubxonasiz, sof SVG. */
export function RiskSparkline({ points, label }: RiskSparklineProps) {
  // Bitta nuqta bo'lsa ham chiziq ko'rinishi uchun u gorizontal kesma sifatida chiziladi.
  const series = points.length === 1 ? [points[0], points[0]] : points
  const path = series
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${toX(index, series.length)},${toY(point.score)}`)
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className="w-full h-20"
    >
      {[RISK_SCORE.MEDIUM_MIN, RISK_SCORE.HIGH_MIN].map((threshold) => (
        <line
          key={threshold}
          x1={0}
          x2={VIEW_WIDTH}
          y1={toY(threshold)}
          y2={toY(threshold)}
          className="stroke-border"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={path}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
