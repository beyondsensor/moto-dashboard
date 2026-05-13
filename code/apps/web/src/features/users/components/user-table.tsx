"use client"

import { UserWithRole } from "../types"
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
import { MoreHorizontal, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

interface UserTableProps {
  users: UserWithRole[]
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter()
  const roleColors = {
    owner: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = (`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || user.email?.[0] || "U").toUpperCase()
            return (
              <TableRow 
                key={user.id} 
                className="hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => router.push(`/authenticated/users/${user.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || user.email} />
                      <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {user.displayName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`capitalize font-normal text-[10px] px-2 py-0 ${roleColors[user.role as keyof typeof roleColors] || "bg-muted text-muted-foreground"}`}>
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    {user.role || "No Organization"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isSystemAdmin ? (
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      System Admin
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Active</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/authenticated/users/${user.id}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

