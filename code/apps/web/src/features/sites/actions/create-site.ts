"use server"

import { createClient } from "@/lib/supabase/server"
import { createSiteSchema, CreateSiteValues } from "../schemas"
import { revalidatePath } from "next/cache"

export async function createSiteAction(values: CreateSiteValues) {
  const supabase = await createClient()

  const validated = createSiteSchema.safeParse(values)
  if (!validated.success) {
    throw new Error("Invalid form data")
  }

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // 2. Create Site
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .insert({
      organization_id: validated.data.organizationId,
      name: validated.data.name,
      code: validated.data.code,
      address: validated.data.address,
      latitude: validated.data.latitude,
      longitude: validated.data.longitude,
      map_image_url: validated.data.mapImageUrl,
      notes: validated.data.notes,
    })
    .select()
    .single()

  if (siteError) {
    console.error("Error creating site:", siteError)
    throw new Error(siteError.message)
  }

  // 3. Add creator as site manager
  const { error: memberError } = await supabase
    .from("site_members")
    .insert({
      site_id: site.id,
      user_id: user.id,
      role: "manager",
    })

  if (memberError) {
    console.error("Error adding site member:", memberError)
    // We don't throw here to avoid failing the whole creation if just the member link fails
    // But in a real app we might want to rollback
  }

  revalidatePath("/authenticated/sites")
  return site
}
