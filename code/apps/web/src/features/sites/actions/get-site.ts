"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSiteAction(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sites")
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching site:", error)
    throw new Error(`Failed to fetch site: ${error.message}`)
  }

  return data
}
