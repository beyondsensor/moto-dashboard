"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteSiteAction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting site:", error)
    throw new Error(error.message)
  }

  revalidatePath("/authenticated/sites")
  return { success: true }
}
