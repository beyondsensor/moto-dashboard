"use client"

import React, { useState } from "react"
import { Building, Floor, Zone, UpsertFloorData } from "../types"
import { InfrastructureTree } from "./infrastructure-tree"
import { BuildingDetails } from "./building-details"
import { FloorDetails } from "./floor-details"
import { ZoneDetails } from "./zone-details"
import { InfrastructureOverview } from "./infrastructure-overview"
import { useInfrastructure } from "../hooks/use-infrastructure"
import { toast } from "sonner"
import { Building2, Layers, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { FloorSeriesForm } from "./floor-series-form"

type InfrastructureItem = Building | Floor | Zone

interface InfrastructureManagerProps {
  siteId: string
  initialData: Building[]
}

export function InfrastructureManager({ siteId, initialData }: InfrastructureManagerProps) {
  const [selected, setSelected] = useState<{ type: "building" | "floor" | "zone", item: InfrastructureItem } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const { 
    query, 
    upsertBuilding, 
    upsertFloor, 
    upsertFloorSeries, 
    upsertZone, 
    deleteItem 
  } = useInfrastructure(siteId)

  const buildings = query.data || initialData
  const isPending = upsertBuilding.isPending || 
                    upsertFloor.isPending || 
                    upsertFloorSeries.isPending || 
                    upsertZone.isPending || 
                    deleteItem.isPending

  const handleSelect = (type: "building" | "floor" | "zone", item: InfrastructureItem) => {
    setSelected({ type, item })
    setDialogOpen(true)
  }

  const handleAdd = (type: "building" | "floor" | "zone", parentId?: string) => {
    let newItem: InfrastructureItem
    if (type === "building") {
      newItem = { id: "", siteId, name: "", orderIndex: 0 } as Building
    } else if (type === "floor") {
      newItem = { id: "", buildingId: parentId || "", name: "", orderIndex: 0 } as Floor
    } else {
      newItem = { id: "", floorId: parentId || "", name: "", orderIndex: 0 } as Zone
    }
    
    setSelected({ type, item: newItem })
    setDialogOpen(true)
  }

  const handleDelete = async (type: "building" | "floor" | "zone", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? All nested items will also be removed.`)) return

    deleteItem.mutate({ type, id }, {
      onSuccess: () => {
        toast.success(`${type} deleted successfully`)
        if (selected?.item?.id === id) {
          setSelected(null)
          setDialogOpen(false)
        }
      }
    })
  }

  const handleSave = async (type: "building" | "floor" | "zone", itemData: any) => {
    const onSuccess = (result: InfrastructureItem) => {
      toast.success(`${type} saved successfully`)
      setSelected({ type, item: result })
      setDialogOpen(false)
    }

    if (type === "building") {
      upsertBuilding.mutate(itemData as Building, { onSuccess })
    } else if (type === "floor") {
      upsertFloor.mutate(itemData as Floor, { onSuccess })
    } else if (type === "zone") {
      upsertZone.mutate(itemData as Zone, { onSuccess })
    }
  }

  const handleSaveSeries = async (floors: UpsertFloorData[]) => {
    upsertFloorSeries.mutate(floors, {
      onSuccess: () => {
        toast.success(`${floors.length} floors created successfully`)
        setDialogOpen(false)
        setSelected(null)
      }
    })
  }

  const getDialogConfig = () => {
    if (!selected) return { title: "", description: "", icon: null }
    const isNew = !selected.item.id
    
    const config = {
      building: { 
        title: isNew ? "Add Building" : "Building Details", 
        description: "Configure physical building properties and location.",
        icon: <Building2 className="size-5" />
      },
      floor: { 
        title: isNew ? "Add Floor" : "Floor Details", 
        description: "Configure floor levels and layout plans.",
        icon: <Layers className="size-5" />
      },
      zone: { 
        title: isNew ? "Add Zone" : "Zone Details", 
        description: "Define logical zones within the floor layout.",
        icon: <MapPin className="size-5" />
      }
    }
    
    return config[selected.type]
  }

  const dialogConfig = getDialogConfig()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px]">
      {/* Sidebar Tree */}
      <div className="lg:col-span-4 xl:col-span-3 border-r pr-6 overflow-y-auto max-h-[calc(100vh-250px)]">
        <InfrastructureTree 
          buildings={buildings}
          selectedId={selected?.item?.id}
          selectedType={selected?.type}
          onSelect={handleSelect}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>

      {/* Main Content Area - Site Overview */}
      <div className="lg:col-span-8 xl:col-span-9 overflow-y-auto max-h-[calc(100vh-250px)] px-6 py-4">
        <InfrastructureOverview buildings={buildings} />
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                {dialogConfig.icon}
              </div>
              <div>
                <DialogTitle>{dialogConfig.title}</DialogTitle>
                <DialogDescription>{dialogConfig.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selected?.type === "building" && (
            <BuildingDetails building={selected.item as Building} onSave={(d) => handleSave("building", d)} isPending={isPending} />
          )}
          {selected?.type === "floor" && (
            <>
              {!selected.item.id ? (
                <Tabs defaultValue="single" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single Floor</TabsTrigger>
                    <TabsTrigger value="series">Add Series</TabsTrigger>
                  </TabsList>
                  <TabsContent value="single">
                    <FloorDetails floor={selected.item as Floor} onSave={(d) => handleSave("floor", d)} isPending={isPending} />
                  </TabsContent>
                  <TabsContent value="series">
                    <FloorSeriesForm buildingId={(selected.item as Floor).buildingId} onSave={handleSaveSeries} isPending={isPending} />
                  </TabsContent>
                </Tabs>
              ) : (
                <FloorDetails floor={selected.item as Floor} onSave={(d) => handleSave("floor", d)} isPending={isPending} />
              )}
            </>
          )}
          {selected?.type === "zone" && (
            <ZoneDetails zone={selected.item as Zone} onSave={(d) => handleSave("zone", d)} isPending={isPending} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
