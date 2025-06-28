"use client"

import { useState } from "react"
import { ArrowLeft, FileVideo, Upload } from "lucide-react"
import Link from "next/link"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { submissionAPI } from "@/services/api"

/**
 * Project Submission Page for Teams
 * Allows teams to submit project details, team members, and video
 *
 * @returns {JSX.Element} Project Submission Page component
 */
export default function SubmitProjectPage() {
  // Form state
  const [videoLink, setVideoLink] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [description, setDescription] = useState("")
  const [learningOutcomes, setLearningOutcomes] = useState("")
  const [teamMembers, setTeamMembers] = useState(["", "", "", ""])
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState("details")

  /**
   * Handle team member name change
   *
   * @param {number} index - Index of the team member in the array
   * @param {string} value - New name value
   */
  const handleTeamMemberChange = (index, value) => {
    const newTeamMembers = [...teamMembers]
    newTeamMembers[index] = value
    setTeamMembers(newTeamMembers)
  }

  /**
   * Handle file selection for video upload
   *
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  /**
   * Handle form submission
   * Currently just logs the data, would connect to API in production
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async(e) => {
    if (e) e.preventDefault()

    // Validate required fields
    if (!projectTitle) {
      alert("Please enter a project title")
      return
    }

    if (!videoLink && !selectedFile) {
      alert("Please provide either a video link or upload a video file")
      return
    }

    // Log form data (would submit to API in production)
    console.log({
      projectTitle,
      videoLink,
      description,
      learningOutcomes,
      teamMembers: teamMembers.filter((member) => member.trim() !== ""),
      videoFile: selectedFile ? selectedFile.name : null,
    })

    const formData = new FormData()
    formData.append("projectTitle", projectTitle)
    formData.append("videoLink", videoLink)
    formData.append("description", description)
    formData.append("learningOutcomes", learningOutcomes)
    teamMembers.forEach((m, i) => formData.append(`teamMembers[${i}]`, m))
    try {
      await submissionAPI.createSubmission({projectTitle,description,learningOutcomes,teamMembers,videoLink})
      alert("Project submitted successfully!")
    } catch (error) {
      console.error("Submission failed:", error)
      alert("Failed to submit project.")
    }

    // alert("Project submitted successfully!")
  }

  const tabOrder = ["details", "team", "video"]

  const handleTabChange = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Submit Project</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="details">Project Details</TabsTrigger>
    <TabsTrigger value="team">Team Members</TabsTrigger>
    <TabsTrigger value="video">Video Submission</TabsTrigger>
  </TabsList>

        {/* Project Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Provide details about your project</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    placeholder="Enter your project title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail"
                    className="min-h-[150px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learning-outcomes">Learning Outcomes</Label>
                  <Textarea
                    id="learning-outcomes"
                    placeholder="List the learning outcomes achieved through this project"
                    className="min-h-[100px]"
                    value={learningOutcomes}
                    onChange={(e) => setLearningOutcomes(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Add your team members (up to 5 including team lead)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Team Lead (You)</Label>
                  <Input value="Team Lead" disabled />
                </div>

                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`team-member-${index}`}>Team Member {index + 1}</Label>
                    <Input
                      id={`team-member-${index}`}
                      placeholder={`Enter name of team member ${index + 1}`}
                      value={member}
                      onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Submission Tab */}
        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Submission</CardTitle>
              <CardDescription>Submit your project video (YouTube or Vimeo link)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video-link">Video Link</Label>
                <Input
                  id="video-link"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-muted p-3">
                  <FileVideo className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Upload a video file</p>
                  <p className="text-sm text-muted-foreground">Or paste a YouTube or Vimeo link above</p>
                </div>
                <div>
                  <input type="file" id="video-file" className="hidden" accept="video/*" onChange={handleFileChange} />
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => document.getElementById("video-file").click()}
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
                {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
              </div>

              {videoLink && (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Video preview would appear here</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full">
                Submit Project
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
       
        <Button onClick={handleTabChange} disabled={activeTab === "video"}>
  Next
</Button>
      </div>
    </div>
  )
}

// Prop validation for any future props
SubmitProjectPage.propTypes = {
  initialData: PropTypes.object,
}
