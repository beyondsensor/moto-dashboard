import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/features/organizations/actions/get-organization"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { OrganizationTabs } from "@/features/organizations/components/organization-tabs"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function OrganizationLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const organization = await getOrganizationBySlug(slug)

  if (!organization) {
    notFound()
  }

  return (
    <PageContent
      breadcrumbs={[
        { label: "Organizations", href: "/authenticated/organizations" },
        { label: organization.name, href: `/authenticated/organizations/${organization.slug}` },
      ]}
    >
      <div className="-mx-8 -mt-4 mb-8 border-b">
        <div className="px-8 pt-6 pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
            <p className="text-muted-foreground">
              Manage your organization's settings, members, and identity.
            </p>
          </div>
        </div>
        <OrganizationTabs slug={slug} />
      </div>
      <div className="max-w-4xl">
        {children}
      </div>
    </PageContent>
  )
}
