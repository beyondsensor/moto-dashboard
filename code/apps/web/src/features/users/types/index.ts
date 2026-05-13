import { z } from "zod"

export type UserRole = "owner" | "admin" | "member"

export interface UserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  displayName: string | null
  avatarUrl: string | null
  isSystemAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface OrganizationMember {
  role: UserRole
  organizationId: string
  organizationName?: string
}

export type UserWithRole = UserProfile & {
  role?: UserRole
}

export type UserDetail = UserWithRole & {
  organizationName?: string
  lastSignInAt?: string
  status?: "active" | "invited" | "locked"
}

export const userFiltersSchema = z.object({
  search: z.string().optional().default(""),
  role: z.enum(["all", "owner", "admin", "member"]).optional().default("all"),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  view: z.enum(["list", "grid"]).optional().default("grid"),
})

export type UserFilters = z.infer<typeof userFiltersSchema>

export interface UsersResponse {
  data: UserWithRole[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
