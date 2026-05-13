import * as z from "zod"

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  isSystemAdmin: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type CreateUserValues = z.infer<typeof createUserSchema>

export const userFiltersSchema = z.object({
  search: z.string().optional().default(""),
  role: z.enum(["all", "owner", "admin", "member"]).optional().default("all"),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).optional().default(10),
  view: z.enum(["list", "grid"]).optional().default("list"),
})

export type UserFilters = z.infer<typeof userFiltersSchema>
