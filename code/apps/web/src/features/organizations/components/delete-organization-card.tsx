"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { deleteOrganizationAction } from "../actions/delete-organization"
import { Organization } from "../types"

interface DeleteOrganizationCardProps {
  organization: Organization
}

export function DeleteOrganizationCard({ organization }: DeleteOrganizationCardProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  
  const CONFIRMATION_TEXT = `delete ${organization.name}`

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteOrganizationAction(organization.id),
    onSuccess: () => {
      toast.success("Organization deleted successfully")
      router.push("/authenticated/organizations")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete organization")
    }
  })

  const isConfirmed = confirmText.toLowerCase() === CONFIRMATION_TEXT.toLowerCase()

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <CardTitle>Delete Organization</CardTitle>
        </div>
        <CardDescription>
          Permanently delete this organization and all of its data, including members, sites, and assets. This action is irreversible.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please type <span className="font-semibold text-foreground italic">{CONFIRMATION_TEXT}</span> to confirm.
          </p>
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRMATION_TEXT} 
            className="max-w-md" 
          />
        </div>
        <div className="flex justify-start">
          <Button 
            variant="destructive" 
            disabled={!isConfirmed || isPending}
            onClick={() => mutate()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Organization
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
