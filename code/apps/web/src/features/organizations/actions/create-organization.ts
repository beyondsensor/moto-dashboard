"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
    throw new Error(memberError.message)
  }

  // 4. Create dedicated storage bucket
  const adminClient = createAdminClient()
  const bucketName = `org-${org.id}`
  const { error: bucketError } = await adminClient.storage.createBucket(bucketName, {
    public: false,
    fileSizeLimit: 10485760, // 10MB
  })

  if (bucketError) {
    console.error("Error creating organization bucket:", bucketError)
    // We log but maybe don't want to break the whole flow if the org is already created?
    // Actually, for consistency, we should probably have transactions, but since we don't,
    // we'll at least inform the user.
    throw new Error(`Organization created but failed to create storage bucket: ${bucketError.message}`)
  }

  revalidatePath("/authenticated/organizations")
  return org
}
