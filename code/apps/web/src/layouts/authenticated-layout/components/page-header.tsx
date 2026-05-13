import { ReactNode } from "react"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { PageBreadcrumbs } from "./page-breadcrumbs"

export function PageHeader({ 
  breadcrumbs,
  actions 
}: { 
  breadcrumbs: { label: string; href?: string }[],
  actions?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      {actions && <div className="px-4">{actions}</div>}
    </header>
  )
}
