import { ReactNode, Suspense } from "react"
import { cookies } from "next/headers"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { SiteProvider } from "@/features/sites/providers/site-context"
import { SitePicker } from "@/features/sites/components/site-picker"
import { MonitorNav } from "./monitor-nav"

export default async function MonitorLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const initialSiteId =
    (await cookieStore).get("selected_site_id")?.value || null

  return (
    <Suspense>
      <SiteProvider initialSiteId={initialSiteId}>
        <PageContent
          breadcrumbs={[{ label: "Monitor", href: "/authenticated/monitor" }]}
        >
          <div className="flex flex-col gap-8">
            {/* Site Context Bar */}
            <div className="-mt-2 flex items-center justify-between border-b border-primary/5 px-1 py-2">
              <SitePicker />
              <div className="hidden items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:flex">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Context Aware Monitoring
              </div>
            </div>

            {/* Title Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary/60 uppercase">
                  System Active
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Unified Monitor
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Advanced site intelligence dashboard. Real-time data
                visualization and infrastructure oversight across all connected
                systems.
              </p>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-primary/5 bg-background/50 shadow-sm backdrop-blur-sm">
              <MonitorNav />
              <div className="min-h-[500px] p-8">{children}</div>
            </div>
          </div>
        </PageContent>
      </SiteProvider>
    </Suspense>
  )
}
