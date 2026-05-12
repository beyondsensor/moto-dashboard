"use client"

import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  groups: [
    {
      label: "Menu",
      items: [
        {
          title: "Dashboard",
          url: "/authenticated/home",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "Tasks",
          url: "#",
          icon: ClipboardList,
          badge: "12+",
        },
        {
          title: "Calendar",
          url: "#",
          icon: Calendar,
        },
        {
          title: "Analytics",
          url: "#",
          icon: BarChart3,
        },
        {
          title: "Team",
          url: "#",
          icon: Users,
        },
      ],
    },
    {
      label: "General",
      items: [
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
        {
          title: "Help",
          url: "#",
          icon: HelpCircle,
        },
        {
          title: "Logout",
          url: "#",
          icon: LogOut,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    Moto Inc
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.groups.map((group) => (
          <NavMain key={group.label} items={group.items} label={group.label} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
