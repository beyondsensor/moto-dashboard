"use client"

import { useState } from "react"
import { uploadLogoAction } from "../actions/upload-logo"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Upload, ImageIcon } from "lucide-react"
import { SupabaseImage } from "@/components/supabase-image"

import { toast } from "sonner"

interface LogoUploadProps {
  organizationId: string
  currentLogoUrl?: string | null
}

export function LogoUpload({ organizationId, currentLogoUrl }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      await uploadLogoAction(organizationId, formData)
      toast.success("Logo uploaded successfully")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Logo</CardTitle>
        <CardDescription>
          Upload a high-resolution logo for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">

        <div className="flex items-center gap-6">
          <div className="h-32 w-32 rounded-lg border flex items-center justify-center bg-muted overflow-hidden relative">
            <SupabaseImage 
              bucket={`org-${organizationId}`}
              path={currentLogoUrl}
              alt="Logo"
              className="h-full w-full object-contain"
              fallback={<ImageIcon className="h-10 w-10 text-muted-foreground" />}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById("logo-input")?.click()}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Logo
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF. Max size 5MB.
            </p>
            <input
              id="logo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
