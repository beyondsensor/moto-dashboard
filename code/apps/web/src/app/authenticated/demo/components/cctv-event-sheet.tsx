"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Camera, 
  Maximize2, 
  Share2, 
  Download,
  AlertTriangle,
  History,
  Play
} from "lucide-react"
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
import { cn } from "@workspace/ui/lib/utils"
import { VAEvent } from "./cctv-data"

interface CctvEventSheetProps {
  event: VAEvent | null
  onOpenChange: (open: boolean) => void
}

export function CctvEventSheet({ event, onOpenChange }: CctvEventSheetProps) {
  if (!event) return null

  return (
    <Sheet open={!!event} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0">
        <div className="flex h-full flex-col">
          {/* Incident Snapshot */}
          <div className="relative aspect-video w-full overflow-hidden bg-black group">
            <img src={event.snapshot} alt="" className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Playback Overlay (Mock) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </div>

            <div className="absolute bottom-4 left-6">
              <Badge className={cn(
                "mb-2 font-black border-none",
                event.severity === "critical" ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" :
                event.severity === "warning" ? "bg-amber-500 text-black" : "bg-blue-500 text-white"
              )}>
                {event.type.replace("-", " ").toUpperCase()} DETECTED
              </Badge>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Security Incident</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {/* Event Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detection Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Severity Level</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    "h-3.5 w-3.5",
                    event.severity === "critical" ? "text-red-500" : "text-amber-500"
                  )} />
                  <span className="text-xs font-bold uppercase">{event.severity}</span>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Source Camera Info */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Detection Source</h4>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-accent/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold">{event.cameraName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{event.cameraId}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Insights (Mock) */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">AI Analytic Insight</h4>
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/10">
                <p className="text-xs leading-relaxed text-foreground/80">
                  {event.type === "motion" && "Atypical movement pattern detected in secure zone after hours. Heatmap indicates focus on entrance hardware."}
                  {event.type === "weapon-detected" && "CRITICAL: Object matching visual signature of a sidearm detected. Accuracy score: 98.4%. Standard response protocol initiated."}
                  {event.type === "loitering" && "Person detected in restricted corridor for > 300 seconds. Subject appears to be testing multiple door handles."}
                  {event.type === "line-crossing" && "Unauthorized crossing of perimeter line detected. Subject direction: North-to-South."}
                  {event.type === "object-removed" && "Static object 'Server Component' is no longer detected in predefined bounding box."}
                </p>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Action History */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Incident Timeline</h4>
              <div className="space-y-4 pl-2">
                <div className="relative border-l pl-4 pb-1">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-xs font-bold uppercase tracking-tight">VA Trigger: {event.type.replace("-", " ")}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()} • System</p>
                </div>
                <div className="relative border-l pl-4 pb-1 opacity-50">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
                  <p className="text-xs font-bold uppercase tracking-tight">Awaiting Operator Review</p>
                  <p className="text-[10px] text-muted-foreground">Pending Action</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-auto p-6 border-t bg-muted/20 flex gap-3">
            <Button variant="outline" className="flex-1 gap-2 h-11 text-xs font-bold uppercase">
              <Share2 className="h-4 w-4" />
              Dispatch
            </Button>
            <Button className="flex-1 gap-2 h-11 text-xs font-bold uppercase bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20">
              <ShieldAlert className="h-4 w-4" />
              Mark Resolved
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
