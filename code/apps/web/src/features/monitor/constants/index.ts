import { AlertEvent } from "../components/alert-feed"

export const MOCK_ALERTS: AlertEvent[] = [
  {
    id: "1",
    title: "WEAPON DETECTED",
    description: "AI Vision analysis of South Lobby CAM-04 identified a high-probability firearm match. Grainy low-light capture.",
    severity: "critical",
    timestamp: "17:05:12",
    location: "SOUTH-LOBBY",
    type: "WEAPON_AI",
    imageUrl: "/cctv/lobby.png",
    details: {
      "Source": "CAM-04-LOBBY",
      "Object": "Handgun (Glock-type)",
      "Confidence": "94.2%",
      "CCTV_Mode": "Night Vision"
    },
    actions: [
      { label: "Dispatch Security", variant: "destructive", message: "Armed response team dispatched to South Lobby." },
      { label: "Lockdown Zone", variant: "destructive", message: "South Wing lockdown initiated." },
      { label: "Alert Authorities", variant: "outline", message: "Local police notified via silent alarm." }
    ]
  },
  {
    id: "2",
    title: "CROWDING DETECTED",
    description: "Wide-angle fisheye feed from Food Court Area C shows occupancy levels exceeding fire safety limits.",
    severity: "warning",
    timestamp: "17:02:45",
    location: "LVL-2-FOOD",
    type: "OCCUPANCY_AI",
    imageUrl: "/cctv/cafeteria.png",
    details: {
      "Source": "CAM-FC-22",
      "Count": "142 Persons",
      "Density": "0.8 ppl/sqm",
      "Lens": "Fisheye 180°"
    },
    actions: [
      { label: "Redirect Traffic", variant: "default", message: "Digital signage updated to redirect visitors." },
      { label: "Deploy Staff", variant: "outline", message: "Floor marshals notified to assist crowd flow." }
    ]
  },
  {
    id: "3",
    title: "AUDIO ANOMALY",
    description: "Acoustic sensor MIC-77-A detected a high-decibel 'Shatter' signature. Cross-referencing with adjacent CAM-JW-01.",
    severity: "critical",
    timestamp: "16:58:30",
    location: "NORTH-WING-L1",
    type: "ACOUSTIC_SENSOR",
    imageUrl: "/cctv/gate.png",
    details: {
      "Sound": "Glass Breaking",
      "Level": "112 dB",
      "Sensor": "MIC-77-A",
      "Feed": "Grainy Monochrome"
    },
    actions: [
      { label: "Activate Cameras", variant: "default", message: "PTZ cameras 12, 14, and 16 focused on North Wing." },
      { label: "Silent Alarm", variant: "destructive", message: "Security station 4 notified." }
    ]
  },
  {
    id: "4",
    title: "VISITOR REGISTERED",
    description: "Front-facing concierge camera CAM-CON-01 identified scheduled VIP arrival via facial recognition.",
    severity: "info",
    timestamp: "16:50:10",
    location: "CONCIERGE",
    type: "VISITOR_MGMT",
    imageUrl: "/cctv/lobby.png",
    details: {
      "Guest": "Elizabeth Smith",
      "Match": "99.1%",
      "CCTV": "High-Res Color"
    },
    actions: [
      { label: "Notify Host", variant: "default", message: "Host notified via mobile app." },
      { label: "Print Badge", variant: "outline", message: "Visitor badge sent to printer B." }
    ]
  },
  {
    id: "5",
    title: "Unauthorized Vehicle Entry",
    description: "ANPR CAM-GATE-01 identified blacklisted plate 'K-7729-AS' during high-speed entry.",
    severity: "critical",
    timestamp: "16:45:12",
    location: "GATE-01",
    type: "ANPR_DETECTION",
    imageUrl: "/cctv/gate.png",
    details: {
      "Plate": "K-7729-AS",
      "Confidence": "98.4%",
      "Vehicle": "Black SUV",
      "CCTV": "IR Monochrome"
    },
    actions: [
      { label: "Block Exit", variant: "destructive", message: "Automatic bollards activated." },
      { label: "Notify Highway Patrol", variant: "outline", message: "LPR data shared with local authorities." }
    ]
  },
  {
    id: "6",
    title: "FIRE ALARM: SMOKE DETECTED",
    description: "Thermal imaging from CAM-ELEC-44 shows rising heat signature and particulate occlusion in Electrical Room 4.",
    severity: "critical",
    timestamp: "16:40:05",
    location: "ELEC-RM-L2",
    type: "FIRE_SAFETY",
    imageUrl: "/cctv/utility.png",
    details: {
      "Sensor": "SD-402-B",
      "Temp": "68°C",
      "Visual": "Thick Smoke",
      "Feed": "Thermal/IR"
    },
    actions: [
      { label: "Activate Suppression", variant: "destructive", message: "FM-200 gas release sequence initiated." },
      { label: "Evacuate Level 2", variant: "destructive", message: "Emergency voice evacuation triggered for Level 2." },
      { label: "Call Fire Dept", variant: "outline", message: "Direct line to Fire Dispatch established." }
    ]
  },
  {
    id: "7",
    title: "SUSPICIOUS PACKAGE",
    description: "Static object analysis from Atrium Wide-Angle CAM identified an unattended item with high dwell time.",
    severity: "critical",
    timestamp: "16:35:22",
    location: "NORTH-ATRIUM",
    type: "OBJECT_AI",
    imageUrl: "/cctv/lobby.png",
    details: {
      "Object": "Blue Backpack",
      "Dwell Time": "18m 42s",
      "AI_Analysis": "Static/Unclaimed"
    },
    actions: [
      { label: "Cordon Area", variant: "destructive", message: "Security cordon established at 20m radius." },
      { label: "Review Footage", variant: "default", message: "Historical tracking of object placement initiated." }
    ]
  },
  {
    id: "8",
    title: "TAILGATING DETECTED",
    description: "Entrance CAM-TS-04 captured multiple persons entering on a single valid badge swipe.",
    severity: "warning",
    timestamp: "16:28:15",
    location: "STAFF-ENTRANCE",
    type: "ACCESS_CONTROL",
    imageUrl: "/cctv/lobby.png",
    details: {
      "Device": "TURNSTILE-04",
      "Count": "2 Persons",
      "CCTV": "Entry Angle B"
    },
    actions: [
      { label: "Intercom Call", variant: "default", message: "Voice link established with Turnstile 04." },
      { label: "Revoke Access", variant: "outline", message: "Mark Peterson's credential temporarily suspended." }
    ]
  },
  {
    id: "9",
    title: "CAMERA TAMPERING",
    description: "CAM-SEC-112 reporting 100% loss of detail. Probable physical obstruction or spray-over.",
    severity: "warning",
    timestamp: "16:15:30",
    location: "REAR-LOADING",
    type: "SYSTEM_HEALTH",
    details: {
      "Camera": "CAM-SEC-112",
      "Event": "LOD (Loss of Detail)",
      "Status": "TAMPERED"
    },
    actions: [
      { label: "Dispatch Patrol", variant: "default", message: "Patrol team dispatched to Rear Loading Dock." },
      { label: "Switch to Aux", variant: "outline", message: "Adjacent camera CAM-SEC-113 set to wide view." }
    ]
  },
  {
    id: "10",
    title: "FACE RECOGNITION: BLACKLIST",
    description: "Individual match on 'High Risk' list identified at Cinema lobby entrance. Cross-referencing with local PD database.",
    severity: "critical",
    timestamp: "16:05:12",
    location: "CINEMA-LEVEL-4",
    type: "BIOMETRIC_AI",
    imageUrl: "/demo/ai_feed.png",
    details: {
      "Name": "Unknown Alias",
      "Match": "89.4%",
      "CCTV": "Face-Track Mode"
    },
    actions: [
      { label: "Intercept", variant: "destructive", message: "Floor 4 security teams notified for intercept." },
      { label: "Track Subject", variant: "default", message: "AI following initiated across all PTZ units." }
    ]
  },
  {
    id: "11",
    title: "WEAPON DETECTION: RIFLE",
    description: "Parking CAM-B2-04 identified a long-barrel weapon profile. Grainy infrared capture from ceiling mount.",
    severity: "critical",
    timestamp: "16:02:45",
    location: "PARKING-B2",
    type: "WEAPON_AI",
    imageUrl: "/demo/anpr_feed.png",
    details: {
      "Weapon": "Assault Rifle",
      "Source": "CAM-B2-04",
      "CCTV": "IR Grainy"
    },
    actions: [
      { label: "Seal Exits", variant: "destructive", message: "All parking ramp exits locked." },
      { label: "Dispatch Tactical", variant: "destructive", message: "Tactical Response Unit dispatched to B2." }
    ]
  },
  {
    id: "12",
    title: "INTRUDER ALERT: PERIMETER BREACH",
    description: "Perimeter CAM-SEC-12 identified humanoid heat signature scaling North fence line.",
    severity: "critical",
    timestamp: "15:58:10",
    location: "NORTH-PERIMETER",
    type: "INTRUSION_AI",
    imageUrl: "/demo/thermal_feed.png",
    details: {
      "Sensor": "VIB-SEC-12",
      "Subject": "Humanoid",
      "CCTV": "Thermal Night"
    },
    actions: [
      { label: "Release K9", variant: "destructive", message: "K9 Unit 2 released in North Zone." },
      { label: "Floodlights On", variant: "default", message: "Perimeter floodlights activated." }
    ]
  },
  {
    id: "13",
    title: "INTRUDER ALERT: SERVER ROOM",
    description: "Corridor CAM-SEC-01 captured forced entry attempts on sensitive door. High-contrast security feed.",
    severity: "critical",
    timestamp: "15:55:00",
    location: "DATA-CENT-L3",
    type: "ACCESS_CONTROL",
    imageUrl: "/demo/thermal_feed.png",
    details: {
      "Source": "CAM-SEC-01",
      "Door": "SEC-DR-01",
      "CCTV": "Low-Light B&W"
    },
    actions: [
      { label: "Lockdown Server", variant: "destructive", message: "Server cluster physical lockdown initiated." },
      { label: "Notify CISO", variant: "outline", message: "Security management notified of physical breach." }
    ]
  },
  {
    id: "14",
    title: "WEAPON DETECTION: CONCEALED",
    description: "AI identified high-probability concealed weapon profile in West Plaza. Low-res wide angle feed.",
    severity: "warning",
    timestamp: "15:48:30",
    location: "WEST-PLAZA",
    type: "WEAPON_AI",
    imageUrl: "/demo/ai_feed.png",
    details: {
      "Source": "CAM-WP-01",
      "Profile": "Concealed Firearm",
      "Confidence": "82.5%"
    },
    actions: [
      { label: "Shadow Subject", variant: "default", message: "Undercover personnel assigned to shadow subject." },
      { label: "Monitor Feed", variant: "outline", message: "West Plaza high-res feeds prioritized." }
    ]
  }
]

export const MOCK_FLOORS = [
  { id: "L1", label: "Level 1", image: "/building/shopping-mall/mall_floorplan_l1.png", alertPos: { top: "33%", left: "50%" } },
  { id: "L2", label: "Level 2", image: "/building/shopping-mall/mall_floorplan_l2.png", alertPos: { top: "60%", left: "40%" } },
  { id: "L3", label: "Level 3", image: "/building/shopping-mall/mall_floorplan_l3.png", alertPos: { top: "25%", left: "30%" } },
  { id: "L4", label: "Level 4", image: "/building/shopping-mall/mall_floorplan_l4.png", alertPos: { top: "50%", left: "70%" } },
  { id: "B1", label: "Basement", image: "/building/shopping-mall/mall_floorplan_b1.png", alertPos: { top: "20%", left: "70%" } },
]
