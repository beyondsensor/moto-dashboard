import { PageContent } from "@/layouts/authenticated-layout/components/page-content"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreateUserForm } from "@/features/users/components/create-user-form"

export default function CreateUserPage() {
  return (
    <PageContent
      breadcrumbs={[
        { label: "Users", href: "/authenticated/users" },
        { label: "Create User", href: "/authenticated/users/create" },
      ]}
    >
      <div className="max-w-3xl mx-auto py-8">
        <Link
          href="/authenticated/users"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Link>

        <CreateUserForm />
      </div>
    </PageContent>
  )
}
