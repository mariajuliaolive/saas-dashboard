import { MainLayout } from "@/components/layout/main-layout"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { ClientsTable } from "@/components/dashboard/clients-table"
import { MOCK_METRICS } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Início" }, { label: "Visão Geral" }]}>
      <div className="flex flex-col gap-5 p-5">
        {/* Skip-to-content target: accessible keyboard shortcut target */}
        <h1 className="sr-only">Visão Geral — Painel Operacional</h1>

        {/* KPI metric cards */}
        <MetricCards metrics={MOCK_METRICS} />

        {/* Clients section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Clientes</h2>
              <p className="text-xs text-muted-foreground">
                Gerencie e acompanhe todos os clientes ativos
              </p>
            </div>
          </div>
          <ClientsTable />
        </section>
      </div>
    </MainLayout>
  )
}
