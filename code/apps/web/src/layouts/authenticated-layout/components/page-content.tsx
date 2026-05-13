import { ReactNode } from "react"
import { SidebarInset } from "@workspace/ui/components/sidebar"
import { PageHeader } from "./page-header"
import { PageFooter } from "./page-footer"

export interface PageContentProps {
  children: ReactNode
  breadcrumbs: {
    label: string
    href?: string
  }[]
  actions?: ReactNode
}

export function PageContent({ children, breadcrumbs, actions }: PageContentProps) {
  return (
    <SidebarInset>
      <PageHeader breadcrumbs={breadcrumbs} actions={actions} />
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 rounded-xl p-4">{children}</div>
      </main>
      <PageFooter />
    </SidebarInset>
  )
}
