"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUser(userId: string, data: {
  firstName: string | null
  lastName: string | null
  displayName: string | null
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("user_profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      display_name: data.displayName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user:", error)
    throw new Error(`Failed to update user: ${error.message}`)
  }

  revalidatePath(`/authenticated/users/${userId}`)
  revalidatePath("/authenticated/users")
}
