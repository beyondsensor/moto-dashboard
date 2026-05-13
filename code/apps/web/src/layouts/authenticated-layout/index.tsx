import { ReactNode } from "react"
import { cookies } from "next/headers"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
} from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { sideBarGroups } from "./auth-config"


export async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={{
          avatar: "",
          email: "yy.foo@beyondsensor.com",
          name: "Foo Yong Yan"
        }} groups={sideBarGroups} />
        {children}
      </SidebarProvider>
    </TooltipProvider>
  )
}
