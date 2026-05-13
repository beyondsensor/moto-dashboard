"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { addMemberSchema, AddMemberValues } from "../schemas"

export async function addOrganizationMemberAction(organizationId: string, values: AddMemberValues) {
  const admin = createAdminClient()

  const validated = addMemberSchema.safeParse(values)
  if (!validated.success) {
    throw new Error("Invalid form data")
  }

  const { userIds, role } = validated.data

  // 1. Filter out users who are already members to avoid unique constraint violations
  const { data: existingMembers } = await admin
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", organizationId)
    .in("user_id", userIds)

  const existingMemberIds = new Set(existingMembers?.map(m => m.user_id) || [])
  const newUserIds = userIds.filter(id => !existingMemberIds.has(id))

  if (newUserIds.length === 0) {
    return { success: true, count: 0, message: "All selected users are already members" }
  }

  // 2. Bulk insert new members
  const membersToInsert = newUserIds.map(userId => ({
    organization_id: organizationId,
    user_id: userId,
    role,
  }))

  const { error: memberError } = await admin
    .from("organization_members")
    .insert(membersToInsert)

  if (memberError) {
    console.error("Error adding organization members:", memberError)
    throw new Error(`Failed to add members: ${memberError.message}`)
  }

  revalidatePath(`/authenticated/organizations/[slug]/members`, "page")
  
  return { 
    success: true, 
    count: newUserIds.length,
    message: `Successfully added ${newUserIds.length} member(s)`
  }
}
