"use client"

import * as React from "react"
import {
  Users,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { Sparkline } from "@/components/sparkline"
import { cn } from "@/lib/utils"
import type { MetricData } from "@/lib/types"

// Map icon name strings from mock data to actual Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
}

function MetricCardSkeleton() {
  return (
    // aria-hidden so screen readers don't announce loading placeholders;
    // an aria-live region in the parent announces when data is ready.
    <div aria-hidden="true" className="flex flex-col gap-3 rounded-md border border-border bg-card p-4">
      <div className="flex justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-7 w-20 animate-pulse rounded bg-muted" />
      <div className="flex justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

interface MetricCardProps {
  data: MetricData
}

function MetricCard({ data }: MetricCardProps) {
  const Icon = ICON_MAP[data.icon] ?? TrendingUp
  const isPositive = data.change >= 0

  // For some metrics, a positive change is good; for "SLA em risco" it's bad.
  // We invert the color semantics for that metric.
  const invertColor = data.label === "SLA em risco" || data.label === "Tarefas abertas"
  const isGood = invertColor ? !isPositive : isPositive

  return (
    <article
      // Each card is an independent stat; article conveys it as self-contained.
      className="flex flex-col gap-2 rounded-md border border-border bg-card p-4 transition-colors hover:bg-card/80"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {data.label}
        </span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold tabular-nums leading-none">
            {data.value}
            {data.unit && (
              <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                {data.unit}
              </span>
            )}
          </p>
          {/* Change badge — screen readers get the full context via aria-label */}
          <p
            className={cn(
              "mt-1.5 flex items-center gap-1 text-xs font-medium",
              isGood ? "text-emerald-400" : "text-red-400"
            )}
            aria-label={`Variação de ${data.change > 0 ? "+" : ""}${data.change}% em relação ao período anterior`}
          >
            <span aria-hidden="true">
              {isPositive ? "▲" : "▼"}
            </span>
            {Math.abs(data.change)}%
            <span className="font-normal text-muted-foreground">vs. mês ant.</span>
          </p>
        </div>

        <Sparkline
          data={data.trend}
          positive={isGood}
          width={64}
          height={28}
        />
      </div>
    </article>
  )
}

interface MetricCardsProps {
  metrics: MetricData[]
}

export function MetricCards({ metrics }: MetricCardsProps) {
  // Simulate 1.5s skeleton loading on first mount
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <section aria-label="Métricas principais">
      {/* aria-live: announces to screen readers when data replaces skeletons */}
      <div
        aria-live="polite"
        aria-busy={loading}
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))
          : metrics.map((m) => <MetricCard key={m.label} data={m} />)}
      </div>
    </section>
  )
}
