export type ClientStatus = "active" | "at-risk" | "churned" | "trial"
export type ClientPlan = "starter" | "growth" | "enterprise"

export interface Client {
  id: string
  name: string
  company: string
  plan: ClientPlan
  status: ClientStatus
  owner: string
  lastContact: string // ISO date string
  slaConsumed: number // 0–100, higher = more at risk
  mrr: number
  nps: number | null
  tasks: number
}

export interface MetricData {
  label: string
  value: string
  change: number // percentage change vs last period
  trend: number[] // 7-point sparkline
  icon: string // lucide icon name
  unit?: string
}

export type SortField = keyof Client
export type SortDir = "asc" | "desc"

export interface TableState {
  search: string
  status: ClientStatus | "all"
  plan: ClientPlan | "all"
  dateFrom: Date | undefined
  dateTo: Date | undefined
  page: number
  pageSize: number
  sortField: SortField
  sortDir: SortDir
  selected: Set<string>
}

export type TaskPriority = "high" | "medium" | "low"
export type TaskStatus = "pending" | "in-progress" | "done" | "overdue"

export interface Task {
  id: string
  title: string
  clientId: string
  clientName: string
  company: string
  priority: TaskPriority
  status: TaskStatus
  assignee: string
  dueDate: string // ISO date
  createdAt: string // ISO date
}
