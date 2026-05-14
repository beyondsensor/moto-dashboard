"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { AlertCircle, ImageIcon } from "lucide-react"

interface SupabaseImageProps {
  bucket: string
  path: string | null | undefined
  alt?: string
  className?: string
  fallback?: React.ReactNode
}

export function SupabaseImage({ 
  bucket, 
  path, 
  alt = "Image", 
  className,
  fallback 
}: SupabaseImageProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function getSignedUrl() {
      if (!path) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(false)
        const supabase = createClient()
        
        // Check if it's already a full URL (legacy or external)
        if (path.startsWith("http")) {
          if (isMounted) {
            setUrl(path)
            setLoading(false)
          }
          return
        }

        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 3600) // 1 hour

        if (error || !data) {
          throw error || new Error("Failed to get signed URL")
        }

        if (isMounted) {
          setUrl(data.signedUrl)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error creating signed URL:", err)
        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    getSignedUrl()

    return () => {
      isMounted = false
    }
  }, [bucket, path])

  if (!path) return fallback || null

  if (loading) {
    return <Skeleton className={`animate-pulse bg-muted ${className}`} />
  }

  if (error || !url) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/50 border border-muted/20 gap-2 ${className}`}>
        <AlertCircle className="size-5 text-muted-foreground/50" />
        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase">Error Loading</span>
      </div>
    )
  }

  return (
    <img 
      src={url} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  )
}
