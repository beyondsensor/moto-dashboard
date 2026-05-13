"use client"

import { Input } from "@workspace/ui/components/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition, useEffect, useState } from "react"
import { Search } from "lucide-react"

export function SiteFilters() {
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
      params.set('page', '1')
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

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search sites by name or code..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 bg-background/50 backdrop-blur-sm"
        />
      </div>
    </div>
  )
}
