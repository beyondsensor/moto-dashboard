"use server"

import { createClient } from "@/lib/supabase/server"

export async function getOrganizationBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching organization:", error)
    return null
  }

  let signedLogoUrl = null
  if (data.logo_url) {
    const { data: signedData } = await supabase.storage
      .from(`org-${data.id}`)
      .createSignedUrl(data.logo_url, 3600)
    
    if (signedData) {
      signedLogoUrl = signedData.signedUrl
    }
  }

  return {
    ...data,
    logo_url: signedLogoUrl,
  }
}
