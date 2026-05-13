"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrganizationSchema, CreateOrganizationValues } from "../schemas"
import { createOrganizationAction } from "../actions/create-organization"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldDescription, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"

export function CreateOrganizationForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  const onSubmit = async (values: CreateOrganizationValues) => {
    setIsPending(true)
    setError(null)
    try {
      await createOrganizationAction(values)
      router.push("/authenticated/organizations")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
        <CardDescription>
          Organizations are the top-level entity in the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Organization Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Acme Corp"
              {...register("name", {
                onChange: (e) => {
                  const val = e.target.value
                  const generatedSlug = val
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]+/g, "")
                  setValue("slug", generatedSlug, { shouldValidate: true })
                },
              })}
            />
            <FieldDescription>
              The display name of your organization.
            </FieldDescription>
            <FieldError errors={errors.name ? [errors.name] : []} />
          </Field>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="slug">Organization Slug</FieldLabel>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground select-none">/</span>
              <Input
                id="slug"
                className="pl-6"
                placeholder="acme-corp"
                {...register("slug")}
              />
            </div>
            <FieldDescription>
              Used in the URL of your organization. Must be unique.
            </FieldDescription>
            <FieldError errors={errors.slug ? [errors.slug] : []} />
          </Field>


          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
