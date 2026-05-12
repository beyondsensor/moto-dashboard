"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function isFirstUser() {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from("user_profiles")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error checking first user:", error)
    return false
  }

  return count === 0
}

export async function completeOnboarding(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  orgName: string
  slug: string
}) {
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
    is_system_admin: true,
  })

  if (profileError) {
    throw new Error(profileError.message)
  }

  // 3. Create Organization
  const { data: orgData, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: data.orgName,
      slug: data.slug,
    })
    .select()
    .single()

  if (orgError) {
    throw new Error(orgError.message)
  }

  // 4. Add User as Owner
  const { error: memberError } = await admin
    .from("organization_members")
    .insert({
      organization_id: orgData.id,
      user_id: userId,
      role: "owner",
    })

  if (memberError) {
    throw new Error(memberError.message)
  }

  return { userId, orgId: orgData.id }
}
