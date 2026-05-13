"use client"

import { Building } from "../types"
import { Building2, Layers, MapPin, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface InfrastructureOverviewProps {
  buildings: Building[]
}

export function InfrastructureOverview({ buildings }: InfrastructureOverviewProps) {
  const totalBuildings = buildings.length
  const totalFloors = buildings.reduce((acc, b) => acc + (b.floors?.length || 0), 0)
  const totalZones = buildings.reduce((acc, b) => {
    const floorsCount = b.floors?.reduce((fAcc, f) => fAcc + (f.zones?.length || 0), 0) || 0
    return acc + floorsCount
  }, 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Site Infrastructure</h2>
        <p className="text-muted-foreground">
          Overview and management of your physical site hierarchy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Buildings" 
          value={totalBuildings} 
          icon={<Building2 className="size-5" />}
          description="Total physical structures"
          color="blue"
        />
        <StatsCard 
          title="Floors" 
          value={totalFloors} 
          icon={<Layers className="size-5" />}
          description="Levels across all buildings"
          color="indigo"
        />
        <StatsCard 
          title="Zones" 
          value={totalZones} 
          icon={<MapPin className="size-5" />}
          description="Logical monitoring zones"
          color="purple"
        />
      </div>

      <Card className="bg-primary/5 border-primary/10 shadow-none overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 className="size-32" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Info className="size-4" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Quick Guide</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed max-w-2xl">
            Site infrastructure is organized into a three-level hierarchy. Use the sidebar tree to navigate and manage each entity.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <GuideItem title="Buildings" text="Main structures with physical addresses." />
             <GuideItem title="Floors" text="Levels within buildings containing floor plans." />
             <GuideItem title="Zones" text="Specific areas on a floor for monitoring." />
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  color: "blue" | "indigo" | "purple"
}

function StatsCard({ title, value, icon, description, color }: StatsCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-xl border ${colors[color] || ""}`}>
            {icon}
          </div>
          <span className="text-4xl font-bold tracking-tighter">{value}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground/80">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface GuideItemProps {
  title: string
  text: string
}

function GuideItem({ title, text }: GuideItemProps) {
  return (
    <li className="space-y-1">
      <span className="text-xs font-bold text-foreground/70 uppercase">{title}</span>
      <p className="text-xs text-muted-foreground leading-tight">{text}</p>
    </li>
  )
}
