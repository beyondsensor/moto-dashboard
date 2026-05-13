import { getSitesAction } from "../actions/get-sites"
import { SiteFilters as SiteFiltersType } from "../types"
import { SiteCard } from "./site-card"
import { SiteTable } from "./site-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

interface SiteListProps {
  filters: SiteFiltersType & { view: "list" | "grid" }
}

export async function SiteList({ filters }: SiteListProps) {
  const { data: sites, meta } = await getSitesAction(filters)

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.organizationId) params.set("organizationId", filters.organizationId)
    params.set("view", filters.view)
    params.set("page", page.toString())
    params.set("pageSize", filters.pageSize.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-8">
      {filters.view === "list" ? (
        <SiteTable sites={sites as any} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site as any} />
          ))}
          {sites.length === 0 && (
            <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
              No sites found matching your criteria.
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
