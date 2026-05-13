import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSiteAction } from "../actions/create-site"
import { updateSiteAction } from "../actions/update-site"
import { deleteSiteAction } from "../actions/delete-site"
import { CreateSiteValues, UpdateSiteValues } from "../schemas"
import { SITES_QUERY_KEY } from "./use-sites"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function useSiteMutations() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const createMutation = useMutation({
    mutationFn: (values: CreateSiteValues) => createSiteAction(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY })
      toast.success("Site created successfully")
      router.push("/authenticated/sites")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create site")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: UpdateSiteValues) => updateSiteAction(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY })
      toast.success("Site updated successfully")
      router.push("/authenticated/sites")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update site")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSiteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY })
      toast.success("Site deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete site")
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
