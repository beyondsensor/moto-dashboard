import { ReactNode } from "react"
import { cookies } from "next/headers"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/providers"
import { sideBarGroups } from "./auth-config"
import { getUserProfileAction } from "@/features/auth/actions/get-user-profile-action"
import { redirect } from "next/navigation"

export async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  const userProfile = await getUserProfileAction()

  if (!userProfile) {
    redirect("/auth/login")
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={userProfile} groups={sideBarGroups} />
      {children}
    </SidebarProvider>
  )
}
