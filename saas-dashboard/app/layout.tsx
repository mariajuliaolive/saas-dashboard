import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "OpsDash — Painel Operacional",
  description: "Painel interno de gestão de clientes e operações SaaS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      // suppressHydrationWarning prevents the class mismatch warning that
      // next-themes causes when it sets the theme class on the server vs client.
      suppressHydrationWarning
      className={GeistSans.className}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          {/* Sonner toast container — positioned bottom-right, WCAG-safe */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "text-xs",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
