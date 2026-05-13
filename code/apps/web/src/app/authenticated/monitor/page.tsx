import { PageContent } from "@/layouts/authenticated-layout/components/page-content"

export default function MonitorPage() {
  return (
    <PageContent
      breadcrumbs={[{ label: "Monitor", href: "/authenticated/monitor" }]}
    >
      <div>Monitor</div>
    </PageContent>
  )
}