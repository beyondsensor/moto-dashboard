"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSiteInfrastructureAction(siteId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("buildings")
    .select(`
      *,
      site:sites(organization_id),
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

  // Sort floors and zones by order_index and map to camelCase
  const sortedData = (data as any || []).map((building: any) => ({
    ...building,
    siteId: building.site_id,
    organizationId: building.site?.organization_id,
    orderIndex: building.order_index,
    exteriorImageUrl: building.exterior_image_url,
    sitePlanUrl: building.site_plan_url,
    floors: (building.floors || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map((floor: any) => ({
      ...floor,
      buildingId: floor.building_id,
      siteId: building.site_id,
      organizationId: building.site?.organization_id,
      orderIndex: floor.order_index,
      levelNumber: floor.level_number,
      floorPlanUrl: floor.floor_plan_url,
      zones: (floor.zones || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map((zone: any) => ({
        ...zone,
        floorId: zone.floor_id,
        orderIndex: zone.order_index
      }))
    }))
  }))

  return sortedData as any
}
