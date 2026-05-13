import { getUserOrganizations } from "@/features/users/actions/get-user-organizations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { Building, Calendar, Shield } from "lucide-react"
import { format } from "date-fns"

interface UserOrganizationsPageProps {
  params: Promise<{ userId: string }>
}

export default async function UserOrganizationsPage({ params }: UserOrganizationsPageProps) {
  const { userId } = await params
  const organizations = await getUserOrganizations(userId)

  const roleColors = {
    owner: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Building className="size-4" />
          </div>
          <CardTitle className="text-xl">Assigned Organizations</CardTitle>
        </div>
        <CardDescription>
          Organizations this user belongs to and their respective roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No organizations assigned</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              This user is not currently a member of any organizations.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.membershipId}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{org.name}</span>
                      <span className="text-xs text-muted-foreground">{org.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`capitalize font-normal text-[10px] px-2 py-0 ${roleColors[org.role as keyof typeof roleColors] || ""}`}
                    >
                      <Shield className="h-2.5 w-2.5 mr-1" />
                      {org.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {org.joinedAt ? format(new Date(org.joinedAt), "PP") : "N/A"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
