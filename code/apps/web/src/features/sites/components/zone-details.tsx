"use client"

import { useForm } from "react-hook-form"
import { Zone, UpsertZoneData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { MapPin, Save } from "lucide-react"

interface ZoneDetailsProps {
  zone: Zone
  onSave: (data: UpsertZoneData) => void
  isPending?: boolean
}

export function ZoneDetails({ zone, onSave, isPending }: ZoneDetailsProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      id: zone.id,
      floorId: zone.floorId,
      name: zone.name,
      description: zone.description || "",
      orderIndex: zone.orderIndex || 0,
    }
  })

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Zone Name</FieldLabel>
          <Input id="name" {...register("name", { required: "Name is required" })} placeholder="Lobby North" />
          <FieldError errors={errors.name ? [errors.name] : []} />
        </Field>

        <Field>
          <FieldLabel htmlFor="orderIndex">Order Index</FieldLabel>
          <Input id="orderIndex" type="number" {...register("orderIndex", { valueAsNumber: true })} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea id="description" {...register("description")} placeholder="Describe the purpose of this zone..." className="min-h-[120px] resize-none" />
      </Field>
      
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
         <MapPin className="size-10 text-primary/40 mb-3" />
         <p className="text-sm font-semibold">Visual Zone Editor</p>
         <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
            The visual zone editor allows you to draw and position zones directly on the floor plan.
         </p>
         <Button variant="outline" size="sm" className="mt-4" type="button" disabled>
            Open Visual Editor
         </Button>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSubmit(onSave)} disabled={isPending || !isDirty} className="w-full sm:w-auto">
          {isPending ? "Saving..." : (
            <>
              <Save data-icon="inline-start" />
              Save Zone
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
