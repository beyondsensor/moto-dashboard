"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteInfrastructureAction(siteId: string, type: "building" | "floor" | "zone", id: string) {
  const supabase = await createClient()

  let table = ""
  switch (type) {
    case "building": table = "buildings"; break
    case "floor": table = "floors"; break
    case "zone": table = "zones"; break
  }

  const { error } = await supabase
    .from(type === "building" ? "buildings" : type === "floor" ? "floors" : "zones")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  
  revalidatePath(`/authenticated/sites/${siteId}/infrastructure`)
  return { success: true }
}
