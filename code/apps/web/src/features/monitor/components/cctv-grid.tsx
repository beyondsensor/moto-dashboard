"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Maximize2, Video } from "lucide-react"
import { useEffect, useState } from "react"

interface CameraFeedProps {
  id: string
  name: string
  location: string
  imageSrc: string
  isActive?: boolean
}

function CameraFeed({ name, location, imageSrc, isActive = true }: CameraFeedProps) {
  const [timestamp, setTimestamp] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toISOString().replace("T", " ").substring(0, 19))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg bg-black border border-primary/10">
      {/* Real Video Feed Image */}
      <img 
        src={imageSrc} 
        alt={name}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Simulated Overlays */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded bg-black/60 px-2 py-1 backdrop-blur-md">
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isActive ? "bg-red-500" : "bg-zinc-500")} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{name}</span>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity rounded bg-black/60 p-1 backdrop-blur-md hover:bg-primary/20">
            <Maximize2 className="h-3 w-3 text-white" />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="rounded bg-black/60 px-2 py-1 backdrop-blur-md">
            <span className="text-[9px] font-mono text-emerald-400 leading-none">{timestamp}</span>
          </div>
          <div className="rounded bg-black/60 px-2 py-1 backdrop-blur-md">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{location}</span>
          </div>
        </div>
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="h-full w-full animate-scanline bg-[linear-gradient(transparent,rgba(255,255,255,0.05),transparent)] translate-y-[-100%]" />
      </div>
    </div>
  )
}

export function CCTVGrid() {
  const cameras = [
    { id: "cam-1", name: "CAM-01-ENTRANCE", location: "MAIN GATE", imageSrc: "/demo/anpr_feed.png" },
    { id: "cam-2", name: "CAM-04-LOBBY", location: "LOBBY NORTH", imageSrc: "/demo/lobby_feed.png" },
    { id: "cam-3", name: "CAM-09-PARKING", location: "B1 SOUTH", imageSrc: "/demo/anpr_day_feed.png" },
    { id: "cam-4", name: "CAM-12-SERVER", location: "DATA ROOM", imageSrc: "/demo/thermal_feed.png" },
  ]

  return (
    <Card className="border-primary/5 bg-background/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-bold tracking-widest uppercase">Multi-View Surveillance</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">4 Active Feeds</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cameras.map((cam) => (
            <CameraFeed key={cam.id} {...cam} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
