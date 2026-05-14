"use client"

import { useForm } from "react-hook-form"
import { Floor, UpsertFloorData } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Save, Upload, Map as MapIcon } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface FloorDetailsProps {
  floor: Floor
  onSave: (data: UpsertFloorData) => void
  isPending?: boolean
}

export function FloorDetails({ floor, onSave, isPending }: FloorDetailsProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<UpsertFloorData>({
    defaultValues: {
      id: floor.id,
      buildingId: floor.buildingId,
      name: floor.name,
      levelNumber: floor.levelNumber || 0,
      orderIndex: floor.orderIndex || 0,
      floorPlanUrl: floor.floorPlanUrl || null,
    }
  })

  const floorPlanUrl = watch("floorPlanUrl")

  return (
    <div className="space-y-6 py-4">
      {/* Floor Plan Upload - Only for updates */}
      {floor.id && (
        <div className="p-4 rounded-xl bg-muted/20 border border-muted/20">
          <input type="hidden" {...register("floorPlanUrl")} />
          <ImageUpload 
            label="Floor Plan"
            value={floorPlanUrl}
            onChange={(url) => setValue("floorPlanUrl", url, { shouldDirty: true })}
            bucket={`org-${floor.organizationId}`}
            path={`sites/${floor.siteId}/buildings/${floor.buildingId}/floors/${floor.id}/floor-plan`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Floor Name</FieldLabel>
          <Input id="name" {...register("name", { required: "Name is required" })} placeholder="Level 1" />
          <FieldError errors={errors.name ? [errors.name] : []} />
        </Field>

        <Field>
          <FieldLabel htmlFor="levelNumber">Level Number</FieldLabel>
          <Input id="levelNumber" type="number" {...register("levelNumber", { valueAsNumber: true })} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Field>
           <FieldLabel htmlFor="orderIndex">Order Index</FieldLabel>
           <Input id="orderIndex" type="number" {...register("orderIndex", { valueAsNumber: true })} />
         </Field>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSubmit(onSave)} disabled={isPending || !isDirty} className="w-full sm:w-auto">
          {isPending ? "Saving..." : (
            <>
              <Save data-icon="inline-start" />
              Save Floor
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
