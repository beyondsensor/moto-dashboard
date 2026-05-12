"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldLabel, FieldDescription, FieldError } from "@workspace/ui/components/field"
import { OnboardingValues, onboardingSchema } from "../schemas"
import { useOnboardingMutation } from "../hooks/use-onboarding-mutation"

export function OnboardingForm() {
  const mutation = useOnboardingMutation()
  const error = mutation.error ? (mutation.error as any).message || "Something went wrong" : null

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    mode: "onBlur",
  })

  const onSubmit = (values: OnboardingValues) => {
    mutation.mutate(values)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome to Motorola Dashboard</CardTitle>
        <CardDescription>
          You are the first user. Please set up your administrator account to get started.
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
