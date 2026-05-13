import { SidebarGroupProps } from "@/components/app-sidebar"

export const sideBarGroups: SidebarGroupProps[] = [
  {
    label: "Ops",
    items: [
      {
        title: "Dashboard",
        url: "/authenticated/home",
        icon: "LayoutDashboard",
      },
      {
        title: "Monitor",
        url: "/authenticated/monitor",
        icon: "Activity",
      },
      {
        title: "Visitor Management",
        url: "/authenticated/visitor-management",
        icon: "IdCard",
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Organizations",
        url: "/authenticated/organizations",
        icon: "Building2",
      },
      {
        title: "Sites",
        url: "/authenticated/sites",
        icon: "Building",
      },
      {
        title: "Users",
        url: "/authenticated/users",
        icon: "Users",
      },
    ],
  },
  {
    label: "General",
    items: [
      {
        title: "Settings",
        url: "#",
        icon: "Settings",
      },
    ],
  },
]
