"use client"

import { useEffect, useState } from "react"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminAPI, evaluationAPI } from "@/services/api"

/**
 * Leaderboard Control Page for Administrators
 * Allows admins to manage and publish the competition leaderboard
 *
 * @returns {JSX.Element} Leaderboard Control Page component
 */
export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)

  // Criteria breakdown with proper weightages as per project requirements
  const criteriaBreakdown = [
    { name: "Relevance to LOs & Outcomes", score: 5, weightage: 5 },
    { name: "Innovation & Creativity", score: 15, weightage: 15 },
    { name: "Clarity & Accessibility", score: 10, weightage: 10 },
    { name: "Depth", score: 5, weightage: 5 },
    { name: "Interactivity & Engagement", score: 25, weightage: 25 },
    { name: "Use of Technology", score: 5, weightage: 5 },
    { name: "Scalability & Adaptability", score: 10, weightage: 10 },
    { name: "Alignment with Ethical Standards", score: 5, weightage: 5 },
    { name: "Practical Application", score: 10, weightage: 10 },
    { name: "Video Quality", score: 10, weightage: 10 },
  ]

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getLeaderboard()
      console.log("Leaderboard API response:", res)
      const leaderboardData = res?.data?.data || []
      console.log("Leaderboard data:", leaderboardData)
      
      // If no leaderboard data from API, create one from evaluations
      if (!leaderboardData || leaderboardData.length === 0) {
        console.log("No leaderboard data from API, creating from evaluations")
        try {
          const evaluationsRes = await evaluationAPI.getEvaluations()
          const evaluationsData = evaluationsRes?.data?.data || []
          console.log("All evaluations data:", evaluationsData)
          
          // Log evaluation statuses for debugging
          const statusCounts = evaluationsData.reduce((acc, evaluation) => {
            acc[evaluation?.status || 'unknown'] = (acc[evaluation?.status || 'unknown'] || 0) + 1
            return acc
          }, {})
          console.log("Evaluation status counts:", statusCounts)
          
          // Create leaderboard from evaluations
          const filteredEvaluations = evaluationsData.filter(evaluation => {
            // Only include evaluations that are completed (submitted = completed, published = completed) AND have scores
            const isCompleted = evaluation?.status === "completed" || evaluation?.status === "submitted" || evaluation?.status === "published"
            if (isCompleted && evaluation?.scores && typeof evaluation.scores === 'object') {
              const totalScore = Object.values(evaluation.scores).reduce((sum, score) => sum + (score || 0), 0)
              return totalScore > 0
            }
            return false
          })
          
          console.log("Filtered completed evaluations (status: completed/submitted/published):", filteredEvaluations.length)
          console.log("Filtered evaluations:", filteredEvaluations)
          
          const evaluationsLeaderboard = filteredEvaluations
            .map((evaluation, index) => {
              // Calculate total score
              let totalScore = 0
              if (evaluation?.scores && typeof evaluation.scores === 'object') {
                totalScore = Object.values(evaluation.scores).reduce((sum, score) => sum + (score || 0), 0)
              }
              
              return {
                _id: evaluation?._id || `eval-${index}`,
                name: evaluation?.submissionId?.teamId?.name || 'Unknown Team',
                totalScore: totalScore,
                currentRank: index + 1,
                submissions: [{
                  projectTitle: evaluation?.submissionId?.projectTitle || 'Untitled Project'
                }]
              }
            })
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
            .map((team, index) => ({
              ...team,
              currentRank: index + 1
            }))
          
          console.log("Created leaderboard from evaluations:", evaluationsLeaderboard)
          setLeaderboard(evaluationsLeaderboard)
        } catch (evalErr) {
          console.error("Failed to fetch evaluations for fallback:", evalErr)
          setLeaderboard([])
        }
      } else {
        setLeaderboard(leaderboardData)
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard", err)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handlePublishLeaderboard = async () => {
    try {
      await adminAPI.publishLeaderboard()
      const res = await adminAPI.getLeaderboard()
      setLeaderboard(res?.data?.data || [])
      alert("Leaderboard published successfully!")
    } catch (err) {
      console.error("Publish leaderboard failed", err)
      alert("Failed to publish leaderboard")
    }
  }

  const handleExportLeaderboard = () => {
    try {
              const header = ["Rank", "Team", "TotalScore", "ProjectTitle"]
              const rows = leaderboard.map((t) => [
          t.currentRank ?? "",
          t.name ?? "",
         t.totalScore ?? t.averageScore ?? 0,
          t.submissions?.[0]?.projectTitle ?? "",
        ])
      const csv = [header, ...rows]
        .map((r) => r.map((v) => {
          const s = String(v).replace(/[\n\r]/g, " ")
          return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }).join(","))
        .join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `leaderboard_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export leaderboard failed", err)
      alert("Failed to export leaderboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard Control</h1>
          <p className="text-muted-foreground">Manage and publish the competition leaderboard</p>
        </div>
         <div className="flex gap-2">
           <Button variant="outline" onClick={handleExportLeaderboard}>
             <Download className="mr-2 h-4 w-4" />
             Export
           </Button>
           <Button variant="outline" onClick={() => {
             setLoading(true)
             fetchLeaderboard()
           }}>
             Refresh
           </Button>
         </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Team Rankings Card */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Rankings</CardTitle>
              <CardDescription>Based on total scores from evaluators</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Teams</DropdownMenuItem>
                <DropdownMenuItem>Top 5</DropdownMenuItem>
                <DropdownMenuItem>Top 10</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sort by Score</DropdownMenuItem>
                <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
                </div>
                             ) : leaderboard.length === 0 ? (
                 <div className="text-center py-8">
                   <div className="text-6xl mb-4">🏆</div>
                   <h3 className="text-lg font-medium mb-2">No Completed Evaluations</h3>
                   <p className="text-muted-foreground mb-4">Only teams with completed evaluations will appear on the leaderboard.</p>
                 </div>
              ) : (
                leaderboard.map((team) => (
                  <div key={team._id} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {team.currentRank ?? "-"}
                    </div>
                    <div className="flex-1 min-w-0">
                                             <div className="flex justify-between mb-1">
                         <p className="font-medium truncate">{team.name}</p>
                         <p className="font-bold">{team.totalScore ?? team.averageScore ?? 0}</p>
                       </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate">{team.submissions?.[0]?.projectTitle || '-'}</p>
                      </div>
                                             <Progress value={Math.min(100, Math.max(0, (Number(team.totalScore ?? team.averageScore ?? 0) / 10)))} className="mt-1" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
                </Card>

        {/* Criteria Breakdown Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Evaluation Criteria & Weightages</CardTitle>
            <CardDescription>Criteria breakdown with proper weightages as per project requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criteriaBreakdown.map((criterion) => (
                <div key={criterion.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{criterion.name}</p>
                      <p className="text-xs text-muted-foreground">Weight: {criterion.weightage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{criterion.weightage}%</p>
                    </div>
                  </div>
                  <Progress value={criterion.weightage} className="h-2" />
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Weightage</span>
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Settings and Preview Tabs */}
        <Tabs defaultValue="settings" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Leaderboard Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Configure how the leaderboard is displayed to teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Toggle settings */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Team Names</p>
                      <p className="text-sm text-muted-foreground">Display team names on the leaderboard</p>
                    </div>
                    <div className="flex h-6 w-11 items-center rounded-full bg-primary p-1">
                      <div className="h-4 w-4 rounded-full bg-primary-foreground"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Project Titles</p>
                      <p className="text-sm text-muted-foreground">Display project titles on the leaderboard</p>
                    </div>
                    <div className="flex h-6 w-11 items-center rounded-full bg-primary p-1">
                      <div className="h-4 w-4 rounded-full bg-primary-foreground"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Detailed Scores</p>
                      <p className="text-sm text-muted-foreground">Display criteria breakdown for each team</p>
                    </div>
                    <div className="flex h-6 w-11 items-center rounded-full bg-muted p-1 justify-end">
                      <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Only Top 5</p>
                      <p className="text-sm text-muted-foreground">Limit leaderboard to top 5 teams</p>
                    </div>
                    <div className="flex h-6 w-11 items-center rounded-full bg-muted p-1 justify-end">
                      <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Preview</CardTitle>
                <CardDescription>Preview how the leaderboard will appear to teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div className="font-bold text-lg">Rank</div>
                    <div className="font-bold text-lg">Team</div>
                    <div className="font-bold text-lg">Score</div>
                  </div>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading preview...</p>
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No completed evaluations available</p>
                    </div>
                  ) : (
                    leaderboard.slice(0, 5).map((team, index) => (
                      <div key={team._id || index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {team.currentRank ?? index + 1}
                          </div>
                        </div>
                        <div className="font-medium">{team.name || '-'}</div>
                        <div className="font-bold text-lg">{team.totalScore ?? team.averageScore ?? 0}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
