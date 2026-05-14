import { MOCK_DEVICES } from "./access-control-data"
import { CAMERA_VIEWS, generateMockCameras, generateMockVAEvents } from "./cctv-data"
import { generateMockVisitors } from "./visitor-data"

export function getSiteOperationalContext() {
  const cameras = generateMockCameras()
  const vaEvents = generateMockVAEvents(cameras)
  const visitors = generateMockVisitors()
  const devices = MOCK_DEVICES

  const offlineCameras = cameras.filter(c => c.status === "offline").length
  const criticalCctvAlerts = vaEvents.filter(e => e.severity === "critical").length
  const lockedDevices = devices.filter(d => d.isLocked).length
  const activeVisitors = visitors.filter(v => v.status === "checked-in").length
  const overstayedVisitors = visitors.filter(v => v.status === "overstayed").length

  return `
CURRENT SITE STATUS SUMMARY:
---------------------------
CCTV SYSTEM:
- Total Cameras: ${cameras.length}
- Offline Cameras: ${offlineCameras}
- Recording: ${cameras.filter(c => c.status === "recording").length}
- Critical AI Alerts (Last 2h): ${criticalCctvAlerts}
- Latest Incident: ${vaEvents[0]?.type.replace("-", " ")} at ${vaEvents[0]?.cameraName}

ACCESS CONTROL:
- Total Access Points: ${devices.length}
- Locked/Secure: ${lockedDevices}
- Open/Unlocked: ${devices.length - lockedDevices}
- Recent Alert: "Unauthorized Access Attempt" detected at Building Alpha, Floor 2.

VISITOR MANAGEMENT:
- Total Visitors Today: ${visitors.length}
- Currently On-Site: ${activeVisitors}
- Overstay Alerts: ${overstayedVisitors}
- High Peak Arrival: 54 visitors at 17:00.

SITE OPERATIONS:
- Overall System Health: ${offlineCameras > 2 ? "Degraded" : "Normal"}
- Security Posture: ${criticalCctvAlerts > 0 ? "Elevated" : "Standard"}
`
}
