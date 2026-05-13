"use client"

import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface UserNavProps {
  userId: string
}

export function UserNav({ userId }: UserNavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Overview",
      href: `/authenticated/users/${userId}`,
      active: pathname === `/authenticated/users/${userId}`,
    },
    {
      title: "Organizations",
      href: `/authenticated/users/${userId}/organizations`,
      active: pathname === `/authenticated/users/${userId}/organizations`,
    },
    {
      title: "Danger",
      href: `/authenticated/users/${userId}/danger`,
      active: pathname === `/authenticated/users/${userId}/danger`,
    },
  ]

  return (
    <div className="border-b">
      <nav className="flex space-x-4 lg:space-x-8" aria-label="User navigation">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center px-1 py-4 text-sm font-medium transition-colors hover:text-primary",
              item.active
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
