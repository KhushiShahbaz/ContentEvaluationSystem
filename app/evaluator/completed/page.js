import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function page() {
  
  // Completed evaluations data
  const completedEvaluations = [
    { id: 6, name: "Team 6", score: 76 },
    { id: 7, name: "Team 7", score: 77 },
    { id: 8, name: "Team 8", score: 78 },
  ]

  return (
    <div>
      <Card>
            <CardHeader>
              <CardTitle>Completed Evaluations</CardTitle>
              <CardDescription>Videos you have already evaluated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{evaluation.name}</p>
                      <p className="text-sm text-muted-foreground">Score: {evaluation.score}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                        View Details
                      </button>
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
