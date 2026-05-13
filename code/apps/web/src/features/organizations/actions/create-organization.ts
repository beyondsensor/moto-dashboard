"use server"

import { createClient } from "@/lib/supabase/server"
import { createOrganizationSchema, CreateOrganizationValues } from "../schemas"
import { revalidatePath } from "next/cache"

export async function createOrganizationAction(values: CreateOrganizationValues) {
  const supabase = await createClient()

  const validated = createOrganizationSchema.safeParse(values)
  if (!validated.success) {
    throw new Error("Invalid form data")
  }

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // 2. Create Organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: validated.data.name,
      slug: validated.data.slug,
      logo_url: validated.data.logoUrl || null,
    })
    .select()
    .single()

  if (orgError) {
    console.error("Error creating organization:", orgError)
    throw new Error(orgError.message)
  }

  // 3. Add creator as owner
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    })

  if (memberError) {
    console.error("Error adding organization member:", memberError)
    // We might want to rollback or just log this. Since we don't have transactions here easily,
    // we'll just throw for now.
    throw new Error(memberError.message)
  }

  revalidatePath("/authenticated/organizations")
  return org
}
