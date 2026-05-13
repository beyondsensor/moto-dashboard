import { AuthenticatedLayout } from "@/layouts/authenticated-layout"
import { Toaster } from "@workspace/ui/components/sonner"
import { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedLayout>
      {children}
      <Toaster />
    </AuthenticatedLayout>
  )
}
