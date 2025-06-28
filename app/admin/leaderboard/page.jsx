"use client"

import { Download, Filter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Leaderboard Control Page for Administrators
 * Allows admins to manage and publish the competition leaderboard
 *
 * @returns {JSX.Element} Leaderboard Control Page component
 */
export default function LeaderboardPage() {
  // Sample team data for the leaderboard
  const teams = [
    { id: 1, name: "Team Alpha", score: 92, project: "AI Content Analyzer" },
    { id: 2, name: "Team Beta", score: 89, project: "Virtual Learning Environment" },
    { id: 3, name: "Team Gamma", score: 87, project: "Smart Health Tracker" },
    { id: 4, name: "Team Delta", score: 85, project: "Automated Trading System" },
    { id: 5, name: "Team Epsilon", score: 82, project: "Sustainable Energy Monitor" },
    { id: 6, name: "Team Zeta", score: 80, project: "AR Navigation Assistant" },
    { id: 7, name: "Team Eta", score: 78, project: "Smart Home Controller" },
    { id: 8, name: "Team Theta", score: 76, project: "Language Learning App" },
    { id: 9, name: "Team Iota", score: 74, project: "Financial Planning Tool" },
    { id: 10, name: "Team Kappa", score: 72, project: "Social Media Analyzer" },
  ]

  // Criteria breakdown for a sample team
  const criteriaBreakdown = [
    { name: "Relevance", score: 9.2 },
    { name: "Innovation", score: 9.5 },
    { name: "Clarity", score: 8.8 },
    { name: "Depth", score: 9.0 },
    { name: "Engagement", score: 9.3 },
    { name: "Tech Use", score: 9.4 },
    { name: "Scalability", score: 8.7 },
    { name: "Ethics", score: 9.1 },
    { name: "Practicality", score: 9.2 },
    { name: "Video Quality", score: 8.8 },
  ]

  /**
   * Handle publishing the leaderboard
   * Would connect to API in production
   */
  const handlePublishLeaderboard = () => {
    console.log("Publishing leaderboard...")
    // Would submit to API in production
    alert("Leaderboard published successfully!")
  }

  /**
   * Handle exporting the leaderboard data
   * Would generate CSV/Excel in production
   */
  const handleExportLeaderboard = () => {
    console.log("Exporting leaderboard data...")
    // Would generate file download in production
    alert("Leaderboard data exported successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard Control</h1>
          <p className="text-muted-foreground">Manage and publish the competition leaderboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLeaderboard}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handlePublishLeaderboard}>Publish Leaderboard</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Team Rankings Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Rankings</CardTitle>
              <CardDescription>Based on average scores from evaluators</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Teams</DropdownMenuItem>
                <DropdownMenuItem>Top 5</DropdownMenuItem>
                <DropdownMenuItem>Top 10</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sort by Score</DropdownMenuItem>
                <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.map((team, index) => (
                <div key={team.id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium truncate">{team.name}</p>
                      <p className="font-bold">{team.score}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground truncate">{team.project}</p>
                      <Link href={`/admin/evaluations/${team.id}`} className="text-xs text-primary">
                        View Details
                      </Link>
                    </div>
                    <Progress value={team.score} className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Criteria Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle>Criteria Breakdown</CardTitle>
            <CardDescription>Average scores by evaluation criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criteriaBreakdown.map((criterion) => (
                <div key={criterion.name} className="space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm">{criterion.name}</p>
                    <p className="text-sm font-medium">{criterion.score}</p>
                  </div>
                  <Progress value={criterion.score * 10} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Settings and Preview Tabs */}
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Leaderboard Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Configure how the leaderboard is displayed to teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Toggle settings */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Team Names</p>
                    <p className="text-sm text-muted-foreground">Display team names on the leaderboard</p>
                  </div>
                  <div className="flex h-6 w-11 items-center rounded-full bg-primary p-1">
                    <div className="h-4 w-4 rounded-full bg-primary-foreground"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Project Titles</p>
                    <p className="text-sm text-muted-foreground">Display project titles on the leaderboard</p>
                  </div>
                  <div className="flex h-6 w-11 items-center rounded-full bg-primary p-1">
                    <div className="h-4 w-4 rounded-full bg-primary-foreground"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Detailed Scores</p>
                    <p className="text-sm text-muted-foreground">Display criteria breakdown for each team</p>
                  </div>
                  <div className="flex h-6 w-11 items-center rounded-full bg-muted p-1 justify-end">
                    <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Only Top 5</p>
                    <p className="text-sm text-muted-foreground">Limit leaderboard to top 5 teams</p>
                  </div>
                  <div className="flex h-6 w-11 items-center rounded-full bg-muted p-1 justify-end">
                    <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Preview</CardTitle>
              <CardDescription>Preview how the leaderboard will appear to teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="font-bold text-lg">Rank</div>
                  <div className="font-bold text-lg">Team</div>
                  <div className="font-bold text-lg">Score</div>
                </div>
                {teams.slice(0, 5).map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {index + 1}
                      </div>
                    </div>
                    <div className="font-medium">{team.name}</div>
                    <div className="font-bold text-lg">{team.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
