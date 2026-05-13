import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { SiteFilters } from "@/features/sites/components/site-filters"
import { SiteList } from "@/features/sites/components/site-list"
import { siteFiltersSchema } from "@/features/sites/types"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const validatedFilters = siteFiltersSchema.parse(params)

  return (
    <PageContent
      breadcrumbs={[{ label: "Sites", href: "/authenticated/sites" }]}
      actions={
        <Link href="/authenticated/sites/create">
          <Button>
            <Plus data-icon="inline-start" />
            Create Site
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        <SiteFilters />
        <Suspense 
          key={JSON.stringify(validatedFilters)} 
          fallback={<SiteListSkeleton view={validatedFilters.view as "list" | "grid"} />}
        >
          <SiteList filters={validatedFilters as any} />
        </Suspense>
      </div>
    </PageContent>
  )
}

function SiteListSkeleton({ view }: { view: "list" | "grid" }) {
  if (view === "list") {
    return (
      <div className="rounded-xl border bg-card/50 overflow-hidden">
        <div className="h-12 bg-muted/30 border-b" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-b last:border-0 p-4 flex gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  )
}