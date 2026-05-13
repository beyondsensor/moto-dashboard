import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/features/organizations/actions/get-organization"
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
    <div className="grid gap-8">
      <LogoUpload 
        organizationId={organization.id} 
        currentLogoUrl={organization.logo_url} 
      />

      <OrganizationDetailsForm organization={organization} />
    </div>
  )
}
