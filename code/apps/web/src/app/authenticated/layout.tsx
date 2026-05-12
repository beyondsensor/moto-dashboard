import { AuthenticatedLayout } from "@/layouts/authenticated-layout"
import { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
  // TODO : Check if the Site is onboarded. If not, redirect to /onboarding
  // TODO : Check if the User is authenticated. If not, redirect to /auth/login

  return <AuthenticatedLayout> {children}</AuthenticatedLayout>
}
