"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, MapPin, Building2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Site } from "../types"
import { format } from "date-fns"

interface SiteTableProps {
  sites: Site[]
}

export function SiteTable({ sites }: SiteTableProps) {
  const router = useRouter()

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="py-4">Site</TableHead>
            <TableHead className="py-4">Organization</TableHead>
            <TableHead className="py-4">Location</TableHead>
            <TableHead className="py-4">Members</TableHead>
            <TableHead className="py-4">Created</TableHead>
            <TableHead className="text-right py-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No sites found.
              </TableCell>
            </TableRow>
          ) : (
            sites.map((site) => (
              <TableRow 
                key={site.id} 
                className="hover:bg-muted/50 transition-colors cursor-pointer group border-b last:border-0"
                onClick={() => router.push(`/authenticated/sites/${site.id}`)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {site.name}
                      </span>
                      {site.code && (
                        <span className="text-xs text-muted-foreground font-medium">{site.code}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm font-medium">{site.organizationName || "N/A"}</span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground max-w-[200px] truncate">
                    <MapPin className="h-3.5 w-3.5 opacity-50 shrink-0" />
                    {site.address || "No address"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Users className="h-3.5 w-3.5 opacity-50" />
                    {site.memberCount || 0}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-xs text-muted-foreground">
                  {format(new Date(site.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right py-4 pr-6">
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-background">
                          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/authenticated/sites/${site.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/authenticated/sites/${site.id}/settings`)}>
                          Edit Site
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
