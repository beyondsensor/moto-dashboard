import { getSiteInfrastructureAction } from "@/features/sites/actions/get-site-infrastructure"
import { InfrastructureManager } from "@/features/sites/components/infrastructure-manager"
import { Card, CardContent } from "@workspace/ui/components/card"

export default async function SiteInfrastructurePage({
  params,
}: {
  params: Promise<{ siteId: string }>
}) {
  const { siteId } = await params
  const infrastructure = await getSiteInfrastructureAction(siteId)

  return (
    <div className="h-full">
      <Card className="border-muted/20 bg-card/30 backdrop-blur-sm overflow-hidden min-h-[700px]">
        <CardContent className="p-0 sm:p-6 h-full">
          <InfrastructureManager siteId={siteId} initialData={infrastructure as any} />
        </CardContent>
      </Card>
    </div>
  )
}
