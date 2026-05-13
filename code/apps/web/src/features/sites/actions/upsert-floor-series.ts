"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface FloorSeriesData {
  buildingId: string
  name: string
  levelNumber: number
  orderIndex: number
}

export async function upsertFloorSeriesAction(siteId: string, floors: FloorSeriesData[]) {
  const supabase = await createClient()

  if (!floors.length) return []

  const payload = floors.map(f => ({
    building_id: f.buildingId,
    name: f.name,
    level_number: f.levelNumber,
    order_index: f.orderIndex,
  }))

  const { data, error } = await supabase
    .from("floors")
    .insert(payload)
    .select()

  if (error) throw new Error(error.message)
  
  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)
  return data
}
