import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/features/organizations/actions/get-organization"
import { getOrganizationMembers } from "@/features/organizations/actions/get-organization-members"
import { AddMemberDialog } from "@/features/organizations/components/add-member-dialog"
import { OrganizationMemberTable } from "@/features/organizations/components/organization-member-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Users } from "lucide-react"
import { OrganizationMemberFilters } from "@/features/organizations/components/organization-member-filters"

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
  }>
}


export default async function MembersPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page, search, role } = await searchParams

  const organization = await getOrganizationBySlug(slug)

  if (!organization) {
    notFound()
  }

  const { data: members, meta } = await getOrganizationMembers(organization.id, {
    page: page ? parseInt(page) : 1,
    pageSize: 20,
    search: search || "",
    role: (role as any) || "all",
  })

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Card className="border shadow-sm bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8 border-b">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                <Users className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Organization Members</CardTitle>
            </div>
            <CardDescription className="mt-2 text-base text-muted-foreground">
              Manage the team members and their access levels for {organization.name}.
            </CardDescription>
          </div>
          <AddMemberDialog organizationId={organization.id} />
        </CardHeader>
        <CardContent className="pt-8">
          <OrganizationMemberFilters />
          <OrganizationMemberTable members={members} />
        </CardContent>
      </Card>
    </div>
  )
}
