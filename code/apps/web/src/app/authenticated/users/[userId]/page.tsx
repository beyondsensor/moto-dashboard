import { getUser } from "@/features/users/actions/get-user"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { format } from "date-fns"
import { Mail, Calendar, Shield, Building } from "lucide-react"

interface UserOverviewPageProps {
  params: Promise<{ userId: string }>
}

export default async function UserOverviewPage({ params }: UserOverviewPageProps) {
  const { userId } = await params
  const user = await getUser(userId)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
              <span className="text-sm">{user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Joined</span>
              <span className="text-sm">
                {user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Access</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">System Role</span>
              <span className="text-sm">
                {user.isSystemAdmin ? "System Administrator" : "Standard User"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Organization</span>
              <span className="text-sm">{user.organizationName || "No Organization"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
