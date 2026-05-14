"use client"

import * as React from "react"
import { Lock, Unlock, Layers, History, Settings } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter 
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Switch } from "@workspace/ui/components/switch"
import { type Device, type EventLog } from "./access-control-data"
import { EventRow } from "./event-row"

interface DeviceDetailSheetProps {
  device: Device | null
  onOpenChange: (open: boolean) => void
  onToggleLock: (id: string) => void
  logs: EventLog[]
  onLogClick: (log: EventLog) => void
}

export function DeviceDetailSheet({ 
  device, 
  onOpenChange, 
  onToggleLock, 
  logs,
  onLogClick
}: DeviceDetailSheetProps) {
  if (!device) return null

  return (
    <Sheet open={!!device} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white/50 dark:bg-white/5">
              <img src={device.imageUrl} alt={device.model} className="h-full w-full object-contain p-1" />
              <div className={cn(
                "absolute bottom-0 right-0 p-1 rounded-tl-lg shadow-sm",
                device.isLocked ? "bg-muted text-muted-foreground" : "bg-green-500 text-white"
              )}>
                {device.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </div>
            </div>
            <div>
              <SheetTitle>{device.name}</SheetTitle>
              <SheetDescription>
                {device.model} • {device.building}
              </SheetDescription>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Layers className="h-3 w-3" />
                <span>{device.floor} • Unit {device.unit}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Status Quick Actions */}
          <Card className="bg-accent/50 border-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Device Lock State</p>
                <p className="text-xs text-muted-foreground">Currently {device.isLocked ? "Secure" : "Unlocked"}</p>
              </div>
              <Button 
                variant={device.isLocked ? "default" : "outline"}
                className={cn(
                  "gap-2",
                  !device.isLocked && "border-green-500 text-green-600 hover:bg-green-50"
                )}
                onClick={() => onToggleLock(device.id)}
              >
                {device.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {device.isLocked ? "Unlock Door" : "Lock Door"}
              </Button>
            </CardContent>
          </Card>

          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Device Configuration</h3>
            
            <div className="space-y-4 rounded-xl border p-4 bg-background/50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Auto-Lock Delay</p>
                  <p className="text-xs text-muted-foreground">Time before door automatically secures.</p>
                </div>
                <Badge variant="outline">{device.config.autoLockDelay}s</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Sensitivity</p>
                  <p className="text-xs text-muted-foreground">Door sensor trigger sensitivity.</p>
                </div>
                <Badge variant="secondary">{device.config.sensitivity}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Failure Notifications</p>
                  <p className="text-xs text-muted-foreground">Alert admins on lock failures.</p>
                </div>
                <Switch checked={device.config.notifyOnFailure} />
              </div>
            </div>
          </div>

          {/* Device Health */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Battery Level</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${device.batteryLevel}%` }} 
                  />
                </div>
                <span className="text-xs font-bold">{device.batteryLevel}%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Signal Strength</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${device.signalStrength}%` }} 
                  />
                </div>
                <span className="text-xs font-bold">{device.signalStrength}%</span>
              </div>
            </div>
          </div>

          {/* Device Logs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Device Logs</h3>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1">
                <History className="h-3 w-3" />
                View All
              </Button>
            </div>
            <div className="space-y-1">
              {logs
                .filter(l => l.deviceId === device.id)
                .slice(0, 5)
                .map(log => <EventRow key={log.id} log={log} onClick={onLogClick} />)
              }
              {logs.filter(l => l.deviceId === device.id).length === 0 && (
                <p className="text-center py-8 text-xs text-muted-foreground italic">No recent logs for this device.</p>
              )}
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
