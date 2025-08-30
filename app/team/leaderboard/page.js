"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { publicAPI } from '@/services/api'

function page() {
  const [leaderboardTeams, setLeaderboardTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await publicAPI.getLeaderboard()
        const data = res?.data?.data || []
        setLeaderboardTeams(
          data.map((t, idx) => ({
            id: t?._id || idx,
            name: t?.name || `Team ${idx + 1}`,
            project: t?.projectTitle || 'No Project',
            score: t?.score ?? t?.averageScore ?? 'N/A',
            rank: t?.rank ?? t?.currentRank ?? idx + 1,
          }))
        )
      } catch (e) {
        console.error('Error loading leaderboard:', e)
        setError('Failed to load leaderboard data')
        setLeaderboardTeams([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>Current Leaderboard</CardTitle>
              <CardDescription>Top teams based on evaluation scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium mb-2">Error Loading Leaderboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Try Again
                    </button>
                  </div>
                ) : leaderboardTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The leaderboard is currently empty.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Teams will appear here once they receive evaluations.
                    </p>
                  </div>
                ) : (
                  leaderboardTeams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {team.rank}
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">Project: {team.project}</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold">{team.score}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default page
