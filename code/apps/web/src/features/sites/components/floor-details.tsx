"use client"

import { useForm } from "react-hook-form"
import { Floor } from "../types"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Layers, Save, Upload } from "lucide-react"

interface FloorDetailsProps {
  floor: Floor
  onSave: (data: any) => void
  isPending?: boolean
}

export function FloorDetails({ floor, onSave, isPending }: FloorDetailsProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      id: floor.id,
      buildingId: floor.buildingId,
      name: floor.name,
      levelNumber: floor.levelNumber || 0,
      orderIndex: floor.orderIndex || 0,
      floorPlanUrl: floor.floorPlanUrl || "",
    }
  })

  return (
    <div className="space-y-6 py-4">
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

      <Field>
        <FieldLabel>Floor Plan</FieldLabel>
        <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5">
           <Upload className="size-8 text-muted-foreground mb-2" />
           <p className="text-sm font-medium">Click to upload or drag and drop</p>
           <p className="text-xs text-muted-foreground mt-1">SVG, PNG, or JPG (max 5MB)</p>
           <Button variant="outline" size="sm" className="mt-4" type="button">
              Select File
           </Button>
        </div>
        {floor.floorPlanUrl && (
          <p className="text-xs text-muted-foreground mt-2 truncate">Current: {floor.floorPlanUrl}</p>
        )}
      </Field>

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
