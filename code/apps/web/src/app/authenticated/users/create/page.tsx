import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateUserPage() {
  return (
    <PageContent
      breadcrumbs={[
        { label: "Users", href: "/authenticated/users" },
        { label: "Invite", href: "/authenticated/users/create" },
      ]}
    >
      <div className="max-w-2xl mx-auto py-8">
        <Link
          href="/authenticated/users"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle>Invite New User</CardTitle>
                <CardDescription>
                  Send an invitation to a new user to join your organization.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
              <UserPlus className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Invite Form Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                The invitation system is currently under development. Soon you'll be able to invite members by email.
              </p>
              <Link href="/authenticated/users">
                <Button variant="outline">Return to User List</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
