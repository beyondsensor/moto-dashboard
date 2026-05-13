"use client"

import { useState, useEffect } from "react"
import { getOrganizationSitesAction } from "../actions/get-organization-sites"
import { getUserSites } from "@/features/users/actions/get-user-sites"
import { updateMemberPermissionsAction, SitePermissionUpdate } from "../actions/update-member-permissions"
import { updateOrganizationMemberRoleAction } from "../actions/update-organization-member-role"
import { toast } from "sonner"
import { UserRole } from "@/features/users/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { MapPin, Loader2, ShieldCheck, Settings2, Shield } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Separator } from "@workspace/ui/components/separator"

interface ManageMemberDialogProps {
  member: {
    id: string
    displayName: string
    organizationId: string
    role: UserRole
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SiteWithPermission {
  id: string
  name: string
  code: string | null
  enabled: boolean
  role: "manager" | "editor" | "viewer"
}

export function ManageMemberDialog({ member, open, onOpenChange }: ManageMemberDialogProps) {
  const [orgRole, setOrgRole] = useState<UserRole>(member.role)
  const [sites, setSites] = useState<SiteWithPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadData()
      setOrgRole(member.role)
    }
  }, [open, member.id, member.role])

  async function loadData() {
    setIsLoading(true)
    try {
      const [allSites, userSites] = await Promise.all([
        getOrganizationSitesAction(member.organizationId),
        getUserSites(member.id)
      ])

      const userSiteMap = new Map(userSites.map(s => [s.id, s.role]))

      const mergedSites: SiteWithPermission[] = allSites.map(site => ({
        id: site.id,
        name: site.name,
        code: site.code,
        enabled: userSiteMap.has(site.id),
        role: (userSiteMap.get(site.id) as any) || "viewer"
      }))

      setSites(mergedSites)
    } catch (error) {
      toast.error("Failed to load permissions data")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSite = (siteId: string) => {
    setSites(prev => prev.map(s => 
      s.id === siteId ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const updateSiteRole = (siteId: string, role: string) => {
    setSites(prev => prev.map(s => 
      s.id === siteId ? { ...s, role: role as any } : s
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const siteUpdates: SitePermissionUpdate[] = sites
        .filter(s => s.enabled)
        .map(s => ({
          siteId: s.id,
          role: s.role
        }))

      // Run both updates
      await Promise.all([
        orgRole !== member.role ? updateOrganizationMemberRoleAction(member.organizationId, member.id, orgRole) : Promise.resolve(),
        updateMemberPermissionsAction(member.id, siteUpdates)
      ])

      toast.success("Member settings updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2.5 text-xl">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Settings2 className="size-5" />
            </div>
            Manage Member: {member.displayName}
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            Configure organization-wide role and site-specific permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {/* Organization Role Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Shield className="size-4 text-primary" />
              Organization Role
            </div>
            <div className="grid gap-4 p-4 rounded-xl border bg-muted/30">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Global Role</label>
                <Select value={orgRole} onValueChange={(value) => setOrgRole(value as UserRole)}>
                  <SelectTrigger className="w-full bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {orgRole === "owner" && "Owners have full control over the organization and billing."}
                  {orgRole === "admin" && "Admins can manage members, sites, and organization settings."}
                  {orgRole === "member" && "Members can view data and perform basic operations within assigned sites."}
                </p>
              </div>
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* Site Permissions Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <MapPin className="size-4 text-primary" />
              Site Permissions
            </div>
            
            <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground font-medium">Loading sites...</p>
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-12 bg-muted/10">
                  <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-muted-foreground">No sites found in this organization.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px] py-3">Access</TableHead>
                      <TableHead className="py-3">Site Name</TableHead>
                      <TableHead className="w-[180px] py-3">Site Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sites.map((site) => (
                      <TableRow key={site.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3">
                          <Switch 
                            checked={site.enabled} 
                            onCheckedChange={() => toggleSite(site.id)} 
                          />
                        </TableCell>
                        <TableCell className="py-3 font-medium">
                          <div className="flex flex-col">
                            <span className="text-sm">{site.name}</span>
                            {site.code && <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{site.code}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Select 
                            disabled={!site.enabled}
                            value={site.role}
                            onValueChange={(value) => updateSiteRole(site.id, value)}
                          >
                            <SelectTrigger className="h-8 text-[11px] bg-background border-muted-foreground/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving} className="border-muted-foreground/20">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="shadow-sm">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
