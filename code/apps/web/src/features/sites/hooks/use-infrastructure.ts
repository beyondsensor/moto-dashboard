import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UpsertBuildingData, UpsertFloorData, UpsertZoneData } from "../types"
import { getSiteInfrastructureAction } from "../actions/get-site-infrastructure"
import { upsertBuildingAction } from "../actions/upsert-building"
import { upsertFloorAction } from "../actions/upsert-floor"
import { upsertFloorSeriesAction } from "../actions/upsert-floor-series"
import { upsertZoneAction } from "../actions/upsert-zone"
import { deleteInfrastructureAction } from "../actions/delete-infrastructure"
import { toast } from "sonner"

export const INFRASTRUCTURE_QUERY_KEY = ["infrastructure"]

export function useInfrastructure(siteId: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId],
    queryFn: () => getSiteInfrastructureAction(siteId),
  })

  const upsertBuilding = useMutation({
    mutationFn: (data: UpsertBuildingData) => upsertBuildingAction(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const upsertFloor = useMutation({
    mutationFn: (data: UpsertFloorData) => upsertFloorAction(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const upsertFloorSeries = useMutation({
    mutationFn: (data: UpsertFloorData[]) => upsertFloorSeriesAction(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const upsertZone = useMutation({
    mutationFn: (data: UpsertZoneData) => upsertZoneAction(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteItem = useMutation({
    mutationFn: ({ type, id }: { type: "building" | "floor" | "zone", id: string }) => 
      deleteInfrastructureAction(siteId, type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INFRASTRUCTURE_QUERY_KEY, siteId] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  return {
    query,
    upsertBuilding,
    upsertFloor,
    upsertFloorSeries,
    upsertZone,
    deleteItem,
  }
}
