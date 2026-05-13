"use client"

import { useState, useTransition } from "react"
import { Building } from "../types"
import { InfrastructureTree } from "./infrastructure-tree"
import { BuildingDetails } from "./building-details"
import { FloorDetails } from "./floor-details"
import { ZoneDetails } from "./zone-details"
import { upsertBuildingAction } from "../actions/upsert-building"
import { upsertFloorAction } from "../actions/upsert-floor"
import { upsertZoneAction } from "../actions/upsert-zone"
import { deleteInfrastructureAction } from "../actions/delete-infrastructure"
import { toast } from "sonner"
import { LayoutDashboard } from "lucide-react"

interface InfrastructureManagerProps {
  siteId: string
  initialData: Building[]
}

export function InfrastructureManager({ siteId, initialData }: InfrastructureManagerProps) {
  // Use initialData as the base, in a real app you might want to sync this with a real-time subscription
  // or just rely on server revalidation which will refresh the initialData prop.
  const [selected, setSelected] = useState<{ type: "building" | "floor" | "zone", item: any } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSelect = (type: "building" | "floor" | "zone", item: any) => {
    setSelected({ type, item })
  }

  const handleAdd = (type: "building" | "floor" | "zone", parentId?: string) => {
    const newItem: any = { name: `New ${type}`, order_index: 0 }
    if (type === "floor") newItem.buildingId = parentId
    if (type === "zone") newItem.floorId = parentId
    setSelected({ type, item: newItem })
  }

  const handleDelete = async (type: "building" | "floor" | "zone", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? All nested items will also be removed.`)) return

    startTransition(async () => {
      try {
        await deleteInfrastructureAction(siteId, type, id)
        toast.success(`${type} deleted successfully`)
        if (selected?.item?.id === id) setSelected(null)
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  const handleSave = async (type: "building" | "floor" | "zone", itemData: any) => {
    startTransition(async () => {
      try {
        let result
        if (type === "building") result = await upsertBuildingAction(siteId, itemData)
        if (type === "floor") result = await upsertFloorAction(siteId, itemData)
        if (type === "zone") result = await upsertZoneAction(siteId, itemData)
        
        toast.success(`${type} saved successfully`)
        setSelected({ type, item: result })
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px]">
      {/* Sidebar Tree */}
      <div className="lg:col-span-4 xl:col-span-3 border-r pr-6 overflow-y-auto max-h-[calc(100vh-250px)]">
        <InfrastructureTree 
          buildings={initialData}
          selectedId={selected?.item?.id}
          selectedType={selected?.type}
          onSelect={handleSelect}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>

      {/* Detail View */}
      <div className="lg:col-span-8 xl:col-span-9 overflow-y-auto max-h-[calc(100vh-250px)] px-2">
        {selected ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {selected.type === "building" && (
              <BuildingDetails building={selected.item} onSave={(d) => handleSave("building", d)} isPending={isPending} />
            )}
            {selected.type === "floor" && (
              <FloorDetails floor={selected.item} onSave={(d) => handleSave("floor", d)} isPending={isPending} />
            )}
            {selected.type === "zone" && (
              <ZoneDetails zone={selected.item} onSave={(d) => handleSave("zone", d)} isPending={isPending} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-12 border-2 border-dashed rounded-2xl bg-muted/10">
            <LayoutDashboard className="size-16 mb-4 opacity-10" />
            <h3 className="text-xl font-semibold text-foreground">Infrastructure Editor</h3>
            <p className="text-sm max-w-sm mt-2 leading-relaxed">
              Select a building, floor, or zone from the sidebar tree to edit its properties or add new sub-entities.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
