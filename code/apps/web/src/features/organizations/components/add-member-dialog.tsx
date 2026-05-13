"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMemberSchema, AddMemberValues } from "../schemas"
import { addOrganizationMemberAction } from "../actions/add-organization-member"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select"
import { MultiUserPicker } from "../../users/components/multi-user-picker"
import { Loader2, UserPlus, Shield } from "lucide-react"

interface AddMemberDialogProps {
  organizationId: string
  trigger?: React.ReactNode
}

export function AddMemberDialog({ organizationId, trigger }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userIds: [],
      role: "member",
    },
  })

  const selectedUsers = watch("userIds")
  const roleValue = watch("role")

  // This state is just to display selected users in the UI before they are saved
  const [selectedUserObjects, setSelectedUserObjects] = useState<any[]>([])

  async function onSubmit(values: AddMemberValues) {
    setIsPending(true)
    try {
      const result = await addOrganizationMemberAction(organizationId, values)
      toast.success(result.message)
      setOpen(false)
      reset()
      setSelectedUserObjects([])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add members")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="shadow-sm">
            <UserPlus className="size-4 mr-2" />
            Add Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-xl font-bold">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <UserPlus className="size-5" />
              </div>
              Add Members
            </DialogTitle>
            <DialogDescription className="text-base mt-1.5">
              Select one or more existing users to add to this organization.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <Field data-invalid={!!errors.userIds}>
              <FieldLabel className="text-sm font-semibold mb-2 block">Search and Select Users</FieldLabel>
              <MultiUserPicker
                selectedUsers={selectedUserObjects}
                onChange={(users) => {
                  setSelectedUserObjects(users)
                  setValue("userIds", users.map(u => u.id))
                }}
                placeholder="Search by name or email..."
              />
              <FieldError errors={errors.userIds ? [errors.userIds] : []} />
            </Field>

            <Field data-invalid={!!errors.role}>
              <FieldLabel className="text-sm font-semibold mb-2 block">Assign Initial Role</FieldLabel>
              <Select 
                onValueChange={(value) => setValue("role", value as any)} 
                defaultValue={roleValue}
              >
                <SelectTrigger id="role" className="bg-background/50 border-muted-foreground/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={errors.role ? [errors.role] : []} />
              <p className="text-[11px] text-muted-foreground mt-2 px-1">
                This role will be applied to all selected users. You can change individual roles later from the members table.
              </p>
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="border-muted-foreground/20">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || selectedUsers.length === 0} className="shadow-sm">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {selectedUsers.length > 0 ? `${selectedUsers.length} ` : ""}Member{selectedUsers.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
