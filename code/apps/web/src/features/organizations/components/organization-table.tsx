import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Organization } from "../types"
import Link from "next/link"

interface OrganizationTableProps {
  organizations: Organization[]
}

export function OrganizationTable({ organizations }: OrganizationTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => {
            const initials = org.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <TableRow key={org.id}>
                <TableCell>
                  <Link
                    href={`/authenticated/organizations/${org.slug}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <Avatar className="size-8 rounded-md">
                      <AvatarImage src={org.logo_url || ""} alt={org.name} className="object-contain" />
                      <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{org.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">/{org.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(org.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )
          })}
          {organizations.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No organizations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
