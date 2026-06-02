"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { href: "/relatorios", label: "Relatórios", icon: BarChart2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        // role="navigation" is implicit on <nav>; using aria-label to distinguish
        // this sidebar from any secondary navigation regions on the page.
        aria-label="Navegação principal"
        className={cn(
          "flex h-screen flex-col border-r border-border bg-background transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo area */}
        <div
          className={cn(
            "flex h-12 items-center border-b border-border px-3",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-400" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-tight">OpsDash</span>
            </div>
          )}
          {collapsed && (
            <Zap className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          )}
          {/* Toggle button — visible only on desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            // Label changes based on state so screen readers announce intent
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className={cn(
              "h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground",
              collapsed && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-0.5 p-2 pt-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            const item = (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </Link>
            )

            // Wrap collapsed items in a tooltip so the label remains accessible
            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{item}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              )
            }
            return item
          })}
        </nav>

        {/* Collapse toggle — bottom, only when expanded */}
        {collapsed && (
          <div className="flex justify-center border-t border-border p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              aria-label="Expandir menu lateral"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
