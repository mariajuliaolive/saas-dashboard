import { MainLayout } from "@/components/layout/main-layout"
import { TaskList } from "@/components/dashboard/task-list"

export default function TarefasPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Início" }, { label: "Tarefas" }]}>
      <div className="flex flex-col gap-5 p-3 sm:p-5">
        <h1 className="sr-only">Gerenciamento de Tarefas</h1>

        <div>
          <h2 className="text-sm font-semibold">Tarefas</h2>
          <p className="text-xs text-muted-foreground">
            Acompanhe e gerencie todas as tarefas de relacionamento com clientes
          </p>
        </div>

        <TaskList />
      </div>
    </MainLayout>
  )
}
