"use server"

import { createClient } from "@/lib/supabase/server"
import { ForgotPasswordInput, forgotPasswordSchema } from "../schemas/forgot-password-schema"
import { headers } from "next/headers"

export async function forgotPasswordAction(values: ForgotPasswordInput) {
  const validated = forgotPasswordSchema.safeParse(values)
  if (!validated.success) {
    return { error: "Invalid input" }
  }

  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo: `${origin}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
