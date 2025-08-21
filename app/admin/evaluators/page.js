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

     
      const evaluatorsResponse = await adminAPI.getPendingEvaluators()
      const evaluationData= evaluatorsResponse?.data?.data
      console.log(evaluationData, evaluatorsResponse)
      setPendingEvaluators(evaluationData )

      const activeEvaluatorsResponse = await evaluatorAPI.getActiveEvaluators()
      const activeEvaluatorsData= activeEvaluatorsResponse?.data?.data?.evaluators

      setActiveEvaluators(activeEvaluatorsData  ?? [])

      console.log( activeEvaluatorsData)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
      setLoading(false)
    }
  }

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

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Approval ({pendingEvaluators.length})</TabsTrigger>
          <TabsTrigger value="active">Active Evaluators ({activeEvaluators.length})</TabsTrigger>
        </TabsList>

        {/* Pending Evaluators Tab */}
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingEvaluators.map((evaluator) => (
              <Card key={evaluator._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{evaluator.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {evaluator.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {evaluator.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied: {formatDate(evaluator.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Qualifictaion:</strong> {evaluator.qualification}
                        </p>
                        <p className="text-sm">
                          <strong>Experience:</strong> {evaluator.experience}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveEvaluator(evaluator._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectEvaluator(evaluator._id)}>
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Evaluators Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeEvaluators?.map((evaluator) => (
              <div className="flex items-center justify-start">
              <Card key={evaluator._id}>
                <CardContent className="p-6 py-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{evaluator.name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {evaluator.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {evaluator.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined: {formatDate(evaluator.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div>
                       
                        <p className="text-sm">
                          <strong>Experience:</strong> {evaluator.experience}
                        </p>
                      </div>
                     
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
