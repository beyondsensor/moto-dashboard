"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { UserRole } from "@/features/users/types"

export async function updateOrganizationMemberRoleAction(
  organizationId: string, 
  userId: string, 
  role: UserRole
) {
  const admin = createAdminClient()

  const { error } = await admin
    .from("organization_members")
    .update({ role })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating member role:", error)
    throw new Error(`Failed to update role: ${error.message}`)
  }

  revalidatePath(`/authenticated/organizations/[slug]/members`, "page")
  
  return { success: true, message: "Role updated successfully" }
}
