"use server"

import { createClient } from "@/lib/supabase/server"
import { createOrganizationSchema, CreateOrganizationValues } from "../schemas"
import { revalidatePath } from "next/cache"

export async function updateOrganizationAction(id: string, values: CreateOrganizationValues) {
  const supabase = await createClient()

  const validated = createOrganizationSchema.safeParse(values)
  if (!validated.success) {
    throw new Error("Invalid form data")
  }

  const { data, error } = await supabase
    .from("organizations")
    .update({
      name: validated.data.name,
      slug: validated.data.slug,
      profile: validated.data.profile,
      website: validated.data.website,
      address: validated.data.address,
      contact_name: validated.data.contact_name,
      contact_mobile: validated.data.contact_mobile,
      contact_email: validated.data.contact_email,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating organization:", error)
    throw new Error(error.message)
  }

  revalidatePath("/authenticated/organizations")
  revalidatePath(`/authenticated/organizations/${data.slug}`)
  return data
}
