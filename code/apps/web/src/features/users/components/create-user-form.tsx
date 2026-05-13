"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, CreateUserValues } from "../schemas"
import { createUser } from "../actions/create-user"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Loader2, UserPlus, Mail, Lock, User, Shield } from "lucide-react"

export function CreateUserForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isSystemAdmin: false,
    },
  })

  async function onSubmit(values: CreateUserValues) {
    setIsPending(true)
    try {
      await createUser(values)
      toast.success("User created successfully")
      router.push("/authenticated/users")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create user")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <Card shadow="none">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <UserPlus className="size-4" />
            </div>
            <CardTitle className="text-xl">Create New User</CardTitle>
          </div>
          <CardDescription>
            Enter the details for the new user. They will be able to sign in immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Field data-invalid={!!errors.firstName}>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="firstName" className="pl-9" {...register("firstName")} placeholder="John" />
              </div>
              <FieldError errors={errors.firstName ? [errors.firstName] : []} />
            </Field>

            <Field data-invalid={!!errors.lastName}>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="lastName" className="pl-9" {...register("lastName")} placeholder="Doe" />
              </div>
              <FieldError errors={errors.lastName ? [errors.lastName] : []} />
            </Field>
          </div>

          <Field data-invalid={!!errors.displayName}>
            <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
            <Input id="displayName" {...register("displayName")} placeholder="John Doe" />
            <FieldError errors={errors.displayName ? [errors.displayName] : []} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input id="email" type="email" className="pl-9" {...register("email")} placeholder="john@example.com" />
            </div>
            <FieldError errors={errors.email ? [errors.email] : []} />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-9" {...register("password")} placeholder="••••••••" />
              </div>
              <FieldError errors={errors.password ? [errors.password] : []} />
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="confirmPassword" type="password" className="pl-9" {...register("confirmPassword")} placeholder="••••••••" />
              </div>
              <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : []} />
            </Field>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isSystemAdmin"
              type="checkbox"
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("isSystemAdmin")}
            />
            <FieldLabel htmlFor="isSystemAdmin" className="flex items-center gap-2 cursor-pointer">
              <Shield className="size-4 text-muted-foreground" />
              Grant System Administrator Access
            </FieldLabel>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-10">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create User
        </Button>
      </div>
    </form>
  )
}
