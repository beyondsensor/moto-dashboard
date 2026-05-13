"use server"

import { createClient } from "@/lib/supabase/server"
import { UserFilters, UsersResponse } from "../types"

export async function getUsers(
  filters: UserFilters,
  organizationId?: string
): Promise<UsersResponse> {
  const supabase = await createClient()
  const { search, role, page, pageSize } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Base query: join user_profiles with organization_members
  // We use !inner to ensure we only get users who are members of an organization if organizationId is provided
  let query = supabase.from("user_profiles").select(
    `
      *,
      organization_members!inner(role, organization_id)
    `,
    { count: "exact" }
  )

  // Filter by organization if ID is provided
  if (organizationId) {
    query = query.eq("organization_members.organization_id", organizationId)
  }

  // Filter by role if specified (and not 'all')
  if (role !== "all") {
    query = query.eq("organization_members.role", role)
  }

  // Search by name or email
  if (search) {
    query = query.or(
      `display_name.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
    )
  }

  const { data, count, error } = await query
    .order("display_name", { ascending: true })
    .range(from, to)

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  // Process data to flatten role and handle avatars
  const usersWithAvatars = await Promise.all(
    (data || []).map(async (user: any) => {
      // Flatten role from the joined table
      const membership = user.organization_members[0]
      const flattenedUser = {
        ...user,
        role: membership?.role,
        organizationId: membership?.organization_id,
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
        }
      }

      return {
        ...flattenedUser,
        avatarUrl: null,
      }
    })
  )

  return {
    data: usersWithAvatars,
    meta: {
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}
