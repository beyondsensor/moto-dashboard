import { z } from "zod"

export const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 characters"),
})

export type TwoFactorInput = z.infer<typeof twoFactorSchema>
