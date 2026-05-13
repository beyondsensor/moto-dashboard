"use server"

import { createClient } from "@/lib/supabase/server"
import { OrganizationFilters } from "../types"

export async function getOrganizations(filters: OrganizationFilters) {
  const supabase = await createClient()
  const { search, page, pageSize } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from("organizations").select("*", { count: "exact" })

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  const { data, count, error } = await query
    .order("name", { ascending: true })
    .range(from, to)

  if (error) {
    console.error("Error fetching organizations:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to fetch organizations: ${error.message}`)
  }

  // Generate signed URLs for logos
  const organizationsWithLogos = await Promise.all(
    (data || []).map(async (org) => {
      if (!org.logo_url) return { ...org, logo_url: null }

      const { data: signedData } = await supabase.storage
        .from(`org-${org.id}`)
        .createSignedUrl(org.logo_url, 3600)

      return {
        ...org,
        logo_url: signedData?.signedUrl || null,
      }
    })
  )

  return {
    data: organizationsWithLogos,
    meta: {
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}
