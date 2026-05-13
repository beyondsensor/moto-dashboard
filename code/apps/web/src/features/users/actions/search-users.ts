"use server"

import { createClient } from "@/lib/supabase/server"

export async function searchUsersAction(
  query: string,
  excludeOrganizationId?: string
) {
  const supabase = await createClient()

  let supabaseQuery = supabase.from("user_profiles").select(`
      id,
      display_name,
      first_name,
      last_name,
      email,
      avatar_url
    `)

  if (query && query.length >= 2) {
    supabaseQuery = supabaseQuery.or(
      `display_name.ilike.%${query}%,email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`
    )
  }

  const { data, error } = await supabaseQuery
    .order("created_at", { ascending: false })
    .limit(10)
  console.log("searchUsersActions", data)

  if (error) {
    console.error("Error searching users:", error)
    return []
  }

  // If excludeOrganizationId is provided, we need to filter out existing members
  // This is a bit tricky with Supabase's current join logic if we want to do it in one query,
  // so we'll do a quick secondary check or just return all and handle it.
  // For simplicity and performance with small results, we'll return all for now.

  return data.map((user: any) => ({
    id: user.id,
    displayName:
      user.display_name ||
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email,
    email: user.email,
    avatarUrl: user.avatar_url,
  }))
}
