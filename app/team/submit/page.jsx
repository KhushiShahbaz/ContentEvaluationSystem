"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ChevronDown, FileVideo, Upload, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { teamAPI, submissionAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubmitProjectPage() {
  const { user } = useAuth()

  const [videoLink, setVideoLink] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [description, setDescription] = useState("")
  const [learningOutcomes, setLearningOutcomes] = useState("")
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [team, setTeam] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [id, setId] = useState('')
  const tabOrder = ["details", "team", "video"]

  useEffect(() => {
    const fetchTeamAndSubmission = async () => {
      if (!user?.teamId) return
      try {
        // Try to fetch existing submission
        const res = await submissionAPI.getTeamSubmissions(user.teamId)
        const submissionData = res?.data?.data
        const filteredSubmission= submissionData.find((data)=>data.status ==='pending')
        if (filteredSubmission) {
          setId(filteredSubmission?._id)
          setTeam(filteredSubmission.teamId) // because you populated it
          setProjectTitle(filteredSubmission.projectTitle || "")
          setDescription(filteredSubmission.description || "")
          setLearningOutcomes(filteredSubmission.learningOutcomes || "")
          setVideoLink(filteredSubmission.videoLink || "")
          setTeamMembers(
            (filteredSubmission.teamId?.members || []).map(member => ({
              label: member.name,
              value: member._id,
            }))
          )
          return
        }
      } catch (err) {
        console.warn("No submission found. Falling back to team info.")
      }
  
      // If no submission, fallback to raw team data
      try {
        const res = await teamAPI.getTeam(user.teamId)
        const teamData = res.data.data
        setTeam(teamData)
        setProjectTitle(teamData.projectTitle || "")
        setDescription(teamData.projectDescription || "")
        setTeamMembers(
          (teamData.members || []).map(member => ({
            label: member.name,
            value: member._id,
          }))
        )
      } catch (err) {
        console.error("Error fetching team:", err)
      }
    }
  
    fetchTeamAndSubmission()
  }, [user])
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!projectTitle) return alert("Please enter a project title")
    if (!videoLink && !selectedFile) return alert("Please provide a video link or file")
console.log(id,"id")
    try {
      if(id){
        await submissionAPI.updateSubmission(id,{
          projectTitle,
          description,
          learningOutcomes,
          videoLink,
          teamMembers: teamMembers.map(m => m.value),
        })
        alert("Project updated successfully!")
      }else{
      await submissionAPI.createSubmission({
        projectTitle,
        description,
        learningOutcomes,
        videoLink,
        teamMembers: teamMembers.map(m => m.value),
      })
      alert("Project submitted successfully!")}
    } catch (error) {
      console.error("Submission failed:", error)
      alert("Failed to submit project.")
    }
  }

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  const toggleOption = (option) => {
    const exists = teamMembers.find((m) => m.value === option.value)
    if (exists) {
      setTeamMembers(teamMembers.filter((m) => m.value !== option.value))
    } else {
      setTeamMembers([...teamMembers, option])
    }
  }

  const removeOption = (option) => {
    setTeamMembers(teamMembers.filter((m) => m.value !== option.value))
  }

  const isSelected = (option) => teamMembers.some((m) => m.value === option.value)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
       
        <h1 className="text-2xl font-bold">Submit Project</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="video">Video Submission</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Provide details about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Project Title</Label>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
              />
              <Label>Project Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                placeholder="Describe your project"
              />
              <Label>Learning Outcomes</Label>
              <Textarea
                value={learningOutcomes}
                onChange={(e) => setLearningOutcomes(e.target.value)}
                className="min-h-[100px]"
                placeholder="What did your team learn?"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Select your team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-full border rounded-md px-3 py-2 bg-white text-sm shadow-sm cursor-pointer flex flex-wrap items-center gap-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {teamMembers.length === 0 && (
                    <span className="text-muted-foreground text-sm">Select team members</span>
                  )}
                  {teamMembers.map((member) => (
                    <span
                      key={member.value}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {member.label}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeOption(member)}
                      />
                    </span>
                  ))}
                  <ChevronDown size={16} className="ml-auto text-muted-foreground" />
                </div>

                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
                    {team?.members?.map((option) => {
                      const o = { label: option.name, value: option._id }
                      return (
                        <li
                          key={o.value}
                          onClick={() => toggleOption(o)}
                          className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${isSelected(o) ? "bg-blue-100 font-semibold text-blue-800" : ""
                            }`}
                        >
                          {o.label}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Tab */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Video Submission</CardTitle>
              <CardDescription>Paste a link or upload your video file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Video Link</Label>
              <Input
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://youtube.com/..."
              />

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
        {activeTab !== "details" ? (
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
        ) : (
          <div />
        )}

        {activeTab !== "video" ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
