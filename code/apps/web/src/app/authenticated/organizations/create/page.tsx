import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form"

export default function CreateOrganizationPage() {
  return (
    <PageContent
      breadcrumbs={[
        { label: "Organizations", href: "/authenticated/organizations" },
        { label: "Create", href: "/authenticated/organizations/create" },
      ]}
    >
      <div className="py-10">
        <CreateOrganizationForm />
      </div>
    </PageContent>
  )
}
