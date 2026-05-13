import { getUserSites } from "@/features/users/actions/get-user-sites"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { MapPin } from "lucide-react"

interface AssignedSitesPageProps {
  params: Promise<{ userId: string }>
}

export default async function AssignedSitesPage({ params }: AssignedSitesPageProps) {
  const { userId } = await params
  const sites = await getUserSites(userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assigned Sites</CardTitle>
      </CardHeader>
      <CardContent>
        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No sites assigned</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              This user is not currently assigned to any sites. Assign sites to grant them access to specific locations.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.code || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{site.address || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {site.role}
                    </Badge>
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
