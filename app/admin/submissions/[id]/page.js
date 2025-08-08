"use client"
import { ArrowLeft, Play, Download, Users, FileVideo, MessageSquare, Star } from "lucide-react"
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

export default function SubmissionDetailPage({ params }) {
const [submission,setSubmission]=useState([])
const{id}=useParams()
  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      try {
        const res = await submissionAPI.getSubmission(id)
        const submissionData = res?.data?.data

        const formattedSubmission = {
          id: submissionData._id,
          projectTitle: submissionData.projectTitle,
          description: submissionData.description,
          status: submissionData.status || "pending",
          evaluationStatus: "not-started",
          submissionDate: new Date(submissionData.submittedAt).toLocaleDateString(),
          teamName: submissionData.teamId?.name || "N/A",
          teamLead: submissionData.submittedBy || "Unknown",
          teamMembers: submissionData.teamMembers || [],
          videoLink: submissionData.videoLink,
          averageScore: submissionData.averageScore,
          assignedEvaluators: submissionData.evaluations?.map((e) => ({
            name: e.evaluatorName,
            expertise: e.expertise,
            status: e.status,
            score: e.score,
          })) || [],
          learningOutcomes: submissionData.learningOutcomes
        }
        
        setSubmission(formattedSubmission)
        
  
        getSubmission(formattedSubmissions)
      } catch (err) {
        console.warn("No submission found.")
      }
    }
  
    fetchTeamAndSubmission()
  }, [])

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

  const completedEvaluations = submission?.assignedEvaluators?.filter((e) => e.status === "completed").length
  const totalEvaluators = submission?.assignedEvaluators?.length
  const progressPercentage = (completedEvaluations / totalEvaluators) * 100
  const getYouTubeEmbedURL = (url) => {
    const videoId = url?.split("v=")[1]?.split("&")[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        
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
            <iframe
              src={getYouTubeEmbedURL(submission.videoLink)}
              title="Project Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none rounded"
            />
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
                  <ul className="space-y-2">
                    {submission?.learningOutcomes}
                  </ul>
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
                {submission?.averageScore && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{submission?.averageScore}</div>
                    <div className="text-sm text-muted-foreground">Current Average Score</div>
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
                {submission?.members?.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${member.name}`} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        {member.role === "Team Lead" && (
                          <Badge variant="outline" className="text-xs">
                            Lead
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Evaluators */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Evaluators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submission?.assignedEvaluators?.map((evaluator, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{evaluator.name}</p>
                        <p className="text-xs text-muted-foreground">{evaluator.email}</p>
                      </div>
                      {getEvaluatorStatusBadge(evaluator.status)}
                    </div>
                    {evaluator.score && (
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Score: {evaluator.score}</span>
                      </div>
                    )}
                    {index < submission.assignedEvaluators.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
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
