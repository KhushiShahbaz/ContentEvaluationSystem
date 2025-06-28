"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

/**
 * Reset password page component
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.token - Password reset token
 */
export default function ResetPasswordPage({ params }) {
  return <ResetPasswordForm token={params.token} />
}
