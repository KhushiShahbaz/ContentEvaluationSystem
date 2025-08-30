"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Edit, Calendar, Users, FileText, Video, Star, Play, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { submissionAPI, evaluationAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function SubmissionDetailsPage({ params }) {
  const { user } = useAuth()
  const [submission, setSubmission] = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch submission details
        const submissionRes = await submissionAPI.getSubmission(params.id)
        const submissionData = submissionRes?.data?.data
        setSubmission(submissionData)
        
        // Fetch evaluations for this submission
        const evaluationRes = await evaluationAPI.getSubmissionEvaluations(params.id)
        const evaluationData = evaluationRes?.data?.data || []
        setEvaluations(evaluationData)
        
      } catch (error) {
        console.error("Error fetching submission details:", error)
        setError("Failed to load submission details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSubmissionDetails()
    }
  }, [params.id])

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
      case 'pending': return <Calendar className="h-4 w-4" />
      case 'submitted': return <FileText className="h-4 w-4" />
      case 'published': return <Star className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
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
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Submission Not Found</h1>
          <p className="text-muted-foreground">{error || "The requested submission could not be found."}</p>
          <Button asChild className="mt-4">
            <Link href="/team">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate evaluation stats
  const completedEvaluations = evaluations.filter(e => e.status === 'submitted' || e.status === 'published')
  const totalScore = completedEvaluations.reduce((sum, e) => sum + (e.totalScore || 0), 0)
  const averageScore = completedEvaluations.length > 0 ? totalScore / completedEvaluations.length : 0
  const evaluationProgress = evaluations.length > 0 ? (completedEvaluations.length / evaluations.length) * 100 : 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{submission.projectTitle}</h1>
          <p className="text-muted-foreground">Submission Details</p>
        </div>
        <Button asChild>
          <Link href={`/team/submit?id=${submission._id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Submission
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Project Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Details about your project submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Project Title</h4>
                <p className="text-lg">{submission.projectTitle}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Learning Outcomes</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.learningOutcomes}</p>
              </div>
            </CardContent>
          </Card>

          {/* Video Submission */}
          <Card>
            <CardHeader>
              <CardTitle>Video Submission</CardTitle>
              <CardDescription>Your project video</CardDescription>
            </CardHeader>
            <CardContent>
              {submission.videoLink ? (
                <div className="aspect-video bg-muted rounded-md">
                  <VideoPlayer videoUrl={submission.videoLink} />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No video submitted</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Members involved in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission.teamMembers && submission.teamMembers.length > 0 ? (
                  submission.teamMembers.map((member) => (
                    <div key={member._id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name?.charAt(0) || 'M'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h5 className="font-medium">{member.name}</h5>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No team members assigned</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Status</CardTitle>
              <CardDescription>Current project status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={getStatusColor(submission.status)}>
                  {submission.status}
                </Badge>
                {getStatusIcon(submission.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Submitted</span>
                  <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                </div>
                {submission.evaluationDueDate && (
                  <div className="flex justify-between text-sm">
                    <span>Evaluation Due</span>
                    <span>{new Date(submission.evaluationDueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Progress</CardTitle>
              <CardDescription>Feedback from evaluators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{evaluationProgress.toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              
              <Progress value={evaluationProgress} className="h-2" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Evaluations:</span>
                  <span>{evaluations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span>{completedEvaluations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span>{evaluations.length - completedEvaluations.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          {completedEvaluations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
                <CardDescription>Combined evaluator scores</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600">{Math.round(averageScore)}</div>
                <p className="text-sm text-muted-foreground">out of 100 points</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Based on {completedEvaluations.length} evaluation{completedEvaluations.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Evaluations Section */}
      {evaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluations</CardTitle>
            <CardDescription>Detailed feedback from evaluators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluations.map((evaluation) => (
                <div key={evaluation._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={evaluation.evaluatorId?.avatar} />
                        <AvatarFallback>{evaluation.evaluatorId?.name?.charAt(0) || 'E'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h5 className="font-medium">{evaluation.evaluatorId?.name || 'Evaluator'}</h5>
                        <p className="text-sm text-muted-foreground">{evaluation.evaluatorId?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(evaluation.status)}>
                        {evaluation.status}
                      </Badge>
                      {evaluation.totalScore && (
                        <Badge variant="outline">{evaluation.totalScore}/100</Badge>
                      )}
                    </div>
                  </div>
                  
                  {evaluation.feedback && (
                    <div className="mb-3">
                      <h6 className="text-sm font-medium mb-1">Feedback:</h6>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {evaluation.feedback}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(evaluation.updatedAt || evaluation.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Video Player Component for different video platforms
function VideoPlayer({ videoUrl }) {
  const [videoType, setVideoType] = useState('unknown')
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    if (!videoUrl) return

    // Determine video type and create appropriate embed URL
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setVideoType('youtube')
      // Convert YouTube URLs to embed format
      let videoId = ''
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0]
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
      }
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`)
      }
    } else if (videoUrl.includes('vimeo.com')) {
      setVideoType('vimeo')
      // Convert Vimeo URLs to embed format
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0]
      if (videoId) {
        setEmbedUrl(`https://player.vimeo.com/video/${videoId}`)
      }
    } else if (videoUrl.includes('dailymotion.com')) {
      setVideoType('dailymotion')
      // Convert Dailymotion URLs to embed format
      const videoId = videoUrl.split('dailymotion.com/video/')[1]?.split('?')[0]
      if (videoId) {
        setEmbedUrl(`https://www.dailymotion.com/embed/video/${videoId}`)
      }
    } else if (videoUrl.includes('drive.google.com')) {
      setVideoType('googledrive')
      // Convert Google Drive URLs to embed format
      const fileId = videoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (fileId) {
        setEmbedUrl(`https://drive.google.com/file/d/${fileId}/preview`)
      }
    } else {
      setVideoType('external')
      setEmbedUrl(videoUrl)
    }
  }, [videoUrl])

  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No video URL provided</p>
        </div>
      </div>
    )
  }

  if (videoType === 'youtube' || videoType === 'vimeo' || videoType === 'dailymotion' || videoType === 'googledrive') {
    return (
      <iframe
        className="w-full h-full rounded"
        src={embedUrl}
        title="Project Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
      />
    )
  }

  // For other platforms, show a link with preview
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-4">
        <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Video Available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This video is hosted on an external platform
        </p>
      </div>
      <Button asChild className="w-full max-w-xs">
        <a href={videoUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Watch Video
        </a>
      </Button>
    </div>
  )
}
