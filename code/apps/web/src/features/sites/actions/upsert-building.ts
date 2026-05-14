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
        exterior_image_url: payload.exteriorImageUrl,
        site_plan_url: payload.sitePlanUrl,
        updated_at: new Date().toISOString(),
      } as any)
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
        exterior_image_url: payload.exteriorImageUrl,
        site_plan_url: payload.sitePlanUrl,
      } as any)
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message)

  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)

  const building = result.data as any
  return {
    ...building,
    siteId: building.site_id,
    organizationId: (data as any).organizationId, // Keep existing if present
    orderIndex: building.order_index,
    exteriorImageUrl: building.exterior_image_url,
    sitePlanUrl: building.site_plan_url,
  }
}
