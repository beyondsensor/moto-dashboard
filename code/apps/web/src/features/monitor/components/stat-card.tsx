import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  status?: "normal" | "warning" | "critical"
  className?: string
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = "normal",
  className,
}: StatCardProps) {
  const statusColors = {
    normal: "text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    warning: "text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    critical: "text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  }

  const statusBg = {
    normal: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    critical: "bg-red-500/10",
  }

  return (
    <Card className={cn("overflow-hidden border-primary/5 bg-background/50 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {title}
        </CardTitle>
        <div className={cn("rounded-lg p-2", statusBg[status])}>
          <Icon className={cn("h-4 w-4", statusColors[status])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-black tracking-tight">{value}</div>
          {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                trend.isPositive ? "bg-emerald-500" : "bg-red-500"
              )}
            />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {trend.label}: {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
