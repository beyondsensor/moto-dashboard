import { AuthenticatedLayout } from "@/layouts/authenticated-layout"
import { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout> {children}</AuthenticatedLayout>
}
