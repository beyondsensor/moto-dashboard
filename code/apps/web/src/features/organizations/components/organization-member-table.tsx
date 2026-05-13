"use client"

import { UserWithRole } from "@/features/users/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, Shield, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { format } from "date-fns"

interface OrganizationMemberTableProps {
  members: UserWithRole[]
}

import { toast } from "sonner"
import { removeOrganizationMemberAction } from "../actions/remove-organization-member"

import { ManageMemberDialog } from "./manage-member-dialog"
import { useState } from "react"

export function OrganizationMemberTable({ members }: OrganizationMemberTableProps) {
  const router = useRouter()
  const [managingMember, setManagingMember] = useState<UserWithRole | null>(null)
  
  const handleRemoveMember = async (userId: string, organizationId: string) => {
    if (!organizationId) {
      toast.error("Organization ID is missing")
      return
    }

    if (!confirm("Are you sure you want to remove this member? They will lose access to this organization immediately.")) {
      return
    }

    try {
      const result = await removeOrganizationMemberAction(organizationId, userId)
      toast.success(result.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member")
    }
  }
  const roleColors = {
    owner: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50",
    member: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50",
  }

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[300px] py-4">Member</TableHead>
            <TableHead className="py-4">Role</TableHead>
            <TableHead className="py-4">Joined</TableHead>
            <TableHead className="text-right py-4 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No members found in this organization.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => {
              const initials = (`${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}` || member.email?.[0] || "U").toUpperCase()
              
              return (
                <TableRow 
                  key={member.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer group border-b last:border-0"
                  onClick={() => router.push(`/authenticated/users/${member.id}`)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-muted">
                        <AvatarImage src={member.avatarUrl || undefined} alt={member.displayName || member.email} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {member.displayName || `${member.firstName || ""} ${member.lastName || ""}`.trim() || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className={`capitalize font-medium text-[11px] px-2.5 py-0.5 rounded-full border shadow-sm ${roleColors[member.role as keyof typeof roleColors] || "bg-muted text-muted-foreground"}`}>
                      <Shield className="h-3 w-3 mr-1.5 opacity-70" />
                      {member.role || "Member"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 opacity-50" />
                      {member.createdAt ? format(new Date(member.createdAt), "MMM d, yyyy") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-background hover:shadow-sm border border-transparent hover:border-muted-foreground/10 transition-all">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuItem 
                            onClick={() => router.push(`/authenticated/users/${member.id}`)}
                            className="rounded-md cursor-pointer"
                          >
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="rounded-md cursor-pointer"
                            onClick={() => setManagingMember(member)}
                          >
                            Manage Member
                          </DropdownMenuItem>
                          <div className="my-1 border-t" />
                          <DropdownMenuItem 
                            className="rounded-md cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => handleRemoveMember(member.id, member.organizationId!)}
                          >
                            Remove from Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {managingMember && (
        <ManageMemberDialog
          member={{
            id: managingMember.id,
            displayName: managingMember.displayName || `${managingMember.firstName || ""} ${managingMember.lastName || ""}`.trim() || managingMember.email,
            organizationId: managingMember.organizationId!,
            role: managingMember.role as any,
          }}
          open={!!managingMember}
          onOpenChange={(open) => !open && setManagingMember(null)}
        />
      )}
    </div>
  )
}
