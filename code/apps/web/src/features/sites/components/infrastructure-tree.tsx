"use client"

import React from "react"
import { Building, Floor, Zone } from "../types"
import { cn } from "@workspace/ui/lib/utils"
import { Building2, Layers, MapPin, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible"

interface InfrastructureTreeProps {
  buildings: Building[]
  selectedId?: string
  selectedType?: "building" | "floor" | "zone"
  onSelect: (type: "building" | "floor" | "zone", item: InfrastructureItem) => void
  onAdd: (type: "building" | "floor" | "zone", parentId?: string) => void
  onDelete: (type: "building" | "floor" | "zone", id: string) => void
}

export function InfrastructureTree({
  buildings,
  selectedId,
  selectedType,
  onSelect,
  onAdd,
  onDelete
}: InfrastructureTreeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Infrastructure</h3>
        <Button variant="ghost" size="icon" className="size-6" onClick={() => onAdd("building")}>
          <Plus className="size-3" />
        </Button>
      </div>
      <div className="space-y-1">
        {buildings.map((building) => (
          <BuildingNode 
            key={building.id} 
            building={building} 
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={onSelect}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        ))}
        {buildings.length === 0 && (
          <div className="p-4 text-center border-2 border-dashed rounded-lg text-xs text-muted-foreground">
            No buildings added yet. Click + to start.
          </div>
        )}
      </div>
    </div>
  )
}

type InfrastructureItem = Building | Floor | Zone

interface NodeProps {
  selectedId?: string
  selectedType?: "building" | "floor" | "zone"
  onSelect: (type: "building" | "floor" | "zone", item: InfrastructureItem) => void
  onAdd: (type: "building" | "floor" | "zone", parentId?: string) => void
  onDelete: (type: "building" | "floor" | "zone", id: string) => void
}

function BuildingNode({ 
  building, 
  selectedId, 
  selectedType, 
  onSelect, 
  onAdd, 
  onDelete 
}: NodeProps & { building: Building }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const isSelected = selectedId === building.id && selectedType === "building"

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/node">
      <div className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
        isSelected ? "bg-primary/10 text-primary shadow-sm border border-primary/20" : "hover:bg-muted"
      )}>
        <CollapsibleTrigger asChild>
          <div className="p-0.5 hover:bg-muted rounded transition-colors cursor-pointer">
            <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
          </div>
        </CollapsibleTrigger>
        <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => onSelect("building", building)}>
          <Building2 className="size-4 shrink-0" />
          <span className="text-sm font-semibold truncate">{building.name}</span>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="icon" className="size-6 hover:bg-primary/20" onClick={(e) => { e.stopPropagation(); onAdd("floor", building.id); }}>
             <Plus className="size-3" />
           </Button>
           <Button variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete("building", building.id); }}>
             <Trash2 className="size-3" />
           </Button>
        </div>
      </div>
      <CollapsibleContent className="pl-6 space-y-1 mt-1 border-l-2 border-muted ml-3.5">
        {building.floors?.map((floor) => (
          <FloorNode 
            key={floor.id} 
            floor={floor} 
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={onSelect}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function FloorNode({ 
  floor, 
  selectedId, 
  selectedType, 
  onSelect, 
  onAdd, 
  onDelete 
}: NodeProps & { floor: Floor }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isSelected = selectedId === floor.id && selectedType === "floor"

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/node">
      <div className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
        isSelected ? "bg-primary/10 text-primary shadow-sm border border-primary/20" : "hover:bg-muted"
      )}>
        <CollapsibleTrigger asChild>
          <div className="p-0.5 hover:bg-muted rounded transition-colors cursor-pointer">
            <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
          </div>
        </CollapsibleTrigger>
        <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => onSelect("floor", floor)}>
          <Layers className="size-4 shrink-0" />
          <span className="text-sm font-medium truncate">{floor.name}</span>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="icon" className="size-6 hover:bg-primary/20" onClick={(e) => { e.stopPropagation(); onAdd("zone", floor.id); }}>
             <Plus className="size-3" />
           </Button>
           <Button variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete("floor", floor.id); }}>
             <Trash2 className="size-3" />
           </Button>
        </div>
      </div>
      <CollapsibleContent className="pl-6 space-y-1 mt-1 border-l-2 border-muted/50 ml-3.5">
        {floor.zones?.map((zone) => (
          <div 
            key={zone.id}
            onClick={() => onSelect("zone", zone)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
              selectedId === zone.id && selectedType === "zone" ? "bg-primary/10 text-primary shadow-sm border border-primary/20" : "hover:bg-muted"
            )}
          >
            <MapPin className="size-3.5 shrink-0" />
            <span className="text-sm truncate">{zone.name}</span>
            <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete("zone", zone.id); }}>
                 <Trash2 className="size-3" />
               </Button>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
