import { UserFilters } from "../types"
import { getUsers } from "../actions/get-users"
import { UserTable } from "./user-table"
import { UserCard } from "./user-card"
import { Users } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

interface UserListProps {
  filters: UserFilters
  organizationId?: string
}

export async function UserList({ filters, organizationId }: UserListProps) {
  const { data: users, meta } = await getUsers(filters, organizationId)

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-lg bg-card/50">
        <Users className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No users found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We couldn&apos;t find any users matching your filters. Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {filters.view === "list" ? (
        <UserTable users={users} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={meta.page > 1 ? `?page=${meta.page - 1}` : "#"} 
                className={meta.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href={`?page=${i + 1}`} 
                  isActive={meta.page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href={meta.page < meta.totalPages ? `?page=${meta.page + 1}` : "#"} 
                className={meta.page === meta.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
