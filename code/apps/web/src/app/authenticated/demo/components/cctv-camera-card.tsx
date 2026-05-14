"use client"

import * as React from "react"
import { Shield, Maximize2, Settings, Wifi, Radio, Clock } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { CctvCamera } from "./cctv-data"

interface CctvCameraCardProps {
  camera: CctvCamera
  onSelect: (camera: CctvCamera) => void
}

export function CctvCameraCard({ camera, onSelect }: CctvCameraCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div 
      className="group relative aspect-video overflow-hidden rounded-xl border bg-black transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(camera)}
    >
      {/* Video Feed Placeholder */}
      <img 
        src={camera.thumb} 
        alt={camera.name}
        className={cn(
          "h-full w-full object-cover opacity-80 transition-all duration-700",
          camera.status === "offline" && "grayscale blur-sm",
          isHovered && "scale-105 opacity-100"
        )}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* OSD (On-Screen Display) Top */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            camera.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
            camera.status === "recording" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-muted"
          )} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-black">
            {camera.name}
          </span>
        </div>
        <Badge variant="outline" className="bg-black/40 text-[8px] font-black border-white/20 text-white py-0 h-4">
          {camera.resolution}
        </Badge>
      </div>

      {/* OSD Bottom */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-white/50">Bitrate</span>
              <span className="text-[10px] font-bold text-white">{camera.bitrate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-white/50">Latency</span>
              <span className="text-[10px] font-bold text-white">{camera.latency}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={() => onSelect(camera)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Center Status for Offline */}
      {camera.status === "offline" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <Wifi className="h-8 w-8 text-white/20 mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Signal Lost</span>
        </div>
      )}

      {/* Recording Indicator */}
      {camera.status === "recording" && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-black text-white uppercase tracking-wider">REC</span>
        </div>
      )}
    </div>
  )
}
