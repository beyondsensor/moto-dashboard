"use server"

import { createClient } from "@/lib/supabase/server"
import { UserFilters } from "@/features/users/types"

export async function getOrganizationMembers(
  organizationId: string,
  filters: Partial<UserFilters>
) {
  const supabase = await createClient()
  const { search, role, page = 1, pageSize = 20 } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Start from organization_members to ensure we only get members of this organization
  let query = supabase
    .from("organization_members")
    .select(
      `
        role,
        user_id,
        user:user_profiles!inner(*)
      `,
      { count: "exact" }
    )
    .eq("organization_id", organizationId)

  // Filter by role
  if (role && role !== "all") {
    query = query.eq("role", role)
  }

  // Filter by search (on the joined user profile)
  if (search) {
    query = query.or(
      `display_name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`,
      { foreignTable: "user" }
    )
  }

  const { data, count, error } = await query
    .order("role", { ascending: true }) // You can also order by user name if preferred
    .range(from, to)

  if (error) {
    console.error("Error fetching organization members:", error)
    throw new Error(`Failed to fetch members: ${error.message}`)
  }

  // Process data to match the UI expectation (UserWithRole[])
  const members = await Promise.all(
    (data || []).map(async (item: any) => {
      const user = item.user
      
      const flattenedUser = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        displayName: user.display_name,
        isSystemAdmin: user.is_system_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        role: item.role,
        organizationId: organizationId,
      }

      // Handle avatar signed URL if exists
      if (user.avatar_url) {
        const { data: signedData } = await supabase.storage
          .from("app-data")
          .createSignedUrl(user.avatar_url, 3600)

        return {
          ...flattenedUser,
          avatarUrl: signedData?.signedUrl || null,
        }
      }

      return {
        ...flattenedUser,
        avatarUrl: null,
      }
    })
  )

  return {
    data: members,
    meta: {
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}
