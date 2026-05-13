"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserOrganizations(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("organization_members")
    .select(`
      id,
      role,
      created_at,
      organizations (
        id,
        name,
        slug,
        contact_email
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user organizations:", error)
    throw new Error(`Failed to fetch organizations: ${error.message}`)
  }

  return data.map((membership: any) => ({
    membershipId: membership.id,
    role: membership.role,
    joinedAt: membership.created_at,
    id: membership.organizations.id,
    name: membership.organizations.name,
    slug: membership.organizations.slug,
    email: membership.organizations.contact_email,
  }))
}
