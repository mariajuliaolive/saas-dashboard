"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserPlus,
  MessageSquare,
  ExternalLink,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { TableFilters } from "./table-filters"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  cn,
  slaColor,
  formatDate,
  formatMRR,
  daysSince,
  STATUS_LABELS,
  STATUS_COLORS,
  PLAN_LABELS,
} from "@/lib/utils"
import { MOCK_CLIENTS } from "@/lib/mock-data"
import type { Client, ClientStatus, ClientPlan, SortField, SortDir } from "@/lib/types"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function SlaBar({ consumed }: { consumed: number }) {
  // Color transitions: green (safe) → amber (warning) → red (critical)
  const color = slaColor(consumed)
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"
        // Convey progress semantics to assistive tech
        role="progressbar"
        aria-valuenow={consumed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`SLA: ${consumed}% consumido`}
      >
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${consumed}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
        {consumed}%
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const { bg, text, dot } = STATUS_COLORS[status]
  return (
    <Badge
      // Using custom styling; shadcn Badge variant="outline" as the base
      className={cn(
        "gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium border-transparent",
        bg,
        text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </Badge>
  )
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
}) {
  if (sortField !== field)
    return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
  if (sortDir === "asc")
    return <ArrowUp className="ml-1 h-3 w-3 text-foreground" aria-hidden="true" />
  return <ArrowDown className="ml-1 h-3 w-3 text-foreground" aria-hidden="true" />
}

// Sortable column header button
function SortableHead({
  children,
  field,
  sortField,
  sortDir,
  onSort,
  className,
}: {
  children: React.ReactNode
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (f: SortField) => void
  className?: string
}) {
  const isActive = sortField === field
  return (
    <TableHead className={cn("py-2", className)}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center text-xs font-medium outline-none",
          "focus-visible:underline focus-visible:underline-offset-2",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        // Announce sort direction to screen readers
        aria-sort={
          isActive ? (sortDir === "asc" ? "ascending" : "descending") : "none"
        }
      >
        {children}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </button>
    </TableHead>
  )
}

export function ClientsTable() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<ClientStatus | "all">("all")
  const [plan, setPlan] = React.useState<ClientPlan | "all">("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [sortField, setSortField] = React.useState<SortField>("company")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  // Reset to page 1 whenever filters change
  React.useEffect(() => setPage(1), [search, status, plan, dateRange])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  // --- Filtering ---
  const filtered = React.useMemo(() => {
    return MOCK_CLIENTS.filter((c) => {
      if (
        search &&
        !c.company.toLowerCase().includes(search.toLowerCase()) &&
        !c.owner.toLowerCase().includes(search.toLowerCase()) &&
        !c.name.toLowerCase().includes(search.toLowerCase())
      )
        return false
      if (status !== "all" && c.status !== status) return false
      if (plan !== "all" && c.plan !== plan) return false
      if (dateRange?.from) {
        const last = new Date(c.lastContact + "T00:00:00")
        if (last < dateRange.from) return false
        if (dateRange.to && last > dateRange.to) return false
      }
      return true
    })
  }, [search, status, plan, dateRange])

  // --- Sorting ---
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField]
      const bv = b[sortField]
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""), "pt-BR")
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize)

  // Bulk selection helpers
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))
  const somePageSelected = pageRows.some((r) => selected.has(r.id))

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageRows.forEach((r) => next.delete(r.id))
      } else {
        pageRows.forEach((r) => next.add(r.id))
      }
      return next
    })
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function quickAction(action: string, client: Client) {
    // Dismiss any existing toast before showing the new one (avoids stacking)
    toast.success(`${action}: ${client.company}`, {
      description: `Ação registrada para ${client.name}`,
      duration: 3000,
    })
  }

  const sortProps = { sortField, sortDir, onSort: handleSort }

  return (
    <TooltipProvider delayDuration={0}>
      <section aria-label="Tabela de clientes" className="flex flex-col gap-3">
        {/* Filters */}
        <TableFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          plan={plan}
          onPlan={setPlan}
          dateRange={dateRange}
          onDateRange={setDateRange}
          resultCount={filtered.length}
          totalCount={MOCK_CLIENTS.length}
        />

        {/* Bulk action bar — shown only when rows are selected */}
        {selected.size > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs"
          >
            <span className="font-medium text-indigo-400">
              {selected.size} cliente{selected.size > 1 ? "s" : ""} selecionado{selected.size > 1 ? "s" : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"
              onClick={() => {
                toast.success(`Responsável atribuído a ${selected.size} cliente(s)`)
                setSelected(new Set())
              }}
            >
              Atribuir responsável
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground"
              onClick={() => setSelected(new Set())}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Table wrapper — horizontal scroll on small screens */}
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="h-9 bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-9 py-2">
                  {/* Indeterminate checkbox for select-all */}
                  <Checkbox
                    checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Selecionar todos os clientes desta página"
                    className="h-3.5 w-3.5"
                  />
                </TableHead>
                <SortableHead field="company" {...sortProps}>Empresa</SortableHead>
                <SortableHead field="plan" {...sortProps}>Plano</SortableHead>
                <SortableHead field="status" {...sortProps}>Status</SortableHead>
                <SortableHead field="owner" {...sortProps}>Responsável</SortableHead>
                <SortableHead field="lastContact" {...sortProps}>Último contato</SortableHead>
                <SortableHead field="slaConsumed" {...sortProps} className="min-w-[140px]">
                  SLA
                </SortableHead>
                <SortableHead field="mrr" {...sortProps} className="text-right">
                  MRR
                </SortableHead>
                <TableHead className="w-10 py-2" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Nenhum cliente encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((client) => (
                  <TableRow
                    key={client.id}
                    // Highlight selected rows with a subtle indigo tint
                    className={cn(
                      "h-10 cursor-default",
                      selected.has(client.id)
                        ? "bg-indigo-500/5 hover:bg-indigo-500/10"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <TableCell className="py-1.5">
                      <Checkbox
                        checked={selected.has(client.id)}
                        onCheckedChange={() => toggleRow(client.id)}
                        aria-label={`Selecionar ${client.company}`}
                        className="h-3.5 w-3.5"
                      />
                    </TableCell>

                    {/* Company + contact name */}
                    <TableCell className="py-1.5">
                      <div>
                        <p className="text-xs font-medium leading-tight">{client.company}</p>
                        <p className="text-[11px] text-muted-foreground">{client.name}</p>
                      </div>
                    </TableCell>

                    {/* Plan */}
                    <TableCell className="py-1.5">
                      <span className="text-xs text-muted-foreground">
                        {PLAN_LABELS[client.plan]}
                      </span>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell className="py-1.5">
                      <StatusBadge status={client.status} />
                    </TableCell>

                    {/* Owner */}
                    <TableCell className="py-1.5">
                      <span className="text-xs">{client.owner}</span>
                    </TableCell>

                    {/* Last contact with relative hint */}
                    <TableCell className="py-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs tabular-nums text-muted-foreground cursor-default">
                            {formatDate(client.lastContact)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {daysSince(client.lastContact)} dia{daysSince(client.lastContact) !== 1 ? "s" : ""} atrás
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    {/* SLA progress bar */}
                    <TableCell className="py-1.5">
                      <SlaBar consumed={client.slaConsumed} />
                    </TableCell>

                    {/* MRR */}
                    <TableCell className="py-1.5 text-right">
                      <span className="text-xs tabular-nums">
                        {client.mrr > 0 ? formatMRR(client.mrr) : "—"}
                      </span>
                    </TableCell>

                    {/* Quick actions dropdown */}
                    <TableCell className="py-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            aria-label={`Ações para ${client.company}`}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="gap-2 text-xs"
                            onSelect={() => quickAction("Tarefa atribuída", client)}
                          >
                            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                            Atribuir tarefa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-xs"
                            onSelect={() => quickAction("Contato registrado", client)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                            Registrar contato
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-xs text-red-400 focus:text-red-400"
                            onSelect={() => quickAction("Cliente removido", client)}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <label htmlFor="page-size-select" className="sr-only">
              Linhas por página
            </label>
            <span>Linhas:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger
                id="page-size-select"
                className="h-7 w-16 text-xs"
                aria-label="Selecionar número de linhas por página"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page navigation */}
          <div
            className="flex items-center gap-1"
            role="navigation"
            aria-label="Paginação da tabela"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
              className="h-7 w-7 p-0 text-xs"
            >
              ‹
            </Button>

            {/* Render up to 5 page buttons with ellipsis */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true
                if (p === 1 || p === totalPages) return true
                if (Math.abs(p - page) <= 1) return true
                return false
              })
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                  acc.push("…")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p as number)}
                    aria-label={`Ir para página ${p}`}
                    aria-current={page === p ? "page" : undefined}
                    className={cn(
                      "h-7 w-7 p-0 text-xs",
                      page === p && "bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
                    )}
                  >
                    {p}
                  </Button>
                )
              )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Próxima página"
              className="h-7 w-7 p-0 text-xs"
            >
              ›
            </Button>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
