"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { resetPasswordSchema, ResetPasswordInput } from "../schemas/reset-password-schema"
import { useAuth } from "../hooks/use-auth"
import { Lock } from "lucide-react"

export function ResetPasswordForm() {
  const { resetPassword } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: ResetPasswordInput) => {
    resetPassword.mutate(values)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Set new password</h2>
        <p className="text-sm text-zinc-400">
          Your new password must be different from previous passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {resetPassword.data?.error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {resetPassword.data.error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              disabled={resetPassword.isPending}
              className="pl-10"
              {...register("password")}
            />
          </div>
          <FieldError errors={errors.password ? [errors.password] : []} />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              disabled={resetPassword.isPending}
              className="pl-10"
              {...register("confirmPassword")}
            />
          </div>
          <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : []} />
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  )
}
