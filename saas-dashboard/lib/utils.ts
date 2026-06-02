import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ClientStatus, ClientPlan, TaskPriority, TaskStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMRR(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso + "T00:00:00"))
}

export function daysSince(iso: string): number {
  const diff = Date.now() - new Date(iso + "T00:00:00").getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Returns Tailwind color classes for SLA progress bar
export function slaColor(consumed: number): string {
  if (consumed >= 80) return "bg-red-500"
  if (consumed >= 60) return "bg-amber-500"
  return "bg-emerald-500"
}

export const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Ativo",
  "at-risk": "Em risco",
  churned: "Churned",
  trial: "Trial",
}

export const STATUS_COLORS: Record<
  ClientStatus,
  { bg: string; text: string; dot: string }
> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  "at-risk": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  churned: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  trial: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
}

export const PLAN_LABELS: Record<ClientPlan, string> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
}

export const TASK_PRIORITY_COLORS: Record<
  TaskPriority,
  { bg: string; text: string; dot: string }
> = {
  high: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  "in-progress": "Em andamento",
  done: "Concluída",
  overdue: "Atrasada",
}

export const TASK_STATUS_COLORS: Record<
  TaskStatus,
  { bg: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  "in-progress": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  done: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  overdue: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate + "T23:59:59") < new Date()
}
