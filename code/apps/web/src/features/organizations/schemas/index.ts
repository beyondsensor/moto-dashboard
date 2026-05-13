import { z } from "zod"

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>
