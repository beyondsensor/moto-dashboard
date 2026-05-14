"use client"

import { AlertEvent, AlertFeed } from "@/features/monitor/components/alert-feed"
import { StatCard } from "@/features/monitor/components/stat-card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { ShieldAlert, Users, CheckCircle2, Zap } from "lucide-react"

interface Floor {
  id: string
  label: string
  image: string
  alertPos: { top: string, left: string }
}

interface DashboardTabProps {
  initialAlerts: AlertEvent[]
  initialFloors: Floor[]
}

export function DashboardTab({ initialAlerts, initialFloors }: DashboardTabProps) {
  const [selectedFloor, setSelectedFloor] = useState(initialFloors[0])

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard 
          title="Security Alerts" 
          value={initialAlerts.length} 
          icon={ShieldAlert} 
          status="warning"
          trend={{ value: 12, label: "vs last hour", isPositive: false }}
        />
        <StatCard 
          title="Active Occupancy" 
          value="1,284" 
          icon={Users} 
          unit="PERSONS"
          trend={{ value: 5, label: "increasing", isPositive: true }}
        />
        <StatCard 
          title="System Health" 
          value="99.9" 
          unit="%" 
          icon={CheckCircle2} 
          status="normal"
        />
        <StatCard 
          title="Network Load" 
          value="42" 
          unit="MB/S" 
          icon={Zap} 
          status="normal"
          trend={{ value: 2, label: "stable", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 flex-1">
      <div className="relative flex-1 overflow-hidden rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm p-4">
        <span className="text-[10px] font-black tracking-widest text-primary uppercase mb-4 block">Exterior View</span>
        <img src="/building/shopping-mall/mall_exterior.png" alt="Exterior" className="w-full object-cover rounded-lg opacity-80" />
      </div>
      <div className="h-full">
        <div className="flex flex-col gap-6 h-full">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black tracking-widest text-primary uppercase">Site Overview</span>
              <div className="flex gap-1">
                {initialFloors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor)}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black rounded border transition-all",
                      selectedFloor?.id === floor.id
                        ? "bg-primary text-background border-primary"
                        : "bg-transparent text-muted-foreground border-primary/20 hover:border-primary/50"
                    )}
                  >
                    {floor.id}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[calc(100%-2.5rem)] w-full overflow-hidden rounded-lg border border-primary/5 bg-black/20">
              <img
                key={selectedFloor?.id}
                src={selectedFloor?.image}
                alt={selectedFloor?.label}
                className="h-full w-full object-contain opacity-60 transition-all duration-500 animate-in fade-in zoom-in-95"
              />
              {/* Dynamic Pulse on Map */}
              {selectedFloor && (
                <div
                  className="absolute transition-all duration-500"
                  style={{ top: selectedFloor.alertPos.top, left: selectedFloor.alertPos.left }}
                >
                  <div className="relative h-4 w-4 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                    <div className="relative h-full w-full rounded-full bg-red-500" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-full">
        <AlertFeed alerts={initialAlerts} className="h-full max-h-[600px]" />
      </div>
      </div>
    </div>
  )
}
