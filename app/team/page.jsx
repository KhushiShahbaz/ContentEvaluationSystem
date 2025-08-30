"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  FileText, 
  Video, 
  Trophy, 
  Calendar, 
  Plus, 
  Edit, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Target,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { teamAPI, submissionAPI, evaluationAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeamDashboard() {
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMembers: 0,
    projectStatus: 'Not Started',
    evaluationProgress: 0,
    averageScore: 0,
    pendingEvaluations: 0
  })

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?.teamId) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        
        // Fetch team information
        const teamRes = await teamAPI.getTeam(user.teamId)
        const teamData = teamRes?.data?.data
        setTeam(teamData)
        
        // Fetch team submissions
        const submissionRes = await submissionAPI.getTeamSubmissions(user.teamId)
        const submissionData = submissionRes?.data?.data || []
        setSubmissions(submissionData)
        
        // Fetch evaluations for the team
        const evaluationRes = await evaluationAPI.getTeamEvaluations(user.teamId)
        const evaluationData = evaluationRes?.data?.data || []
        setEvaluations(evaluationData)
        
        // Calculate stats with safe defaults
        const currentSubmission = submissionData.find(s => s?.status === 'pending' || s?.status === 'submitted')
        const completedEvaluations = evaluationData.filter(e => e?.status === 'submitted' || e?.status === 'published')
        const totalScore = completedEvaluations.reduce((sum, e) => sum + (e?.totalScore || 0), 0)
        const avgScore = completedEvaluations.length > 0 ? totalScore / completedEvaluations.length : 0
        
        setStats({
          totalMembers: (teamData?.members?.length || 0) + 1, // +1 for leader
          projectStatus: currentSubmission?.status || 'Not Started',
          evaluationProgress: completedEvaluations.length || 0,
          averageScore: Math.round(avgScore * 10) / 10 || 0,
          pendingEvaluations: evaluationData.filter(e => e?.status === 'draft' || e?.status === 'pending').length || 0
        })
        
      } catch (error) {
        console.error("Error fetching team data:", error)
        // Set safe defaults on error
        setStats({
          totalMembers: 0,
          projectStatus: 'Error',
          evaluationProgress: 0,
          averageScore: 0,
          pendingEvaluations: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'submitted': return <CheckCircle className="h-4 w-4" />
      case 'published': return <Trophy className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user?.teamId) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Team Assigned</h1>
          <p className="text-muted-foreground">You are not part of any team yet.</p>
          <Button asChild className="mt-4">
            <Link href="/register">Join a Team</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team Loading Error</h1>
          <p className="text-muted-foreground">Unable to load team information. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">Team Dashboard</p>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={getStatusColor(stats.projectStatus)}>
              {stats.projectStatus}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluationProgress}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
            <p className="text-xs text-muted-foreground">Awaiting feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Project Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Current project status and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <div key={submission._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{submission.projectTitle}</h4>
                        <Badge variant="secondary" className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{submission.description}</p>
                      {submission.evaluationDueDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(submission.evaluationDueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No projects submitted yet</p>
                    <Button asChild className="mt-2">
                      <Link href="/team/submit">Submit Your First Project</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest team updates and evaluations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluations.length > 0 ? (
                  evaluations.slice(0, 5).map((evaluation) => (
                    <div key={evaluation._id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(evaluation.status)}`}>
                        {getStatusIcon(evaluation.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Evaluation {evaluation.status === 'submitted' ? 'completed' : evaluation.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evaluation.updatedAt || evaluation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {evaluation.totalScore && (
                        <Badge variant="outline">{evaluation.totalScore}/100</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No evaluations yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Team Leader */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.leader?.avatar} />
                    <AvatarFallback>{team.leader?.name?.charAt(0) || 'L'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{team.leader?.name || 'Team Leader'}</h4>
                    <p className="text-sm text-muted-foreground">Team Leader</p>
                  </div>
                  <Badge variant="secondary">Leader</Badge>
                </div>

                <Separator />

                {/* Team Members */}
                {team.members && team.members.length > 0 ? (
                  team.members.map((member) => (
                    <div key={member._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name?.charAt(0) || 'M'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline">Member</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No team members yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Track all your project submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission?._id || Math.random()} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-lg">{submission?.projectTitle || 'Untitled Project'}</h4>
                        <Badge variant="secondary" className={getStatusColor(submission?.status || 'unknown')}>
                          {submission?.status || 'unknown'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{submission?.description || 'No description provided'}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Submitted: {submission?.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                        {submission?.evaluationDueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Due: {new Date(submission.evaluationDueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/team/submit?id=${submission?._id || ''}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/team/submissions/${submission?._id || ''}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                  <Button asChild className="mt-2">
                    <Link href="/team/submit">Submit Your First Project</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluations Tab */}
        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
              <CardDescription>View feedback and scores from evaluators</CardDescription>
            </CardHeader>
            <CardContent>
              {evaluations.length > 0 ? (
                <div className="space-y-4">
                  {evaluations.map((evaluation) => (
                    <div key={evaluation?._id || Math.random()} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Evaluation #{evaluation?._id ? evaluation._id.slice(-6) : 'Unknown'}</h4>
                        <Badge variant="secondary" className={getStatusColor(evaluation?.status || 'unknown')}>
                          {evaluation?.status || 'unknown'}
                        </Badge>
                      </div>
                      
                      {evaluation?.totalScore && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Total Score:</span>
                            <span className="text-2xl font-bold text-blue-600">{evaluation.totalScore}/100</span>
                          </div>
                          <Progress value={evaluation.totalScore} className="h-2" />
                        </div>
                      )}

                      {evaluation?.averageScore && (
                        <div className="mb-3">
                          <span className="text-sm text-muted-foreground">
                            Average Score: {evaluation.averageScore}/10
                          </span>
                        </div>
                      )}

                      {evaluation?.feedback && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Feedback:</h5>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {evaluation.feedback}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {evaluation?.updatedAt || evaluation?.createdAt ? 
                          new Date(evaluation.updatedAt || evaluation.createdAt).toLocaleDateString() : 
                          'Unknown date'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No evaluations yet</p>
                  <p className="text-sm text-muted-foreground">Evaluations will appear here once submitted</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
