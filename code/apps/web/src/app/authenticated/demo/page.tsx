import { getMonitorAlertsAction, getMonitorFloorsAction } from "@/features/monitor/actions/get-monitor-data"
import { DemoDashboard } from "./demo-dashboard"

export default async function DemoPage() {
  const [alerts, floors] = await Promise.all([
    getMonitorAlertsAction(),
    getMonitorFloorsAction(),
  ])

  return <DemoDashboard initialAlerts={alerts} initialFloors={floors} />
}
