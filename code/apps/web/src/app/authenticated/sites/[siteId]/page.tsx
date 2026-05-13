import { getSiteAction } from "@/features/sites/actions/get-site"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { MapPin, Calendar, ShieldCheck, Info } from "lucide-react"
import { format } from "date-fns"

export default async function SiteOverviewPage({
  params,
}: {
  params: Promise<{ siteId: string }>
}) {
  const { siteId } = await params
  const site = await getSiteAction(siteId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-muted/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <CardTitle>Site Details</CardTitle>
          </div>
          <CardDescription>General information and location of the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Organization</span>
              <p className="font-medium">{(site as any).organization?.name || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Site Code</span>
              <p className="font-medium">{site.code || "None"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Address</span>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="font-medium text-sm leading-relaxed">{site.address || "No address provided"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-muted/20">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Internal Notes</span>
            <div className="p-4 rounded-lg bg-muted/30 border border-muted/10">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {site.notes || "No additional notes for this site."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-muted/20">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span>Created</span>
              </div>
              <span className="font-medium">{format(new Date(site.created_at), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4" />
                <span>Site Status</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold uppercase">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-muted/20 overflow-hidden group">
          <div className="h-32 bg-muted flex items-center justify-center relative">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
             <MapPin className="size-8 text-primary/40 group-hover:scale-110 transition-transform" />
             <div className="absolute bottom-2 left-2 right-2 text-center p-1 bg-background/80 backdrop-blur-sm rounded text-[10px] font-medium border border-muted/20">
                Interactive Map Coming Soon
             </div>
          </div>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              GPS Coordinates: {site.latitude || "N/A"}, {site.longitude || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
