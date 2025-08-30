"use client"
import { ArrowLeft, Play, Download, Users, FileVideo, MessageSquare, Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { submissionAPI } from "@/services/api"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

// VideoPlayer component for handling multiple video platforms
const VideoPlayer = ({ videoLink }) => {
  if (!videoLink) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No video link provided</p>
        </div>
      </div>
    )
  }

  // YouTube
  if (videoLink.includes('youtube.com') || videoLink.includes('youtu.be')) {
    const getYouTubeEmbedURL = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
    }
    
    const embedUrl = getYouTubeEmbedURL(videoLink)
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title="Project Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none rounded"
        />
      )
    }
  }

  // Vimeo
  if (videoLink.includes('vimeo.com')) {
    const getVimeoEmbedURL = (url) => {
      const regExp = /vimeo\.com\/(\d+)/
      const match = url.match(regExp)
      return match ? `https://player.vimeo.com/video/${match[1]}` : null
    }
    
    const embedUrl = getVimeoEmbedURL(videoLink)
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title="Project Video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none rounded"
        />
      )
    }
  }

  // Dailymotion
  if (videoLink.includes('dailymotion.com')) {
    const getDailymotionEmbedURL = (url) => {
      const regExp = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/
      const match = url.match(regExp)
      return match ? `https://www.dailymotion.com/embed/video/${match[1]}` : null
    }
    
    const embedUrl = getDailymotionEmbedURL(videoLink)
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title="Project Video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none rounded"
        />
      )
    }
  }

  // Google Drive
  if (videoLink.includes('drive.google.com')) {
    const getGoogleDriveEmbedURL = (url) => {
      const regExp = /\/d\/([a-zA-Z0-9-_]+)/
      const match = url.match(regExp)
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null
    }
    
    const embedUrl = getGoogleDriveEmbedURL(videoLink)
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title="Project Video"
          allow="autoplay"
          className="w-full h-full border-none rounded"
        />
      )
    }
  }

  // For other platforms or if embed fails, show external link
  return (
    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground mb-2">Video from external platform</p>
        <Button asChild variant="outline" size="sm">
          <a href={videoLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Video
          </a>
        </Button>
      </div>
    </div>
  )
}

export default function SubmissionDetailPage({ params }) {
const [submission,setSubmission]=useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const{id}=useParams()
  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await submissionAPI.getSubmission(id)
        const submissionData = res?.data?.data

        if (!submissionData) {
          setError('Submission not found')
          return
        }

        const formattedSubmission = {
          id: submissionData?._id || Math.random(),
          projectTitle: submissionData?.projectTitle || 'Untitled Project',
          description: submissionData?.description || 'No description provided',
          status: submissionData?.status || "pending",
          evaluationStatus: "not-started",
          submissionDate: submissionData?.submittedAt ? new Date(submissionData.submittedAt).toLocaleDateString() : 'Unknown date',
          teamName: submissionData?.teamId?.name || "N/A",
          teamLead: submissionData?.submittedBy || "Unknown",
          teamMembers: submissionData?.teamId?.members || [],
          videoLink: submissionData?.videoLink || '',
          averageScore: submissionData?.averageScore || 0,
          assignedEvaluators: submissionData?.evaluations?.map((e) => ({
            name: e?.evaluatorId?.name || 'Unknown Evaluator',
            expertise: e?.evaluatorId?.expertise || 'Not specified',
            status: e?.status || 'Unknown',
            score: e?.scores || 0,
          })) || [],
          learningOutcomes: submissionData?.learningOutcomes || 'No learning outcomes specified'
        }
        
        setSubmission(formattedSubmission)
        
  
        // getSubmission(formattedSubmissions)
      } catch (err) {
        console.error("Error fetching submission:", err)
        setError('Failed to load submission data')
      } finally {
        setLoading(false)
      }
    }
  
    fetchTeamAndSubmission()
  }, [id])

  const getEvaluatorStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const completedEvaluations = submission?.assignedEvaluators?.filter((e) => e.status === "completed").length || 0
  const totalEvaluators = submission?.assignedEvaluators?.length || 0
  const progressPercentage = totalEvaluators > 0 ? (completedEvaluations / totalEvaluators) * 100 : 0
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading submission details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Submission</h1>
          <p className="text-muted-foreground mb-4">{error || 'Submission not found'}</p>
          <Button asChild>
            <Link href="/admin/submissions">Back to Submissions</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/submissions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{submission.projectTitle}</h1>
          <p className="text-muted-foreground">
            {submission.teamName} • Submitted on {submission.submissionDate}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Project Video */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Project Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video rounded overflow-hidden">
                <VideoPlayer videoLink={submission.videoLink} />
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="learning">Learning Outcomes</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{submission.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                  <CardDescription>Skills and knowledge gained through this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm leading-relaxed">
                    {submission.learningOutcomes}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evaluation Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>
                      {completedEvaluations}/{totalEvaluators} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>
                {submission?.averageScore && submission.averageScore > 0 ? (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{submission.averageScore}</div>
                    <div className="text-sm text-muted-foreground">Current Average Score</div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-muted-foreground">-</div>
                    <div className="text-sm text-muted-foreground">No scores yet</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission?.teamMembers && submission.teamMembers.length > 0 ? (
                  submission.teamMembers.map((member, index) => (
                    <div key={member?._id || index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${member?.name || 'user'}`} />
                        <AvatarFallback>{member?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {member?.name || 'Unknown Member'}
                          </span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs">Lead</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {member?.email || 'No email'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No team members found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Evaluators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Assigned Evaluators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission?.assignedEvaluators && submission.assignedEvaluators.length > 0 ? (
                  submission.assignedEvaluators.map((evaluator, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{evaluator.name}</p>
                        <p className="text-xs text-muted-foreground">{evaluator.expertise}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEvaluatorStatusBadge(evaluator.status)}
                        {evaluator.score && typeof evaluator.score === 'object' ? (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(Object.values(evaluator.score).reduce((sum, score) => sum + (score || 0), 0) / Object.keys(evaluator.score).length)}/100
                          </Badge>
                        ) : evaluator.score ? (
                          <Badge variant="outline" className="text-xs">
                            {evaluator.score}/100
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No evaluators assigned yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Prop validation
SubmissionDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}
