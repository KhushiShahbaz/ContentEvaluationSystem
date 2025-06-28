'use client'
import { CheckCircle, Clock, FileVideo, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"

/**
 * Evaluator Dashboard component
 * Displays assigned videos, evaluation progress, and evaluation form
 *
 * @returns {JSX.Element} Evaluator Dashboard component
 */
const EvaluatorDashboard = () => {
  // Evaluator dashboard statistics
  const { user } = useAuth()

  const stats = {
    assignedVideos: { count: 8, message: "Teams assigned to you" },
    pendingReviews: { count: 5, message: "Awaiting your evaluation" },
    completed: { count: 3, message: "Evaluations submitted" },
    progress: { percentage: 37.5 },
  }

  // Pending evaluations data
  const pendingEvaluations = [
    { id: 1, name: "Team 1", project: "AI-Powered Content Analysis" },
    { id: 2, name: "Team 2", project: "AI-Powered Content Analysis" },
    { id: 3, name: "Team 3", project: "AI-Powered Content Analysis" },
    { id: 4, name: "Team 4", project: "AI-Powered Content Analysis" },
    { id: 5, name: "Team 5", project: "AI-Powered Content Analysis" },
  ]

  // Completed evaluations data
  const completedEvaluations = [
    { id: 6, name: "Team 6", score: 76 },
    { id: 7, name: "Team 7", score: 77 },
    { id: 8, name: "Team 8", score: 78 },
  ]

  return (
    // <ProtectedRoute allowedRoles={["evaluator"]}>

    //    <DashboardLayout role="evaluator" userName={user?.name} userEmail={user?.email}>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluator Dashboard</h1>
        <p className="text-muted-foreground">Review and evaluate team submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
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

      {/* Pending and Completed Evaluations Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Evaluations</TabsTrigger>
          <TabsTrigger value="completed">Completed Evaluations</TabsTrigger>
        </TabsList>

        {/* Pending Evaluations Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Evaluations</CardTitle>
              <CardDescription>Videos awaiting your evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.name}</p>
                      <p className="text-sm text-muted-foreground">Project: {evaluation.project}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                        Watch Video
                      </button>
                      <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
                        Evaluate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Evaluations Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Evaluations</CardTitle>
              <CardDescription>Videos you have already evaluated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.name}</p>
                      <p className="text-sm text-muted-foreground">Score: {evaluation.score}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Evaluation Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Form</CardTitle>
          <CardDescription>Select a video from the pending list to evaluate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
            <p>No video selected. Please select a video to evaluate from the pending list.</p>
          </div>
        </CardContent>
      </Card>
    </div>
    // </DashboardLayout>
    // </ProtectedRoute>
  )
}

export default EvaluatorDashboard
