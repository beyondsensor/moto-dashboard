"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleOrganizationActiveAction(id: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("organizations")
    .update({ is_active: !currentStatus })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error toggling organization status:", error)
    throw new Error(error.message)
  }

  revalidatePath(`/authenticated/organizations`)
  return data
}
