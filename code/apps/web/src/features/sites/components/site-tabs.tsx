"use client"

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { useRouter, usePathname } from "next/navigation"

interface SiteTabsProps {
  siteId: string
}

export function SiteTabs({ siteId }: SiteTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { label: "Overview", value: "overview", href: `/authenticated/sites/${siteId}` },
    { label: "Infrastructure", value: "infrastructure", href: `/authenticated/sites/${siteId}/infrastructure` },
    { label: "Members", value: "members", href: `/authenticated/sites/${siteId}/members` },
    { label: "Contacts", value: "contacts", href: `/authenticated/sites/${siteId}/contacts` },
    { label: "Settings", value: "settings", href: `/authenticated/sites/${siteId}/settings` },
  ]

  // Determine current tab
  const currentTab = pathname.split("/").pop() === siteId ? "overview" : pathname.split("/").pop() || "overview"

  return (
    <div className="px-8">
      <Tabs value={currentTab} onValueChange={(value) => {
        const tab = tabs.find(t => t.value === value)
        if (tab) router.push(tab.href)
      }}>
        <TabsList className="bg-transparent h-auto p-0 gap-6 border-b-0 rounded-none w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 font-semibold text-sm transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
