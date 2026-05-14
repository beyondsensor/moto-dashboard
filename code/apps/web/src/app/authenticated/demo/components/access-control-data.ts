import { Lock, Unlock, Activity, History, AlertTriangle, Layers, Building, Search, Filter, ChevronLeft, ChevronRight, Settings } from "lucide-react"

export interface Device {
  id: string
  name: string
  model: string
  type: "facial" | "card" | "touch" | "biometric"
  building: string
  floor: string
  unit: string
  isLocked: boolean
  lastActivity: string
  batteryLevel: number
  signalStrength: number
  imageUrl: string
  config: {
    autoLockDelay: number
    sensitivity: "Low" | "Medium" | "High"
    notifyOnFailure: boolean
  }
}

export interface EventLog {
  id: string
  deviceId: string
  deviceName: string
  timestamp: string
  event: string
  status: "success" | "failure" | "warning"
  person?: {
    name: string
    role: string
    avatar: string
    department: string
  }
}

const BUILDINGS = ["Building Alpha", "Building Bravo", "Building Gamma"]
const FLOORS = Array.from({ length: 10 }, (_, i) => `Floor ${i + 1}`)

const DEVICE_MODELS = [
  { name: "FaceID Pro X", type: "facial" as const, img: "/assets/access-control-devices/frt-terminal.webp" },
  { name: "SecurePass RFID", type: "card" as const, img: "/assets/access-control-devices/smart-reader.avif" },
  { name: "TouchEntry G3", type: "touch" as const, img: "/assets/access-control-devices/smart-reader.avif" },
  { name: "BioScan Elite", type: "biometric" as const, img: "/assets/access-control-devices/frt-terminal.webp" }
]

const generateMockData = (): Device[] => {
  const devices: Device[] = []
  let count = 0

  BUILDINGS.forEach((building) => {
    FLOORS.forEach((floor) => {
      const numDevices = 15 + Math.floor(Math.random() * 5)
      for (let i = 0; i < numDevices; i++) {
        count++
        const modelInfo = DEVICE_MODELS[Math.floor(Math.random() * DEVICE_MODELS.length)] || DEVICE_MODELS[0]!
        const unit = `${floor.split(" ")[1]}${(i + 1).toString().padStart(2, "0")}`
        devices.push({
          id: `dev-${count}`,
          name: `${modelInfo.type === "facial" ? "Facial" : modelInfo.type === "card" ? "Card" : "Access"} Point ${unit}`,
          model: modelInfo.name,
          type: modelInfo.type,
          building,
          floor,
          unit,
          isLocked: true,
          lastActivity: new Date(Date.now() - Math.random() * 10000000).toISOString(),
          batteryLevel: 60 + Math.floor(Math.random() * 40),
          signalStrength: 70 + Math.floor(Math.random() * 30),
          imageUrl: modelInfo.img,
          config: {
            autoLockDelay: 10,
            sensitivity: "Medium",
            notifyOnFailure: true
          }
        })
      }
    })
  })

  if (devices.length > 105) {
    if (devices[5]) devices[5].isLocked = false
    if (devices[105]) devices[105].isLocked = false
  }

  return devices
}

const PERSONS = [
  { name: "Sarah Chen", role: "Security Lead", department: "Operations", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { name: "Marcus Miller", role: "Facility Manager", department: "Management", avatar: "https://i.pravatar.cc/150?u=marcus" },
  { name: "Elena Rodriguez", role: "Maintenance Tech", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=elena" },
  { name: "David Kim", role: "Security Officer", department: "Operations", avatar: "https://i.pravatar.cc/150?u=david" },
  { name: "Aria Thorne", role: "Site Administrator", department: "Admin", avatar: "https://i.pravatar.cc/150?u=aria" }
]

const generateMockLogs = (devices: Device[]): EventLog[] => {
  return Array.from({ length: 50 }, (_, i) => {
    const device = devices[Math.floor(Math.random() * devices.length)] || devices[0]!
    const events = [
      { msg: "Unauthorized Access Attempt", status: "failure" as const, hasPerson: false },
      { msg: "Door Unlocked (Mobile Key)", status: "success" as const, hasPerson: true },
      { msg: "Door Locked (Manual)", status: "success" as const, hasPerson: true },
      { msg: "Battery Low Warning", status: "warning" as const, hasPerson: false },
      { msg: "Force Entry Detected", status: "failure" as const, hasPerson: false },
      { msg: "System Override Unlock", status: "warning" as const, hasPerson: true }
    ]
    const event = events[Math.floor(Math.random() * events.length)] || events[0]!
    const person = event.hasPerson ? (PERSONS[Math.floor(Math.random() * PERSONS.length)] || PERSONS[0]!) : undefined
    
    return {
      id: `log-${i}`,
      deviceId: device.id,
      deviceName: device.name,
      timestamp: new Date(Date.now() - i * 15 * 60 * 1000).toISOString(),
      event: event.msg,
      status: event.status,
      person
    }
  })
}

export const MOCK_DEVICES = generateMockData()
export const MOCK_LOGS = generateMockLogs(MOCK_DEVICES)
export { BUILDINGS, FLOORS }
