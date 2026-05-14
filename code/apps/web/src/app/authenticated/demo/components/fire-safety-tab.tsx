"use client"

import { Flame } from "lucide-react"

export function FireSafetyTab() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/[0.02]">
      <Flame className="mb-4 h-12 w-12 text-primary/20" />
      <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">Fire Suppression Overview - System Loading...</p>
    </div>
  )
}
