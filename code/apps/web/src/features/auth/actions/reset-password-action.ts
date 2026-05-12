"use server"

import { createClient } from "@/lib/supabase/server"
import { ResetPasswordInput, resetPasswordSchema } from "../schemas/reset-password-schema"

export async function resetPasswordAction(values: ResetPasswordInput) {
  const validated = resetPasswordSchema.safeParse(values)
  if (!validated.success) {
    return { error: "Invalid input" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
