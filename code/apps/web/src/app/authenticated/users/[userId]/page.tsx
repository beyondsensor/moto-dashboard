import { getUser } from "@/features/users/actions/get-user"
import { UserDetailsCard } from "@/features/users/components/user-details-card"
import { UserAvatarCard } from "@/features/users/components/user-avatar-card"
import { UserAccountCard } from "@/features/users/components/user-account-card"

interface UserOverviewPageProps {
  params: Promise<{ userId: string }>
}

export default async function UserOverviewPage({ params }: UserOverviewPageProps) {
  const { userId } = await params
  const user = await getUser(userId)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <UserAccountCard user={user} />
        <UserAvatarCard user={user} />
        <UserDetailsCard user={user} />
      </div>
    </div>
  )
}


