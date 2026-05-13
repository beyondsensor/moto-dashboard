"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { LayoutDashboard, Users, AlertTriangle, Settings } from "lucide-react"

interface OrganizationTabsProps {
  slug: string
}

export function OrganizationTabs({ slug }: OrganizationTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      label: "General",
      href: `/authenticated/organizations/${slug}`,
      icon: LayoutDashboard,
      active: pathname === `/authenticated/organizations/${slug}`,
    },
    {
      label: "Members",
      href: `/authenticated/organizations/${slug}/members`,
      icon: Users,
      active: pathname === `/authenticated/organizations/${slug}/members`,
    },
    {
      label: "Danger Zone",
      href: `/authenticated/organizations/${slug}/danger`,
      icon: AlertTriangle,
      active: pathname === `/authenticated/organizations/${slug}/danger`,
    },
  ]

  return (
    <div className="flex items-center border-b px-4">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
              tab.active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
