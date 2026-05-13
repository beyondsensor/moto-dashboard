export default function SiteSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Settings className="size-8 text-primary" />
      </div>
      <h2 className="text-xl font-bold">Site Settings</h2>
      <p className="text-muted-foreground max-w-sm mt-2">
        Manage site configuration, coordinates, and general settings. Implementation is coming soon.
      </p>
    </div>
  )
}

import { Settings } from "lucide-react"
