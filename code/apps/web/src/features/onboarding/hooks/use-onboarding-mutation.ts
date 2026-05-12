import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { completeOnboarding } from "../actions/complete-onboarding"
import { OnboardingValues } from "../schemas"

export function useOnboardingMutation() {
  const router = useRouter()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (values: OnboardingValues) => {
      await completeOnboarding(values)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (signInError) throw signInError
    },
    onSuccess: () => {
      router.push("/authenticated")
    },
  })
}
