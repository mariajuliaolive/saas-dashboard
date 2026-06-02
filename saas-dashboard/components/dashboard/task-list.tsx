"use client"

import * as React from "react"
import { Search, X, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatDate, daysSince, TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from "@/lib/utils"
import { MOCK_TASKS } from "@/lib/mock-data"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"

const ASSIGNEES = ["Todos", "Carlos M.", "Ana P.", "Beatriz S."]

const STATUS_ICONS: Record<TaskStatus, React.ElementType> = {
  pending: Circle,
  "in-progress": Clock,
  done: CheckCircle2,
  overdue: AlertCircle,
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { bg, text, dot } = TASK_PRIORITY_COLORS[priority]
  return (
    <Badge
      className={cn(
        "gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium border-transparent",
        bg,
        text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  )
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const { bg, text, dot } = TASK_STATUS_COLORS[status]
  return (
    <Badge
      className={cn(
        "gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium border-transparent",
        bg,
        text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {TASK_STATUS_LABELS[status]}
    </Badge>
  )
}

function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: TaskStatus) => void }) {
  const StatusIcon = STATUS_ICONS[task.status]
  const isPastDue = task.status !== "done" && new Date(task.dueDate + "T23:59:59") < new Date()

  return (
    <article
      className={cn(
        "rounded-md border border-border bg-card p-3 flex flex-col gap-2.5 transition-colors",
        task.status === "done" && "opacity-60",
        task.status === "overdue" && "border-red-500/20"
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() =>
            onStatusChange(task.id, task.status === "done" ? "pending" : "done")
          }
          aria-label={task.status === "done" ? "Reabrir tarefa" : "Marcar como concluída"}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          <StatusIcon
            className={cn(
              "h-4 w-4",
              task.status === "done" && "text-emerald-400",
              task.status === "overdue" && "text-red-400",
              task.status === "in-progress" && "text-indigo-400"
            )}
            aria-hidden="true"
          />
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs font-medium leading-tight",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {task.company} · {task.clientName}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        <span className="ml-auto text-[11px] text-muted-foreground">
          {task.assignee}
        </span>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
        <span>Criada em {formatDate(task.createdAt)}</span>
        <span
          className={cn(
            "tabular-nums",
            isPastDue && task.status !== "done" && "text-red-400 font-medium"
          )}
        >
          Vence {formatDate(task.dueDate)}
          {isPastDue && task.status !== "done" && (
            <span> · {daysSince(task.dueDate)}d atrás</span>
          )}
        </span>
      </div>
    </article>
  )
}

export function TaskList() {
  const [tasks, setTasks] = React.useState<Task[]>(MOCK_TASKS)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<TaskStatus | "all">("all")
  const [priority, setPriority] = React.useState<TaskPriority | "all">("all")
  const [assignee, setAssignee] = React.useState("Todos")

  function handleStatusChange(id: string, newStatus: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
    toast.success(
      newStatus === "done" ? "Tarefa concluída!" : "Tarefa reaberta",
      { duration: 2000 }
    )
  }

  const hasFilters =
    search !== "" || status !== "all" || priority !== "all" || assignee !== "Todos"

  function clearAll() {
    setSearch("")
    setStatus("all")
    setPriority("all")
    setAssignee("Todos")
  }

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      if (
        search &&
        !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.company.toLowerCase().includes(search.toLowerCase()) &&
        !t.clientName.toLowerCase().includes(search.toLowerCase())
      )
        return false
      if (status !== "all" && t.status !== status) return false
      if (priority !== "all" && t.priority !== priority) return false
      if (assignee !== "Todos" && t.assignee !== assignee) return false
      return true
    })
  }, [tasks, search, status, priority, assignee])

  // Group by status for summary counts
  const counts = React.useMemo(() => ({
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks])

  return (
    <div className="flex flex-col gap-4">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { label: "Pendentes", count: counts.pending, color: "text-muted-foreground" },
          { label: "Em andamento", count: counts.inProgress, color: "text-indigo-400" },
          { label: "Atrasadas", count: counts.overdue, color: "text-red-400" },
          { label: "Concluídas", count: counts.done, color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5"
          >
            <span className={cn("text-sm font-bold tabular-nums leading-none", s.color)}>
              {s.count}
            </span>
            <span className="text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar tarefa ou cliente…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar tarefas"
            className="h-8 pl-8 text-xs"
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus | "all")}>
          <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Todos os status</SelectItem>
            <SelectItem value="pending" className="text-xs">Pendente</SelectItem>
            <SelectItem value="in-progress" className="text-xs">Em andamento</SelectItem>
            <SelectItem value="overdue" className="text-xs">Atrasada</SelectItem>
            <SelectItem value="done" className="text-xs">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority | "all")}>
          <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Filtrar por prioridade">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Todas</SelectItem>
            <SelectItem value="high" className="text-xs">Alta</SelectItem>
            <SelectItem value="medium" className="text-xs">Média</SelectItem>
            <SelectItem value="low" className="text-xs">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Filtrar por responsável">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASSIGNEES.map((a) => (
              <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {filtered.length} de {tasks.length}
          </span>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              aria-label="Limpar filtros"
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Task cards */}
      {filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-md border border-border text-sm text-muted-foreground">
          Nenhuma tarefa encontrada com os filtros aplicados.
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
