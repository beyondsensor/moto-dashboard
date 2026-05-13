"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAvatar(userId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("avatar") as File

  if (!file) {
    throw new Error("No file provided")
  }

  // 1. Upload to storage
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("app-data")
    .upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError)
    throw new Error(`Failed to upload avatar: ${uploadError.message}`)
  }

  // 2. Update user profile
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      avatar_url: filePath,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (updateError) {
    console.error("Error updating user avatar:", updateError)
    throw new Error(`Failed to update user avatar: ${updateError.message}`)
  }

  revalidatePath(`/authenticated/users/${userId}`)
  revalidatePath("/authenticated/users")
}
