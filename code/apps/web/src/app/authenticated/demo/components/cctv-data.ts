export type CameraStatus = "online" | "offline" | "recording" | "alert"

export interface CctvCamera {
  id: string
  name: string
  location: string
  status: CameraStatus
  resolution: string
  bitrate: string
  latency: string
  thumb: string
  type: "bullet" | "dome" | "ptz"
}

export interface VAEvent {
  id: string
  cameraId: string
  cameraName: string
  timestamp: string
  type: "motion" | "line-crossing" | "loitering" | "object-removed" | "weapon-detected"
  severity: "info" | "warning" | "critical"
  snapshot: string
}

export const CAMERA_VIEWS = [
  { name: "Main Lobby Entrance", type: "dome", thumb: "/cctv/lobby.png?v=1" },
  { name: "West Parking Lot", type: "bullet", thumb: "/cctv/parking.png?v=1" },
  { name: "Data Center Aisle 4", type: "bullet", thumb: "/cctv/datacenter.png?v=1" },
  { name: "North Perimeter", type: "bullet", thumb: "/cctv/perimeter.png?v=1" },
  { name: "Elevator Bank B", type: "dome", thumb: "/cctv/elevator.png?v=1" },
  { name: "Loading Dock 02", type: "ptz", thumb: "/cctv/loading.png?v=1" },
  { name: "Employee Cafeteria", type: "dome", thumb: "/cctv/cafeteria.png?v=1" },
  { name: "Secure Storage Unit", type: "bullet", thumb: "/cctv/storage.png?v=1" },
  { name: "Executive Suite", type: "dome", thumb: "/cctv/reception.png?v=1" },
  { name: "Roof Access Point", type: "bullet", thumb: "/cctv/roof.png?v=1" },
  { name: "Basement Utility", type: "bullet", thumb: "/cctv/utility.png?v=1" },
  { name: "Main Gate ANPR", type: "ptz", thumb: "/cctv/gate.png?v=1" }
]

export const generateMockCameras = (): CctvCamera[] => {
  return CAMERA_VIEWS.map((view, i) => ({
    id: `cam-${i + 1}`,
    name: view.name,
    location: view.name.split(" ").slice(-1)[0] || "Unknown",
    status: (Math.random() > 0.9 ? "offline" : Math.random() > 0.7 ? "recording" : "online") as "online" | "offline" | "recording",
    resolution: "4K (3840x2160)",
    bitrate: `${(Math.random() * 8 + 2).toFixed(1)} Mbps`,
    latency: `${Math.floor(Math.random() * 40 + 10)}ms`,
    thumb: view.thumb,
    type: view.type as any
  }))
}

export const generateMockVAEvents = (cameras: CctvCamera[]): VAEvent[] => {
  const eventTypes: VAEvent["type"][] = ["motion", "line-crossing", "loitering", "object-removed", "weapon-detected"]
  return Array.from({ length: 20 }, (_, i) => {
    const camera = cameras[Math.floor(Math.random() * cameras.length)] || cameras[0]!
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)] || eventTypes[0]!
    return {
      id: `ev-${i}`,
      cameraId: camera.id,
      cameraName: camera.name,
      timestamp: new Date(Date.now() - Math.random() * 2 * 3600000).toISOString(),
      type,
      severity: (i % 5 === 0 ? "critical" : i % 3 === 0 ? "warning" : "info") as "info" | "warning" | "critical",
      snapshot: camera.thumb
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
