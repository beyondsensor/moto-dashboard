"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { Lock, Info } from "lucide-react"

export default function AccessControlPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site to view its access control logs and status.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        <Lock className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Access Control & Lifts</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Security gates and elevator monitoring for site <span className="font-mono font-bold text-primary">{siteId.slice(0, 8)}...</span>
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-4 rounded-xl bg-background border shadow-sm flex flex-col items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 self-end" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Gate {i}</span>
            <span className="font-semibold text-xs">SECURE</span>
          </div>
        ))}
      </div>
    </div>
  )
}
