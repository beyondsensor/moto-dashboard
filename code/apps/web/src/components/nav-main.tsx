"use client"

import { useState, useEffect } from "react"
import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: string
  }[]
  label?: string
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = mounted 
            ? (pathname === item.url || pathname.startsWith(item.url + "/") || item.isActive) 
            : item.isActive

          return (
            <SidebarMenuItem 
              key={item.title} 
              className={cn(
                "relative transition-all duration-200",
                isActive && "before:absolute before:-left-2 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:z-20"
              )}
            >
              <SidebarMenuButton 
                asChild 
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "bg-sidebar-accent font-bold text-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <Link href={item.url}>
                  {item.icon && (
                    <item.icon className={cn("size-5", isActive ? "text-primary" : "text-muted-foreground/60")} />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
