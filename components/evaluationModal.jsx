'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function EvaluationFormModal({ videoId, isOpen, setOpen }) {
  const [score, setScore] = useState('')
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScore('')
      setComments('')
      setErrors({})
      setSuccess(false)
    }
  }, [isOpen])

  const validate = () => {
    const newErrors = {}
    const numericScore = Number(score)

    if (!score) {
      newErrors.score = 'Score is required'
    } else if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      newErrors.score = 'Score must be between 0 and 10'
    }

    if (!comments || comments.trim().length < 5) {
      newErrors.comments = 'Comments must be at least 5 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/evaluation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, score, comments }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
        }, 1000)
      } else {
        alert('Submission failed')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Evaluation Form</DialogTitle>
          <DialogDescription>
            Submit your evaluation for the selected video
          </DialogDescription>
        </DialogHeader>

        {videoId ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (0–10)</Label>
              <Input
                id="score"
                type="number"
                placeholder="Enter score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              {errors.score && (
                <p className="text-sm text-red-500">{errors.score}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                placeholder="Write your comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              {errors.comments && (
                <p className="text-sm text-red-500">{errors.comments}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading || success}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submitted
                  </>
                ) : (
                  'Submit Evaluation'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
            <p>No video selected. Please select one from the list.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
