"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * Authentication form component for login and signup
 * Handles both login and registration with role verification
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedRole - The role selected by user (admin, team, evaluator)
 * @param {Function} props.onAuthSuccess - Callback when authentication is successful
 * @param {Function} props.onBack - Callback to go back to role selection
 * @returns {JSX.Element} Authentication form component
 */
export function AuthForm({ selectedRole, onAuthSuccess, onBack }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  /**
   * Handle login form submission
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - replace with actual API response
      const mockUsers = {
        "admin@test.com": { role: "admin", name: "Admin User", email: "admin@test.com" },
        "team@test.com": { role: "team", name: "Team Lead", email: "team@test.com" },
        "evaluator@test.com": { role: "evaluator", name: "Evaluator", email: "evaluator@test.com" },
      }

      const user = mockUsers[loginData.email]

      if (!user) {
        throw new Error("User not found")
      }

      if (loginData.password !== "password123") {
        throw new Error("Invalid password")
      }

      // Check if user role matches selected role
      if (user.role !== selectedRole) {
        throw new Error(`Access denied. This account is registered as ${user.role}, but you selected ${selectedRole}.`)
      }

      // Success - call the callback with user data
      onAuthSuccess(user)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle signup form submission
   */
  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (signupData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock signup success
      setSuccess("Account created successfully! You can now login.")

      // Reset form
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "team":
        return "Team Member"
      case "evaluator":
        return "Evaluator"
      default:
        return "User"
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome {getRoleDisplay(selectedRole)}</CardTitle>
          <CardDescription>
            Please login or create an account to continue as {getRoleDisplay(selectedRole)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-destructive">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login as {getRoleDisplay(selectedRole)}
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up as {getRoleDisplay(selectedRole)}
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Role Selection
            </Button>
          </div>

          {/* Demo credentials info */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo Credentials:</strong>
              <br />
              Email: {selectedRole}@test.com
              <br />
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Prop validation
AuthForm.propTypes = {
  selectedRole: PropTypes.oneOf(["admin", "team", "evaluator"]).isRequired,
  onAuthSuccess: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}
