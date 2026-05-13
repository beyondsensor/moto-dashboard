"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadLogoAction(organizationId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file provided")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `logo-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // 1. Upload to dedicated bucket
  const { error: uploadError } = await supabase.storage
    .from(`org-${organizationId}`)
    .upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading logo:", uploadError)
    throw new Error(uploadError.message)
  }

  // 2. Update organization logo_url
  const { data, error: updateError } = await supabase
    .from("organizations")
    .update({ logo_url: filePath })
    .eq("id", organizationId)
    .select()
    .single()

  if (updateError) {
    console.error("Error updating organization logo:", updateError)
    throw new Error(updateError.message)
  }

  revalidatePath(`/authenticated/organizations/${data.slug}`)
  return data
}
