"use server"

import { createClient } from "@/lib/supabase/server"
import { UserDetail } from "../types"

export async function getUser(userId: string): Promise<UserDetail> {
  const supabase = await createClient()

  // Fetch user profile with organization membership
  const { data: user, error } = await supabase
    .from("user_profiles")
    .select(`
      *,
      organization_members(
        role,
        organization_id,
        organizations(name)
      )
    `)
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user:", error)
    throw new Error(`Failed to fetch user: ${error.message}`)
  }

  // Process data
  const { organization_members, ...rest } = user
  const membership = organization_members?.[0]
  const flattenedUser = {
    id: rest.id,
    email: rest.email,
    firstName: rest.first_name,
    lastName: rest.last_name,
    displayName: rest.display_name,
    isSystemAdmin: rest.is_system_admin,
    createdAt: rest.created_at,
    updatedAt: rest.updated_at,
    role: membership?.role,
    organizationId: membership?.organization_id,
    organizationName: membership?.organizations?.name,
  }

  // Handle avatar signed URL if exists
  let avatarUrl: string | null = null
  if (user.avatar_url) {
    const { data: signedData } = await supabase.storage
      .from("app-data")
      .createSignedUrl(user.avatar_url, 3600)
    avatarUrl = signedData?.signedUrl || null
  }

  return {
    ...flattenedUser,
    avatarUrl,
  } as UserDetail
}
