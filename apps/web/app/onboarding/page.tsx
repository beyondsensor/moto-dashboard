import { isFirstUser } from "@/features/onboarding/actions"
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const isFirst = await isFirstUser()

  if (!isFirst) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <OnboardingForm />
    </div>
  )
}
