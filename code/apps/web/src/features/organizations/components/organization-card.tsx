import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Organization } from "../types"
import Link from "next/link"

interface OrganizationCardProps {
  organization: Organization
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const initials = organization.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/authenticated/organizations/${organization.slug}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage src={organization.logo_url || ""} alt={organization.name} className="object-contain" />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <CardTitle className="text-lg truncate">{organization.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">/{organization.slug}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Created on {new Date(organization.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
