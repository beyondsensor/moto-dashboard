"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createSiteSchema, updateSiteSchema, UpdateSiteValues, siteFormSchema, SiteFormValues } from "../schemas"
import { useSiteMutations } from "../hooks/use-site-mutations"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

interface SiteFormProps {
  initialData?: UpdateSiteValues
  organizations: { id: string, name: string }[]
}

export function SiteForm({ initialData, organizations }: SiteFormProps) {
  const router = useRouter()
  const { createMutation, updateMutation } = useSiteMutations()
  const isPending = createMutation.isPending || updateMutation.isPending
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      organizationId: organizations.length === 1 ? organizations[0]?.id : "",
      address: "",
      notes: "",
    },
  })

  const onSubmit = (values: SiteFormValues) => {
    if (isEditing && initialData) {
      updateMutation.mutate({ ...values, id: initialData.id } as UpdateSiteValues)
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm shadow-xl border-muted/20">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Site" : "Create New Site"}</CardTitle>
        <CardDescription>
          Sites represent physical locations or facilities within an organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field data-invalid={!!errors.organizationId}>
              <FieldLabel htmlFor="organizationId">Organization</FieldLabel>
              <Select 
                defaultValue={watch("organizationId")}
                onValueChange={(val) => setValue("organizationId", val, { shouldValidate: true })}
                disabled={isEditing}
              >
                <SelectTrigger id="organizationId" className="bg-background/50">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={errors.organizationId ? [errors.organizationId] : []} />
            </Field>

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Site Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Main Factory"
                className="bg-background/50"
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : []} />
            </Field>

            <Field data-invalid={!!errors.code}>
              <FieldLabel htmlFor="code">Site Code (Optional)</FieldLabel>
              <Input
                id="code"
                placeholder="e.g. FACT-01"
                className="bg-background/50"
                {...register("code")}
              />
              <FieldError errors={errors.code ? [errors.code] : []} />
            </Field>

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                id="address"
                placeholder="123 Industrial Way..."
                className="bg-background/50"
                {...register("address")}
              />
              <FieldError errors={errors.address ? [errors.address] : []} />
            </Field>
          </div>

          <Field data-invalid={!!errors.notes}>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Any additional information about this site..."
              className="bg-background/50 min-h-[100px]"
              {...register("notes")}
            />
            <FieldError errors={errors.notes ? [errors.notes] : []} />
          </Field>

          <div className="flex justify-end gap-3 pt-4 border-t border-muted/20">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="px-8">
              {isPending ? "Saving..." : isEditing ? "Update Site" : "Create Site"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
