"use client"

import * as React from "react"
import { Activity, History, AlertTriangle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { type EventLog } from "./access-control-data"

interface EventRowProps {
  log: EventLog
  onClick?: (log: EventLog) => void
}

export function EventRow({ log, onClick }: EventRowProps) {
  const Icon = log.status === "failure" ? AlertTriangle : log.status === "warning" ? History : Activity
  const color = log.status === "failure" ? "text-red-500" : log.status === "warning" ? "text-amber-500" : "text-blue-500"

  return (
    <div 
      className="flex items-start gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent/50 cursor-pointer"
      onClick={() => onClick?.(log)}
    >
      <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background border", color)}>
        <Icon className="h-2.5 w-2.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[10px] font-semibold leading-none truncate">{log.event}</p>
          <span className="text-[8px] text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="text-[8px] text-muted-foreground truncate">{log.deviceName}</p>
          {log.person && (
            <div className="flex items-center gap-1 shrink-0">
              <img src={log.person.avatar} alt="" className="h-3 w-3 rounded-full border border-primary/10" />
              <span className="text-[8px] font-medium text-primary/70">{log.person.name}</span>
            </div>
          )}
          {!log.person && <span className="text-[8px] text-muted-foreground/50">System</span>}
        </div>
      </div>
    </div>
  )
}
