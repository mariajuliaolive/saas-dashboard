"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Bell, Sun, Moon, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[]
  onMobileMenuToggle?: () => void
  notificationCount?: number
}

export function Header({
  breadcrumbs,
  onMobileMenuToggle,
  notificationCount = 3,
}: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch for theme-dependent rendering
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <TooltipProvider delayDuration={0}>
      <header
        className="flex h-12 items-center justify-between border-b border-border bg-background px-4"
        role="banner"
      >
        {/* Left: mobile menu + breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — only visible below md */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            aria-label="Abrir menu"
            className="h-7 w-7 text-muted-foreground md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Breadcrumb navigation */}
          <nav aria-label="Localização atual">
            <ol className="flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  {i > 0 && (
                    <li aria-hidden="true">
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </li>
                  )}
                  <li
                    className={cn(
                      i === breadcrumbs.length - 1
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                    aria-current={
                      i === breadcrumbs.length - 1 ? "page" : undefined
                    }
                  >
                    {crumb.label}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right: theme toggle + notifications + user */}
        <div className="flex items-center gap-1.5">
          {/* Dark/light toggle */}
          {mounted && (
            <div className="flex items-center gap-1.5 border-r border-border pr-3 mr-1">
              {/* Using a Switch for semantic on/off affordance */}
              <Label
                htmlFor="theme-toggle"
                className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground"
              >
                {isDark ? (
                  <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {isDark ? "Dark" : "Light"}
                </span>
              </Label>
              <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                // Explicit aria-label since visual label may be ambiguous
                aria-label="Alternar entre tema claro e escuro"
                className="h-5 w-9"
              />
            </div>
          )}

          {/* Notification bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${notificationCount} notificações pendentes`}
                className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notificationCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white"
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{notificationCount} notificações</TooltipContent>
          </Tooltip>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/avatar.png" alt="Foto de Ana Paula" />
                  {/* Fallback initials — ensure contrast with background */}
                  <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-400">
                    AP
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">
                <p className="font-semibold">Ana Paula</p>
                <p className="text-muted-foreground font-normal">
                  ana.paula@empresa.com
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">Perfil</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-red-400 focus:text-red-400">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
