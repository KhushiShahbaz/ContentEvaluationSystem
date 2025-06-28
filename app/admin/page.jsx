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
  const [evaluationProgress, setEvaluationProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const statsResponse = await adminAPI.getDashboardStats()
        const statsData=statsResponse?.data?.data
        setStats( {teams: { count: statsData.totalTeams, },
          evaluators: { count: statsData.totalEvaluators
            , pending: statsData.pendingEvaluators },
          submissions: { count: statsData.totalSubmissions, percentage: "0% of total teams" },
          evaluationsComplete: { percentage: 0 },})

        const evaluatorsResponse = await adminAPI.getPendingEvaluators()
        setPendingEvaluators(evaluatorsResponse?.data?.data )

        const progressResponse = await adminAPI.getEvaluationProgress()
        setEvaluationProgress(progressResponse?.data?.data )

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

  const handleApproveEvaluator = async (id) => {
    try {
      await adminAPI.approveEvaluator(id)
      setPendingEvaluators((prev) => prev.filter((e) => e.id !== id))
      setStats((prev) => ({
        ...prev,
        evaluators: {
          ...prev.evaluators,
          pending: prev.evaluators.pending - 1,
        },
      }))
    } catch (err) {
      console.error("Error approving evaluator:", err)
      setError("Failed to approve evaluator. Please try again.")
    }
  }

  const handleRejectEvaluator = async (id) => {
    try {
      await adminAPI.rejectEvaluator(id)
      setPendingEvaluators((prev) => prev.filter((e) => e.id !== id))
      setStats((prev) => ({
        ...prev,
        evaluators: {
          ...prev.evaluators,
          pending: prev.evaluators.pending - 1,
        },
      }))
    } catch (err) {
      console.error("Error rejecting evaluator:", err)
      setError("Failed to reject evaluator. Please try again.")
    }
  }

  return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage evaluators, teams, and monitor the evaluation process</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                <p className="text-xs text-muted-foreground">{stats?.submissions?.percentage}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluations Complete</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.evaluationsComplete?.percentage}%</div>
                <Progress value={stats?.evaluationsComplete?.percentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
              <TabsTrigger value="evaluations">Evaluation Progress</TabsTrigger>
            </TabsList>

            

            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Team Submissions</CardTitle>
                  <CardDescription>Latest project submissions from teams</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <p>Loading recent submissions...</p>
                    </div>
                  ) : recentSubmissions.length === 0 ? (
                    <div className="flex justify-center p-4">
                      <p>No recent submissions</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentSubmissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{submission?.teamName}</p>
                            <p className="text-sm text-muted-foreground">Project: {submission?.projectTitle}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button>View Details</Button>
                            <Button variant="outline">Assign Evaluators</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Progress</CardTitle>
                  <CardDescription>Track the progress of evaluations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <p>Loading evaluation progress...</p>
                    </div>
                  ) : Array.isArray(evaluationProgress) && evaluationProgress.length > 0 ? (
                    <div className="space-y-4">
                      {evaluationProgress.map((team) => (
                        <div key={team.id} className="space-y-2">
                          <div className="flex justify-between">
                              <p className="font-medium">{team?.name}</p>
                            <p className="text-sm text-muted-foreground">{team?.progress}% Complete</p>
                          </div>
                          <Progress value={team?.progress} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center p-4">
                      <p>No evaluation data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
  )
}
