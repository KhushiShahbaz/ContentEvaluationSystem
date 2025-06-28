"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { Shield, Users, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

/**
 * Role selector component for the initial login screen
 * Allows users to select their role before accessing the dashboard
 *
 * @param {Object} props - Component props
 * @param {Function} props.onRoleChange - Callback function when role is selected
 * @returns {JSX.Element} Role selector component
 */
export function RoleSelector({ onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState("admin")

  const handleRoleChange = (role) => {
    setSelectedRole(role)
  }

  const handleSubmit = () => {
    onRoleChange(selectedRole)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Select Your Role</CardTitle>
        <CardDescription>Choose your role to access the appropriate dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={selectedRole}
          onValueChange={(value) => handleRoleChange(value)}
          className="grid gap-4"
        >
          <div>
            <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
            <Label
              htmlFor="admin"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Shield className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">Administrator</p>
                <p className="text-sm text-muted-foreground">Manage evaluators, teams, and the entire system</p>
              </div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="team" id="team" className="peer sr-only" />
            <Label
              htmlFor="team"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Users className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">Team Member</p>
                <p className="text-sm text-muted-foreground">Submit projects, view feedback, and check rankings</p>
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
                <p className="text-sm text-muted-foreground">Review submissions and provide evaluations</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Continue as{" "}
          {selectedRole === "admin" ? "Administrator" : selectedRole === "team" ? "Team Member" : "Evaluator"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Prop validation
RoleSelector.propTypes = {
  onRoleChange: PropTypes.func.isRequired,
}
