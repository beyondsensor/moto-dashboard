import { getUser } from "@/features/users/actions/get-user"
import { UserNav } from "@/features/users/components/user-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { notFound } from "next/navigation"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"

interface UserLayoutProps {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}

export default async function UserLayout({ children, params }: UserLayoutProps) {
  const { userId } = await params
  
  try {
    const user = await getUser(userId)

    return (
      <PageContent
        breadcrumbs={[
          { label: "Users", href: "/authenticated/users" },
          { label: user.displayName || user.email, href: `/authenticated/users/${userId}` },
        ]}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                <AvatarImage src={user.avatarUrl || ""} alt={user.displayName || ""} />
                <AvatarFallback className="text-lg">
                  {user.displayName?.substring(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">{user.email}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                  {user.organizationName && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span className="text-sm">{user.organizationName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <UserNav userId={userId} />

          <div className="flex-1">
            {children}
          </div>
        </div>
      </PageContent>
    )
  } catch (error) {
    console.error("User not found:", error)
    notFound()
  }
}

