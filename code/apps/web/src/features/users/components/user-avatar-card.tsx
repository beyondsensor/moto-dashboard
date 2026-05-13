"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { UserDetail } from "../types"
import { updateAvatar } from "../actions/update-avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Image, Loader2, Upload, User } from "lucide-react"

interface UserAvatarCardProps {
  user: UserDetail
}

export function UserAvatarCard({ user }: UserAvatarCardProps) {
  const [isPending, setIsPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    const formData = new FormData()
    formData.append("avatar", file)

    setIsPending(true)
    try {
      await updateAvatar(user.id, formData)
      toast.success("Avatar updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update avatar")
    } finally {
      setIsPending(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const initials = (`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || user.email?.[0] || "U").toUpperCase()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Image className="size-4" />
          </div>
          <CardTitle className="text-xl">Profile Picture</CardTitle>
        </div>
        <CardDescription>A profile picture helps identify the user.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-6">
        <Avatar className="h-32 w-32 border-4 border-muted">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || user.email} />
          <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload New Picture
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size 10MB.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
