"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

import { UpsertFloorData } from "../types"

export async function upsertFloorSeriesAction(
  siteId: string,
  floors: UpsertFloorData[]
) {
  const supabase = await createClient()

  if (!floors.length) return []

  const payload = floors.map((f) => ({
    building_id: f.buildingId,
    name: f.name,
    level_number: f.levelNumber,
    order_index: f.orderIndex,
  }))

  const { data, error } = await supabase.from("floors").insert(payload).select()

  if (error) throw new Error(error.message)

  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)

  return (data || []).map((floor) => ({
    ...floor,
    buildingId: floor.building_id,
    orderIndex: floor.order_index,
    levelNumber: floor.level_number,
    floorPlanUrl: floor.floor_plan_url,
  }))
}
