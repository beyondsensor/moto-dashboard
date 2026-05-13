import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Users, UserPlus } from "lucide-react"

export default function MembersPage() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              <CardTitle>Organization Members</CardTitle>
            </div>
            <CardDescription>
              Manage the people who have access to this organization.
            </CardDescription>
          </div>
          <Button size="sm">
            <UserPlus className="size-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <Users className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No members found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Start by inviting your team members to collaborate on this organization.
            </p>
            <Button variant="outline">Invite Your First Member</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
