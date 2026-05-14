import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { AlertTriangle, Info, ShieldAlert, Zap } from "lucide-react"

import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { useState } from "react"
import { Calendar, Clock, MapPin, Tag } from "lucide-react"

export type AlertSeverity = "info" | "warning" | "critical"

export interface AlertAction {
  label: string
  variant?: "default" | "outline" | "destructive"
  message: string
}

export interface AlertEvent {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  timestamp: string
  location: string
  type?: string
  imageUrl?: string
  details?: Record<string, string>
  actions?: AlertAction[]
}

interface AlertFeedProps {
  alerts: AlertEvent[]
  className?: string
}

export function AlertFeed({ alerts, className }: AlertFeedProps) {
  const [selectedAlert, setSelectedAlert] = useState<AlertEvent | null>(null)

  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return {
          icon: ShieldAlert,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          badge: "bg-red-500/20 text-red-500 border-red-500/30",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          badge: "bg-amber-500/20 text-amber-500 border-amber-500/30",
        }
      default:
        return {
          icon: Info,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          badge: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        }
    }
  }

  return (
    <>
      <Card className={cn("flex flex-col border-primary/5 bg-background/50 backdrop-blur-sm", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold tracking-widest uppercase">Live Alerts Feed</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] animate-pulse bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Live System
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto px-3 pb-3">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = getSeverityConfig(alert.severity)
              const Icon = config.icon
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    "relative flex flex-col gap-2 rounded-lg border p-3 transition-all hover:bg-primary/[0.02] cursor-pointer group",
                    config.bg,
                    config.border
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 rounded-full p-1.5", config.bg)}>
                      <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black tracking-tight truncate group-hover:text-primary transition-colors">{alert.title}</span>
                        <span className="text-[9px] font-bold text-muted-foreground tabular-nums shrink-0 ml-2">
                          {alert.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <p className="flex-1 text-[11px] text-muted-foreground leading-snug">
                          {alert.description}
                        </p>
                        
                        {alert.imageUrl && (
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded border border-primary/10 bg-black/20">
                            <img 
                              src={alert.imageUrl} 
                              alt="Capture" 
                              className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute top-0 right-0 bg-red-500 h-1 w-1 rounded-full m-1 animate-pulse" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <SheetContent className="sm:max-w-md border-l border-primary/10 bg-background/95 backdrop-blur-xl p-0">
          {selectedAlert && (
            <div className="flex flex-col h-full gap-6 p-6 overflow-y-auto">
              <SheetHeader className="space-y-1 p-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn("font-black text-[10px] uppercase", getSeverityConfig(selectedAlert.severity).badge)}>
                    {selectedAlert.severity}
                  </Badge>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedAlert.type}</span>
                </div>
                <SheetTitle className="text-xl font-black tracking-tight leading-tight">
                  {selectedAlert.title}
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed pt-2">
                  {selectedAlert.description}
                </SheetDescription>
              </SheetHeader>

              {selectedAlert.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-primary/10 bg-black shadow-2xl">
                  <img 
                    src={selectedAlert.imageUrl} 
                    alt="High Resolution Capture" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Capture Log</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Location</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{selectedAlert.location}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Timestamp</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{selectedAlert.timestamp}</span>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Type</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{selectedAlert.type?.replace('_', ' ')}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Date</span>
                      </div>
                      <span className="text-sm font-bold text-primary">May 14, 2026</span>
                   </div>
                </div>
              </div>

              {selectedAlert.details && (
                <div className="space-y-4 rounded-xl border border-primary/5 bg-primary/[0.02] p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 block border-b border-primary/5 pb-2">Diagnostic Data</span>
                  <div className="grid grid-cols-2 gap-y-4">
                    {Object.entries(selectedAlert.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">{key}</span>
                        <span className="text-xs font-bold text-primary">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto space-y-3 pt-6 border-t border-primary/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Recommended Actions</span>
                <div className="flex flex-col gap-2">
                  {selectedAlert.actions?.map((action, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        import("sonner").then(({ toast }) => {
                          toast.success(action.label, {
                            description: action.message,
                          })
                        })
                      }}
                      className={cn(
                        "w-full rounded-lg py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                        action.variant === "destructive" 
                          ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                          : action.variant === "outline"
                          ? "border border-primary/20 text-primary hover:bg-primary/5"
                          : "bg-primary text-background hover:bg-primary/90"
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                  {!selectedAlert.actions && (
                    <button className="w-full rounded-lg bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-background hover:bg-primary/90 transition-all">
                      Acknowledge Incident
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
