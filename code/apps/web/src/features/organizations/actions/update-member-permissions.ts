"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface SitePermissionUpdate {
  siteId: string
  role: "manager" | "editor" | "viewer"
}

export async function updateMemberPermissionsAction(
  userId: string,
  permissions: SitePermissionUpdate[]
) {
  const admin = createAdminClient()

  // 1. Delete all existing site memberships for this user
  // This is a simple way to "sync" the permissions
  const { error: deleteError } = await admin
    .from("site_members")
    .delete()
    .eq("user_id", userId)

  if (deleteError) {
    console.error("Error clearing existing permissions:", deleteError)
    throw new Error(`Failed to update permissions: ${deleteError.message}`)
  }

  // 2. Insert new permissions if any
  if (permissions.length > 0) {
    const toInsert = permissions.map(p => ({
      user_id: userId,
      site_id: p.siteId,
      role: p.role,
    }))

    const { error: insertError } = await admin
      .from("site_members")
      .insert(toInsert)

    if (insertError) {
      console.error("Error inserting new permissions:", insertError)
      throw new Error(`Failed to save permissions: ${insertError.message}`)
    }
  }

  revalidatePath(`/authenticated/organizations/[slug]/members`, "page")
  
  return { success: true, message: "Permissions updated successfully" }
}
