"use client"

import * as React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MOCK_CLIENTS } from "@/lib/mock-data"
import { cn, formatMRR, PLAN_LABELS, STATUS_LABELS } from "@/lib/utils"
import type { ClientPlan, ClientStatus } from "@/lib/types"

// ─── Chart primitives ──────────────────────────────────────────────────────

function HBar({
  label,
  value,
  maxValue,
  colorClass,
  formatted,
}: {
  label: string
  value: number
  maxValue: number
  colorClass: string
  formatted: string
}) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">{label}</span>
      <div
        className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${formatted}`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-24 shrink-0 text-xs tabular-nums">{formatted}</span>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-md border border-border bg-card p-4 flex flex-col gap-4">
      <h3 className="text-xs font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function StatCard({
  label,
  value,
  sub,
  colorClass = "text-foreground",
}: {
  label: string
  value: string
  sub?: string
  colorClass?: string
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-2xl font-bold tabular-nums leading-none", colorClass)}>
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function RelatoriosPage() {
  const clients = MOCK_CLIENTS

  // MRR by plan
  const mrrByPlan = React.useMemo(() => {
    const plans: ClientPlan[] = ["enterprise", "growth", "starter"]
    return plans.map((plan) => ({
      plan,
      label: PLAN_LABELS[plan],
      mrr: clients
        .filter((c) => c.plan === plan)
        .reduce((sum, c) => sum + c.mrr, 0),
    }))
  }, [clients])

  const totalMrr = mrrByPlan.reduce((s, p) => s + p.mrr, 0)
  const maxPlanMrr = Math.max(...mrrByPlan.map((p) => p.mrr))

  const PLAN_COLORS: Record<ClientPlan, string> = {
    enterprise: "bg-indigo-500",
    growth: "bg-violet-500",
    starter: "bg-sky-500",
  }

  // Clients by status
  const statusGroups = React.useMemo(() => {
    const statuses: ClientStatus[] = ["active", "at-risk", "trial", "churned"]
    return statuses.map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: clients.filter((c) => c.status === status).length,
    }))
  }, [clients])

  const maxStatusCount = Math.max(...statusGroups.map((s) => s.count))

  const STATUS_COLORS: Record<ClientStatus, string> = {
    active: "bg-emerald-500",
    "at-risk": "bg-amber-500",
    trial: "bg-indigo-500",
    churned: "bg-red-500",
  }

  // SLA health
  const slaZones = React.useMemo(() => {
    const green = clients.filter((c) => c.slaConsumed < 60).length
    const amber = clients.filter((c) => c.slaConsumed >= 60 && c.slaConsumed < 80).length
    const red = clients.filter((c) => c.slaConsumed >= 80).length
    return { green, amber, red, total: clients.length }
  }, [clients])

  // NPS breakdown
  const nps = React.useMemo(() => {
    const withNps = clients.filter((c) => c.nps !== null)
    const promoters = withNps.filter((c) => c.nps! >= 9).length
    const passives = withNps.filter((c) => c.nps! >= 7 && c.nps! < 9).length
    const detractors = withNps.filter((c) => c.nps! < 7).length
    const avg =
      withNps.length > 0
        ? withNps.reduce((s, c) => s + c.nps!, 0) / withNps.length
        : 0
    return { promoters, passives, detractors, total: withNps.length, avg }
  }, [clients])

  const npsTotal = nps.promoters + nps.passives + nps.detractors
  const promoterPct = npsTotal > 0 ? (nps.promoters / npsTotal) * 100 : 0
  const passivePct = npsTotal > 0 ? (nps.passives / npsTotal) * 100 : 0
  const detractorPct = npsTotal > 0 ? (nps.detractors / npsTotal) * 100 : 0

  // MRR by plan donut-style percentages
  const mrrPlanPcts = mrrByPlan.map((p) => ({
    ...p,
    pct: totalMrr > 0 ? Math.round((p.mrr / totalMrr) * 100) : 0,
  }))

  return (
    <MainLayout breadcrumbs={[{ label: "Início" }, { label: "Relatórios" }]}>
      <div className="flex flex-col gap-5 p-3 sm:p-5">
        <h1 className="sr-only">Relatórios e Análises</h1>

        <div>
          <h2 className="text-sm font-semibold">Relatórios</h2>
          <p className="text-xs text-muted-foreground">
            Visão analítica de receita, saúde e satisfação dos clientes
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="MRR Total"
            value={formatMRR(totalMrr)}
            sub="receita mensal recorrente"
          />
          <StatCard
            label="Clientes ativos"
            value={String(statusGroups.find((s) => s.status === "active")?.count ?? 0)}
            sub={`de ${clients.length} no total`}
            colorClass="text-emerald-400"
          />
          <StatCard
            label="SLA em risco"
            value={String(slaZones.red)}
            sub="consumo ≥ 80%"
            colorClass={slaZones.red > 3 ? "text-red-400" : "text-amber-400"}
          />
          <StatCard
            label="NPS médio"
            value={nps.avg.toFixed(1)}
            sub={`${nps.total} clientes avaliados`}
            colorClass={nps.avg >= 8 ? "text-emerald-400" : nps.avg >= 6 ? "text-amber-400" : "text-red-400"}
          />
        </div>

        {/* Charts grid — 1 col mobile, 2 cols desktop */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* MRR por plano */}
          <SectionCard title="MRR por plano">
            <div className="flex flex-col gap-3">
              {mrrByPlan.map((p) => (
                <HBar
                  key={p.plan}
                  label={p.label}
                  value={p.mrr}
                  maxValue={maxPlanMrr}
                  colorClass={PLAN_COLORS[p.plan]}
                  formatted={formatMRR(p.mrr)}
                />
              ))}
            </div>
            <div className="flex gap-4 text-[11px] text-muted-foreground border-t border-border pt-3">
              {mrrPlanPcts.map((p) => (
                <div key={p.plan} className="flex items-center gap-1">
                  <span className={cn("h-2 w-2 rounded-full", PLAN_COLORS[p.plan])} />
                  {p.label}: {p.pct}%
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Clientes por status */}
          <SectionCard title="Clientes por status">
            <div className="flex flex-col gap-3">
              {statusGroups.map((s) => (
                <HBar
                  key={s.status}
                  label={s.label}
                  value={s.count}
                  maxValue={maxStatusCount}
                  colorClass={STATUS_COLORS[s.status]}
                  formatted={`${s.count} cliente${s.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          </SectionCard>

          {/* Saúde do SLA */}
          <SectionCard title="Saúde do SLA">
            <div className="flex flex-col gap-3">
              {[
                { label: "Saudável (<60%)", count: slaZones.green, colorClass: "bg-emerald-500" },
                { label: "Atenção (60–80%)", count: slaZones.amber, colorClass: "bg-amber-500" },
                { label: "Crítico (≥80%)", count: slaZones.red, colorClass: "bg-red-500" },
              ].map((z) => (
                <HBar
                  key={z.label}
                  label={z.label}
                  value={z.count}
                  maxValue={slaZones.total}
                  colorClass={z.colorClass}
                  formatted={`${z.count} cliente${z.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>

            {/* Stacked bar visual */}
            <div className="flex h-3 overflow-hidden rounded-full" aria-hidden="true">
              <div className="bg-emerald-500 transition-all" style={{ width: `${(slaZones.green / slaZones.total) * 100}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${(slaZones.amber / slaZones.total) * 100}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${(slaZones.red / slaZones.total) * 100}%` }} />
            </div>
          </SectionCard>

          {/* NPS */}
          <SectionCard title="NPS — Net Promoter Score">
            <div className="flex items-end gap-4">
              <div>
                <p className={cn(
                  "text-4xl font-bold tabular-nums leading-none",
                  nps.avg >= 8 ? "text-emerald-400" : nps.avg >= 6 ? "text-amber-400" : "text-red-400"
                )}>
                  {nps.avg.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Média de {nps.total} clientes
                </p>
              </div>
              <div className="flex flex-col gap-1.5 text-xs ml-auto">
                {[
                  { label: "Promotores (9–10)", count: nps.promoters, color: "text-emerald-400", dot: "bg-emerald-500" },
                  { label: "Passivos (7–8)", count: nps.passives, color: "text-amber-400", dot: "bg-amber-500" },
                  { label: "Detratores (0–6)", count: nps.detractors, color: "text-red-400", dot: "bg-red-500" },
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", g.dot)} />
                    <span className="text-muted-foreground">{g.label}</span>
                    <span className={cn("ml-auto font-semibold tabular-nums", g.color)}>{g.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segmented NPS bar */}
            <div
              className="flex h-3 overflow-hidden rounded-full"
              role="img"
              aria-label={`NPS: ${nps.promoters} promotores, ${nps.passives} passivos, ${nps.detractors} detratores`}
            >
              <div className="bg-emerald-500 transition-all" style={{ width: `${promoterPct}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${passivePct}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${detractorPct}%` }} />
            </div>

            <p className="text-[11px] text-muted-foreground">
              {Math.round(promoterPct)}% promotores · {Math.round(passivePct)}% passivos · {Math.round(detractorPct)}% detratores
            </p>
          </SectionCard>
        </div>
      </div>
    </MainLayout>
  )
}
