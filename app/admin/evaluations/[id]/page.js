"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { evaluationAPI, submissionAPI } from "@/services/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const STATUS_TO_BADGE = {
  draft: { className: "bg-gray-100 text-gray-800", label: "Draft" },
  submitted: { className: "bg-yellow-100 text-yellow-800", label: "Submitted" },
  published: { className: "bg-green-100 text-green-800", label: "Published" },
}

export default function AdminEvaluationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true)
        setError("")
        const id = params?.id
        if (!id) return
        const res = await evaluationAPI.getEvaluation(id)
        const evalData = res?.data?.data || null
        setEvaluation(evalData)
        // Fetch submission with populated team to display team details
        if (evalData?.submissionId?._id || evalData?.submissionId) {
          const submissionId = evalData?.submissionId?._id || evalData?.submissionId
          try {
            const subRes = await submissionAPI.getSubmission(submissionId)
            setSubmission(subRes?.data?.data || null)
          } catch (_) {
            // ignore, submission may not be accessible
          }
        }
      } catch (err) {
        setError("Failed to load evaluation details.")
      } finally {
        setLoading(false)
      }
    }
    fetchEvaluation()
  }, [params?.id])

  const handlePublish = async () => {
    if (!evaluation?._id) return
    try {
      setPublishing(true)
      await evaluationAPI.publishEvaluation(evaluation._id)
      const res = await evaluationAPI.getEvaluation(evaluation._id)
      setEvaluation(res?.data?.data || null)
    } catch (err) {
      setError("Failed to publish evaluation.")
    } finally {
      setPublishing(false)
    }
  }

  const renderStatusBadge = (status) => {
    const conf = STATUS_TO_BADGE[status] || { className: "bg-secondary", label: status }
    return <Badge className={conf.className}>{conf.label}</Badge>
  }

  const scores = evaluation?.scores || {}
  const scoreRows = [
    { key: "relevance", label: "Relevance" },
    { key: "innovation", label: "Innovation" },
    { key: "clarity", label: "Clarity" },
    { key: "depth", label: "Depth" },
    { key: "engagement", label: "Engagement" },
    { key: "techUse", label: "Technology Use" },
    { key: "scalability", label: "Scalability" },
    { key: "ethics", label: "Ethics" },
    { key: "practicality", label: "Practicality" },
    { key: "videoQuality", label: "Video Quality" },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Details</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load the evaluation.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Details</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">Back to Evaluations</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Details</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">Back to Evaluations</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
            <CardDescription>The requested evaluation could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Details</h1>
          <p className="text-muted-foreground">View evaluation information and scores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/evaluations">Back to Evaluations</Link>
          </Button>

        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{evaluation?.submissionId?.projectTitle || "Untitled Project"}</CardTitle>
          <CardDescription>
            Evaluated by {evaluation?.evaluatorId?.name || "Unknown"}
            {evaluation?.evaluatorId?.email ? ` (${evaluation.evaluatorId.email})` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              {renderStatusBadge(evaluation.status)}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Average Score</div>
              <div className="font-medium">{evaluation.averageScore?.toFixed?.(2) ?? evaluation.averageScore}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Score</div>
              <div className="font-medium">{evaluation.totalScore}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Evaluated At</div>
              <div className="font-medium">{evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleString() : "-"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Details</CardTitle>
          <CardDescription>Information about the submitting team</CardDescription>
        </CardHeader>
        <CardContent>
          {submission ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Team Name</div>
                  <div className="font-medium">{submission?.teamId?.name || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                  <div className="font-medium">{(submission?.teamId?.members?.length ||0)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Submitted At</div>
                  <div className="font-medium">{submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "-"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Members</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(submission?.teamId?.members || []).map((member) => (
                        <TableRow key={member._id}>
                          <TableCell className="font-medium">{member?.name || "Member"}</TableCell>
                          <TableCell>{member?.email || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Team information unavailable.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scores Breakdown</CardTitle>
          <CardDescription>Each criterion is scored from 1 to 10</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoreRows.map(({ key, label }) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{label}</TableCell>
                  <TableCell>{scores?.[key] ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Evaluator's comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {evaluation.feedback || "No feedback provided."}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


