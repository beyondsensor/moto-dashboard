import { z } from "zod"

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  profile: z.string().optional().nullable(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  contact_name: z.string().optional().nullable(),
  contact_mobile: z.string().optional().nullable(),
  contact_email: z.string().email("Invalid contact email").optional().or(z.literal("")).nullable(),
})

export type CreateOrganizationValues = z.infer<typeof createOrganizationSchema>

export const addMemberSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  role: z.enum(["owner", "admin", "member"]).default("member"),
})

export type AddMemberValues = z.infer<typeof addMemberSchema>
