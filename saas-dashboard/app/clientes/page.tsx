import { MainLayout } from "@/components/layout/main-layout"
import { ClientsTable } from "@/components/dashboard/clients-table"
import { MOCK_CLIENTS } from "@/lib/mock-data"

const stats = [
  {
    label: "Total",
    value: MOCK_CLIENTS.length,
    color: "text-foreground",
  },
  {
    label: "Ativos",
    value: MOCK_CLIENTS.filter((c) => c.status === "active").length,
    color: "text-emerald-400",
  },
  {
    label: "Em risco",
    value: MOCK_CLIENTS.filter((c) => c.status === "at-risk").length,
    color: "text-amber-400",
  },
  {
    label: "Trial",
    value: MOCK_CLIENTS.filter((c) => c.status === "trial").length,
    color: "text-indigo-400",
  },
  {
    label: "Churned",
    value: MOCK_CLIENTS.filter((c) => c.status === "churned").length,
    color: "text-red-400",
  },
]

export default function ClientesPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Início" }, { label: "Clientes" }]}>
      <div className="flex flex-col gap-5 p-3 sm:p-5">
        <h1 className="sr-only">Gestão de Clientes</h1>

        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Clientes</h2>
            <p className="text-xs text-muted-foreground">
              Gerencie todos os clientes e acompanhe a saúde das contas
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 rounded-md border border-border bg-card px-3 py-2 text-xs">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className={`text-base font-bold tabular-nums leading-none ${s.color}`}>
                  {s.value}
                </span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ClientsTable />
      </div>
    </MainLayout>
  )
}
