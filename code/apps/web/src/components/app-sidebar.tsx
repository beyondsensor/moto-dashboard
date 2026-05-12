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
  LucideIcon,
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
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

const iconMap = {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
}

export type SidebarIconName = keyof typeof iconMap

export interface SidebarItemsProps {
  title: string
  url: string
  icon: SidebarIconName
  isActive?: boolean
  badge?: string
}

export interface SidebarGroupProps {
  label: string
  items: SidebarItemsProps[]
}

export interface UserInfoProps {
  name: string
  email: string
  avatar: string
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserInfoProps
  groups: SidebarGroupProps[]
}

export function AppSidebar({ user, groups, ...props }: AppSidebarProps) {
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
        {groups.map((group) => (
          <NavMain
            key={group.label}
            label={group.label}
            items={group.items.map((item) => ({
              ...item,
              icon: iconMap[item.icon] || HelpCircle,
            }))}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
