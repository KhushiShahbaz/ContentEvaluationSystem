"use client"
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { evaluationAPI, adminAPI } from "@/services/api"
import { useEffect, useState } from "react"

export default function EvaluationSummaryPage() {
  const [teamEvaluations, setTeamEvaluations] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await evaluationAPI.getEvaluations()
        const submissionData = res?.data?.data || []        
        const formattedSubmissions = submissionData?.map((evaluation) => {
          const status = evaluation?.status || "draft"
          const evaluatorsAssigned = 1
          const evaluationsCompleted = ["submitted", "published"].includes(status) ? 1 : 0
          return {
            id: evaluation?._id || Math.random(),
            projectTitle: evaluation?.submissionId?.projectTitle || 'Untitled Project',
            description: evaluation?.submissionId?.description || 'No description',
            status,
            submissionDate: evaluation?.submissionId?.submittedAt ? new Date(evaluation.submissionId.submittedAt).toLocaleDateString() : "-",
            teamName: evaluation?.submissionId?.teamId?.name || "N/A",
            teamLead: evaluation?.submissionId?.teamId?.leaderId?.name || "Unknown",
            teamMembers: evaluation?.submissionId?.teamId?.members || [],
            videoLink: evaluation?.submissionId?.videoLink || '',
            averageScore: evaluation?.averageScore || 0,
            evaluatorsAssigned,
            evaluationsCompleted,
          }
        })

        setTeamEvaluations(formattedSubmissions)
      } catch (err) {
        console.error("Error fetching evaluations:", err)
        setError('Failed to load evaluation data')
        setTeamEvaluations([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamAndSubmission()
  }, [])


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true)
        const res = await adminAPI.getLeaderboard()
        console.log("Leaderboard API response:", res)
        const leaderboardData = res?.data?.data || []
        console.log("Leaderboard data:", leaderboardData)
        
        // If no leaderboard data from API, create one from evaluations
        if (!leaderboardData || leaderboardData.length === 0) {
          console.log("No leaderboard data from API, creating from evaluations")
          const evaluationsLeaderboard = teamEvaluations
            .filter(team => team.totalScore && team.totalScore > 0)
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
            .map((team, index) => ({
              _id: team.id,
              name: team.teamName,
              totalScore: team.totalScore,
              currentRank: index + 1
            }))
          console.log("Created leaderboard from evaluations:", evaluationsLeaderboard)
          setLeaderboard(evaluationsLeaderboard)
        } else {
          setLeaderboard(leaderboardData)
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
      } finally {
        setLeaderboardLoading(false)
      }
    }
    fetchLeaderboard()
  }, [teamEvaluations])



  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleExportReport = async () => {
    try {
      const res = await evaluationAPI.exportReport()
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const fileName = `evaluation_report_${new Date().toISOString().slice(0,10)}.csv`
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed", err)
      alert("Failed to export evaluation report")
    }
  }

  const handlePublishLeaderboard = async () => {
    try {
      await adminAPI.publishLeaderboard()
      const res = await adminAPI.getLeaderboard()
      setLeaderboard(res?.data?.data || [])
      alert("Leaderboard published")
    } catch (err) {
      console.error("Publish leaderboard failed", err)
      alert("Failed to publish leaderboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Summary</h1>
          <p className="text-muted-foreground">Comprehensive overview of all evaluations and progress</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      
          <Card>
            <CardHeader>
              <CardTitle>Team Evaluation Status</CardTitle>
              <CardDescription>Track the progress of each team's evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-muted-foreground">Loading evaluations...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-medium mb-2">Error Loading Evaluations</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : teamEvaluations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-medium mb-2">No Evaluations Found</h3>
                  <p className="text-muted-foreground mb-4">No team evaluations are available yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Total Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamEvaluations.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.teamName}</TableCell>
                      <TableCell>{team.projectTitle}</TableCell>
                      <TableCell>{team.submissionDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={Math.min(100, Math.max(0, (team.evaluationsCompleted / (team.evaluatorsAssigned || 1)) * 100))} className="w-16" />
                          <span className="text-sm text-muted-foreground">
                            {team.evaluationsCompleted}/{team.evaluatorsAssigned}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {team.totalScore && team.totalScore > 0 ? (
                          <span className="font-medium">{team.totalScore}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(team.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/evaluations/${team.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          </Card>
      
    </div>
  )
}
