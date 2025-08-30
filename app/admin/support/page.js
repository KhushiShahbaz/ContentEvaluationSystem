"use client"

import { useEffect, useState } from "react"
import { Send, Search, Filter, MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chatAPI } from "@/services/api"

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
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({ totalTickets: 0, activeTickets: 0, resolvedTickets: 0, closedTickets: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch support chats and stats using chat API
        const [chatsRes, statsRes] = await Promise.all([
          chatAPI.getAllSupportChats(),
          chatAPI.getSupportStats()
        ])
        
        const chats = chatsRes?.data?.data || []
        const statsData = statsRes?.data?.data?.overview || {}
        
        // Transform chat data to match our UI structure
        const transformedTickets = chats.map((chat) => ({
          id: chat._id,
          title: chat.title,
          user: chat.participants?.[0]?.name || "User",
          userType: chat.userType || chat.participants?.[0]?.role || "user",
          priority: chat.priority,
          status: chat.status,
          lastMessage: chat.messages?.[chat.messages.length - 1]?.content || "No messages yet",
          timestamp: chat.lastMessageDate ? new Date(chat.lastMessageDate).toLocaleString() : "",
          messages: chat.messages?.map((m) => ({
            id: m._id,
            sender: m.sender?.name || m.senderName || "User",
            message: m.content,
            timestamp: m.timestamp ? new Date(m.timestamp).toLocaleString() : "",
            isAdmin: m.isAdmin || m.sender?.role === "admin",
          })) || [],
        }))
        
        setTickets(transformedTickets)
        setStats(statsData)
      } catch (e) {
        console.error("Failed to fetch chat data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
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

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setLoading(true)
      // Update chat status in database using chat API
      await chatAPI.updateChatStatus(ticketId, { status: newStatus })
      
      // Update local state to reflect the change
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: newStatus }
            : ticket
        )
      )
      
      // Update selected ticket if it's the current one
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus }))
      }
      
      console.log(`Ticket ${ticketId} status changed to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update ticket status:', error)
      alert(`Failed to update status: ${error?.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.closedTickets}</div>
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
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Resolved</DropdownMenuItem>
                <DropdownMenuItem>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {filteredTickets.map((ticket) => (
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
                        <Button variant="outline" size="sm" disabled={loading}>
                          {loading ? "Updating..." : "Change Status"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(selectedTicket.id, "active")}
                          disabled={selectedTicket.status === "active" || loading}
                        >
                          Mark as Active
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(selectedTicket.id, "resolved")}
                          disabled={selectedTicket.status === "resolved" || loading}
                        >
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(selectedTicket.id, "closed")}
                          disabled={selectedTicket.status === "closed" || loading}
                        >
                          Mark as Closed
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
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  if (!newMessage.trim() || !selectedTicket) return
                  try {
                    await chatAPI.sendMessage(selectedTicket.id, { content: newMessage.trim() })
                    setNewMessage("")
                    // Refresh selected ticket
                    const res = await chatAPI.getChat(selectedTicket.id)
                    const chat = res?.data?.data
                    setSelectedTicket({
                      id: chat._id,
                      title: chat.title,
                      user: chat.participants?.[0]?.name || "User",
                      userType: chat.userType || chat.participants?.[0]?.role || "user",
                      priority: chat.priority,
                      status: chat.status,
                      lastMessage: chat.messages?.[chat.messages.length - 1]?.content || "No messages yet",
                      timestamp: chat.lastMessageDate ? new Date(chat.lastMessageDate).toLocaleString() : "",
                      messages: chat.messages?.map((m) => ({
                        id: m._id,
                        sender: m.sender?.name || m.senderName || "User",
                        message: m.content,
                        timestamp: m.timestamp ? new Date(m.timestamp).toLocaleString() : "",
                        isAdmin: m.isAdmin || m.sender?.role === "admin",
                      })) || [],
                    })
                    
                    // Also refresh the tickets list to show updated last message
                    setTickets(prevTickets => 
                      prevTickets.map(ticket => 
                        ticket.id === selectedTicket.id 
                          ? {
                              ...ticket,
                              lastMessage: chat.messages?.[chat.messages.length - 1]?.content || "No messages yet",
                              timestamp: chat.lastMessageDate ? new Date(chat.lastMessageDate).toLocaleString() : "",
                            }
                          : ticket
                      )
                    )
                  } catch (err) {
                    console.error("Failed to send message", err)
                  }
                }} className="flex gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        e.currentTarget.form?.requestSubmit()
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
