"use client"

import { useState } from "react"
import { Send, Search, Filter, MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Chat Support Page for Administrators
 * Manage support tickets and chat with users
 *
 * @returns {JSX.Element} Chat Support Page component
 */
export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample support tickets
  const supportTickets = [
    {
      id: 1,
      title: "Unable to submit project video",
      user: "Team Alpha",
      userType: "team",
      priority: "high",
      status: "open",
      lastMessage: "The upload keeps failing after 50%",
      timestamp: "2024-01-15 14:30",
      messages: [
        {
          id: 1,
          sender: "Team Alpha",
          message: "Hi, we're having trouble uploading our project video. It keeps failing after reaching 50%.",
          timestamp: "2024-01-15 14:30",
          isAdmin: false,
        },
        {
          id: 2,
          sender: "Admin",
          message:
            "Hello! I'm sorry to hear about the upload issue. Can you tell me the file size and format of your video?",
          timestamp: "2024-01-15 14:35",
          isAdmin: true,
        },
        {
          id: 3,
          sender: "Team Alpha",
          message:
            "The file is 2.5GB and in MP4 format. We've tried multiple times but it always stops at the same point.",
          timestamp: "2024-01-15 14:40",
          isAdmin: false,
        },
      ],
    },
    {
      id: 2,
      title: "Evaluation criteria clarification",
      user: "Dr. Sarah Johnson",
      userType: "evaluator",
      priority: "medium",
      status: "pending",
      lastMessage: "Need clarification on scoring rubric",
      timestamp: "2024-01-15 12:15",
      messages: [
        {
          id: 1,
          sender: "Dr. Sarah Johnson",
          message:
            "Could you provide more details about the 'Innovation' criteria? I want to ensure I'm scoring consistently.",
          timestamp: "2024-01-15 12:15",
          isAdmin: false,
        },
      ],
    },
    {
      id: 3,
      title: "Account approval status",
      user: "Prof. Michael Chen",
      userType: "evaluator",
      priority: "low",
      status: "resolved",
      lastMessage: "Thank you for the quick approval!",
      timestamp: "2024-01-14 16:45",
      messages: [
        {
          id: 1,
          sender: "Prof. Michael Chen",
          message: "Hi, I submitted my evaluator application 3 days ago. Could you please check the status?",
          timestamp: "2024-01-14 10:00",
          isAdmin: false,
        },
        {
          id: 2,
          sender: "Admin",
          message:
            "Hello Professor Chen! I've reviewed your application and you've been approved. Welcome to the platform!",
          timestamp: "2024-01-14 16:30",
          isAdmin: true,
        },
        {
          id: 3,
          sender: "Prof. Michael Chen",
          message: "Thank you for the quick approval!",
          timestamp: "2024-01-14 16:45",
          isAdmin: false,
        },
      ],
    },
  ]

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTicket) return

    console.log(`Sending message to ticket ${selectedTicket.id}: ${newMessage}`)
    setNewMessage("")
    // Would update the ticket messages in production
    alert("Message sent successfully!")
  }

  const handleStatusChange = (ticketId, newStatus) => {
    console.log(`Changing ticket ${ticketId} status to ${newStatus}`)
    // Would update ticket status in production
    alert(`Ticket status changed to ${newStatus}`)
  }

  // Statistics
  const stats = {
    totalTickets: supportTickets.length,
    openTickets: supportTickets.filter((t) => t.status === "open").length,
    pendingTickets: supportTickets.filter((t) => t.status === "pending").length,
    resolvedTickets: supportTickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground">Manage support tickets and assist users</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Tickets List */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Tickets</DropdownMenuItem>
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>Resolved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {supportTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium line-clamp-2">{ticket.title}</h4>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {ticket.user} ({ticket.userType})
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ticket.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{ticket.timestamp}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="md:col-span-2">
          {selectedTicket ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
                    <CardDescription>
                      {selectedTicket.user} ({selectedTicket.userType}) • {selectedTicket.timestamp}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Change Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "open")}>
                          Mark as Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "pending")}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(selectedTicket.id, "resolved")}>
                          Mark as Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[80%] ${message.isAdmin ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${message.sender}`} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <p>Select a ticket to view the conversation</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
