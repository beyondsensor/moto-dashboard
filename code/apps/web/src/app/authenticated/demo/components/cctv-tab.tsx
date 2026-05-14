"use client"

import * as React from "react"
import { 
  Camera, 
  Search, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Activity,
  History,
  Scan,
  Maximize2
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { 
  CctvCamera, 
  VAEvent, 
  generateMockCameras, 
  generateMockVAEvents 
} from "./cctv-data"
import { CctvCameraCard } from "./cctv-camera-card"
import { CctvDetailSheet } from "./cctv-detail-sheet"
import { CctvEventSheet } from "./cctv-event-sheet"

export function CctvTab() {
  const [cameras] = React.useState<CctvCamera[]>(() => generateMockCameras())
  const [events] = React.useState<VAEvent[]>(() => generateMockVAEvents(cameras))
  const [currentPage, setCurrentPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [selectedCamera, setSelectedCamera] = React.useState<CctvCamera | null>(null)
  const [selectedEvent, setSelectedEvent] = React.useState<VAEvent | null>(null)
  
  const ITEMS_PER_PAGE = 9 // 3x3 Grid
  
  const filteredCameras = cameras.filter(cam => 
    cam.name.toLowerCase().includes(search.toLowerCase()) ||
    cam.location.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCameras.length / ITEMS_PER_PAGE)
  const paginatedCameras = filteredCameras.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 p-1">
      {/* Main Grid Area */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Surveillance Grid
              <Badge variant="outline" className="ml-2 bg-primary/5 text-primary border-primary/20">
                {cameras.length} CAMERAS
              </Badge>
            </h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search cameras or zones..." 
                className="pl-9 h-9 bg-background/50 border-primary/10 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-1 bg-background/50">
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-primary/10 text-primary hover:bg-primary/20">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-primary/5">
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-8 mx-2" />
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 3x3 Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
          <div className="grid grid-cols-3 gap-4 auto-rows-min pb-4">
            {paginatedCameras.map((camera) => (
              <CctvCameraCard 
                key={camera.id} 
                camera={camera} 
                onSelect={setSelectedCamera}
              />
            ))}
          </div>
          {paginatedCameras.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50 italic py-20">
              <Scan className="h-12 w-12 mb-4" />
              <p>No camera feeds match your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: VA Event Feed */}
      <div className="flex w-96 flex-col gap-4 min-h-0 border-l pl-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            Video Analytics Feed
          </h3>
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 animate-pulse font-black text-[9px]">REAL-TIME</Badge>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-none">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="group relative overflow-hidden rounded-xl border bg-background/50 hover:bg-accent/30 transition-all cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex gap-3 p-3">
                <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-black">
                  <img src={event.snapshot} alt="" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>
                  {event.severity === "critical" && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[9px] font-black uppercase px-1.5 rounded",
                      event.severity === "critical" ? "bg-red-500 text-white" :
                      event.severity === "warning" ? "bg-amber-500 text-black" : "bg-blue-500 text-white"
                    )}>
                      {event.type.replace("-", " ")}
                    </span>
                    <span className="text-[8px] font-bold text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold tracking-tight line-clamp-1">{event.cameraName}</p>
                  <p className="text-[9px] text-muted-foreground leading-none">Security Zone • Sector 4</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full h-10 text-xs font-bold gap-2 bg-background/50 border-primary/10">
          <History className="h-4 w-4" />
          Analytics Archives
        </Button>
      </div>

      <CctvDetailSheet 
        camera={selectedCamera} 
        onOpenChange={(open) => !open && setSelectedCamera(null)} 
      />

      <CctvEventSheet
        event={selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>
  )
}

function Separator({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical", className?: string }) {
  return (
    <div className={cn(
      "bg-border shrink-0",
      orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
      className
    )} />
  )
}
