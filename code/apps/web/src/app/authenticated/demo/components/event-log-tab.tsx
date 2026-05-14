"use client"

import { AlertEvent, AlertFeed } from "@/features/monitor/components/alert-feed"

interface EventLogTabProps {
  initialAlerts: AlertEvent[]
}

export function EventLogTab({ initialAlerts }: EventLogTabProps) {
  return (
    <AlertFeed alerts={[...initialAlerts, ...initialAlerts]} className="max-h-[800px]" />
  )
}
