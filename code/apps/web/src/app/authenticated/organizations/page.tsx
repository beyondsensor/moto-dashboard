import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { OrganizationFilters } from "@/features/organizations/components/organization-filters"
import { OrganizationList } from "@/features/organizations/components/organization-list"
import { organizationFiltersSchema } from "@/features/organizations/types"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const validatedFilters = organizationFiltersSchema.parse(params)

  return (
    <PageContent
      breadcrumbs={[{ label: "Organizations", href: "/authenticated/organizations" }]}
      actions={
        <Link href="/authenticated/organizations/create">
          <Button>
            <Plus data-icon="inline-start" />
            Create Organization
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        <OrganizationFilters />
        <Suspense 
          key={JSON.stringify(validatedFilters)} 
          fallback={<OrganizationListSkeleton view={validatedFilters.view} />}
        >
          <OrganizationList filters={validatedFilters} />
        </Suspense>
      </div>
    </PageContent>
  )
}

function OrganizationListSkeleton({ view }: { view: "list" | "grid" }) {
  if (view === "list") {
    return (
      <div className="rounded-md border">
        <div className="h-10 border-b bg-muted/50" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 border-b" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  )
}