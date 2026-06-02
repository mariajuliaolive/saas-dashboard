"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export function MainLayout({
  children,
  breadcrumbs = [{ label: "Visão Geral" }],
}: MainLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  // Mobile sidebar overlay state
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — always visible on desktop, overlay on mobile */}
      <div
        className={cn(
          "md:relative md:flex md:shrink-0",
          // On mobile: fixed overlay
          "fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main
          id="main-content"
          className="flex-1 overflow-auto"
          // Landmark for skip-to-content links
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
