"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { Zap, Info } from "lucide-react"

export default function UtilityPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site to monitor power and utility consumption.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <Zap className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Power & Utilities</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Electrical load, water consumption, and backup power systems for site <span className="font-mono font-bold text-primary">{siteId.slice(0, 8)}...</span>
        </p>
      </div>
      <div className="w-full max-w-md bg-background/50 rounded-xl border p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span>Current Load</span>
          <span>84.2 kW</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[65%]" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="text-left">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Grid</span>
            <div className="text-sm font-bold">CONNECTED</div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Generator</span>
            <div className="text-sm font-bold text-muted-foreground">READY</div>
          </div>
        </div>
      </div>
    </div>
  )
}
