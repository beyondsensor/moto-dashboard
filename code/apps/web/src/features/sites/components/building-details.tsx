"use client"

import { useForm } from "react-hook-form"
import { Building, UpsertBuildingData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { MapPin, Save } from "lucide-react"

interface BuildingDetailsProps {
  building: Building
  onSave: (data: UpsertBuildingData) => void
  isPending: boolean
}

export function BuildingDetails({ building, onSave, isPending }: BuildingDetailsProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<UpsertBuildingData>({
    defaultValues: {
      id: building.id,
      name: building.name,
      description: building.description || "",
      address: building.address || "",
      latitude: building.latitude || 0,
      longitude: building.longitude || 0,
      orderIndex: building.orderIndex || 0,
    }
  })

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Building Name</FieldLabel>
          <Input id="name" {...register("name", { required: "Name is required" })} placeholder="Main Tower" />
          <FieldError errors={errors.name ? [errors.name] : []} />
        </Field>

        <Field>
          <FieldLabel htmlFor="orderIndex">Order Index</FieldLabel>
          <Input id="orderIndex" type="number" {...register("orderIndex", { valueAsNumber: true })} />
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

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSubmit(onSave)} disabled={isPending || !isDirty} className="w-full sm:w-auto">
          {isPending ? "Saving..." : (
            <>
              <Save data-icon="inline-start" />
              Save Building
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
