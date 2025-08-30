"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { evaluationAPI } from "@/services/api"

export default function CompletedEvaluationDetails({ params }) {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await evaluationAPI.getEvaluation(params.id)
        setEvaluation(res?.data?.data || null)
      } catch (err) {
        setError("Failed to load evaluation details")
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [params.id])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/evaluator/completed">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Evaluation Details</h1>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {evaluation && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team & Project</CardTitle>
              <CardDescription>{evaluation?.submissionId?.teamId?.name || "Team"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{evaluation?.submissionId?.projectTitle || "-"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scores</CardTitle>
              <CardDescription>Total: {evaluation?.totalScore ?? 0} | Avg: {evaluation?.averageScore ?? 0}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(evaluation?.scores, null, 2)}</pre>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{evaluation?.feedback || "No feedback provided."}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

CompletedEvaluationDetails.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
}

"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { evaluationAPI } from "@/services/api"

export default function CompletedEvaluationDetails({ params }) {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await evaluationAPI.getEvaluation(params.id)
        setEvaluation(res?.data?.data || null)
      } catch (err) {
        setError("Failed to load evaluation details")
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [params.id])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/evaluator/completed">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Evaluation Details</h1>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {evaluation && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team & Project</CardTitle>
              <CardDescription>{evaluation?.submissionId?.teamId?.name || "Team"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{evaluation?.submissionId?.projectTitle || "-"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scores</CardTitle>
              <CardDescription>Total: {evaluation?.totalScore ?? 0} | Avg: {evaluation?.averageScore ?? 0}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(evaluation?.scores, null, 2)}</pre>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{evaluation?.feedback || "No feedback provided."}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

CompletedEvaluationDetails.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
}

"use client"

import { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { evaluationAPI } from "@/services/api"

/**
 * Evaluation criteria for project assessment
 * Each criterion has an ID, name, and description
 */
const criteria = [
  { id: "relevance", name: "Relevance", description: "Alignment with the competition theme" },
  { id: "innovation", name: "Innovation", description: "Originality and creativity of the solution" },
  { id: "clarity", name: "Clarity", description: "Clear explanation of concepts and implementation" },
  { id: "depth", name: "Depth", description: "Thoroughness of research and implementation" },
  { id: "engagement", name: "Engagement", description: "Ability to engage and maintain interest" },
  { id: "techUse", name: "Tech Use", description: "Effective use of technology" },
  { id: "scalability", name: "Scalability", description: "Potential for growth and expansion" },
  { id: "ethics", name: "Ethics", description: "Consideration of ethical implications" },
  { id: "practicality", name: "Practicality", description: "Feasibility and practical application" },
  { id: "videoQuality", name: "Video Quality", description: "Production quality of the video" },
]

/**
 * Evaluation page component for a specific team submission
 * Allows evaluators to score each criterion and provide feedback
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Team ID to evaluate
 * @returns {JSX.Element} Evaluation page component
 */
export default function EvaluationPage({ params }) {
  // Initialize scores with default value of 7 for each criterion
  const [scores, setScores] = useState(Object.fromEntries(criteria.map((c) => [c.id, 7])))
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)

  // Load current evaluation to prefill if exists
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true)
        const res = await evaluationAPI.getEvaluation(params.id)
        const data = res?.data?.data
        if (data?.scores) {
          setScores((prev) => ({ ...prev, ...data.scores }))
        }
        setFeedback(data?.feedback || "")
        setAssignment(data)
        setSubmission(data?.submissionId || null)
      } catch (err) {
        // If not found, ignore; otherwise show error
        if (err?.response?.status && err.response.status !== 404) {
          setError('Failed to load evaluation')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEvaluation()
  }, [params.id])

  /**
   * Handle score change for a specific criterion
   *
   * @param {string} criterionId - ID of the criterion being scored
   * @param {number[]} value - New score value (as array from Slider component)
   */
  const handleScoreChange = (criterionId, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: value[0],
    }))
  }

  // Calculate total and average scores
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const averageScore = totalScore / criteria.length

  /**
   * Handle form submission
   * Currently just logs the data, would connect to API in production
   */
  const handleSubmit = async () => {
    try {
      setLoading(true)
      // If there is an existing evaluation (params.id as evaluation id), update
      await evaluationAPI.updateEvaluation(params.id, {
        scores,
        feedback,
        status: 'submitted',
      })
      alert('Evaluation submitted successfully!')
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to submit evaluation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/evaluator/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Evaluate Team {params.id}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Video and Project Details Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Video</CardTitle>
              <CardDescription>Watch the video submission carefully before evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                {submission?.videoLink ? (
                  <iframe
                    className="w-full h-full rounded"
                    src={submission.videoLink}
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-muted-foreground">Video player would be embedded here</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Project Title</h3>
                <p>{submission?.projectTitle || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{submission?.description || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium">Learning Outcomes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission?.learningOutcomes || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Score</CardTitle>
              <CardDescription>Current average: {averageScore.toFixed(1)}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold">{totalScore}</div>
                <p className="text-sm text-muted-foreground">out of 100 points</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>Rate each criterion from 1-10</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={criterion.id}>{criterion.name}</Label>
                    <span className="text-sm font-medium">{scores[criterion.id]}/10</span>
                  </div>
                  <Slider
                    id={criterion.id}
                    min={1}
                    max={10}
                    step={1}
                    value={[scores[criterion.id]]}
                    onValueChange={(value) => handleScoreChange(criterion.id, value)}
                  />
                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>Provide constructive feedback for the team</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your feedback here..."
                className="min-h-[150px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                Submit Evaluation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Prop validation
EvaluationPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}
