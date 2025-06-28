"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

/**
 * Protected route component
 * Ensures only authenticated users with specific roles can access certain pages
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Redirect if user doesn't have the required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/admin")
        } else if (user.role === "team") {
          router.push("/team")
        } else if (user.role === "evaluator") {
          router.push("/evaluator")
        } else {
          router.push("/")
        }
      }
    }
  }, [isAuthenticated, user, loading, router, allowedRoles])

  // Show loading state while checking authentication
  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl font-bold">Loading...</div>
          <p className="text-muted-foreground">Please wait while we verify your access</p>
        </div>
      </div>
    )
  }

  // If user has required role, render children
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children
  }

  // This should not be reached due to the redirect in useEffect
  return null
}
