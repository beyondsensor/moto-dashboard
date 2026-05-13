"use client"

import { Input } from "@workspace/ui/components/input"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { LayoutGrid, List } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useEffect, useState } from "react"

export function OrganizationFilters() {
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

  const handleViewChange = (view: string) => {
    if (!view) return
    startTransition(() => {
      router.push(`?${createQueryString("view", view)}`)
    })
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Search organizations..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
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
