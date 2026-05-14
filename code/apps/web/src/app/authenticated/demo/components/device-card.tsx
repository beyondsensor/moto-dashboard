"use client"

import * as React from "react"
import { Lock, Unlock, Layers } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Switch } from "@workspace/ui/components/switch"
import { type Device } from "./access-control-data"

interface DeviceCardProps {
  device: Device
  onToggleLock: (id: string) => void
  onClick: (device: Device) => void
}

export function DeviceCard({ device, onToggleLock, onClick }: DeviceCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-md cursor-pointer border-primary/5 bg-background/50 backdrop-blur-sm",
        !device.isLocked && "border-green-500/30 ring-1 ring-green-500/20"
      )}
      onClick={() => onClick(device)}
    >
      <CardHeader className="p-3 pb-1 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white/50 dark:bg-white/5">
              <img src={device.imageUrl} alt="" className="h-full w-full object-contain p-1" />
              <div className={cn(
                "absolute bottom-0 right-0 p-1 rounded-tl-md shadow-sm",
                device.isLocked ? "bg-muted text-muted-foreground" : "bg-green-500 text-white"
              )}>
                {device.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </div>
            </div>
            <div className="min-w-0">
              <CardTitle className="text-[11px] font-bold truncate leading-tight">{device.name}</CardTitle>
              <CardDescription className="text-[9px] uppercase tracking-tighter opacity-70 truncate">{device.model}</CardDescription>
            </div>
          </div>
          <Badge variant={device.isLocked ? "secondary" : "default"} className={cn(
            "text-[8px] px-1 h-4 font-black tracking-tighter shrink-0",
            !device.isLocked && "bg-green-500 hover:bg-green-600 border-none"
          )}>
            {device.isLocked ? "LCK" : "OPN"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 relative z-10">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1 truncate opacity-80">
            <Layers className="h-2.5 w-2.5" />
            <span className="truncate">F{device.floor.split(" ")[1]} • U{device.unit}</span>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Switch
              checked={!device.isLocked}
              onCheckedChange={() => onToggleLock(device.id)}
              className="scale-[0.6] origin-right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
