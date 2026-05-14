"use client"

import * as React from "react"
import { 
  Settings, 
  Video, 
  ShieldAlert, 
  History, 
  Trash2, 
  Power,
  RotateCw,
  Eye,
  Info
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
import { CctvCamera } from "./cctv-data"

interface CctvDetailSheetProps {
  camera: CctvCamera | null
  onOpenChange: (open: boolean) => void
}

export function CctvDetailSheet({ camera, onOpenChange }: CctvDetailSheetProps) {
  if (!camera) return null

  return (
    <Sheet open={!!camera} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0">
        <div className="flex h-full flex-col">
          {/* Header with Camera Preview */}
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <img src={camera.thumb} alt="" className="h-full w-full object-cover opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <Badge className="mb-2 bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                LIVE FEED
              </Badge>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{camera.name}</h2>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{camera.id} • {camera.location}</p>
            </div>
            <Button size="icon" variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/20">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {/* Stream Telemetry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stream Health</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">98.4%</span>
                  <div className="h-1.5 w-24 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Storage Left</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">1.2 TB</span>
                  <div className="h-1.5 w-24 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Device Settings */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Stream Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">Resolution & Framerate</p>
                      <p className="text-[10px] text-muted-foreground">3840x2160 @ 30fps (H.265)</p>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">AI Analytics (VA)</p>
                      <p className="text-[10px] text-muted-foreground">Motion, Loitering, Line-Crossing Active</p>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Device Info */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">System Metadata</h4>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Firmware</p>
                  <p className="text-xs font-bold">v4.2.1-SECURE</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground">MAC Address</p>
                  <p className="text-xs font-bold">00:1A:2B:3C:4D:5E</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground">IP Address</p>
                  <p className="text-xs font-bold">192.168.1.142</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-muted-foreground">Model</p>
                  <p className="text-xs font-bold font-mono">CC-XT5000-DOME</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto p-6 border-t bg-muted/20 flex gap-3">
            <Button variant="outline" className="flex-1 gap-2 h-11 text-xs font-bold uppercase border-red-500/20 text-red-500 hover:bg-red-500/10">
              <Power className="h-4 w-4" />
              Power Off
            </Button>
            <Button className="flex-1 gap-2 h-11 text-xs font-bold uppercase bg-primary shadow-lg shadow-primary/20">
              <Eye className="h-4 w-4" />
              View Archive
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
