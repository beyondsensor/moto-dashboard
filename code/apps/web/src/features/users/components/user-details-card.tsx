"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { UserDetail } from "../types"
import { updateUser } from "../actions/update-user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Loader2, User } from "lucide-react"

const userDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
})

type UserDetailsValues = z.infer<typeof userDetailsSchema>

interface UserDetailsCardProps {
  user: UserDetail
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<UserDetailsValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      displayName: user.displayName || "",
    },
  })

  async function onSubmit(values: UserDetailsValues) {
    setIsPending(true)
    try {
      await updateUser(user.id, values)
      toast.success("User details updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user details")
    } finally {
      setIsPending(false)
    }
  }

  const isDirty = form.formState.isDirty

  return (
    <Card shadow="none">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <User className="size-4" />
          </div>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </div>
        <CardDescription>Update the user's name and display name.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.firstName}>
              <FieldLabel>First Name</FieldLabel>
              <Input {...form.register("firstName")} disabled={isPending} />
              <FieldError errors={form.formState.errors.firstName ? [form.formState.errors.firstName] : []} />
            </Field>
            <Field data-invalid={!!form.formState.errors.lastName}>
              <FieldLabel>Last Name</FieldLabel>
              <Input {...form.register("lastName")} disabled={isPending} />
              <FieldError errors={form.formState.errors.lastName ? [form.formState.errors.lastName] : []} />
            </Field>
          </div>
          <Field data-invalid={!!form.formState.errors.displayName}>
            <FieldLabel>Display Name</FieldLabel>
            <Input {...form.register("displayName")} disabled={isPending} />
            <FieldError errors={form.formState.errors.displayName ? [form.formState.errors.displayName] : []} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
