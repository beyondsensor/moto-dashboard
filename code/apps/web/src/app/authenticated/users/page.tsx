import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { UserFilters } from "@/features/users/components/user-filters"
import { UserList } from "@/features/users/components/user-list"
import { userFiltersSchema } from "@/features/users/types"
import { Button } from "@workspace/ui/components/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const validatedFilters = userFiltersSchema.parse(params)

  return (
    <PageContent
      breadcrumbs={[{ label: "Users", href: "/authenticated/users" }]}
      actions={
        <Link href="/authenticated/users/create">
          <Button size="sm">
            <UserPlus className="size-4 mr-2" />
            Invite User
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-6">
        <UserFilters />
        <Suspense 
          key={JSON.stringify(validatedFilters)} 
          fallback={<UserListSkeleton view={validatedFilters.view} />}
        >
          <UserList filters={validatedFilters} />
        </Suspense>
      </div>
    </PageContent>
  )
}

function UserListSkeleton({ view }: { view: "list" | "grid" }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
      ))}
    </div>
  )
}