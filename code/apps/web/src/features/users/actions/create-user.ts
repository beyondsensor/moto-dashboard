"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { CreateUserValues } from "../schemas"

export async function createUser(data: CreateUserValues) {
  const admin = createAdminClient()

  // 1. Create Auth User
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  })

  if (authError) {
    console.error("Error creating auth user:", authError)
    throw new Error(`Failed to create auth user: ${authError.message}`)
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user: No user returned")
  }

  const userId = authData.user.id

  // 2. Create User Profile
  const { error: profileError } = await admin.from("user_profiles").insert({
    id: userId,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    display_name: data.displayName,
    is_system_admin: data.isSystemAdmin,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    // Cleanup auth user if profile creation fails
    await admin.auth.admin.deleteUser(userId)
    console.error("Error creating user profile:", profileError)
    throw new Error(`Failed to create user profile: ${profileError.message}`)
  }

  revalidatePath("/authenticated/users")
  return { userId }
}
