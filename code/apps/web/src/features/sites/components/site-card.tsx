"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Building2, MapPin, Users, ArrowRight } from "lucide-react"
import { Site } from "../types"
import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"

interface SiteCardProps {
  site: Site
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Link href={`/authenticated/sites/${site.id}`}>
      <Card className="group hover:bg-accent/50 transition-all cursor-pointer h-full border-muted/20 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all flex items-center justify-center">
          <Building2 className="size-10 text-primary opacity-80 group-hover:scale-110 transition-transform" />
        </div>
        <CardHeader className="flex flex-col gap-1.5 p-4">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
              {site.name}
            </CardTitle>
            {site.code && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider shrink-0">
                {site.code}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {(site as any).organizationName || "No Organization"}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{site.address || "No address provided"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="size-3.5 shrink-0" />
              <span>{site.memberCount || 0} Members assigned</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t border-muted/10 mt-auto flex justify-between items-center bg-muted/5 group-hover:bg-primary/5 transition-colors">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
            View Details
          </span>
          <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </CardFooter>
      </Card>
    </Link>
  )
}
