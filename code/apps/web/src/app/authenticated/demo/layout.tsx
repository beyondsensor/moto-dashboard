import { ReactNode, Suspense } from "react"
import { cookies } from "next/headers"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { SiteProvider } from "@/features/sites/providers/site-context"
import { SitePicker } from "@/features/sites/components/site-picker"

export default async function DemoLayout({
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
          breadcrumbs={[{ label: "Command Center Demo", href: "/authenticated/demo" }]}
        >
          <div className="flex flex-col gap-8">
            {/* Mission Critical Header */}
            <div className="-mt-2 flex items-center justify-between border-b border-primary/10 px-1 py-4">
              <div className="flex items-center gap-6">
                <SitePicker />
                <div className="h-8 w-[1px] bg-primary/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                    Unified Command
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    v2.4.0-PRO
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                    System Health
                  </span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-1 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    ))}
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-primary/10" />
                <div className="flex flex-col items-end">
                   <span className="text-sm font-black tabular-nums tracking-tight">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">
                    Local Time
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="min-h-screen">
              {children}
            </main>
          </div>
        </PageContent>
      </SiteProvider>
    </Suspense>
  )
}
