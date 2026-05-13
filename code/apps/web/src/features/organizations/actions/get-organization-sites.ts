"use server"

import { createClient } from "@/lib/supabase/server"

export async function getOrganizationSitesAction(organizationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sites")
    .select("id, name, code, address")
    .eq("organization_id", organizationId)
    .order("name")

  if (error) {
    console.error("Error fetching organization sites:", error)
    throw new Error(`Failed to fetch sites: ${error.message}`)
  }

  return data || []
}
