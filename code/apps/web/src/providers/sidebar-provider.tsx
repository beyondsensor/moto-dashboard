"use client"

import { SidebarProvider as BaseSidebarProvider } from "@workspace/ui/components/sidebar"

export function SidebarProvider({ 
  children, 
  defaultOpen 
}: { 
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <BaseSidebarProvider defaultOpen={defaultOpen}>
      {children}
    </BaseSidebarProvider>
  )
}
