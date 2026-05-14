import { faker } from "@faker-js/faker"

export type VisitorStatus = "pre-registered" | "checked-in" | "checked-out" | "overstayed"

export interface Visitor {
  id: string
  name: string
  company: string
  status: VisitorStatus
  host: string
  purpose: string
  checkInTime?: string
  expectedTime: string
  avatar: string
  badgeNumber?: string
}

export interface VisitorMovement {
  id: string
  visitorId: string
  visitorName: string
  timestamp: string
  location: string
  action: string
  type: "entry" | "exit" | "access"
}

export const VISITOR_HOSTS = [
  "Sarah Chen (Security Lead)",
  "Marcus Miller (Facility Manager)",
  "David Kim (Security Officer)",
  "Elena Rodriguez (Engineering)",
  "Aria Thorne (Admin)"
]

export const generateMockVisitors = (): Visitor[] => {
  return Array.from({ length: 180 }, (_, i) => {
    const statuses: VisitorStatus[] = ["checked-in", "pre-registered", "checked-out", "overstayed"]
    const status = statuses[Math.floor(Math.random() * statuses.length)] || statuses[0]!
    const isCheckedIn = status === "checked-in" || status === "checked-out" || status === "overstayed"
    
    return {
      id: `v-${i}`,
      name: faker.person.fullName(),
      company: faker.company.name(),
      status,
      host: VISITOR_HOSTS[Math.floor(Math.random() * VISITOR_HOSTS.length)] || VISITOR_HOSTS[0]!,
      purpose: faker.lorem.words(3),
      checkInTime: isCheckedIn ? faker.date.recent({ days: 1 }).toISOString() : undefined,
      expectedTime: faker.date.soon({ days: 1 }).toISOString(),
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      badgeNumber: isCheckedIn ? `B-${1000 + i}` : undefined
    }
  })
}

export const generateMockMovements = (visitors: Visitor[]): VisitorMovement[] => {
  const checkedInVisitors = visitors.filter(v => v.status !== "pre-registered")
  return Array.from({ length: 100 }, (_, i) => {
    const visitor = checkedInVisitors[Math.floor(Math.random() * checkedInVisitors.length)]
    const locations = ["Main Entrance", "Elevator Lobby A", "Floor 4 North", "Cafeteria", "Boardroom"]
    const types: ("entry" | "exit" | "access")[] = ["entry", "exit", "access"]
    
    return {
      id: `m-${i}`,
      visitorId: visitor?.id || "v-unknown",
      visitorName: visitor?.name || "Unknown Visitor",
      timestamp: new Date(Date.now() - Math.random() * 6 * 3600000).toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)] || locations[0]!,
      action: "RFID Scan Authorized",
      type: types[Math.floor(Math.random() * types.length)] || types[0]!
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const ARRIVAL_TREND = [
  { hour: "12:00", count: 12 },
  { hour: "13:00", count: 18 },
  { hour: "14:00", count: 32 },
  { hour: "15:00", count: 45 },
  { hour: "16:00", count: 28 },
  { hour: "17:00", count: 54 },
  { hour: "18:00", count: 38 }
]
