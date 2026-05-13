"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSiteInfrastructureAction(siteId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("buildings")
    .select(`
      *,
      floors:floors(
        *,
        zones:zones(*)
      )
    `)
    .eq("site_id", siteId)
    .order("order_index")

  if (error) {
    console.error("Error fetching site infrastructure:", error)
    throw new Error(error.message)
  }

  // Sort floors and zones by order_index
  const sortedData = (data || []).map(building => ({
    ...building,
    floors: (building.floors || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map((floor: any) => ({
      ...floor,
      zones: (floor.zones || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
    }))
  }))

  return sortedData
}
