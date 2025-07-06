"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LoginForm } from "@/components/auth/login-form"

/**
 * Home page component
 * Redirects authenticated users to their respective dashboards
 */
export default function Home() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "team-member" || user.role==="team-leader") {
        router.push("/team")
      } else if (user.role === "evaluator") {
        router.push("/evaluator")
      }
    }
  }, [user, isAuthenticated, loading, router])

  // Show login form for unauthenticated users
  if (!isAuthenticated && !loading) {
    return <LoginForm />
  }

  // Loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl font-bold">Loading...</div>
        <p className="text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
