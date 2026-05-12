"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

export default function SplashScreen() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20) // 100 * 20ms = 2 seconds

    const timeout = setTimeout(() => {
      router.push("/auth/login")
    }, 2500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-sans text-white">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="z-10 flex flex-col items-center space-y-8 text-center">
        {/* Logo Container */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/30 blur-2xl animate-pulse" />
          <h1 className="relative text-6xl font-bold tracking-tighter sm:text-7xl">
            Motorola<span className="text-primary">Dashboard</span>
          </h1>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Initializing System
          </p>

          {/* Progress Bar Container */}
          <div className="h-[2px] w-48 overflow-hidden rounded-full bg-zinc-800 sm:w-64">
            <div
              className="h-full bg-primary transition-all duration-75 ease-out shadow-[0_0_10px_#ea580c]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute bottom-12 left-12 h-8 w-8 border-b-2 border-l-2 border-zinc-800" />
      <div className="absolute bottom-12 right-12 h-8 w-8 border-b-2 border-r-2 border-zinc-800" />
      <div className="absolute top-12 left-12 h-8 w-8 border-t-2 border-l-2 border-zinc-800" />
      <div className="absolute top-12 right-12 h-8 w-8 border-t-2 border-r-2 border-zinc-800" />

      <footer className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
        © 2026 Moto Dashboard v1.0.0
      </footer>
    </div>
  )
}
