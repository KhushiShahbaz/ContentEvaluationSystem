"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/context/auth-context"
import { adminAPI } from "@/services/api"
import { BarChart3, FileVideo, Shield, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    teams: { count: 0, change: "0 from last week" },
    evaluators: { count: 0, pending: 0 },
    submissions: { count: 0, percentage: "0% of total teams" },
    evaluationsComplete: { percentage: 0 },
  })
  const [pendingEvaluators, setPendingEvaluators] = useState([])
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [evaluationProgress, setEvaluationProgress] = useState({
    totalSubmissions: 0,
    evaluatedSubmissions: 0,
    progressPercent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const statsResponse = await adminAPI.getDashboardStats()
        const statsData = statsResponse?.data?.data || {}
        setStats({
          teams: { 
            count: statsData?.totalTeams || 0, 
            change: "0 from last week" 
          },
          evaluators: { 
            count: statsData?.totalEvaluators || 0, 
            pending: statsData?.pendingEvaluators || 0 
          },
          submissions: { 
            count: statsData?.totalSubmissions || 0, 
            percentage: "0% of total teams" 
          },
          evaluationsComplete: { 
            percentage: 0 
          }
        })

        const evaluatorsResponse = await adminAPI.getPendingEvaluators()
        setPendingEvaluators(evaluatorsResponse?.data?.data || [])

        const progressResponse = await adminAPI.getEvaluationProgress()
        const progressData = progressResponse?.data?.data || { totalSubmissions: 0, evaluatedSubmissions: 0, progressPercent: 0 }
        setEvaluationProgress(progressData)

        console.log(statsResponse, evaluatorsResponse, progressResponse)
        setLoading(false)
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage evaluators, teams, and monitor the evaluation process</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.teams?.count}</div>
                <p className="text-xs text-muted-foreground">{stats?.teams?.change}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.evaluators?.count}</div>
                <p className="text-xs text-muted-foreground">{stats?.evaluators?.pending} pending approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <FileVideo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.submissions?.count}</div>
                <p className="text-xs text-muted-foreground">
                  {evaluationProgress?.totalSubmissions > 0
                    ? `${Math.round((stats?.submissions?.count / evaluationProgress.totalSubmissions) * 100)}% of total submissions`
                    : "0% of total submissions"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluations Complete</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evaluationProgress?.progressPercent}%</div>
                <Progress value={evaluationProgress?.progressPercent} className="mt-2" />
              </CardContent>
            </Card>
          </div>
            </>
          )}
        </div>
    )
  }
