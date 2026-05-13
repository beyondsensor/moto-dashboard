"use client"

import { UserWithRole } from "../types"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Mail, Shield, User, MoreHorizontal } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

interface UserCardProps {
  user: UserWithRole
}

export function UserCard({ user }: UserCardProps) {
  const initials = (`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || user.email?.[0] || "U").toUpperCase()

  const roleColors = {
    owner: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group relative hover:border-primary/50">
      <Link href={`/authenticated/users/${user.id}`} className="absolute inset-0 z-0" />
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || user.email} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <h3 className="font-semibold text-sm truncate max-w-[150px] group-hover:text-primary transition-colors">
              {user.displayName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/authenticated/users/${user.id}`}>View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem>Change Role</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex items-center justify-between mt-2 relative z-10 pointer-events-none">
        <Badge variant="secondary" className={`capitalize font-normal text-[10px] px-2 py-0 ${roleColors[user.role as keyof typeof roleColors] || "bg-muted text-muted-foreground"}`}>
          <Shield className="h-2.5 w-2.5 mr-1" />
          {user.role || "No Organization"}
        </Badge>
        {user.isSystemAdmin && (
          <Badge variant="outline" className="text-[10px] px-2 py-0">
            System Admin
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

