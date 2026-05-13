import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { format } from "date-fns"
import { Mail, Calendar, Shield, Building, Info } from "lucide-react"
import { UserDetail } from "../types"

interface UserAccountCardProps {
  user: UserDetail
}

export function UserAccountCard({ user }: UserAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Info className="size-4" />
          </div>
          <CardTitle className="text-xl">Account Information</CardTitle>
        </div>
        <CardDescription>
          Detailed account metadata and platform access information.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Email Address</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Joined Platform</span>
              <span className="text-sm font-medium">
                {user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">System Access Role</span>
              <span className="text-sm font-medium">
                {user.isSystemAdmin ? "System Administrator" : "Standard User"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Primary Organization</span>
              <span className="text-sm font-medium">{user.organizationName || "No Organization"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
