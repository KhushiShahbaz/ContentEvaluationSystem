"use client"
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { evaluationAPI } from "@/services/api"
import { useEffect, useState } from "react"

export default function EvaluationSummaryPage() {
const[teamEvaluations,setTeamEvaluations]=useState([])

  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      try {
        const res = await evaluationAPI.getEvaluations()
        const submissionData = res?.data?.data || []        
        const formattedSubmissions = submissionData?.map((submission) => {
          return {
            id: submission._id,
            projectTitle: submission.submissionId.projectTitle,
            description: submission.submissionId.description,
            status: submission.status || "pending",
            evaluationStatus: "not-started", // you can change this logic if backend provides it
            submissionDate: new Date(submission.submissionId.submittedAt).toLocaleDateString(),
            teamName: submission.submissionId?.teamId.name || "N/A",
            teamLead: submission.submissionId.teamId.leaderId.name || "Unknown",
            teamMembers: submission.submissionId.teamId.members || [],
            videoLink: submission.submissionId.videoLink,
            averageScore: submission.averageScore,
            assignedEvaluators: submission.evaluatorId.name,
          }
        })

        setTeamEvaluations(formattedSubmissions)
      } catch (err) {
        console.warn("No submission found.")
      }
    }

    fetchTeamAndSubmission()
  }, [])



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

  const handleExportReport = () => {
    console.log("Exporting evaluation report...")
    alert("Evaluation report exported successfully!")
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamEvaluations.map((team) =>{
                    console.log(team)
                    return (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.teamName}</TableCell>
                      <TableCell>{team.project}</TableCell>
                      <TableCell>{team.submissionDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(team.evaluationsCompleted / team.evaluatorsAssigned) * 100}
                            className="w-16"
                          />
                          <span className="text-sm text-muted-foreground">
                            {team.evaluationsCompleted}/{team.evaluatorsAssigned}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {team.averageScore ? (
                          <span className="font-medium">{team.averageScore}</span>
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
                  )})}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  )
}
