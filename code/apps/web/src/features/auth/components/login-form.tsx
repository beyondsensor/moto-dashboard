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
import { loginSchema, LoginInput } from "../schemas/login-schema"
import { useAuth } from "../hooks/use-auth"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit = (values: LoginInput) => {
    login.mutate(values)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
        <p className="text-sm text-zinc-400">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {login.data?.error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {login.data.error}
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
              disabled={login.isPending}
              className="pl-10"
              {...register("email")}
            />
          </div>
          <FieldError errors={errors.email ? [errors.email] : []} />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={login.isPending}
              className="pl-10"
              {...register("password")}
            />
          </div>
          <FieldError errors={errors.password ? [errors.password] : []} />
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
