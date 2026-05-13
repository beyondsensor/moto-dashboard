"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteOrganizationAction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting organization:", error)
    throw new Error(error.message)
  }

  revalidatePath("/authenticated/organizations")
  return { success: true }
}
