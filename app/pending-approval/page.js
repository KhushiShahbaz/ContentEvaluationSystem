"use client"

import { AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Approval Pending
          </CardTitle>
          <CardDescription>Your account is waiting for admin approval.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Hold on!</AlertTitle>
            <AlertDescription>
              Your evaluator account has been created but is pending admin approval.
              You will be notified via email once it is approved.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            If you think this is a mistake, please contact the admin.
          </div>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
