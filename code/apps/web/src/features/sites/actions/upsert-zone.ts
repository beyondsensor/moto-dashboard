"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function upsertZoneAction(siteId: string, data: { id?: string, floorId: string, name: string, description?: string, orderIndex?: number }) {
  const supabase = await createClient()

  const { id, floorId, ...payload } = data

  let result
  if (id) {
    result = await supabase
      .from("zones")
      .update({ 
        name: payload.name,
        description: payload.description,
        order_index: payload.orderIndex,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select()
      .single()
  } else {
    result = await supabase
      .from("zones")
      .insert({ 
        floor_id: floorId,
        name: payload.name,
        description: payload.description,
        order_index: payload.orderIndex || 0
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)
  return result.data
}
