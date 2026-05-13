import { z } from "zod"

export const organizationFiltersSchema = z.object({
  search: z.string().optional(),
  view: z.enum(["list", "grid"]).default("grid"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(12),
})

export type OrganizationFilters = z.infer<typeof organizationFiltersSchema>

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  created_at: string
  updated_at: string
}
