import Image from "next/image"
import React from "react"
import { isFirstUser } from "@/features/onboarding/actions/is-first-user"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Check if there are any users. If not, redirect to onboarding.
  const isFirst = await isFirstUser()
  if (isFirst) {
    redirect("/onboarding")
  }

  // 2. Check if the user is logged in, if so redirect to authenticated home.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    console.log("Redirecting")
    redirect("/authenticated/home")
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side: Hero Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/auth-hero.jpg"
          alt="Authentication Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Moto<span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-lg text-zinc-200">
              Next Generation Building Management System designed for Future.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Component */}
      <div className="flex w-full flex-col items-center justify-center  p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center justify-center lg:hidden">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Moto<span className="text-primary">Dashboard</span>
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
