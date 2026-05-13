"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Power, PowerOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { toggleOrganizationActiveAction } from "../actions/deactivate-organization"
import { Organization } from "../types"
import { useRouter } from "next/navigation"

interface DeactivateOrganizationCardProps {
  organization: Organization
}

export function DeactivateOrganizationCard({ organization }: DeactivateOrganizationCardProps) {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleOrganizationActiveAction(organization.id, organization.is_active),
    onSuccess: (updated) => {
      toast.success(`Organization ${updated.is_active ? "activated" : "deactivated"} successfully`)
      router.refresh()
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update organization status")
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {organization.is_active ? (
            <PowerOff className="size-5 text-orange-500" />
          ) : (
            <Power className="size-5 text-green-500" />
          )}
          <CardTitle>{organization.is_active ? "Deactivate" : "Activate"} Organization</CardTitle>
        </div>
        <CardDescription>
          {organization.is_active 
            ? "Temporarily disable access to this organization. Members will not be able to log in or access data until it is reactivated."
            : "Restore access to this organization and all its data for all members."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={organization.is_active ? "outline" : "default"} 
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {organization.is_active ? "Deactivate Organization" : "Activate Organization"}
        </Button>
      </CardContent>
    </Card>
  )
}
