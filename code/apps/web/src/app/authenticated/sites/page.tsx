import { PageContent } from "@/layouts/authenticated-layout/components/page-content"

export default async function SitesPage() {
  return (
    <PageContent
      breadcrumbs={[{ label: "Sites", href: "/authenticated/sites" }]}
    >
      <div>
        <h1>Sites</h1>
      </div>
    </PageContent>
  )
}