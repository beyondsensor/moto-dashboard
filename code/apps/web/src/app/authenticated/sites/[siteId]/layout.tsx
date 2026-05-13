import { notFound } from "next/navigation"
import { getSiteAction } from "@/features/sites/actions/get-site"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { SiteTabs } from "@/features/sites/components/site-tabs"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    siteId: string
  }>
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { siteId } = await params
  const site = await getSiteAction(siteId)

  if (!site) {
    notFound()
  }

  return (
    <PageContent
      breadcrumbs={[
        { label: "Sites", href: "/authenticated/sites" },
        { label: site.name, href: `/authenticated/sites/${site.id}` },
      ]}
    >
      <div className="-mx-8 -mt-4 mb-8 border-b bg-card/30 backdrop-blur-sm">
        <div className="px-8 pt-8 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
              {site.code && (
                <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  {site.code}
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Manage infrastructure, members, and site-specific configuration.
            </p>
          </div>
        </div>
        <SiteTabs siteId={siteId} />
      </div>
      <div>
        {children}
      </div>
    </PageContent>
  )
}
