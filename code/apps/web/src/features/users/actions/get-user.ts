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
  const membership = user.organization_members?.[0]
  const flattenedUser = {
    ...user,
    role: membership?.role,
    organizationId: membership?.organization_id,
    organizationName: membership?.organizations?.name,
  }
  delete flattenedUser.organization_members

  // Handle avatar signed URL if exists
  if (user.avatar_url) {
    const { data: signedData } = await supabase.storage
      .from("app-data")
      .createSignedUrl(user.avatar_url, 3600)

    return {
      ...flattenedUser,
      avatarUrl: signedData?.signedUrl || null,
    } as UserDetail
  }

  return {
    ...flattenedUser,
    avatarUrl: null,
  } as UserDetail
}
