"use client"

import * as React from "react"
import {
  Search,
  Building,
  Layers,
  Activity,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

// --- Types ---

import {
  MOCK_DEVICES,
  MOCK_LOGS,
  BUILDINGS,
  FLOORS,
  type Device,
  type EventLog
} from "./access-control-data"

import { DeviceCard } from "./device-card"
import { EventRow } from "./event-row"
import { DeviceDetailSheet } from "./device-detail-sheet"
import { EventDetailSheet } from "./event-detail-sheet"

export function AccessControlTab() {
  const [devices, setDevices] = React.useState<Device[]>(MOCK_DEVICES)
  const [logs, setLogs] = React.useState<EventLog[]>(MOCK_LOGS)
  const [search, setSearch] = React.useState("")
  const [selectedBuilding, setSelectedBuilding] = React.useState("all")
  const [selectedFloor, setSelectedFloor] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null)
  const [selectedLog, setSelectedLog] = React.useState<EventLog | null>(null)
  const timers = React.useRef<Record<string, NodeJS.Timeout>>({})

  const ITEMS_PER_PAGE = 48

  React.useEffect(() => {
    return () => {
      // Clean up timers on unmount
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  const handleDeviceToggleLock = (id: string) => {
    setDevices(prev => {
      const newDevices = prev.map(d => {
        if (d.id === id) {
          const newLockedState = !d.isLocked

          // Clear existing timer if any
          if (timers.current[id]) {
            clearTimeout(timers.current[id])
            delete timers.current[id]
          }

          // If unlocking, set auto-lock timer
          if (!newLockedState) {
            timers.current[id] = setTimeout(() => {
              setDevices(current => current.map(dev =>
                dev.id === id ? { ...dev, isLocked: true } : dev
              ))
              // Add a log for auto-lock
              setLogs(currentLogs => {
                const device = currentLogs.find(l => l.deviceId === id)?.deviceName || "Unknown Device"
                return [{
                  id: `log-auto-${Date.now()}`,
                  deviceId: id,
                  deviceName: device,
                  timestamp: new Date().toISOString(),
                  event: "Door Locked (Timed Auto-Lock)",
                  status: "success"
                }, ...currentLogs]
              })
              delete timers.current[id]
            }, 10000)
          }

          return { ...d, isLocked: newLockedState }
        }
        return d
      })
      return newDevices
    })

    // Update selected device if it's the one being toggled
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => prev ? { ...prev, isLocked: !prev.isLocked } : null)
    }

    // Add manual action log
    const device = devices.find(d => d.id === id)
    if (device) {
      const isUnlocking = device.isLocked
      setLogs(prev => [{
        id: `log-${Date.now()}`,
        deviceId: id,
        deviceName: device.name,
        timestamp: new Date().toISOString(),
        event: isUnlocking ? "Manual Remote Unlock" : "Manual Remote Lock",
        status: isUnlocking ? "warning" : "success",
        person: {
          name: "Beyond Sensor",
          role: "Security Administrator",
          avatar: "https://i.pravatar.cc/150?u=beyond",
          department: "System Admin"
        }
      }, ...prev])
    }
  }

  const filteredDevices = React.useMemo(() => {
    return devices.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.unit.includes(search) || d.model.toLowerCase().includes(search.toLowerCase())
      const matchesBuilding = selectedBuilding === "all" || d.building === selectedBuilding
      const matchesFloor = selectedFloor === "all" || d.floor === selectedFloor
      return matchesSearch && matchesBuilding && matchesFloor
    })
  }, [devices, search, selectedBuilding, selectedFloor])

  const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE)
  const paginatedDevices = filteredDevices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)


  return (
    <div className="flex h-[calc(100vh-180px)] flex-col gap-4">
      {/* Header & Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Access Matrix</h2>
          <p className="text-xs text-muted-foreground">Monitoring {devices.length} units.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-7 h-8 text-xs"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <Select value={selectedBuilding} onValueChange={(v) => { setSelectedBuilding(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <Building className="mr-1.5 h-3.5 w-3.5 opacity-50" />
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              {BUILDINGS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedFloor} onValueChange={(v) => { setSelectedFloor(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Layers className="mr-1.5 h-3.5 w-3.5 opacity-50" />
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {FLOORS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Device Grid Section */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto scrollbar-none p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggleLock={handleDeviceToggleLock}
                onClick={setSelectedDevice}
              />
            ))}
          </div>

          {filteredDevices.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <Search className="h-10 w-10 text-muted-foreground/20 mb-2" />
              <h3 className="font-semibold text-sm">No results</h3>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-auto flex items-center justify-between border-t pt-3 shrink-0">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-medium">{filteredDevices.length}</span> units found
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px]"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1 px-2 text-[10px]">
                  <span className="font-medium">{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px]"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Global Activity Side Panel */}
        <div className="hidden flex-col gap-3 lg:flex min-h-0">
          <Card className="flex-1 border-primary/5 bg-background/50 backdrop-blur-sm flex flex-col overflow-hidden">
            <CardHeader className="p-3 pb-1 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-primary" />
                  Activity
                </CardTitle>
                <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-1 pt-0 flex-1 overflow-y-auto scrollbar-none">
              <div className="space-y-0.5">
                {logs.map(log => (
                  <EventRow
                    key={log.id}
                    log={log}
                    onClick={setSelectedLog}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Sheets */}
      <DeviceDetailSheet
        device={selectedDevice}
        onOpenChange={(open) => !open && setSelectedDevice(null)}
        onToggleLock={handleDeviceToggleLock}
        logs={logs}
        onLogClick={setSelectedLog}
      />

      <EventDetailSheet
        log={selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </div>
  )
}
