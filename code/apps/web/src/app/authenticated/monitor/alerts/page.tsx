"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { AlertTriangle, Info } from "lucide-react"

export default function AlertsPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site to view active alerts and event history.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Alerts & Events</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Consolidated event log and critical alerts for site <span className="font-mono font-bold text-primary">{siteId.slice(0, 8)}...</span>
        </p>
      </div>
      <div className="w-full max-w-xl space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="p-4 rounded-lg bg-background border border-primary/10 flex items-start gap-4 text-left shadow-sm">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Maintenance</span>
                <span className="text-[10px] text-muted-foreground">12m ago</span>
              </div>
              <p className="text-sm font-medium leading-none">Routine sensor calibration scheduled</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
