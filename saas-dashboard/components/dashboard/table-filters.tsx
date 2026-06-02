"use client"

import * as React from "react"
import { Search, X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { ClientStatus, ClientPlan } from "@/lib/types"

interface TableFiltersProps {
  search: string
  onSearch: (v: string) => void
  status: ClientStatus | "all"
  onStatus: (v: ClientStatus | "all") => void
  plan: ClientPlan | "all"
  onPlan: (v: ClientPlan | "all") => void
  dateRange: DateRange | undefined
  onDateRange: (v: DateRange | undefined) => void
  resultCount: number
  totalCount: number
}

export function TableFilters({
  search,
  onSearch,
  status,
  onStatus,
  plan,
  onPlan,
  dateRange,
  onDateRange,
  resultCount,
  totalCount,
}: TableFiltersProps) {
  const hasActiveFilters =
    search !== "" || status !== "all" || plan !== "all" || dateRange !== undefined

  function clearAll() {
    onSearch("")
    onStatus("all")
    onPlan("all")
    onDateRange(undefined)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="client-search"
          type="search"
          placeholder="Buscar por empresa ou responsável…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          // Accessible label via visible placeholder and id; if design removes
          // placeholder, add a <Label htmlFor="client-search"> visually hidden.
          aria-label="Buscar clientes"
          className="h-8 pl-8 text-xs"
        />
      </div>

      {/* Status filter */}
      <Select
        value={status}
        onValueChange={(v) => onStatus(v as ClientStatus | "all")}
      >
        <SelectTrigger
          className="h-8 w-[130px] text-xs"
          aria-label="Filtrar por status"
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Todos os status</SelectItem>
          <SelectItem value="active" className="text-xs">Ativo</SelectItem>
          <SelectItem value="at-risk" className="text-xs">Em risco</SelectItem>
          <SelectItem value="trial" className="text-xs">Trial</SelectItem>
          <SelectItem value="churned" className="text-xs">Churned</SelectItem>
        </SelectContent>
      </Select>

      {/* Plan filter */}
      <Select
        value={plan}
        onValueChange={(v) => onPlan(v as ClientPlan | "all")}
      >
        <SelectTrigger
          className="h-8 w-[130px] text-xs"
          aria-label="Filtrar por plano"
        >
          <SelectValue placeholder="Plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Todos os planos</SelectItem>
          <SelectItem value="starter" className="text-xs">Starter</SelectItem>
          <SelectItem value="growth" className="text-xs">Growth</SelectItem>
          <SelectItem value="enterprise" className="text-xs">Enterprise</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="Filtrar por período do último contato"
            className={cn(
              "h-8 justify-start gap-2 text-xs font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} –{" "}
                  {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yy", { locale: ptBR })
              )
            ) : (
              "Período"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      {/* Clear all + result count */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground whitespace-nowrap" aria-live="polite">
          {resultCount} de {totalCount}
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            aria-label="Limpar todos os filtros"
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
