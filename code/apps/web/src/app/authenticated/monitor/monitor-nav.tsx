"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { 
  Activity, 
  Video, 
  Lock, 
  Flame, 
  Zap, 
  AlertTriangle 
} from "lucide-react"

export function MonitorNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const siteId = searchParams.get("siteId")
  
  const tabs = [
    { label: "Overview", href: "/authenticated/monitor", icon: Activity },
    { label: "CCTV", href: "/authenticated/monitor/cctv", icon: Video },
    { label: "Access Control", href: "/authenticated/monitor/access-control", icon: Lock },
    { label: "Fire Safety", href: "/authenticated/monitor/fire-safety", icon: Flame },
    { label: "Utility", href: "/authenticated/monitor/utility", icon: Zap },
    { label: "Alerts", href: "/authenticated/monitor/alerts", icon: AlertTriangle },
  ]

  return (
    <div className="border-b border-primary/5">
      <nav className="flex gap-1 -mb-px overflow-x-auto no-scrollbar pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          
          // Preserve siteId in the link
          const href = siteId ? `${tab.href}?siteId=${siteId}` : tab.href

          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap",
                isActive 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
