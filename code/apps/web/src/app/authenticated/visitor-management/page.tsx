import { PageContent } from "@/layouts/authenticated-layout/components/page-content";


export default async function VisitorManagementPage() {

    return (
        <PageContent
            breadcrumbs={[{ label: "Visitor Management", href: "/authenticated/visitor-management" }]}
        >
            <div>Visitor Management</div>
        </PageContent>
    )
}