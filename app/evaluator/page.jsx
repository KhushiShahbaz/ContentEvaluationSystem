'use client'
import { CheckCircle, Clock, FileVideo, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { evaluatorAPI } from "@/services/api"

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

  const stats = {
    assignedVideos: { count: 8, message: "Teams assigned to you" },
    pendingReviews: { count: 5, message: "Awaiting your evaluation" },
    completed: { count: 3, message: "Evaluations submitted" },
    progress: { percentage: 37.5 },
  }


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const statsResponse = await evaluatorAPI.getEvaluatorDashboardStats(user.evaluatorId)
        const statsData=statsResponse?.data?.data

        // setStats( {teams: { count: statsData.totalTeams, },
        //   evaluators: { count: statsData.totalEvaluators
        //     , pending: statsData.pendingEvaluators },
        //   submissions: { count: statsData.totalSubmissions, percentage: "0% of total teams" },
        //   evaluationsComplete: { percentage: 0 },})
        console.log(statsData)

      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluator Dashboard</h1>
        <p className="text-muted-foreground">Review and evaluate team submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-20 grid-cols-2  m-40">
        <Card className="py-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedVideos.count}</div>
            <p className="text-xs text-muted-foreground">{stats.assignedVideos.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews.count}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingReviews.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed.count}</div>
            <p className="text-xs text-muted-foreground">{stats.completed.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progress.percentage}%</div>
            <Progress value={stats.progress.percentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}

export default EvaluatorDashboard
