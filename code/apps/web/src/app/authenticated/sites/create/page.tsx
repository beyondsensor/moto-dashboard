import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { SiteForm } from "@/features/sites/components/site-form"
import { getOrganizations } from "@/features/organizations/actions/get-organizations"

export default async function CreateSitePage() {
  const { data: organizations } = await getOrganizations({ page: 1, pageSize: 100, view: "list" })

  return (
    <PageContent
      breadcrumbs={[
        { label: "Sites", href: "/authenticated/sites" },
        { label: "Create", href: "/authenticated/sites/create" },
      ]}
    >
      <div className="py-8">
        <SiteForm organizations={organizations} />
      </div>
    </PageContent>
  )
}
