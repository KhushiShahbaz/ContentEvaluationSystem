"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { evaluationAPI } from '@/services/api'

function page() {
  const [completedEvaluations, setCompletedEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        const res = await evaluationAPI.getEvaluatorAssignments()
        const completed = res?.data?.data?.completed || []
        setCompletedEvaluations(completed)
      } catch (err) {
        console.error('Failed to load completed evaluations', err)
        setError('Failed to load completed evaluations')
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  return (
    <div>
      <Card>
            <CardHeader>
              <CardTitle>Completed Evaluations</CardTitle>
              <CardDescription>Videos you have already evaluated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && completedEvaluations.map((evaluation) => (
                  <div key={evaluation._id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.submissionId?.teamId?.name || 'Team'}</p>
                      <p className="text-sm text-muted-foreground">Score: {evaluation.totalScore ?? '-'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/evaluator/completed/${evaluation._id}`} className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground inline-flex items-center">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default page
