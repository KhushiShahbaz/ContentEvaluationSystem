"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/context/auth-context"

export default function EvaluatorDashboardPage({ children }) {
  const { user } = useAuth()


  return (
    <ProtectedRoute allowedRoles={["evaluator"]}>
      <DashboardLayout role="evaluator" userName={user?.name} userEmail={user?.email}>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children} {/* This acts like Outlet */}
      </main>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
