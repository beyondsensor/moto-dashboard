"use server"

import { MOCK_ALERTS, MOCK_FLOORS } from "../constants"

export async function getMonitorAlertsAction() {
  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_ALERTS
}

export async function getMonitorFloorsAction() {
  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_FLOORS
}
