"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { Video, Info } from "lucide-react"

export default function CCTVPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site from the picker above to view its CCTV feeds.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <Video className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">CCTV Monitoring</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Real-time video feeds for site <span className="font-mono font-bold text-primary">{siteId.slice(0, 8)}...</span> are being initialized.
        </p>
      </div>
      <div className="flex gap-3">
        <div className="px-4 py-2 rounded-full bg-background border text-xs font-semibold shadow-sm">Grid View</div>
        <div className="px-4 py-2 rounded-full bg-background border text-xs font-semibold shadow-sm">Map View</div>
        <div className="px-4 py-2 rounded-full bg-background border text-xs font-semibold shadow-sm">Playback</div>
      </div>
    </div>
  )
}
