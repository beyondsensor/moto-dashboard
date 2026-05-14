"use client"

import { useForm } from "react-hook-form"
import { Building, UpsertBuildingData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { MapPin, Save, Globe, FileText } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface BuildingDetailsProps {
  building: Building
  onSave: (data: UpsertBuildingData) => void
  isPending: boolean
}

export function BuildingDetails({ building, onSave, isPending }: BuildingDetailsProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<UpsertBuildingData>({
    defaultValues: {
      id: building.id,
      name: building.name,
      description: building.description || "",
      address: building.address || "",
      latitude: building.latitude || 0,
      longitude: building.longitude || 0,
      orderIndex: building.orderIndex || 0,
      exteriorImageUrl: building.exteriorImageUrl || null,
      sitePlanUrl: building.sitePlanUrl || null,
    }
  })

  const exteriorImageUrl = watch("exteriorImageUrl")
  const sitePlanUrl = watch("sitePlanUrl")

  return (
    <div className="space-y-6 py-4">
      {/* Image Management Section - Only for updates */}
      {building.id && (
        <div className="grid grid-cols-1 gap-6 p-4 rounded-xl bg-muted/20 border border-muted/20">
          <input type="hidden" {...register("exteriorImageUrl")} />
          <input type="hidden" {...register("sitePlanUrl")} />
          <ImageUpload 
            label="Exterior View"
            value={exteriorImageUrl}
            onChange={(url) => setValue("exteriorImageUrl", url, { shouldDirty: true })}
            bucket={`org-${building.organizationId}`}
            path={`sites/${building.siteId}/buildings/${building.id}/exterior`}
          />
          <ImageUpload 
            label="Site Plan"
            value={sitePlanUrl}
            onChange={(url) => setValue("sitePlanUrl", url, { shouldDirty: true })}
            bucket={`org-${building.organizationId}`}
            path={`sites/${building.siteId}/buildings/${building.id}/site-plan`}
          />
        </div>
      )}

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
