'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { evaluationAPI } from '@/services/api'
import WatchVideoModal from "@/components/WatchVideoModal"

function page() {
  const router = useRouter()
  const [videoUrl, setVideoUrl] = useState("")
  const [videoOpen,setVideoOpen]=useState(false)
  const [pendingEvaluations, setPendingEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        const res = await evaluationAPI.getEvaluatorAssignments()
        const pending = res?.data?.data?.pending || []
        setPendingEvaluations(pending)
      } catch (err) {
        console.error('Failed to load assignments', err)
        setError('Failed to load assignments')
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
              <CardTitle>Pending Evaluations</CardTitle>
              <CardDescription>Videos awaiting your evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && pendingEvaluations.map((evaluation) => (
                  <div key={evaluation._id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.submissionId?.teamId?.name || 'Team'}</p>
                      <p className="text-sm text-muted-foreground">Project: {evaluation.submissionId?.projectTitle || '-'}</p>
                      <p className="text-xs text-muted-foreground">Status: {evaluation.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground"  onClick={() => {
    setVideoOpen(true)
    setVideoUrl(evaluation.submissionId?.videoLink || '')
  }}>
                        Watch Video
                      </Button>
                      <Button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground" onClick={()=>router.push(`/evaluator/videos/${evaluation._id}`)}>
                        Evaluate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
<WatchVideoModal videoUrl={videoUrl} setOpen={setVideoOpen} isOpen={videoOpen}/>
    </div>
  )
}

export default page
