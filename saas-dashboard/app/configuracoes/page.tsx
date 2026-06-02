"use client"

import * as React from "react"
import { toast } from "sonner"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─── Team mock data ─────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { name: "Ana Paula", email: "ana.paula@empresa.com", role: "Customer Success", initials: "AP", color: "bg-indigo-500/20 text-indigo-400" },
  { name: "Carlos Mendes", email: "carlos.m@empresa.com", role: "Account Manager", initials: "CM", color: "bg-violet-500/20 text-violet-400" },
  { name: "Beatriz Souza", email: "beatriz.s@empresa.com", role: "Customer Success", initials: "BS", color: "bg-emerald-500/20 text-emerald-400" },
]

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold">{title}</h3>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

// ─── Notification row ───────────────────────────────────────────────────────

function NotifRow({
  id,
  label,
  description,
  defaultChecked = true,
}: {
  id: string
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = React.useState(defaultChecked)

  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <div>
        <Label htmlFor={id} className="text-xs font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(v) => {
          setChecked(v)
          toast.success(v ? `${label} ativado` : `${label} desativado`, { duration: 2000 })
        }}
        aria-label={label}
        className="h-5 w-9 shrink-0"
      />
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [name, setName] = React.useState("Ana Paula")
  const [role, setRole] = React.useState("Customer Success Manager")
  const [saving, setSaving] = React.useState(false)

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast.success("Perfil atualizado com sucesso")
  }

  return (
    <MainLayout breadcrumbs={[{ label: "Início" }, { label: "Configurações" }]}>
      <div className="flex flex-col gap-5 p-3 sm:p-5 max-w-2xl">
        <h1 className="sr-only">Configurações</h1>

        <div>
          <h2 className="text-sm font-semibold">Configurações</h2>
          <p className="text-xs text-muted-foreground">
            Gerencie seu perfil, equipe e preferências do sistema
          </p>
        </div>

        {/* Profile section */}
        <Section title="Perfil" description="Informações visíveis para toda a equipe">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src="/avatar.png" alt="Foto de perfil" />
                <AvatarFallback className="bg-indigo-500/20 text-sm font-semibold text-indigo-400">
                  AP
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium">{name}</p>
                <p className="text-[11px] text-muted-foreground">ana.paula@empresa.com</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs mt-1 w-fit"
                  onClick={() => toast.info("Upload de foto em breve")}
                >
                  Alterar foto
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-xs">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs">E-mail</Label>
                <Input
                  id="email"
                  value="ana.paula@empresa.com"
                  disabled
                  className="h-8 text-xs opacity-60"
                  aria-describedby="email-hint"
                />
                <p id="email-hint" className="text-[11px] text-muted-foreground">
                  Altere via SSO do administrador
                </p>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="role" className="text-xs">Cargo</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                {saving ? "Salvando…" : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Section>

        {/* Notifications section */}
        <Section title="Notificações" description="Escolha quando e como ser notificado">
          <div>
            <NotifRow
              id="notif-sla"
              label="Alertas de SLA"
              description="Receba alertas quando clientes ultrapassarem 70% do SLA"
              defaultChecked
            />
            <NotifRow
              id="notif-tasks"
              label="Tarefas atribuídas"
              description="Notificação quando uma nova tarefa for atribuída a você"
              defaultChecked
            />
            <NotifRow
              id="notif-churn"
              label="Risco de churn"
              description="Alertas quando um cliente mudar para o status Em risco"
              defaultChecked
            />
            <NotifRow
              id="notif-weekly"
              label="Resumo semanal"
              description="Relatório por e-mail toda segunda-feira com os KPIs da semana"
              defaultChecked={false}
            />
            <NotifRow
              id="notif-nps"
              label="Novas respostas de NPS"
              description="Notificação quando um cliente responder a pesquisa NPS"
              defaultChecked={false}
            />
          </div>
        </Section>

        {/* Team section */}
        <Section title="Equipe" description="Membros com acesso ao painel">
          <div className="flex flex-col gap-2">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={cn("text-xs font-semibold", member.color)}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{member.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{member.email}</p>
                </div>
                <Badge className="shrink-0 text-[11px] bg-muted text-muted-foreground border-transparent hover:bg-muted">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => toast.info("Convite de membro em breve")}
            >
              + Convidar membro
            </Button>
          </div>
        </Section>

        {/* Security section */}
        <Section title="Segurança">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Senha</p>
                <p className="text-[11px] text-muted-foreground">Última alteração há 45 dias</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => toast.info("Redirecionando para troca de senha…")}
              >
                Alterar senha
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-xs font-medium">Autenticação em dois fatores</p>
                <p className="text-[11px] text-muted-foreground">Adiciona uma camada extra de segurança</p>
              </div>
              <Switch
                aria-label="Ativar autenticação em dois fatores"
                className="h-5 w-9"
                onCheckedChange={(v) =>
                  toast.info(v ? "2FA ativado" : "2FA desativado", { duration: 2000 })
                }
              />
            </div>
          </div>
        </Section>
      </div>
    </MainLayout>
  )
}
