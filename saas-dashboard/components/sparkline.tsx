"use client"

// Pure SVG sparkline — no chart library needed.
// Normalizes the data array to fit within the SVG viewport.
interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  positive?: boolean // drives stroke color (green vs red)
}

export function Sparkline({
  data,
  width = 64,
  height = 24,
  positive = true,
}: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    // Invert Y: SVG origin is top-left, so we flip
    const y = height - ((v - min) / range) * height
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const polyline = points.join(" ")

  // Subtle area fill under the line
  const first = points[0]
  const last = points[points.length - 1]
  const area = `${first} ${polyline} ${last.split(",")[0]},${height} 0,${height}`

  const stroke = positive ? "#34d399" : "#f87171" // emerald-400 / red-400
  const fill = positive ? "#34d39920" : "#f8717120"

  return (
    // aria-hidden because sparklines are decorative; the numeric value and change
    // percentage already convey the information to screen readers.
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      <polygon points={area} fill={fill} />
      <polyline
        points={polyline}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
