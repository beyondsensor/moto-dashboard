"use client"

import React, { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@workspace/ui/components/button"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

import { SupabaseImage } from "./supabase-image"

interface ImageUploadProps {
  value?: string | null // This will now be the relative path
  onChange: (path: string | null) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
  bucket: string // e.g. org-{orgId}
  path: string // e.g. sites/{siteId}/buildings/{buildingId}/exterior
  label?: string
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  bucket,
  path,
  label = "Image",
  disabled,
  className
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    try {
      setIsUploading(true)
      onUploadStart?.()

      // Generate unique filename with timestamp for cache busting
      const fileExt = file.name.split(".").pop()
      const timestamp = Math.floor(Date.now() / 1000)
      const fileName = `${path.split("/").pop()}_${timestamp}.${fileExt}`
      const parentPath = path.substring(0, path.lastIndexOf("/"))
      const fullPath = `${parentPath}/${fileName}`

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fullPath, file, {
          cacheControl: "3600",
          upsert: true
        })

      if (error) throw error

      // Cleanup old file if exists
      if (value && !value.startsWith("http")) {
        try {
          await supabase.storage.from(bucket).remove([value])
        } catch (cleanupError) {
          console.error("Error cleaning up old image:", cleanupError)
        }
      }

      onChange(data.path)
      toast.success(`${label} updated successfully`)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
      onUploadEnd?.()
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      if (!value.startsWith("http")) {
        await supabase.storage.from(bucket).remove([value])
      }
      onChange(null)
      toast.success(`${label} removed`)
    } catch (error: any) {
      toast.error("Failed to remove image")
    }
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        {value && !disabled && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] font-bold text-destructive hover:underline uppercase tracking-tight"
          >
            Remove
          </button>
        )}
      </div>

      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`
          aspect-square relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300
          ${value ? "h-[400px] sm:h-[600px]" : "h-[200px]"}
          ${!disabled && !isUploading ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5" : "cursor-default opacity-60"}
          ${isUploading ? "bg-muted/30" : "bg-muted/5"}
          flex flex-col items-center justify-center text-center p-4
          ${className || ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 text-primary animate-spin" />
            <p className="text-xs font-bold text-primary uppercase">Uploading...</p>
          </div>
        ) : value ? (
          <SupabaseImage
            bucket={bucket}
            path={value}
            alt={label}
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-tight">Click to upload</p>
              <p className="text-[10px] text-muted-foreground uppercase">PNG, JPG, or WEBP</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
