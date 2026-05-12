"use client"

import { useMutation } from "@tanstack/react-query"
import { loginAction } from "../actions/login-action"
import { forgotPasswordAction } from "../actions/forgot-password-action"
import { resetPasswordAction } from "../actions/reset-password-action"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      if (data.success) {
        router.push("/authenticated/home")
        router.refresh()
      }
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordAction,
  })

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: (data) => {
      if (data.success) {
        router.push("/auth/login")
      }
    },
  })

  return {
    login: loginMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  }
}
