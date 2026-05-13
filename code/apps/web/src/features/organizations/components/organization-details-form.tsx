"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOrganizationSchema, CreateOrganizationValues } from "../schemas"
import { updateOrganizationAction } from "../actions/update-organization"
import { Organization } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldDescription, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Globe, User, Mail, Phone, MapPin, Info } from "lucide-react"

interface OrganizationDetailsFormProps {
  organization: Organization
}

export function OrganizationDetailsForm({ organization }: OrganizationDetailsFormProps) {
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: CreateOrganizationValues) => updateOrganizationAction(organization.id, values),
    onSuccess: (updated) => {
      toast.success("Organization updated successfully")
      if (updated.slug !== organization.slug) {
        router.push(`/authenticated/organizations/${updated.slug}`)
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update organization")
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      profile: organization.profile || "",
      website: organization.website || "",
      address: organization.address || "",
      contact_name: organization.contact_name || "",
      contact_mobile: organization.contact_mobile || "",
      contact_email: organization.contact_email || "",
    },
  })

  const onSubmit = async (values: CreateOrganizationValues) => {
    await mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* General Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-5 text-primary" />
            <CardTitle>General Information</CardTitle>
          </div>
          <CardDescription>
            Update your organization's basic details and public presence.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Organization Name</FieldLabel>
              <Input id="name" {...register("name")} placeholder="Acme Corp" />
              <FieldError errors={errors.name ? [errors.name] : []} />
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Organization Slug</FieldLabel>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground select-none">/</span>
                <Input id="slug" className="pl-6" {...register("slug")} placeholder="acme-corp" />
              </div>
              <FieldError errors={errors.slug ? [errors.slug] : []} />
            </Field>
          </div>

          <Field data-invalid={!!errors.website}>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <div className="relative flex items-center">
              <Globe className="absolute left-3 size-4 text-muted-foreground" />
              <Input id="website" className="pl-9" {...register("website")} placeholder="https://acme.com" />
            </div>
            <FieldError errors={errors.website ? [errors.website] : []} />
          </Field>
        </CardContent>
      </Card>

      {/* Organization Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            <CardTitle>Organization Profile</CardTitle>
          </div>
          <CardDescription>
            Provide a brief description or profile of your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field data-invalid={!!errors.profile}>
            <FieldLabel htmlFor="profile">Profile / Description</FieldLabel>
            <Textarea 
              id="profile" 
              {...register("profile")} 
              placeholder="Tell us about your organization..."
              className="min-h-[120px] resize-none"
            />
            <FieldError errors={errors.profile ? [errors.profile] : []} />
          </Field>
        </CardContent>
      </Card>

      {/* Organization Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <CardTitle>Organization Address</CardTitle>
          </div>
          <CardDescription>
            The physical location or registered office address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field data-invalid={!!errors.address}>
            <FieldLabel htmlFor="address">Full Address</FieldLabel>
            <Textarea 
              id="address" 
              {...register("address")} 
              placeholder="123 Business Ave, Suite 100..."
              className="min-h-[100px] resize-none"
            />
            <FieldError errors={errors.address ? [errors.address] : []} />
          </Field>
        </CardContent>
      </Card>

      {/* Primary Contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            <CardTitle>Primary Contact Person</CardTitle>
          </div>
          <CardDescription>
            Details of the main person to contact regarding this organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Field data-invalid={!!errors.contact_name}>
            <FieldLabel htmlFor="contact_name">Full Name</FieldLabel>
            <div className="relative flex items-center">
              <User className="absolute left-3 size-4 text-muted-foreground" />
              <Input id="contact_name" className="pl-9" {...register("contact_name")} placeholder="John Doe" />
            </div>
            <FieldError errors={errors.contact_name ? [errors.contact_name] : []} />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field data-invalid={!!errors.contact_email}>
              <FieldLabel htmlFor="contact_email">Email Address</FieldLabel>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 size-4 text-muted-foreground" />
                <Input id="contact_email" className="pl-9" {...register("contact_email")} placeholder="john@acme.com" />
              </div>
              <FieldError errors={errors.contact_email ? [errors.contact_email] : []} />
            </Field>

            <Field data-invalid={!!errors.contact_mobile}>
              <FieldLabel htmlFor="contact_mobile">Mobile Number</FieldLabel>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 size-4 text-muted-foreground" />
                <Input id="contact_mobile" className="pl-9" {...register("contact_mobile")} placeholder="+1 234 567 890" />
              </div>
              <FieldError errors={errors.contact_mobile ? [errors.contact_mobile] : []} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-10">
        <Button type="submit" size="lg" disabled={isPending || !isDirty}>
          {isPending ? "Saving Changes..." : "Save All Changes"}
        </Button>
      </div>
    </form>
  )
}
