"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ConfirmProvider } from "@/components/confirm-provider"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
