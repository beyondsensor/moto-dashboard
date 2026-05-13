"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function upsertFloorAction(siteId: string, data: { id?: string, buildingId: string, name: string, levelNumber?: number, orderIndex?: number, floorPlanUrl?: string }) {
  const supabase = await createClient()

  const { id, buildingId, ...payload } = data

  let result
  if (id) {
    result = await supabase
      .from("floors")
      .update({ 
        name: payload.name,
        level_number: payload.levelNumber,
        order_index: payload.orderIndex,
        floor_plan_url: payload.floorPlanUrl,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select()
      .single()
  } else {
    result = await supabase
      .from("floors")
      .insert({ 
        building_id: buildingId,
        name: payload.name,
        level_number: payload.levelNumber,
        order_index: payload.orderIndex || 0,
        floor_plan_url: payload.floorPlanUrl
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)
  return result.data
}
