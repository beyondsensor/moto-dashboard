"use client"

import * as React from "react"
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  MoreVertical,
  ArrowUpRight,
  LogOut,
  Building2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { 
  generateMockVisitors, 
  generateMockMovements, 
  ARRIVAL_TREND, 
  Visitor, 
  VisitorMovement,
  VisitorStatus 
} from "./visitor-data"
import { StatCard } from "@/features/monitor/components/stat-card"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table"

import { VisitorDetailSheet } from "./visitor-detail-sheet"

export function VisitorTab() {
  const [visitors, setVisitors] = React.useState<Visitor[]>(() => generateMockVisitors())
  const [movements, setMovements] = React.useState<VisitorMovement[]>(() => generateMockMovements(visitors))
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<VisitorStatus | "all">("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedVisitor, setSelectedVisitor] = React.useState<Visitor | null>(null)
  
  const ITEMS_PER_PAGE = 15

  const handleCheckout = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, status: "checked-out" as VisitorStatus } : v
    ))
  }

  const filteredVisitors = React.useMemo(() => {
    return visitors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                           v.company.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || v.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [visitors, search, statusFilter])

  const totalPages = Math.ceil(filteredVisitors.length / ITEMS_PER_PAGE)
  const paginatedVisitors = filteredVisitors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const stats = {
    total: visitors.length,
    active: visitors.filter(v => v.status === "checked-in").length,
    preRegistered: visitors.filter(v => v.status === "pre-registered").length,
    overstayed: visitors.filter(v => v.status === "overstayed").length
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col gap-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Visitors" value={stats.total} icon={Users} trend={{ value: 8, label: "vs yesterday", isPositive: true }} />
        <StatCard title="Currently On-Site" value={stats.active} icon={UserCheck} status="normal" />
        <StatCard title="Pre-Registered" value={stats.preRegistered} icon={Calendar} status="normal" />
        <StatCard title="Overstay Alerts" value={stats.overstayed} icon={Clock} status={stats.overstayed > 0 ? "critical" : "normal"} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        {/* Main Content: Directory & Trends */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Trend Chart (SVG) */}
          <Card className="border-primary/5 bg-background/50 backdrop-blur-sm">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Arrival Trend (6H)</CardTitle>
                  <p className="text-lg font-bold">Inflow Peak: {Math.max(...ARRIVAL_TREND.map(t => t.count))} Visitors</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold">+14% Growth</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              <div className="h-32 w-full relative">
                <div className="flex h-full items-end justify-between gap-2 px-2 pb-6">
                  {ARRIVAL_TREND.map((t, i) => {
                    const height = Math.floor((t.count / 60) * 80)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                        <div className="w-full relative flex items-end justify-center h-24">
                          <div 
                            className="w-full max-w-[28px] bg-primary/10 rounded-t-md transition-all duration-500 group-hover/bar:bg-primary/20"
                            style={{ height: `${height}px` }}
                          />
                          <div 
                            className="absolute w-full max-w-[28px] bg-primary rounded-t-md transition-all duration-700 delay-100 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                            style={{ height: `${Math.floor(height * 0.8)}px` }}
                          />
                          {/* Tooltip on hover */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-black px-2 py-1 rounded border opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-20">
                            {t.count} VISITORS
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{t.hour}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visitor Directory */}
          <div className="flex flex-col gap-3 min-h-[500px] flex-1 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Visitor Directory</h3>
                <Badge variant="outline" className="text-[10px] py-0">{filteredVisitors.length} Total</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    placeholder="Filter visitors..." 
                    className="h-7.5 w-48 pl-7 text-[10px]" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  {(["all", "pre-registered", "checked-in"] as const).map(s => (
                    <Button 
                      key={s}
                      variant={statusFilter === s ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider"
                      onClick={() => setStatusFilter(s)}
                    >
                      {s.replace("-", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto border rounded-xl bg-background/50 backdrop-blur-sm scrollbar-none">
              <Table>
                <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
                  <TableRow className="hover:bg-transparent border-primary/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Visitor</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Company</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Host</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Check-In</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-10 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVisitors.map((visitor) => (
                    <TableRow 
                      key={visitor.id} 
                      className="border-primary/5 group transition-colors hover:bg-primary/5"
                    >
                      <TableCell className="py-2">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group/name w-fit"
                          onClick={() => setSelectedVisitor(visitor)}
                        >
                          <img src={visitor.avatar} alt="" className="h-7 w-7 rounded-full border border-primary/10 group-hover/name:border-primary/40 transition-colors" />
                          <span className="text-[11px] font-bold truncate group-hover/name:text-primary transition-colors">{visitor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-[10px] text-muted-foreground font-medium">{visitor.company}</span>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 text-muted-foreground/50" />
                          <span className="text-[10px] text-muted-foreground">{visitor.host.split(" (")[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        {visitor.checkInTime ? (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-emerald-500/50" />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/30 italic">Scheduled</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[8px] h-4 py-0 leading-none px-1.5 font-bold tracking-tight",
                            visitor.status === "checked-in" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                            visitor.status === "pre-registered" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            visitor.status === "overstayed" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {visitor.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {paginatedVisitors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Users className="h-12 w-12 opacity-10 mb-4" />
                  <p className="text-xs font-medium italic">No visitors match your current filters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-2 flex items-center justify-between border-t pt-4">
              <p className="text-[10px] text-muted-foreground font-medium">
                Showing <span className="font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredVisitors.length)}</span> of <span className="font-bold">{filteredVisitors.length}</span>
              </p>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Movement Log */}
        <div className="flex flex-col gap-4 min-h-0 border-l pl-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Live Movement Log</h3>
            <Badge variant="outline" className="animate-pulse bg-emerald-500/10 text-emerald-500 border-emerald-500/20">LIVE</Badge>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-none">
            {movements.map((move) => (
              <div key={move.id} className="relative pl-4 pb-3 border-l last:pb-0">
                <div className={cn(
                  "absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background shadow-sm",
                  move.type === "entry" ? "bg-emerald-500" : 
                  move.type === "exit" ? "bg-amber-500" : "bg-blue-500"
                )} />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold">{move.visitorName}</p>
                    <span className="text-[8px] text-muted-foreground">{new Date(move.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-none">
                    {move.action} at <span className="font-bold text-foreground">{move.location}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {move.type === "entry" && <Badge className="text-[7px] h-3.5 bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 border-none px-1">INBOUND</Badge>}
                    {move.type === "exit" && <Badge className="text-[7px] h-3.5 bg-amber-500/20 text-amber-600 hover:bg-amber-500/20 border-none px-1">OUTBOUND</Badge>}
                    {move.type === "access" && <Badge className="text-[7px] h-3.5 bg-blue-500/20 text-blue-600 hover:bg-blue-500/20 border-none px-1">ZONE ACCESS</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full h-9 text-xs gap-2 border-primary/10 bg-background/50">
            <LogOut className="h-3.5 w-3.5" />
            Bulk Checkout Mode
          </Button>
        </div>
      </div>

      <VisitorDetailSheet 
        visitor={selectedVisitor} 
        onOpenChange={(open) => !open && setSelectedVisitor(null)}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
