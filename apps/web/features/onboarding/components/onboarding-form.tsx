"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldLabel, FieldDescription, FieldError } from "@workspace/ui/components/field"
import { useMutation } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { completeOnboarding } from "../actions"
import { useRouter } from "next/navigation"

const onboardingSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  orgName: z.string().min(2, "Organization name must be at least 2 characters."),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
})

type OnboardingValues = z.infer<typeof onboardingSchema>

export function OnboardingForm() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      orgName: "",
      slug: "",
    },
    mode: "onBlur",
  })

  // Auto-generate slug from org name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const value = e.target.value
    onChange(value)
    form.setValue("slug", value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""), { shouldValidate: true })
  }

  const mutation = useMutation({
    mutationFn: async (values: OnboardingValues) => {
      await completeOnboarding(values)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (signInError) throw signInError
    },
    onSuccess: () => {
      router.push("/authenticated")
    },
    onError: (err: any) => {
      setError(err.message || "Something went wrong")
    },
  })

  const onSubmit = (values: OnboardingValues) => {
    setError(null)
    mutation.mutate(values)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome to Motorola Dashboard</CardTitle>
        <CardDescription>
          You are the first user. Please set up your administrator account and organization.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="John" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Doe" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} placeholder="john.doe@motorola.com" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} placeholder="••••••••" />
                <FieldDescription>At least 8 characters long.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <hr className="border-border" />

          <Controller
            name="orgName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Organization Name</FieldLabel>
                <Input 
                  {...field} 
                  id={field.name} 
                  aria-invalid={fieldState.invalid} 
                  onChange={(e) => handleOrgNameChange(e, field.onChange)}
                  placeholder="Motorola Solutions" 
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Organization URL Slug</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="motorola-solutions" />
                <FieldDescription>Your dashboard will be at: domain.com/org/[slug]</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {error && <p className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || mutation.isPending}>
            {form.formState.isSubmitting || mutation.isPending ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
