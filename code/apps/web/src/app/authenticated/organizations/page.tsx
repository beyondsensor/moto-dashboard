import { PageContent } from "@/layouts/authenticated-layout/components/page-content"

export default async function OrganizationsPage() {
  return (
    <PageContent
      breadcrumbs={[{ label: "Organizations", href: "/authenticated/organizations" }]}
    >
      <div>
        <h1>Organizations</h1>
      </div>
    </PageContent>
  )
}