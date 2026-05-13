import { useQuery } from "@tanstack/react-query"
import { getSitesAction } from "../actions/get-sites"
import { SiteFilters } from "../types"

export const SITES_QUERY_KEY = ["sites"]

export function useSites(filters: SiteFilters) {
  return useQuery({
    queryKey: [...SITES_QUERY_KEY, filters],
    queryFn: () => getSitesAction(filters),
  })
}
