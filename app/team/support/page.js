"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { supportAPI } from "@/services/api"

export default function TeamSupportPage() {
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadUserTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await supportAPI.getUserTickets()
      const list = res?.data?.tickets || []
      setTickets(list.map((t) => ({
        id: t?._id || Math.random(),
        title: t?.title || 'Untitled Ticket',
        status: t?.status || 'Unknown',
        priority: t?.priority || 'medium',
        lastMessage: t?.lastMessage || 'No messages yet',
        lastMessageDate: t?.lastMessageDate ? new Date(t.lastMessageDate).toLocaleString() : "No date",
      })))
    } catch (err) {
      console.error('Error loading tickets:', err)
      setError('Failed to load support tickets')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserTickets()
  }, [])

  const filtered = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const openTicket = async (id) => {
    const res = await supportAPI.getTicketById(id)
    const t = res?.data?.ticket
    if (!t) return
    setSelected({
      id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      messages: (t.messages || []).map((m) => ({
        id: m._id,
        sender: m.senderName,
        content: m.message,
        at: m.timestamp ? new Date(m.timestamp).toLocaleString() : "",
        isAdmin: m.isAdmin,
      })),
    })
  }

  const send = async () => {
    if (!selected || !message.trim()) return
    await supportAPI.sendMessage(selected.id, { message })
    setMessage("")
    await openTicket(selected.id)
  }

  const create = async () => {
    if (!newTitle.trim() || !newMessage.trim()) return
    await supportAPI.createTicket({ title: newTitle.trim(), message: newMessage.trim(), priority: "medium" })
    setCreating(false)
    setNewTitle("")
    setNewMessage("")
    await loadUserTickets()
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={() => setCreating(true)}>New</Button>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium mb-2">Error Loading Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={loadUserTickets} 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? 'No tickets match your search.' : 'You haven\'t created any support tickets yet.'}
              </p>
              {!search && (
                <Button onClick={() => setCreating(true)} variant="outline">
                  Create First Ticket
                </Button>
              )}
            </div>
          ) : (
            filtered.map((t) => (
              <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openTicket(t.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{t.title}</div>
                    <Badge variant="secondary">{t.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{t.lastMessage}</div>
                  <div className="text-xs text-muted-foreground">{t.lastMessageDate}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        {creating ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Start a conversation with the support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Textarea placeholder="Describe your issue" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={create}>Create</Button>
                <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : selected ? (
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>{selected.title}</CardTitle>
              <CardDescription>Status: {selected.status} • Priority: {selected.priority}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {selected?.messages && selected.messages.length > 0 ? (
                selected.messages.map((m) => (
                  <div key={m?.id || Math.random()} className={`flex ${m?.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded p-2 text-sm ${m?.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <div>{m?.content || 'Empty message'}</div>
                      <div className={`text-xs ${m?.isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {m?.sender || 'Unknown'} • {m?.at || 'No date'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-6xl mb-4">💬</div>
                  <p>No messages in this ticket yet.</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              )}
            </CardContent>
            <div className="border-t p-4 flex gap-2">
              <Textarea placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={send}>Send</Button>
            </div>
          </Card>
        ) : (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-muted-foreground">Select a ticket or create a new one</div>
          </Card>
        )}
      </div>
    </div>
  )
}


