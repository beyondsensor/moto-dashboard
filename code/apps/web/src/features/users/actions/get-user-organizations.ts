"use server"

import { createClient } from "@/lib/supabase/server"

import { UserOrganization, UserRole } from "../types"
 
export async function getUserOrganizations(userId: string): Promise<UserOrganization[]> {
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
 
  interface RawMembership {
    id: string
    role: string
    created_at: string
    organizations: {
      id: string
      name: string
      slug: string
      contact_email: string
    } | null
  }

  return (data as unknown as RawMembership[]).map((membership) => ({
    membershipId: membership.id,
    role: membership.role as UserRole,
    joinedAt: membership.created_at,
    id: membership.organizations?.id || "",
    name: membership.organizations?.name || "",
    slug: membership.organizations?.slug || "",
    email: membership.organizations?.contact_email || "",
  }))
}
