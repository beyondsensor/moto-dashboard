"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface SiteContextType {
  siteId: string | null
  setSiteId: (id: string | null) => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ 
  children, 
  initialSiteId 
}: { 
  children: ReactNode, 
  initialSiteId: string | null 
}) {
  const [siteId, setSiteIdState] = useState<string | null>(initialSiteId)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const setSiteId = (id: string | null) => {
    setSiteIdState(id)
    
    // Set cookie
    if (id) {
      document.cookie = `selected_site_id=${id}; path=/; max-age=31536000; SameSite=Lax`
    } else {
      document.cookie = `selected_site_id=; path=/; max-age=0; SameSite=Lax`
    }

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set("siteId", id)
    } else {
      params.delete("siteId")
    }
    
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  // Sync from URL if it changes (e.g. browser back/forward or manual URL edit)
  useEffect(() => {
    const urlSiteId = searchParams.get("siteId")
    if (urlSiteId && urlSiteId !== siteId) {
      setSiteIdState(urlSiteId)
      document.cookie = `selected_site_id=${urlSiteId}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [searchParams, siteId])

  return (
    <SiteContext.Provider value={{ siteId, setSiteId }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}
