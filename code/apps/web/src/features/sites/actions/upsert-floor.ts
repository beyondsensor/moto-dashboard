"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { UpsertFloorData } from "../types"

export async function upsertFloorAction(siteId: string, data: UpsertFloorData) {
  console.log("upsertFloorAction received data:", data)
  const supabase = await createClient()

  const { id, buildingId, ...payload } = data
  
  // Robust field mapping to handle both camelCase and snake_case
  const floorData = {
    name: payload.name,
    level_number: payload.levelNumber ?? (payload as any).level_number,
    order_index: payload.orderIndex ?? (payload as any).order_index,
    floor_plan_url: payload.floorPlanUrl ?? (payload as any).floor_plan_url,
    updated_at: new Date().toISOString(),
  }

  console.log("Saving floor data to DB:", floorData)

  let result
  if (id) {
    result = await supabase
      .from("floors")
      .update(floorData)
      .eq("id", id)
      .select()
      .single()
  } else {
    result = await supabase
      .from("floors")
      .insert({
        building_id: buildingId,
        ...floorData,
        updated_at: undefined // Let DB handle created_at/updated_at on insert
      })
      .select()
      .single()
  }

  if (result.error) {
    console.error("Supabase Error saving floor:", result.error)
    throw new Error(result.error.message)
  }
  
  console.log("Upserted floor:", result.data)

  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)

  const floor = result.data
  return {
    ...floor,
    buildingId: floor.building_id,
    siteId: (data as any).siteId,
    organizationId: (data as any).organizationId,
    orderIndex: floor.order_index,
    levelNumber: floor.level_number,
    floorPlanUrl: floor.floor_plan_url,
  }
}
