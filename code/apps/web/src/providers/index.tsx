"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export * from "./theme-provider"
export * from "./query-provider"
export * from "./sidebar-provider"
