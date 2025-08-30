"use client"

import { useEffect, useState } from "react"
import { Check, X, Mail, Phone, Calendar, Filter, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminAPI, evaluatorAPI } from "@/services/api"

/**
 * Evaluators Management Page for Administrators
 * Allows admins to manage evaluator accounts, approvals, and assignments
 *
 * @returns {JSX.Element} Evaluators Management Page component
 */
export default function EvaluatorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvaluator, setSelectedEvaluator] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [pendingEvaluators, setPendingEvaluators] = useState([])
  const [activeEvaluators, setActiveEvaluators]=useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const[inviteData, setInviteData]=useState({
  name:"",
  email:"",
  message:""
})
  useEffect(() => {

    fetchEvaluatorData()
  }, [])



  const fetchEvaluatorData = async () => {
    try {
      setLoading(true)
      setError(null)
     
      const evaluatorsResponse = await adminAPI.getPendingEvaluators()
      const evaluationData = evaluatorsResponse?.data?.data || []
      setPendingEvaluators(evaluationData)

      const activeEvaluatorsResponse = await evaluatorAPI.getActiveEvaluators({ search: searchTerm || undefined })
      const activeEvaluatorsData = activeEvaluatorsResponse?.data?.data?.evaluators || []

      setActiveEvaluators(activeEvaluatorsData)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      setPendingEvaluators([])
      setActiveEvaluators([])
      setLoading(false)
    }
  }

  // Debounced search for active evaluators
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const res = await evaluatorAPI.getActiveEvaluators({ search: searchTerm || undefined })
        const data = res?.data?.data?.evaluators
        setActiveEvaluators(data ?? [])
      } catch (err) {
        console.error("Error searching active evaluators:", err)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  /**
   * Handle evaluator approval
   */
  const handleApproveEvaluator = async (id) => {
    console.log(id)
    try {
      await adminAPI.approveEvaluator(id)
      setPendingEvaluators((prev) => prev.filter((e) => e._id !== id))
      // setStats((prev) => ({
      //   ...prev,
      //   evaluators: {
      //     ...prev.evaluators,
      //     pending: prev.evaluators.pending - 1,
      //   },
      // }))
    } catch (err) {
      console.error("Error approving evaluator:", err)
      setError("Failed to approve evaluator. Please try again.")
    }
  }

  const handleRejectEvaluator = async (id) => {
    try {
      await adminAPI.rejectEvaluator(id)
      setPendingEvaluators((prev) => prev.filter((e) => e._id !== id))
      // setStats((prev) => ({
      //   ...prev,
      //   evaluators: {
      //     ...prev.evaluators,
      //     pending: prev.evaluators.pending - 1,
      //   },
      // }))
    } catch (err) {
      console.error("Error rejecting evaluator:", err)
      setError("Failed to reject evaluator. Please try again.")
    }
  }
  /**
   * Handle adding new evaluator
   */
  const handleAddEvaluator =async (e) => {
    
    e.preventDefault()
    console.log("Adding new evaluator")
    setLoading(true)
    setError(null)

    try {
      const response = await evaluatorAPI.inviteEvaluator(inviteData)
    console.log(response.data)

    setIsAddDialogOpen(false)
    alert("Invitation sent successfully!")
    } catch (err) {
      setError(err.response?.data?.message || "Invitation not sent")
      throw err
    } finally {
      setLoading(false)
    }
   
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluators Management</h1>
          <p className="text-muted-foreground">Manage evaluator accounts and assignments</p>
        </div>
       
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search evaluators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading evaluators...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium mb-2">Error Loading Evaluators</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchEvaluatorData} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Evaluators ({activeEvaluators?.length || 0})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval ({pendingEvaluators?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Pending Evaluators Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingEvaluators?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium mb-2">No Pending Evaluators</h3>
                <p className="text-muted-foreground mb-4">All evaluator applications have been processed.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingEvaluators
                  .filter((e) => {
                    if (!searchTerm) return true
                    const q = searchTerm.toLowerCase()
                    return (
                      e?.name?.toLowerCase().includes(q) ||
                      e?.email?.toLowerCase().includes(q)
                    )
                  })
                  .map((evaluator) => (
                    <Card key={evaluator?._id || Math.random()}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold">{evaluator?.name || 'Unknown Name'}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {evaluator?.email || 'No email'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {evaluator?.phone || 'No phone'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Applied: {evaluator?.createdAt ? formatDate(evaluator.createdAt) : 'Unknown date'}
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm">
                                <strong>Qualification:</strong> {evaluator?.qualification || 'Not specified'}
                              </p>
                              <p className="text-sm">
                                <strong>Experience:</strong> {evaluator?.experience || 'Not specified'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveEvaluator(evaluator?._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectEvaluator(evaluator?._id)}>
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Active Evaluators Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeEvaluators?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium mb-2">No Active Evaluators</h3>
                <p className="text-muted-foreground mb-4">No evaluators are currently active.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {activeEvaluators?.map((evaluator) => (
                  <Card key={evaluator?._id || Math.random()}>
                    <CardContent className="p-6 py-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{evaluator?.name || 'Unknown Name'}</h3>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {evaluator?.email || 'No email'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {evaluator?.phone || 'No phone'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Joined: {evaluator?.createdAt ? formatDate(evaluator.createdAt) : 'Unknown date'}
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm">
                              <strong>Experience:</strong> {evaluator?.experience || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
