import { getOrganizations } from "../actions/get-organizations"
import { OrganizationFilters } from "../types"
import { OrganizationCard } from "./organization-card"
import { OrganizationTable } from "./organization-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

interface OrganizationListProps {
  filters: OrganizationFilters
}

export async function OrganizationList({ filters }: OrganizationListProps) {
  const { data: organizations, meta } = await getOrganizations(filters)

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    params.set("view", filters.view)
    params.set("page", page.toString())
    params.set("pageSize", filters.pageSize.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-8">
      {filters.view === "list" ? (
        <OrganizationTable organizations={organizations} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
          {organizations.length === 0 && (
            <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground border rounded-lg border-dashed">
              No organizations found.
            </div>
          )}
        </div>
      )}

      {meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={meta.page > 1 ? buildPageUrl(meta.page - 1) : "#"} 
                aria-disabled={meta.page <= 1}
                className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink 
                  href={buildPageUrl(p)} 
                  isActive={p === meta.page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href={meta.page < meta.totalPages ? buildPageUrl(meta.page + 1) : "#"} 
                aria-disabled={meta.page >= meta.totalPages}
                className={meta.page >= meta.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
