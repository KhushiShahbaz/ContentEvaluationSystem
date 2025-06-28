"use client"
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/**
 * Evaluation Summary Page for Administrators
 * Provides comprehensive overview of all evaluations and their progress
 *
 * @returns {JSX.Element} Evaluation Summary Page component
 */
export default function EvaluationSummaryPage() {
  // Summary statistics
  const stats = {
    totalSubmissions: 24,
    completedEvaluations: 18,
    pendingEvaluations: 6,
    averageScore: 78.5,
    evaluationProgress: 75,
  }

  // Team evaluation data
  const teamEvaluations = [
    {
      id: 1,
      teamName: "Team Alpha",
      project: "AI Content Analyzer",
      submissionDate: "2024-01-10",
      evaluatorsAssigned: 3,
      evaluationsCompleted: 3,
      averageScore: 92,
      status: "completed",
      evaluators: ["Dr. Wilson", "Prof. Anderson", "Dr. Kim"],
    },
    {
      id: 2,
      teamName: "Team Beta",
      project: "Virtual Learning Platform",
      submissionDate: "2024-01-12",
      evaluatorsAssigned: 3,
      evaluationsCompleted: 2,
      averageScore: 89,
      status: "in-progress",
      evaluators: ["Dr. Wilson", "Prof. Anderson", "Dr. Rodriguez"],
    },
    {
      id: 3,
      teamName: "Team Gamma",
      project: "Smart Health Tracker",
      submissionDate: "2024-01-14",
      evaluatorsAssigned: 3,
      evaluationsCompleted: 1,
      averageScore: 87,
      status: "in-progress",
      evaluators: ["Prof. Anderson", "Dr. Kim", "Dr. Chen"],
    },
    {
      id: 4,
      teamName: "Team Delta",
      project: "Automated Trading System",
      submissionDate: "2024-01-15",
      evaluatorsAssigned: 3,
      evaluationsCompleted: 0,
      averageScore: null,
      status: "pending",
      evaluators: ["Dr. Wilson", "Dr. Rodriguez", "Dr. Chen"],
    },
  ]

  // Evaluator performance data
  const evaluatorPerformance = [
    {
      id: 1,
      name: "Dr. James Wilson",
      assignedEvaluations: 8,
      completedEvaluations: 6,
      averageTimePerEvaluation: "2.5 hours",
      averageScore: 85.2,
      completionRate: 75,
    },
    {
      id: 2,
      name: "Prof. Lisa Anderson",
      assignedEvaluations: 9,
      completedEvaluations: 8,
      averageTimePerEvaluation: "3.1 hours",
      averageScore: 82.7,
      completionRate: 89,
    },
    {
      id: 3,
      name: "Dr. Robert Kim",
      assignedEvaluations: 7,
      completedEvaluations: 4,
      averageTimePerEvaluation: "2.8 hours",
      averageScore: 79.3,
      completionRate: 57,
    },
  ]

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

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Teams submitted projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvaluations}</div>
            <p className="text-xs text-muted-foreground">Evaluations finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
            <p className="text-xs text-muted-foreground">Awaiting evaluation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Overall average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluationProgress}%</div>
            <Progress value={stats.evaluationProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Team Evaluations</TabsTrigger>
          <TabsTrigger value="evaluators">Evaluator Performance</TabsTrigger>
        </TabsList>

        {/* Team Evaluations Tab */}
        <TabsContent value="teams" className="space-y-4">
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
                  {teamEvaluations.map((team) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluator Performance Tab */}
        <TabsContent value="evaluators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluator Performance</CardTitle>
              <CardDescription>Monitor evaluator productivity and scoring patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evaluator</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluatorPerformance.map((evaluator) => (
                    <TableRow key={evaluator.id}>
                      <TableCell className="font-medium">{evaluator.name}</TableCell>
                      <TableCell>{evaluator.assignedEvaluations}</TableCell>
                      <TableCell>{evaluator.completedEvaluations}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={evaluator.completionRate} className="w-16" />
                          <span className="text-sm">{evaluator.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{evaluator.averageTimePerEvaluation}</TableCell>
                      <TableCell>{evaluator.averageScore}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
