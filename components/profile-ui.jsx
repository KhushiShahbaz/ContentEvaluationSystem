"use client";

import {
  Mail,
  Shield,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  ClipboardList,
  Users,
  Code2,
  
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { userAPI } from "@/services/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileResponse = await userAPI.getUser(user._id);
      setUserProfile(profileResponse?.data?.user);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto p-4 ">
    <Card className="rounded-2xl">
      <CardHeader className="text-center space-y-2">
        <Avatar className="mx-auto h-20 w-20">
          <AvatarFallback className="capitalize text-xl">
            {userProfile.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-semibold capitalize flex items-center justify-center gap-2">
          {userProfile.name}
         
        </CardTitle>
  
        <div className="text-sm text-muted-foreground">
          {userProfile.role === "evaluator" ? (
            <Shield className="inline h-4 w-4 mr-1" />
          ) : (
            <Users className="inline h-4 w-4 mr-1" />
          )}
          {formatRole(userProfile.role)}
  
          {userProfile.role === "evaluator" && (
            <Badge
              variant={userProfile.isApproved ? "default" : "destructive"}
              className="ml-2"
            >
              {userProfile.isApproved ? "Approved" : "Pending"}
            </Badge>
          )}
        </div>
      </CardHeader>
  
      <CardContent className="space-y-4">
        <ProfileRow icon={<Mail className="h-4 w-4" />} label="Email" value={userProfile.email} />
  
        {userProfile.role === "evaluator" && (
          <>
            <ProfileRow icon={<GraduationCap className="h-4 w-4" />} label="Qualification" value={userProfile.evaluatorId.qualification} />
            <ProfileRow icon={<Briefcase className="h-4 w-4" />} label="Experience" value={userProfile.evaluatorId.experience} />
            <ProfileRow icon={<MapPin className="h-4 w-4" />} label="Address" value={userProfile.evaluatorId.address} />
          </>
        )}
  
        {userProfile.role === "team" && (
          <>
            <ProfileRow icon={<ClipboardList className="h-4 w-4" />} label="Project Title" value={userProfile.teamId.projectTitle} />
            <ProfileRow icon={<FileText className="h-4 w-4" />} label="Project Description" value={userProfile.teamId.projectDescription} />
            <ProfileRow icon={<Code2 className="h-4 w-4" />} label="Team Code" value={userProfile.teamId.teamCode} />
            <ProfileRow
  icon={<Code2 className="h-4 w-4" />}
  label="Team Members"
  value={userProfile.teamId?.members?.map((member) => member.name).join(", ")}
/>

          </>
        )}
      </CardContent>
    </Card>
  
    
  </div>
  
  );
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
  );
}

function formatRole(role) {
  if (role === "evaluator") return "Evaluator";
  if (role === "team-leader") return "Team Leader";
  if (role === "team-member") return "Team Member";
  return "User";
}
