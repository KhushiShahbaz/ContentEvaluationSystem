"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { submissionAPI } from '@/services/api'
import { useAuth } from '@/context/auth-context'

function page() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user?.teamId) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await submissionAPI.getTeamSubmissions(user.teamId)
        const subs = res?.data?.data || []
        const out = []
        subs.forEach((s) => {
          if (s?.evaluations && Array.isArray(s.evaluations)) {
            s.evaluations.forEach((ev) => {
              if (ev) {
                out.push({
                  id: ev._id || Math.random(),
                  project: s?.projectTitle || 'Untitled Project',
                  evaluator: ev?.evaluatorId?.name || 'Unknown Evaluator',
                  average: ev?.averageScore || null,
                  status: ev?.status || 'Unknown',
                  feedback: ev?.feedback || null,
                })
              }
            })
          }
        })
        setRows(out)
      } catch (e) {
        console.error('Error loading feedback:', e)
        setError('Failed to load feedback data')
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Feedback</CardTitle>
          <CardDescription>Your evaluations and feedback from reviewers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading feedback...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium mb-2">Error Loading Feedback</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Try Again
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No Feedback Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't received any evaluations or feedback yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Feedback will appear here once evaluators review your submissions.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Evaluator</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id || Math.random()}>
                    <TableCell className="font-medium">{r.project || 'Untitled Project'}</TableCell>
                    <TableCell>{r.evaluator || 'Unknown Evaluator'}</TableCell>
                    <TableCell>{r.average ?? '-'}</TableCell>
                    <TableCell>{r.status || 'Unknown'}</TableCell>
                    <TableCell className="max-w-xl whitespace-pre-wrap">{r.feedback || 'No feedback provided'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default page
