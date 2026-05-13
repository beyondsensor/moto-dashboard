"use client"

import { useForm } from "react-hook-form"
import { Building } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Building2, MapPin, Save } from "lucide-react"

interface BuildingDetailsProps {
  building: Building
  onSave: (data: any) => void
  isPending?: boolean
}

export function BuildingDetails({ building, onSave, isPending }: BuildingDetailsProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      id: building.id,
      name: building.name,
      description: building.description || "",
      address: building.address || "",
      latitude: building.latitude || 0,
      longitude: building.longitude || 0,
      order_index: building.orderIndex || 0,
    }
  })

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <CardTitle>Building Details</CardTitle>
              <CardDescription>Configure physical building properties.</CardDescription>
            </div>
          </div>
          <Button onClick={handleSubmit(onSave)} disabled={isPending || !isDirty} className="w-full sm:w-auto">
            {isPending ? "Saving..." : (
              <>
                <Save data-icon="inline-start" />
                Save Building
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Building Name</FieldLabel>
            <Input id="name" {...register("name", { required: "Name is required" })} placeholder="Main Tower" />
            <FieldError errors={errors.name ? [errors.name] : []} />
          </Field>

          <Field>
            <FieldLabel htmlFor="order_index">Order Index</FieldLabel>
            <Input id="order_index" type="number" {...register("order_index", { valueAsNumber: true })} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" {...register("description")} placeholder="Optional description..." className="min-h-[100px] resize-none" />
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Textarea id="address" className="pl-9 min-h-[80px] resize-none" {...register("address")} placeholder="Full address of the building..." />
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Field>
             <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
             <Input id="latitude" type="number" step="any" {...register("latitude", { valueAsNumber: true })} />
           </Field>
           <Field>
             <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
             <Input id="longitude" type="number" step="any" {...register("longitude", { valueAsNumber: true })} />
           </Field>
        </div>
      </CardContent>
    </Card>
  )
}
