"use server"

import { createClient } from "@/lib/supabase/server"
import { LoginInput, loginSchema } from "../schemas/login-schema"

export async function loginAction(values: LoginInput) {
  const validated = loginSchema.safeParse(values)
  if (!validated.success) {
    return { error: "Invalid input" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
