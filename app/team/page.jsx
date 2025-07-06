'use client'

import { useEffect, useState } from "react"
import { BarChart3, CheckCircle, Clock, FileVideo } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import { teamAPI } from "@/services/api"

export default function TeamDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.teamId) return

    const fetchStats = async () => {
      try {
        const statsResponse = await teamAPI.getTeamDashboardStats(user.teamId)
        const data=statsResponse?.data
        console.log(statsResponse)
        setStats({
          submissionStatus: {
            status: data.submissionStatus.status,
            deadline: data.submissionStatus.deadline,
          },
          evaluationStatus: {
            status: data.evaluationStatus.status,
            message: data.evaluationStatus.message,
          },
          currentRank: {
            rank: data.rank.current !== null ? data.rank.current : "--",
            message: data.rank.message,
          },
          teamMembers: {
            count: `${data.teamMembers.joined}/${data.teamMembers.total}`,
            percentage: Math.round((data.teamMembers.joined / data.teamMembers.total) * 100),
          },
        })
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
        <p className="text-muted-foreground">Submit your project, view feedback, and check your ranking</p>
      </div>

      <div className="grid gap-10 grid-cols-2 mx-[8rem]">
        {/* Submission Status */}
        <Card className="h-[12rem] w-[25rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission Status</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.submissionStatus.status}</div>
            <p className="text-xs text-muted-foreground">Deadline: {stats.submissionStatus.deadline}</p>
          </CardContent>
        </Card>

        {/* Evaluation Status */}
        <Card className="h-[12rem] w-[25rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluation Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluationStatus.status}</div>
            <p className="text-xs text-muted-foreground">{stats.evaluationStatus.message}</p>
          </CardContent>
        </Card>

        {/* Current Rank */}
        <Card className="h-[12rem] w-[25rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentRank.rank}</div>
            <p className="text-xs text-muted-foreground">{stats.currentRank.message}</p>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="h-[12rem] w-[25rem]">
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
    </div>
  )
}
