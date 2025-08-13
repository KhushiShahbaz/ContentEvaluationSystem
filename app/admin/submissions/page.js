"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Filter,
  Eye,
  Users,
  Calendar,
  File,
  Download,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { evaluatorAPI, submissionAPI } from "@/services/api"

export default function TeamSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedEvaluators, setSelectedEvaluators] = useState([])
  const [availableEvaluators, setAvailableEvaluators] = useState([])
  const [loading, setLoading] = useState(false)
  // Sample team submissions data
  const [teamSubmissions, setTeamSubmission] = useState([])


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

  useEffect(() => {
    if (isAssignDialogOpen) {
      fetchEvaluators();
    }
  }, [isAssignDialogOpen]);

  const fetchEvaluators = async () => {
    try {
      const res = await evaluatorAPI.getActiveEvaluators();
      setAvailableEvaluators(res?.data?.data?.evaluators);
    } catch (err) {
      console.error("Error fetching evaluators", err);
    }
  };

  const handleEvaluatorToggle = (id) => {
    setSelectedEvaluators((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // ✅ Assign API Call
  const handleAssignEvaluators = async () => {
    try {
      setLoading(true);
      const res = await submissionAPI.assignEvaluator(selectedSubmission.id, selectedEvaluators)
      setIsAssignDialogOpen(false);
    } catch (err) {
      console.error("Error assigning evaluators", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSubmissions = () => {
    console.log("Exporting submissions data...")
    alert("Submissions data exported successfully!")
  }

  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      try {
        const res = await submissionAPI.getSubmissions()
        const submissionData = res?.data?.data || []
        const formattedSubmissions = submissionData.map((submission) => {
          return {
            id: submission._id,
            projectTitle: submission.projectTitle,
            description: submission.description,
            status: submission.status || "pending",
            evaluationStatus: "not-started", // you can change this logic if backend provides it
            submissionDate: new Date(submission.submittedAt).toLocaleDateString(),
            teamName: submission.teamId?.name || "N/A",
            teamLead: submission.submittedBy || "Unknown",
            teamMembers: submission.teamId.members || [],
            videoLink: submission.videoLink,
            averageScore: submission.averageScore,
            assignedEvaluators: submission.evaluations?.map((e) => e.evaluatorId.name) || [],
          }
        })

        setTeamSubmission(formattedSubmissions)
      } catch (err) {
        console.warn("No submission found.")
      }
    }

    fetchTeamAndSubmission()
  }, [])


  const filteredSubmissions = teamSubmissions.filter(
    (submission) =>
      submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.teamId.toLowerCase().includes(searchTerm.toLowerCase()),
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
                    <h4 className="text-sm font-medium mb-2">Team Members ({submission?.teamMembers.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {submission?.teamMembers?.map((member, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://avatar.vercel.sh/${member.name}`} />
                            <AvatarFallback className="text-xs">{member?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{member.name}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs ml-1">
                              Lead
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
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
                      <div className="text-2xl font-bold">{submission.averageScore<0 && submission.averageScore}</div>
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

                    {/* <Button variant="outline" className="w-full" size="sm" asChild>
                      <Link onClick={()=>{setIsAssignDialogOpen(true)}}>
                        <File className="mr-2 h-4 w-4" />
                       Assign Evaluator
                      </Link>
                    </Button> */}

                    {submission.status === "pending" && (
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
                                {availableEvaluators?.map((evaluator,idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`evaluator-${evaluator._id}`}
                                      checked={selectedEvaluators.includes(evaluator._id)}
                                      onCheckedChange={() => handleEvaluatorToggle(evaluator._id)}
                                    />
                                    <Label htmlFor={`evaluator-${evaluator._id}`} className="flex-1">
                                      <div>
                                        <div className="font-medium">{evaluator.name}</div>
                                        <div className="text-xs text-muted-foreground">{evaluator.experience}</div>
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </div>
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

      {/* {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <FileVideo className="h-12 w-12 mx-auto mb-4" />
              <p>No submissions found matching your search criteria</p>
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  )
}
