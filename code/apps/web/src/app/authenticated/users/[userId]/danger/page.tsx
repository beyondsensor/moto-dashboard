import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { ShieldAlert, KeyRound, Lock, Trash2 } from "lucide-react"

interface DangerPageProps {
  params: Promise<{ userId: string }>
}

export default async function DangerPage({ params }: DangerPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-warning font-semibold">
        <ShieldAlert className="h-5 w-5" />
        <span>Administrative Actions</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Reset Password
            </CardTitle>
            <CardDescription>
              Send a password reset email to the user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Send Reset Link</Button>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Lock Account
            </CardTitle>
            <CardDescription>
              Prevent the user from signing in without deleting their data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full text-warning hover:bg-warning/10">Lock Account</Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete User
            </CardTitle>
            <CardDescription>
              Permanently remove this user and all their associations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">Delete Permanently</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
