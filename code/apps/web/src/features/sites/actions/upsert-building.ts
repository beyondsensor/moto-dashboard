"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { UpsertBuildingData } from "../types"

export async function upsertBuildingAction(
  siteId: string,
  data: UpsertBuildingData
) {
  const supabase = await createClient()

  const { id, ...payload } = data

  let result
  if (id) {
    result = await supabase
      .from("buildings")
      .update({
        name: payload.name,
        description: payload.description,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        order_index: payload.orderIndex,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()
  } else {
    result = await supabase
      .from("buildings")
      .insert({
        site_id: siteId,
        name: payload.name,
        description: payload.description,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        order_index: payload.orderIndex || 0,
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message)

  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)

  const building = result.data
  return {
    ...building,
    siteId: building.site_id,
    orderIndex: building.order_index,
  }
}
