import { z } from "zod"

export const siteFiltersSchema = z.object({
  search: z.string().optional(),
  organizationId: z.string().optional(),
  view: z.enum(["list", "grid"]).default("grid"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(12),
})

export type SiteFilters = z.infer<typeof siteFiltersSchema>

export interface Site {
  id: string
  organizationId: string
  name: string
  code?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  mapImageUrl?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  organizationName?: string
  memberCount?: number
}

export interface SiteMember {
  id: string
  siteId: string
  userId: string
  role: 'manager' | 'editor' | 'viewer'
  createdAt: string
  updatedAt: string
  user?: {
    email: string
    displayName?: string
    avatarUrl?: string
  }
}

export interface Building {
  id: string
  siteId: string
  organizationId: string
  name: string
  description?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  orderIndex: number
  exteriorImageUrl?: string | null
  sitePlanUrl?: string | null
  floors?: Floor[]
}

export interface Floor {
  id: string
  buildingId: string
  siteId: string
  organizationId: string
  name: string
  levelNumber?: number | null
  orderIndex: number
  floorPlanUrl?: string | null
  zones?: Zone[]
}

export interface Zone {
  id: string
  floorId: string
  name: string
  description?: string | null
  orderIndex: number
}

export interface UpsertBuildingData {
  id?: string
  name: string
  description?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  orderIndex?: number
  exteriorImageUrl?: string | null
  sitePlanUrl?: string | null
}

export interface UpsertFloorData {
  id?: string
  buildingId: string
  name: string
  levelNumber?: number | null
  orderIndex?: number
  floorPlanUrl?: string | null
}

export interface UpsertZoneData {
  id?: string
  floorId: string
  name: string
  description?: string | null
  orderIndex?: number
}
