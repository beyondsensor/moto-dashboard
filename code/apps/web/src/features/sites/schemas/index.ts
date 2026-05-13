import { z } from "zod"

export const createSiteSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  mapImageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")).nullable(),
  notes: z.string().optional().nullable(),
})

export type CreateSiteValues = z.infer<typeof createSiteSchema>

export const siteFormSchema = createSiteSchema.extend({
  id: z.string().optional(),
})

export type SiteFormValues = z.infer<typeof siteFormSchema>

export const updateSiteSchema = createSiteSchema.partial().extend({
  id: z.string().uuid("Invalid site ID"),
})

export type UpdateSiteValues = z.infer<typeof updateSiteSchema>

export const addSiteMemberSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  role: z.enum(["manager", "editor", "viewer"]).default("viewer"),
})

export type AddSiteMemberValues = z.infer<typeof addSiteMemberSchema>
