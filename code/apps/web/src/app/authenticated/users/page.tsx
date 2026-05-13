import { PageContent } from "@/layouts/authenticated-layout/components/page-content"

export default function UsersPage() {
  return (
    <PageContent
      breadcrumbs={[{ label: "Users", href: "/authenticated/users" }]}
    >
      <div>Users</div>
    </PageContent>
  )
}