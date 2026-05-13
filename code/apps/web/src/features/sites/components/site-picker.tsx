"use client"

import * as React from "react"
import { Check, Building2, Building, Search, Loader2, Grid2X2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { useSite } from "../providers/site-context"
import { useSites } from "../hooks/use-sites"
import { Site } from "../types"

export function SitePicker() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { siteId, setSiteId } = useSite()
  const { data, isLoading: loading } = useSites({ page: 1, pageSize: 200, view: "list" })
  const sites = React.useMemo(() => data?.data || [], [data])

  const selectedSite = React.useMemo(() => 
    sites.find((site) => site.id === siteId),
    [sites, siteId]
  )

  const filteredSites = React.useMemo(() => {
    return sites.filter(site => 
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.organizationName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sites, searchQuery])

  // Group sites by organization
  const groupedSites = React.useMemo(() => {
    return filteredSites.reduce((acc, site) => {
      const org = site.organizationName || "Other Sites"
      if (!acc[org]) acc[org] = []
      acc[org].push(site)
      return acc
    }, {} as Record<string, Site[]>)
  }, [filteredSites])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-[320px] justify-between h-12 px-4 bg-background/40 backdrop-blur-xl border-primary/10 hover:border-primary/40 shadow-sm transition-all duration-500 group rounded-xl"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Building className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Global Context</span>
              <span className="font-bold truncate text-sm">
                {selectedSite ? selectedSite.name : "Browse all sites..."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/50 group-hover:text-primary transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Browse</span>
            <Grid2X2 className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-primary/5 shadow-2xl bg-background/95 backdrop-blur-2xl">
        <DialogHeader className="p-8 pb-6 border-b bg-primary/[0.02]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Infrastructure Browser</span>
              </div>
              <DialogTitle className="text-3xl font-black tracking-tight">Select Site Content</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Browse through all registered sites and their organizational context.
              </DialogDescription>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search sites or organizations..." 
                className="pl-10 h-11 bg-background border-primary/10 focus-visible:ring-primary/20 focus-visible:border-primary/40 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 pt-6 bg-gradient-to-b from-primary/[0.01] to-transparent scrollbar-thin scrollbar-thumb-primary/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Synchronizing Sites...</p>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Search className="h-12 w-12 opacity-10" />
              <p className="font-medium">No sites found matching your search</p>
            </div>
          ) : (
            <div className="space-y-12 pb-12">
              {Object.entries(groupedSites).map(([org, orgSites]) => (
                <div key={org} className="space-y-4">
                  <div className="flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10 -mx-4 px-4 rounded-lg">
                    <div className="p-1.5 rounded-md bg-muted/50 border">
                      <Building2 className="h-4 w-4 text-primary/70" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">{org}</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/10 to-transparent" />
                    <span className="text-[10px] font-bold text-muted-foreground">{orgSites.length} Sites</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    {orgSites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSiteId(site.id)
                          setOpen(false)
                        }}
                        className={cn(
                          "flex items-center text-left px-4 py-2.5 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                          siteId === site.id 
                            ? "bg-primary/[0.04] border-primary/40 shadow-sm" 
                            : "bg-background border-primary/5 hover:border-primary/20 hover:bg-primary/[0.01]"
                        )}
                      >
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
                          siteId === site.id 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-muted/30 border-primary/5 text-muted-foreground group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary"
                        )}>
                          <Building className="h-4 w-4" />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 truncate">
                          <div className="flex flex-col truncate">
                            <span className={cn(
                              "text-sm font-bold tracking-tight truncate transition-colors",
                              siteId === site.id ? "text-primary" : "text-foreground"
                            )}>
                              {site.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-muted-foreground">ID: {site.id.slice(0, 8)}</span>
                              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                              <span className="text-[10px] text-muted-foreground/60 truncate">{org}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/5 border border-green-500/10">
                              <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-green-600/80">Online</span>
                            </div>
                            
                            <div className={cn(
                              "h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-500",
                              siteId === site.id 
                                ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md" 
                                : "bg-muted/20 border-primary/5 text-transparent"
                            )}>
                              <Check className="h-3 w-3 stroke-[3px]" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-primary/[0.02] border-t flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-8">
           <div className="flex gap-4">
              <span>Total Sites: {sites.length}</span>
              <span>Online: {sites.length}</span>
           </div>
           <div className="flex items-center gap-1 text-primary/60">
              <div className="h-1 w-1 rounded-full bg-primary/60" />
              <span>Live Infrastructure Sync</span>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
