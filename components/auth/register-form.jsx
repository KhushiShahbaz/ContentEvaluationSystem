"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ClipboardList, Loader2, Video, Users } from "lucide-react"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [qualification, setQualification] = useState("")
  const [experience, setExperience] = useState("")
  const [teamName, setTeamName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [teamCode, setTeamCode] = useState("")
  const [isTeamLead, setIsTeamLead] = useState(false)

  const [role, setRole] = useState("team")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [teamRole, setTeamRole] = useState("leader")
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const selectedRole = e.target.value
    setTeamRole(selectedRole)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const phonePattern = /^03[0-9]{9}$/
    if (!phonePattern.test(phone)) {
      setError("Please enter a valid phone number starting with 03 and 11 digits long.")
      return
    }

    setIsLoading(true)

    try {
      if (role === "evaluator") {
        const user = await register({
          name,
          email,
          password,
          role,
          phone,
          qualification,
          experience,
          address,
        })
        if (user.role === "evaluator" && !user.isApproved) {
          router.push("/pending-approval")
        } else if (user.role === "evaluator" && user.isApproved) {
          router.push("/evaluator")
        }
      } else if (role === "team") {
        const user = await register({
          name,
          email,
          password,
          role,
          phone,
          teamCode,
          projectTitle,
          projectDescription,
          isTeamLead: teamRole === "leader",
        })
        if (user.role === "team") {
          router.push("/team")
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="text-2xl font-bold">Evaluation System</div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Register to access the evaluation system</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Select Your Role</Label>
              <RadioGroup value={role} onValueChange={setRole} className="grid gap-4 pt-2">
                <div>
                  <RadioGroupItem value="team" id="team" className="peer sr-only" />
                  <Label
                    htmlFor="team"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Users className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">Team Member or Team Leader</p>
                      <p className="text-xs text-muted-foreground">
                        Submit projects, view feedback, and check rankings
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="evaluator" id="evaluator" className="peer sr-only" />
                  <Label
                    htmlFor="evaluator"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Video className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">Evaluator</p>
                      <p className="text-xs text-muted-foreground">Review submissions and provide evaluations</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {role === "evaluator" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: Evaluator accounts require admin approval before access is granted.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="03XX1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="^03[0-9]{9}$"
                title="Please enter a valid Pakistani phone number starting with 03"
              />
            </div>

            {role === "evaluator" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {role === "team" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Register as:</label>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        value="leader"
                        checked={teamRole === "leader"}
                        onChange={handleChange}
                      />
                      <span className="ml-2">Team Leader</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-indigo-600"
                        value="member"
                        checked={teamRole === "member"}
                        onChange={handleChange}
                      />
                      <span className="ml-2">Team Member</span>
                    </label>
                  </div>
                </div>

                {teamRole === "member" && (
                  <div className="space-y-2">
                    <Label htmlFor="team-code">Team Code (if joining an existing team)</Label>
                    <Input id="team-code" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} />
                  </div>
                )}

                {teamRole === "leader" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input
                        id="project-title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Project Description</Label>
                      <Input
                        id="project-description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
