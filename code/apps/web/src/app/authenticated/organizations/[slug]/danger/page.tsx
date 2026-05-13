import { notFound } from "next/navigation"
import { getOrganizationBySlug } from "@/features/organizations/actions/get-organization"
import { DeleteOrganizationCard } from "@/features/organizations/components/delete-organization-card"
import { DeactivateOrganizationCard } from "@/features/organizations/components/deactivate-organization-card"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DangerZonePage({ params }: PageProps) {
  const { slug } = await params
  const organization = await getOrganizationBySlug(slug)

  if (!organization) {
    notFound()
  }

  return (
    <div className="grid gap-8">
      <DeactivateOrganizationCard organization={organization} />
      <DeleteOrganizationCard organization={organization} />
    </div>
  )
}
