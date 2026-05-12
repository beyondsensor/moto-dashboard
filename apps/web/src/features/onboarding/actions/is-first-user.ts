"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function isFirstUser() {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from("user_profiles")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error checking first user:", error)
    return false
  }

  return count === 0
}
