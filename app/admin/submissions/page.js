"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Eye,
  Users,
  Calendar,
  FileVideo,
  Download,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Team Submissions Page for Administrators
 * Allows admins to view, manage, and assign evaluators to team submissions
 *
 * @returns {JSX.Element} Team Submissions Page component
 */
export default function TeamSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedEvaluators, setSelectedEvaluators] = useState([])

  // Sample team submissions data
  const teamSubmissions = [
    {
      id: 1,
      teamName: "Team Alpha",
      teamLead: "John Smith",
      teamMembers: ["John Smith", "Sarah Johnson", "Mike Chen", "Lisa Wang"],
      projectTitle: "AI-Powered Content Analysis Platform",
      description:
        "An intelligent platform that analyzes content using machine learning algorithms to provide insights and recommendations for content creators.",
      learningOutcomes: [
        "Understanding of natural language processing",
        "Implementation of machine learning models",
        "Building scalable web applications",
        "User experience design for complex data visualization",
      ],
      videoLink: "https://youtube.com/watch?v=example1",
      submissionDate: "2024-01-15",
      status: "pending-assignment",
      assignedEvaluators: [],
      evaluationStatus: "not-started",
      averageScore: null,
      tags: ["AI", "Machine Learning", "Web Development"],
    },
    {
      id: 2,
      teamName: "Team Beta",
      teamLead: "Emily Rodriguez",
      teamMembers: ["Emily Rodriguez", "David Kim", "Anna Thompson", "James Wilson"],
      projectTitle: "Virtual Learning Environment",
      description:
        "A comprehensive virtual learning platform with interactive features, real-time collaboration, and adaptive learning algorithms.",
      learningOutcomes: [
        "Educational technology implementation",
        "Real-time communication systems",
        "Adaptive learning algorithms",
        "User interface design for education",
      ],
      videoLink: "https://youtube.com/watch?v=example2",
      submissionDate: "2024-01-14",
      status: "assigned",
      assignedEvaluators: ["Dr. Wilson", "Prof. Anderson", "Dr. Kim"],
      evaluationStatus: "in-progress",
      averageScore: 89,
      tags: ["Education", "Virtual Reality", "Collaboration"],
    },
    {
      id: 3,
      teamName: "Team Gamma",
      teamLead: "Michael Brown",
      teamMembers: ["Michael Brown", "Jessica Lee", "Robert Taylor"],
      projectTitle: "Smart Health Monitoring System",
      description:
        "IoT-based health monitoring system that tracks vital signs and provides real-time health insights using wearable devices.",
      learningOutcomes: [
        "IoT device integration",
        "Real-time data processing",
        "Health data analytics",
        "Mobile application development",
      ],
      videoLink: "https://youtube.com/watch?v=example3",
      submissionDate: "2024-01-13",
      status: "assigned",
      assignedEvaluators: ["Dr. Rodriguez", "Prof. Chen", "Dr. Anderson"],
      evaluationStatus: "completed",
      averageScore: 92,
      tags: ["IoT", "Healthcare", "Mobile Development"],
    },
    {
      id: 4,
      teamName: "Team Delta",
      teamLead: "Sophie Martinez",
      teamMembers: ["Sophie Martinez", "Alex Johnson", "Ryan Davis", "Maria Garcia", "Tom Wilson"],
      projectTitle: "Sustainable Energy Management Platform",
      description:
        "A platform for monitoring and optimizing energy consumption in smart buildings using AI and IoT sensors.",
      learningOutcomes: [
        "Sustainable technology development",
        "Energy optimization algorithms",
        "IoT sensor networks",
        "Data visualization and analytics",
      ],
      videoLink: "https://youtube.com/watch?v=example4",
      submissionDate: "2024-01-12",
      status: "under-review",
      assignedEvaluators: ["Dr. Kim", "Prof. Anderson"],
      evaluationStatus: "in-progress",
      averageScore: 87,
      tags: ["Sustainability", "IoT", "Energy Management"],
    },
  ]

  // Available evaluators for assignment
  const availableEvaluators = [
    { id: 1, name: "Dr. James Wilson", expertise: "Computer Vision, Deep Learning" },
    { id: 2, name: "Prof. Lisa Anderson", expertise: "Natural Language Processing" },
    { id: 3, name: "Dr. Robert Kim", expertise: "Cybersecurity, Blockchain" },
    { id: 4, name: "Dr. Emily Rodriguez", expertise: "Data Science, Analytics" },
    { id: 5, name: "Prof. Michael Chen", expertise: "Software Engineering, Cloud Computing" },
  ]

  // Statistics
  const stats = {
    totalSubmissions: teamSubmissions.length,
    pendingAssignment: teamSubmissions.filter((s) => s.status === "pending-assignment").length,
    assigned: teamSubmissions.filter((s) => s.status === "assigned").length,
    underReview: teamSubmissions.filter((s) => s.status === "under-review").length,
    completed: teamSubmissions.filter((s) => s.evaluationStatus === "completed").length,
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending-assignment":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Assignment</Badge>
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>
      case "under-review":
        return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getEvaluationStatusBadge = (status) => {
    switch (status) {
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAssignEvaluators = () => {
    if (selectedEvaluators.length === 0) {
      alert("Please select at least one evaluator")
      return
    }

    console.log(`Assigning evaluators ${selectedEvaluators} to submission ${selectedSubmission.id}`)
    setIsAssignDialogOpen(false)
    setSelectedEvaluators([])
    alert("Evaluators assigned successfully!")
  }

  const handleEvaluatorToggle = (evaluatorId) => {
    setSelectedEvaluators((prev) =>
      prev.includes(evaluatorId) ? prev.filter((id) => id !== evaluatorId) : [...prev, evaluatorId],
    )
  }

  const handleExportSubmissions = () => {
    console.log("Exporting submissions data...")
    alert("Submissions data exported successfully!")
  }

  const filteredSubmissions = teamSubmissions.filter(
    (submission) =>
      submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.teamLead.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Submissions</h1>
          <p className="text-muted-foreground">Manage team project submissions and evaluator assignments</p>
        </div>
        <Button onClick={handleExportSubmissions}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingAssignment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by team name, project title, or team lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>All Submissions</DropdownMenuItem>
            <DropdownMenuItem>Pending Assignment</DropdownMenuItem>
            <DropdownMenuItem>Assigned</DropdownMenuItem>
            <DropdownMenuItem>Under Review</DropdownMenuItem>
            <DropdownMenuItem>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-6">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Project Info */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{submission.projectTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {submission.teamName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {submission.submissionDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(submission.status)}
                      {getEvaluationStatusBadge(submission.evaluationStatus)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{submission.description}</p>

                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Team Members ({submission.teamMembers.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {submission.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://avatar.vercel.sh/${member}`} />
                            <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{member}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs ml-1">
                              Lead
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {submission.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Assigned Evaluators */}
                  {submission.assignedEvaluators.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assigned Evaluators</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.assignedEvaluators.map((evaluator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {evaluator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions and Score */}
                <div className="space-y-4">
                  {submission.averageScore && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{submission.averageScore}</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full" size="sm" asChild>
                      <Link href={`/admin/submissions/${submission.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full" size="sm" asChild>
                      <a href={submission.videoLink} target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </a>
                    </Button>

                    {submission.status === "pending-assignment" && (
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign Evaluators
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Evaluators</DialogTitle>
                            <DialogDescription>
                              Select evaluators to review {submission.teamName}'s project
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Available Evaluators</Label>
                              <div className="mt-2 space-y-2">
                                {availableEvaluators.map((evaluator) => (
                                  <div key={evaluator.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`evaluator-${evaluator.id}`}
                                      checked={selectedEvaluators.includes(evaluator.id)}
                                      onCheckedChange={() => handleEvaluatorToggle(evaluator.id)}
                                    />
                                    <Label htmlFor={`evaluator-${evaluator.id}`} className="flex-1">
                                      <div>
                                        <div className="font-medium">{evaluator.name}</div>
                                        <div className="text-xs text-muted-foreground">{evaluator.expertise}</div>
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="assignment-notes">Assignment Notes (Optional)</Label>
                              <Textarea
                                id="assignment-notes"
                                placeholder="Add any specific instructions for the evaluators..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAssignEvaluators}>Assign Selected Evaluators</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {submission.status === "assigned" && (
                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <Link href={`/admin/evaluations/${submission.id}`}>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Track Progress
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <FileVideo className="h-12 w-12 mx-auto mb-4" />
              <p>No submissions found matching your search criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
