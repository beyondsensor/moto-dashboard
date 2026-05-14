"use client"

import { StatCard } from "@/features/monitor/components/stat-card"
import { AlertEvent } from "@/features/monitor/components/alert-feed"
import {
  ShieldCheck,
  Users,
  Activity,
  Zap,
  LayoutDashboard,
  Lock,
  Flame,
  AlertCircle,
  Camera
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { DashboardTab } from "./components/dashboard-tab"
import { AccessControlTab } from "./components/access-control-tab"
import { FireSafetyTab } from "./components/fire-safety-tab"
import { EventLogTab } from "./components/event-log-tab"
import { VisitorTab } from "./components/visitor-tab"
import { CctvTab } from "./components/cctv-tab"

interface Floor {
  id: string
  label: string
  image: string
  alertPos: { top: string, left: string }
}

interface DemoDashboardProps {
  initialAlerts: AlertEvent[]
  initialFloors: Floor[]
}

export function DemoDashboard({ initialAlerts, initialFloors }: DemoDashboardProps) {
  return (
    <div className="flex flex-col gap-6 p-1">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="h-12 w-full justify-start gap-4 rounded-none border-b border-primary/5 bg-transparent p-0">
          <TabsTrigger
            value="dashboard"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="access"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <Lock className="mr-2 h-3.5 w-3.5" />
            Access Control
          </TabsTrigger>
          <TabsTrigger
            value="visitors"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <Users className="mr-2 h-3.5 w-3.5" />
            Visitors
          </TabsTrigger>
          <TabsTrigger
            value="cctv"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <Camera className="mr-2 h-3.5 w-3.5" />
            CCTV
          </TabsTrigger>
          <TabsTrigger
            value="fire"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <Flame className="mr-2 h-3.5 w-3.5" />
            Fire Safety
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-[10px] font-black tracking-widest uppercase data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
          >
            <AlertCircle className="mr-2 h-3.5 w-3.5" />
            Event Log
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0 space-y-6">
            <DashboardTab initialAlerts={initialAlerts} initialFloors={initialFloors} />
          </TabsContent>

          <TabsContent value="access" className="m-0">
            <AccessControlTab />
          </TabsContent>
          
          <TabsContent value="visitors" className="m-0">
            <VisitorTab />
          </TabsContent>

          <TabsContent value="cctv" className="m-0">
            <CctvTab />
          </TabsContent>

          <TabsContent value="fire" className="m-0">
            <FireSafetyTab />
          </TabsContent>

          <TabsContent value="events" className="m-0">
            <EventLogTab initialAlerts={initialAlerts} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
