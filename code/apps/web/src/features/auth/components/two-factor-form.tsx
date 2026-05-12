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
import { twoFactorSchema, TwoFactorInput } from "../schemas/two-factor-schema"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function TwoFactorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = (values: TwoFactorInput) => {
    console.log("2FA submitted:", values)
    // Implementation depends on Supabase 2FA flow (TOTP/OTP)
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
        <h2 className="text-2xl font-semibold tracking-tight text-white">Two-factor authentication</h2>
        <p className="text-sm text-zinc-400">
          Enter the 6-digit code from your authentication app.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="code">Authentication Code</FieldLabel>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="code"
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="pl-10 text-center text-2xl tracking-[0.5em]"
              {...register("code")}
            />
          </div>
          <FieldError errors={errors.code ? [errors.code] : []} />
        </Field>

        <Button
          type="submit"
          className="w-full"
        >
          Verify
        </Button>

        <p className="text-center text-xs text-zinc-500">
          Lost your device? <button className="text-primary hover:underline">Use a backup code</button>
        </p>
      </form>
    </div>
  )
}
