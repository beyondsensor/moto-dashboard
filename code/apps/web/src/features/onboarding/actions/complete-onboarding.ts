"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { OnboardingValues } from "../schemas"

export async function completeOnboarding(data: OnboardingValues) {
  const admin = createAdminClient()

  // 1. Create Auth User with Service Role
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    })

  if (authError) {
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user")
  }

  const userId = authData.user.id

  // 2. Create User Profile
  const { error: profileError } = await admin.from("user_profiles").insert({
    id: userId,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    display_name: `${data.firstName} ${data.lastName}`,
    avatar_url: null,
    is_system_admin: true,
  })

  if (profileError) {
    throw new Error(profileError.message)
  }

  return { userId }
}
