'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import EvaluationFormModal from '@/components/evaluationModal.jsx'  // ✅ correct
import WatchVideoModal from "@/components/WatchVideoModal"

function page() {
  const [isOpen, setOpen]=useState(false)
  const[videoId,setVideoId]=useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const[videoOpen,setVideoOpen]=useState(false)
    // Pending evaluations data
  const pendingEvaluations = [
    { id: 1, name: "Team 1", project: "AI-Powered Content Analysis" },
    { id: 2, name: "Team 2", project: "AI-Powered Content Analysis" },
    { id: 3, name: "Team 3", project: "AI-Powered Content Analysis" },
    { id: 4, name: "Team 4", project: "AI-Powered Content Analysis" },
    { id: 5, name: "Team 5", project: "AI-Powered Content Analysis" },
  ]

  const handleModal=(id)=>{
    setOpen(true);
    setVideoId(id);
  }
 
  return (
    <div>
       <Card>
            <CardHeader>
              <CardTitle>Pending Evaluations</CardTitle>
              <CardDescription>Videos awaiting your evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.name}</p>
                      <p className="text-sm text-muted-foreground">Project: {evaluation.project}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground"  onClick={() => {
    setWatchOpen(true)
    setVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ") // replace with real link
  }}>
                        Watch Video
                      </Button>
                      <Button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground" onClick={()=>handleModal(evaluation.id)}>
                        Evaluate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <EvaluationFormModal videoId={videoId} setOpen={setOpen} isOpen={isOpen} />
<WatchVideoModal videoUrl={videoUrl} setOpen={setVideoOpen} isOpen={videoOpen}/>
    </div>
  )
}

export default page
