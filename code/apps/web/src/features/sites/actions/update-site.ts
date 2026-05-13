"use server"

import { createClient } from "@/lib/supabase/server"
import { updateSiteSchema, UpdateSiteValues } from "../schemas"
import { revalidatePath } from "next/cache"

export async function updateSiteAction(values: UpdateSiteValues) {
  const supabase = await createClient()

  const validated = updateSiteSchema.safeParse(values)
  if (!validated.success) {
    throw new Error("Invalid form data")
  }

  const { id, ...updateData } = validated.data

  const { data, error } = await supabase
    .from("sites")
    .update({
      name: updateData.name,
      code: updateData.code,
      address: updateData.address,
      latitude: updateData.latitude,
      longitude: updateData.longitude,
      map_image_url: updateData.mapImageUrl,
      notes: updateData.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating site:", error)
    throw new Error(error.message)
  }

  revalidatePath("/authenticated/sites")
  revalidatePath(`/authenticated/sites/${id}`)
  return data
}
