"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserSites(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("site_members")
    .select(`
      role,
      sites(
        id,
        name,
        code,
        address
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user sites:", error)
    throw new Error(`Failed to fetch user sites: ${error.message}`)
  }

  return (data || []).map((item: any) => ({
    id: item.sites.id,
    name: item.sites.name,
    code: item.sites.code,
    address: item.sites.address,
    role: item.role,
  }))
}
