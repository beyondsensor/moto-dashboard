"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function removeOrganizationMemberAction(
  organizationId: string,
  userId: string
) {
  const admin = createAdminClient()

  const { error } = await admin
    .from("organization_members")
    .delete()
    .eq("organization_id", organizationId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error removing organization member:", error)
    throw new Error(`Failed to remove member: ${error.message}`)
  }

  revalidatePath(`/authenticated/organizations/[slug]/members`, "page")

  return { success: true, message: "Member removed successfully" }
}
