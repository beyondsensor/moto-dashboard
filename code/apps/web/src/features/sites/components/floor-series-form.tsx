"use client"

import React, { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Save, Info } from "lucide-react"

interface FloorSeriesFormProps {
  buildingId: string
  onSave: (data: any[]) => void
  isPending?: boolean
}

export function FloorSeriesForm({ buildingId, onSave, isPending }: FloorSeriesFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      prefix: "Level ",
      startLevel: 1,
      endLevel: 5,
      orderIndexStart: 0,
    }
  })

  const formValues = useWatch({ control })
  const { prefix, startLevel, endLevel, orderIndexStart } = formValues

  const preview = useMemo(() => {
    const start = Number(startLevel) || 0
    const end = Number(endLevel) || 0
    const ordStart = Number(orderIndexStart) || 0
    
    if (end < start) return []
    
    const floors = []
    for (let i = start; i <= end; i++) {
      floors.push({
        buildingId,
        name: `${prefix || ""}${i}`,
        levelNumber: i,
        orderIndex: ordStart + (i - start)
      })
    }
    return floors
  }, [buildingId, prefix, startLevel, endLevel, orderIndexStart])

  const onSubmit = () => {
    onSave(preview)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="prefix">Name Prefix</FieldLabel>
          <Input id="prefix" {...register("prefix")} placeholder="Level " />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="startLevel">Start Level</FieldLabel>
            <Input id="startLevel" type="number" {...register("startLevel", { valueAsNumber: true })} />
          </Field>
          <Field>
            <FieldLabel htmlFor="endLevel">End Level</FieldLabel>
            <Input id="endLevel" type="number" {...register("endLevel", { valueAsNumber: true })} />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="orderIndexStart">Order Index Start</FieldLabel>
          <Input id="orderIndexStart" type="number" {...register("orderIndexStart", { valueAsNumber: true })} />
        </Field>
      </div>

      <div className="bg-muted/30 rounded-xl p-4 border border-muted/50">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
          <Info className="size-4" />
          Preview ({preview.length} floors)
        </div>
        <div className="flex flex-wrap gap-2">
          {preview.map((f, i) => (
            <div key={i} className="px-2 py-1 bg-background border rounded text-xs font-medium">
              {f.name}
            </div>
          ))}
          {preview.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No floors will be generated. Check your start/end levels.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSubmit(onSubmit)} disabled={isPending || preview.length === 0} className="w-full sm:w-auto">
          {isPending ? "Creating..." : (
            <>
              <Save data-icon="inline-start" />
              Create {preview.length} Floors
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
