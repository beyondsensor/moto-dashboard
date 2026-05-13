"use client"

import { useSite } from "@/features/sites/providers/site-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Activity, LayoutDashboard, Database, Info } from "lucide-react"

export default function MonitorOverviewPage() {
  const { siteId } = useSite()

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Info className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">No Site Selected</h2>
        <p className="text-muted-foreground max-w-xs">
          Please select a site from the picker above to view its monitoring data.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass border-primary/5 shadow-none hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">
              All infrastructure components operational
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass border-primary/5 shadow-none hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active telemetry streams
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/5 shadow-none hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Layout Version</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v2.4.0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last synced 2 minutes ago
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-dashed border-primary/20 p-12 flex flex-col items-center justify-center text-center gap-4 bg-primary/5">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Activity className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Site Overview Content</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            This is a placeholder for the main monitoring overview for site <span className="font-mono text-primary">{siteId.slice(0, 8)}...</span>
          </p>
        </div>
      </div>
    </div>
  )
}