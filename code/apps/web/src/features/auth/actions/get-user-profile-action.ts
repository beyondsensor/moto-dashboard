"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserProfileAction() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  let avatarUrl = ""
  if (profile?.avatar_url) {
    // Generate signed URL for private avatar
    const { data: signedUrlData } = await supabase.storage
      .from("app-data")
      .createSignedUrl(profile.avatar_url, 3600) // 1 hour expiry

    if (signedUrlData) {
      avatarUrl = signedUrlData.signedUrl
    }
  }

  return {
    name: profile?.display_name || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: avatarUrl,
  }
}
