"use client"

import * as React from "react"
import { Activity, History, AlertTriangle, Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { type EventLog } from "./access-control-data"

interface EventDetailSheetProps {
  log: EventLog | null
  onOpenChange: (open: boolean) => void
}

export function EventDetailSheet({ log, onOpenChange }: EventDetailSheetProps) {
  if (!log) return null

  return (
    <Sheet open={!!log} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-sm">
        <div className="flex h-full flex-col">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border",
                log.status === "failure" ? "bg-red-500/10 text-red-500" : 
                log.status === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
              )}>
                {log.status === "failure" ? <AlertTriangle className="h-5 w-5" /> : 
                 log.status === "warning" ? <History className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
              </div>
              <div>
                <SheetTitle className="text-sm">Event Record</SheetTitle>
                <SheetDescription className="text-xs">Log ID: {log.id}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 px-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Type</p>
              <p className="text-lg font-bold leading-tight">{log.event}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Device</p>
                <p className="text-xs font-medium">{log.deviceName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personnel Involved</p>
              {log.person ? (
                <div className="flex items-center gap-3 rounded-xl border p-3 bg-background/50">
                  <img src={log.person.avatar} alt="" className="h-10 w-10 rounded-full border" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{log.person.name}</p>
                    <p className="text-[10px] text-muted-foreground">{log.person.role} • {log.person.department}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed p-3 bg-muted/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">Automated System</p>
                    <p className="text-[10px] text-muted-foreground">Autonomous Device Action</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</p>
                <p className="text-xs font-medium">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                <Badge variant={log.status === "success" ? "default" : "outline"} className={cn(
                  "text-[10px] h-5",
                  log.status === "success" && "bg-green-500",
                  log.status === "failure" && "text-red-500 border-red-500",
                  log.status === "warning" && "text-amber-500 border-amber-500"
                )}>
                  {log.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 rounded-xl bg-accent/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trace Metadata</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Session ID</span>
                  <span className="font-mono">SID-2026-990-X</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Protocol</span>
                  <span className="font-mono">MQTT over TLS</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-mono text-green-500">12ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t">
            <Button className="w-full gap-2" variant="outline">
              <Search className="h-4 w-4" />
              Find Related Events
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
