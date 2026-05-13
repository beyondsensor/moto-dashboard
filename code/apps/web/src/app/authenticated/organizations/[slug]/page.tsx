import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/features/organizations/actions/get-organization"
import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { OrganizationDetailsForm } from "@/features/organizations/components/organization-details-form"
import { LogoUpload } from "@/features/organizations/components/logo-upload"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function OrganizationPage({ params }: PageProps) {
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
      <div className="max-w-4xl mx-auto py-10 flex flex-col gap-8 px-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground text-lg">
            Manage your organization's settings and identity.
          </p>
        </div>

        <div className="grid gap-8">
          <LogoUpload 
            organizationId={organization.id} 
            currentLogoUrl={organization.logo_url} 
          />

          <OrganizationDetailsForm organization={organization} />
        </div>
      </div>
    </PageContent>
  )
}
