"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { Flame, Info } from "lucide-react"

export default function FireSafetyPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site to monitor its fire safety systems.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <Flame className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Fire Safety Systems</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Fire panels, smoke detectors, and sprinkler systems for site <span className="font-mono font-bold text-primary">{siteId.slice(0, 8)}...</span>
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-semibold">Fire Panels: NORMAL</span>
        </div>
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-semibold">Smoke Sensors: 142/142</span>
        </div>
        <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-semibold">Sprinklers: STANDBY</span>
        </div>
      </div>
    </div>
  )
}
