'use client'
import { BarChart3, CheckCircle, Clock, FileVideo } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/context/auth-context"

/**
 * Team Dashboard component
 * Displays team status, project submission form, leaderboard, and feedback
 *
 * @returns {JSX.Element} Team Dashboard component
 */
export default function TeamDashboard() {
  const { user } = useAuth()

  // Team dashboard statistics
  const stats = {
    submissionStatus: { status: "Pending", deadline: "May 20, 2025" },
    evaluationStatus: { status: "Waiting", message: "Submit your project first" },
    currentRank: { rank: "--", message: "Awaiting evaluation" },
    teamMembers: { count: "4/5", percentage: 80 },
  }

  // Leaderboard data
  const leaderboardTeams = [
    { id: 1, name: "Team 9", project: "Interactive Learning Platform", score: 92 },
    { id: 2, name: "Team 8", project: "Interactive Learning Platform", score: 89 },
    { id: 3, name: "Team 7", project: "Interactive Learning Platform", score: 86 },
    { id: 4, name: "Team 6", project: "Interactive Learning Platform", score: 83 },
    { id: 5, name: "Team 5", project: "Interactive Learning Platform", score: 80 },
  ]

  return (
    
       <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
        <p className="text-muted-foreground">Submit your project, view feedback, and check your ranking</p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission Status</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.submissionStatus.status}</div>
            <p className="text-xs text-muted-foreground">Deadline: {stats.submissionStatus.deadline}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluation Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluationStatus.status}</div>
            <p className="text-xs text-muted-foreground">{stats.evaluationStatus.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentRank.rank}</div>
            <p className="text-xs text-muted-foreground">{stats.currentRank.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers.count}</div>
            <Progress value={stats.teamMembers.percentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

     

      {/* Leaderboard and Feedback Tabs */}
      {/* <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList> */}

        {/* Leaderboard Tab */}
        {/* <TabsContent value="leaderboard" className="space-y-4"> */}
          <Card>
            <CardHeader>
              <CardTitle>Current Leaderboard</CardTitle>
              <CardDescription>Top teams based on evaluation scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardTeams.map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">Project: {team.project}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{team.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        {/* </TabsContent> */}

        {/* Feedback Tab
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluator Feedback</CardTitle>
              <CardDescription>Feedback and comments from evaluators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                <p>No feedback available yet. Submit your project to receive evaluations.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      {/* </Tabs> */}
      </div>

  )
}
