"use client"

import { Input } from "@workspace/ui/components/input"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { LayoutGrid, List, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useEffect, useState } from "react"

export function UserFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      if (name !== 'page') params.set('page', '1')
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        startTransition(() => {
          router.push(`?${createQueryString("search", searchValue)}`)
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue, createQueryString, router, searchParams])

  const handleRoleChange = (role: string) => {
    startTransition(() => {
      router.push(`?${createQueryString("role", role)}`)
    })
  }

  const handleViewChange = (view: string) => {
    if (!view) return
    startTransition(() => {
      router.push(`?${createQueryString("view", view)}`)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-4 w-full sm:max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Select
          value={searchParams.get("role") || "all"}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ToggleGroup
        type="single"
        value={searchParams.get("view") || "grid"}
        onValueChange={handleViewChange}
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
