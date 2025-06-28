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

/**
 * Detailed Team Submission View Page
 * Shows comprehensive information about a specific team submission
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Submission ID
 * @returns {JSX.Element} Detailed submission view component
 */
export default function SubmissionDetailPage({ params }) {
  // Sample detailed submission data
  const submission = {
    id: params.id,
    teamName: "Team Alpha",
    teamLead: "John Smith",
    teamMembers: [
      { name: "John Smith", role: "Team Lead", email: "john.smith@university.edu" },
      { name: "Sarah Johnson", role: "Frontend Developer", email: "sarah.j@university.edu" },
      { name: "Mike Chen", role: "Backend Developer", email: "mike.chen@university.edu" },
      { name: "Lisa Wang", role: "UI/UX Designer", email: "lisa.wang@university.edu" },
    ],
    projectTitle: "AI-Powered Content Analysis Platform",
    description:
      "An intelligent platform that analyzes content using machine learning algorithms to provide insights and recommendations for content creators. The platform uses natural language processing to understand content sentiment, readability, and engagement potential. It also provides automated suggestions for improving content quality and reach.",
    learningOutcomes: [
      "Understanding of natural language processing and its applications",
      "Implementation of machine learning models for text analysis",
      "Building scalable web applications with modern frameworks",
      "User experience design for complex data visualization",
      "Integration of AI services and APIs",
      "Database design for handling large datasets",
    ],
    videoLink: "https://youtube.com/watch?v=example1",
    submissionDate: "2024-01-15",
    status: "assigned",
    assignedEvaluators: [
      { name: "Dr. James Wilson", expertise: "Computer Vision, Deep Learning", status: "completed", score: 92 },
      { name: "Prof. Lisa Anderson", expertise: "Natural Language Processing", status: "in-progress", score: null },
      { name: "Dr. Robert Kim", expertise: "Cybersecurity, Blockchain", status: "pending", score: null },
    ],
    evaluationStatus: "in-progress",
    averageScore: 92,
    tags: ["AI", "Machine Learning", "Web Development", "NLP"],
    technicalDetails: {
      technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB"],
      githubRepo: "https://github.com/team-alpha/content-analyzer",
      liveDemo: "https://content-analyzer-demo.vercel.app",
      documentation: "https://docs.content-analyzer.com",
    },
  }

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

  const completedEvaluations = submission.assignedEvaluators.filter((e) => e.status === "completed").length
  const totalEvaluators = submission.assignedEvaluators.length
  const progressPercentage = (completedEvaluations / totalEvaluators) * 100

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
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <div className="text-center">
                  <FileVideo className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Video player would be embedded here</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <a href={submission.videoLink} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Watch on YouTube
                  </a>
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="learning">Learning Outcomes</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{submission.description}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {submission.technicalDetails.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
                    {submission.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">GitHub Repository</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.technicalDetails.githubRepo} target="_blank" rel="noopener noreferrer">
                        View Code
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Live Demo</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.technicalDetails.liveDemo} target="_blank" rel="noopener noreferrer">
                        View Demo
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Documentation</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={submission.technicalDetails.documentation} target="_blank" rel="noopener noreferrer">
                        View Docs
                      </a>
                    </Button>
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
                {submission.averageScore && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{submission.averageScore}</div>
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
                {submission.teamMembers.map((member, index) => (
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
                {submission.assignedEvaluators.map((evaluator, index) => (
                  <div key={index}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{evaluator.name}</p>
                        <p className="text-xs text-muted-foreground">{evaluator.expertise}</p>
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

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Team
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href={`/admin/evaluations/${submission.id}`}>View Detailed Evaluations</Link>
              </Button>
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
