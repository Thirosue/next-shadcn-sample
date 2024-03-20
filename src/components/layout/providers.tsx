"use client"

import { SessionProvider, SessionProviderProps } from "next-auth/react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ConfirmProvider } from "@/components/layout/confirm-provider"

import ThemeProvider from "./ThemeToggle/theme-provider"

export function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"]
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <TooltipProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
