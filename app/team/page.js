import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function page() {

      // Leaderboard data
  const leaderboardTeams = [
    { id: 1, name: "Team 9", project: "Interactive Learning Platform", score: 92 },
    { id: 2, name: "Team 8", project: "Interactive Learning Platform", score: 89 },
    { id: 3, name: "Team 7", project: "Interactive Learning Platform", score: 86 },
    { id: 4, name: "Team 6", project: "Interactive Learning Platform", score: 83 },
    { id: 5, name: "Team 5", project: "Interactive Learning Platform", score: 80 },
  ]

  
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>Current Leaderboard</CardTitle>
              <CardDescription>Top teams based on evaluation scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardTeams.map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">Project: {team.project}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{team.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default page
