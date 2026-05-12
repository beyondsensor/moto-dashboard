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
import { forgotPasswordSchema, ForgotPasswordInput } from "../schemas/forgot-password-schema"
import { useAuth } from "../hooks/use-auth"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotPassword.mutate(values)
  }

  if (forgotPassword.data?.success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Check your email</h2>
          <p className="text-sm text-zinc-400">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Forgot password?</h2>
        <p className="text-sm text-zinc-400">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {forgotPassword.data?.error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {forgotPassword.data.error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={forgotPassword.isPending}
              className="pl-10"
              {...register("email")}
            />
          </div>
          <FieldError errors={errors.email ? [errors.email] : []} />
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? "Sending link..." : "Reset password"}
        </Button>
      </form>
    </div>
  )
}
