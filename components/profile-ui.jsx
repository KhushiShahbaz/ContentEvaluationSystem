"use client"

import {
  Mail,
  Phone,
  User,
  Shield,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  ClipboardList,
  Users,
  BadgeCheck,
  Code2,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { adminAPI, authAPI } from "@/services/api"
import { useEffect, useState } from "react"

// Fake dynamic user from backend
const user = {
  name: "Sana Malik",
  email: "sana@example.com",
  phone: "03001234567",
  role: "evaluator", // "team-leader" or "team-member"
  approved: false,

  // For evaluator
  qualification: "MSc CS",
  experience: "5 years",
  address: "Karachi",

  // For team roles
  projectTitle: "Smart Health App",
  projectDescription: "AI-powered health diagnostic tool",
  teamCode: "ABC123",
}

export default function ProfilePage() {
  const[error,setError]=useState("")
  const[loading, setLoading]=useState(false)

  useEffect(() => {

    fetchProfileData()
  }, [])



  const fetchProfileData = async () => {
    try {
      setLoading(true)

     
      const profileResponse = await authAPI.getProfile()
      console.log(profileResponse)
    
      setLoading(false)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      setLoading(false)
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-xl shadow-md">
        <CardHeader className="flex flex-col items-center space-y-3 text-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {user.role === "evaluator" ? (
              <Shield className="inline h-4 w-4 mr-1" />
            ) : (
              <Users className="inline h-4 w-4 mr-1" />
            )}
            {formatRole(user.role)}

            {user.role === "evaluator" && (
              <Badge variant={user.approved ? "default" : "destructive"} className="ml-2">
                {user.approved ? "Approved" : "Pending"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ProfileRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
          <ProfileRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />

          {user.role === "evaluator" && (
            <>
              <ProfileRow icon={<GraduationCap className="h-4 w-4" />} label="Qualification" value={user.qualification} />
              <ProfileRow icon={<Briefcase className="h-4 w-4" />} label="Experience" value={user.experience} />
              <ProfileRow icon={<MapPin className="h-4 w-4" />} label="Address" value={user.address} />
            </>
          )}

          {user.role === "team-leader" && (
            <>
              <ProfileRow icon={<ClipboardList className="h-4 w-4" />} label="Project Title" value={user.projectTitle} />
              <ProfileRow icon={<FileText className="h-4 w-4" />} label="Project Description" value={user.projectDescription} />
              <ProfileRow icon={<Code2 className="h-4 w-4" />} label="Team Code" value={user.teamCode} />
            </>
          )}

          {user.role === "team-member" && (
            <ProfileRow icon={<Code2 className="h-4 w-4" />} label="Team Code" value={user.teamCode} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      {icon && <div className="mt-1 text-muted-foreground">{icon}</div>}
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{value || "—"}</div>
      </div>
    </div>
  )
}

function formatRole(role) {
  if (role === "evaluator") return "Evaluator"
  if (role === "team-leader") return "Team Leader"
  if (role === "team-member") return "Team Member"
  return "User"
}
