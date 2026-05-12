import { ReactNode } from "react"
import { cookies } from "next/headers"
import { AppSidebar, AppSidebarProps } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

const sidebarData: AppSidebarProps = {
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
          icon: "LayoutDashboard",
          isActive: true,
        },
        {
          title: "Tasks",
          url: "#",
          icon: "ClipboardList",
          badge: "12+",
        },
        {
          title: "Calendar",
          url: "#",
          icon: "Calendar",
        },
        {
          title: "Analytics",
          url: "#",
          icon: "BarChart3",
        },
        {
          title: "Team",
          url: "#",
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
  ],
}

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
        <AppSidebar user={sidebarData.user} groups={sidebarData.groups} />
        <PageContent
          breadcrumbs={[{ label: "Dashboard", href: "/authenticated/home" }]}
        >
          {children}
        </PageContent>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export interface PageContentProps {
  children: ReactNode
  breadcrumbs: {
    label: string
    href?: string
  }[]
}

export function PageBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: { label: string; href?: string }[]
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={index} className="hidden md:block">
            <BreadcrumbLink href={breadcrumb.href}>
              {breadcrumb.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function PageContent({ children, breadcrumbs }: PageContentProps) {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 rounded-xl p-4">{children}</div>
      </main>
      <footer className="flex items-center border-t p-2 text-center">
        <p className="text-center text-sm leading-loose text-balance text-muted-foreground md:text-left">
          Powered by BeyondSensor Solutions
        </p>
      </footer>
    </SidebarInset>
  )
}
