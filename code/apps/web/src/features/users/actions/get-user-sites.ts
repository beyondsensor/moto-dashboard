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

  return (data || []).map((item) => {
    const site = item.sites as unknown as { id: string, name: string, code: string, address: string }
    return {
      id: site.id,
      name: site.name,
      code: site.code,
      address: site.address,
      role: item.role,
    }
  })
}
