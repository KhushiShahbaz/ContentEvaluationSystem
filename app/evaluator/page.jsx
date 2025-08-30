'use client'
import { CheckCircle, Clock, FileVideo, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { evaluatorAPI, evaluationAPI } from "@/services/api"

/**
 * Evaluator Dashboard component
 * Displays assigned videos, evaluation progress, and evaluation form
 *
 * @returns {JSX.Element} Evaluator Dashboard component
 */
const EvaluatorDashboard = () => {
  // Evaluator dashboard statistics
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [stats, setStats] = useState({
    assignedEvaluations: 0,
    pendingReviews: { count: 0, message: "Awaiting your evaluation" },
    completed: { count: 0, message: "Evaluations submitted" },
    progress: { percentage: 0 },
  })


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const id = user?.evaluatorId || user?._id
        if (!id) {
          setLoading(false)
          return
        }
        const [statsResponse] = await Promise.all([
          evaluatorAPI.getEvaluatorDashboardStats(id),
        ])
        const evaluatorData = statsResponse?.data?.data?.evaluator
        const s = evaluatorData?.stats || {}

        const assignedCount = Number(s.assignedEvaluations || 0)
        const completedCount = Number(s.completedEvaluations || 0)
        const pendingCount = Math.max(assignedCount - completedCount, 0)
        const progressPct = Math.round(Number(s.completionRate || (assignedCount > 0 ? (completedCount / assignedCount) * 100 : 0)))

        setStats({
          assignedEvaluations: assignedCount,
          pendingReviews: { count: pendingCount, message: "Awaiting your evaluation" },
          completed: { count: completedCount, message: "Evaluations submitted" },
          progress: { percentage: progressPct },
        })

        console.log({ evaluatorData })
        setLoading(false)

      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluator Dashboard</h1>
        <p className="text-muted-foreground">Review and evaluate team submissions</p>
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Teams</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assignedEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-1">Teams assigned for evaluation</p>
          </CardContent>
        </Card>
        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingReviews.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingReviews.message}</p>
          </CardContent>
        </Card>
        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.completed.message}</p>
          </CardContent>
        </Card>
        <Card className="py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{stats.progress.percentage}%</div>
            </div>
            <Progress value={stats.progress.percentage} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">Completion rate of your assigned evaluations</p>
          </CardContent>
        </Card>
      </div>
      {loading && (
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      )}
      
    </div>
  )
}

export default EvaluatorDashboard
