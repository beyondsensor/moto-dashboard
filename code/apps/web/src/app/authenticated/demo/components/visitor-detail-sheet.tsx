"use client"

import * as React from "react"
import { 
  User, 
  Building2, 
  Clock, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Calendar,
  ExternalLink,
  History
} from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { Visitor } from "./visitor-data"

interface VisitorDetailSheetProps {
  visitor: Visitor | null
  onOpenChange: (open: boolean) => void
  onCheckout: (id: string) => void
}

export function VisitorDetailSheet({ visitor, onOpenChange, onCheckout }: VisitorDetailSheetProps) {
  if (!visitor) return null

  const isCheckedIn = visitor.status === "checked-in" || visitor.status === "overstayed"

  return (
    <Sheet open={!!visitor} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0">
        <div className="flex h-full flex-col p-6">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={visitor.avatar} alt="" className="h-16 w-16 rounded-2xl border-2 border-background shadow-xl" />
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-background",
                  visitor.status === "checked-in" ? "bg-emerald-500" : 
                  visitor.status === "pre-registered" ? "bg-blue-500" :
                  visitor.status === "overstayed" ? "bg-red-500" : "bg-muted"
                )} />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold tracking-tight">{visitor.name}</SheetTitle>
                <SheetDescription className="text-xs font-medium text-primary">
                  {visitor.company}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto scrollbar-none">
            {/* Status Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Badge ID</p>
                <p className="text-sm font-mono font-bold">{visitor.badgeNumber || "NOT ASSIGNED"}</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Status</p>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-bold h-5 px-1.5",
                  visitor.status === "checked-in" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  visitor.status === "overstayed" && "bg-red-500/10 text-red-500 border-red-500/20",
                  visitor.status === "pre-registered" && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {visitor.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Visit Details */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Visit Information</h4>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Host Person</p>
                    <p className="text-sm font-medium">{visitor.host}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Purpose of Visit</p>
                    <p className="text-sm font-medium">{visitor.purpose}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Checked In</p>
                      <p className="text-sm font-medium">{visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString() : "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Expected Out</p>
                      <p className="text-sm font-medium">{new Date(visitor.expectedTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Recent Activity Mini-Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Recent Access Logs</h4>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] font-bold gap-1 uppercase">
                  Full History <ExternalLink className="h-2.5 w-2.5" />
                </Button>
              </div>
              <div className="space-y-3 pl-2">
                <div className="relative border-l pl-4 pb-2">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold">Main Lobby Entrance</p>
                  <p className="text-[10px] text-muted-foreground">Checked in via Kiosk 02 • 12:34 PM</p>
                </div>
                <div className="relative border-l pl-4 pb-2">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-blue-500" />
                  <p className="text-xs font-bold">Elevator Bank A</p>
                  <p className="text-[10px] text-muted-foreground">Authorized access to Floor 4 • 12:45 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-auto pt-6 border-t flex gap-3">
            <Button variant="outline" className="flex-1 gap-2 h-11 text-xs font-bold uppercase">
              <Calendar className="h-4 w-4" />
              Reschedule
            </Button>
            {isCheckedIn && (
              <Button 
                variant="destructive" 
                className="flex-1 gap-2 h-11 text-xs font-bold uppercase shadow-lg shadow-red-500/10"
                onClick={() => {
                  onCheckout(visitor.id)
                  onOpenChange(false)
                }}
              >
                <LogOut className="h-4 w-4" />
                Check Out
              </Button>
            )}
            {!isCheckedIn && visitor.status === "pre-registered" && (
              <Button className="flex-1 gap-2 h-11 text-xs font-bold uppercase bg-emerald-600 hover:bg-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Check In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
