"use server"

import { createClient } from "@/lib/supabase/server"
import { SiteFilters, Site } from "../types"

export async function getSitesAction(filters: SiteFilters) {
  const supabase = await createClient()
  const { search, organizationId, page, pageSize } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // We use a join or separate count to get member counts if needed
  // For now, let's just get the sites
  let query = supabase.from("sites").select(
    `
      *,
      organization:organizations(name),
      site_members(count)
    `,
    { count: "exact" }
  )

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (organizationId) {
    query = query.eq("organization_id", organizationId)
  }

  const { data, count, error } = await query
    .order("name", { ascending: true })
    .range(from, to)

  if (error) {
    console.error("Error fetching sites:", error)
    throw new Error(`Failed to fetch sites: ${error.message}`)
  }

  const formattedData: Site[] = (data || []).map((site) => ({
    ...site,
    organizationId: site.organization_id,
    createdAt: site.created_at,
    updatedAt: site.updated_at,
    organizationName: site.organization?.name,
    memberCount: site.site_members?.[0]?.count || 0,
  }))

  return {
    data: formattedData,
    meta: {
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  }
}
