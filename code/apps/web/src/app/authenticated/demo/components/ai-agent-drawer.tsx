"use client"

import * as React from "react"
import {
  Bot,
  Send,
  Loader2,
  Search,
  Sparkles
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@workspace/ui/components/drawer"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface AiAgentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  siteContext: string
}

export function AiAgentDrawer({ open, onOpenChange, siteContext }: AiAgentDrawerProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<any[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ask Beyond initialized. Operations context synchronized. How can I assist with site security today?"
    }
  ])
  const [isLoading, setIsLoading] = React.useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: "user", content }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          siteContext
        })
      })

      if (!response.ok) throw new Error("Failed to reach Ask Beyond")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""
      const assistantId = (Date.now() + 1).toString()

      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: assistantContent } : m
          ))
        }
      }
    } catch (error: any) {
      console.error("Ask Beyond Error:", error)
      setMessages(prev => [...prev, { 
        id: "error", 
        role: "assistant", 
        content: `Connection Error: ${error.message || "Failed to reach operations center."}`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current && !searchQuery) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, searchQuery])

  const quickActions = [
    "Summarize site status",
    "Are any cameras offline?",
    "Check visitor overstays",
    "Analyze access logs"
  ]

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-t border-primary/20">
        <div className="mx-auto w-full max-w-2xl flex flex-col h-full overflow-hidden">
          <DrawerHeader className="p-6 border-b border-primary/10 bg-primary/5 rounded-t-3xl shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <DrawerTitle className="text-lg font-black tracking-tight uppercase">Ask Beyond</DrawerTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Ops Link</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-9 w-9 rounded-lg", isSearchOpen && "bg-primary/10 text-primary")}
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen)
                    if (isSearchOpen) setSearchQuery("")
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-muted-foreground uppercase">
                  v2.0
                </Badge>
              </div>
            </div>

            {isSearchOpen && (
              <div className="mt-4 relative animate-in fade-in slide-in-from-top-2 duration-200">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-background/50 border-primary/10 text-xs"
                />
              </div>
            )}
          </DrawerHeader>

          {/* Message Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none"
          >
            {filteredMessages.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 opacity-50">
                <Search className="h-8 w-8" />
                <p className="text-xs font-bold uppercase tracking-widest">No matching records found</p>
              </div>
            )}
            
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  m.role === "user" ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    {m.role === "user" ? "Command Center" : "Beyond"}
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border border-primary/10 text-foreground",
                    searchQuery && "ring-1 ring-primary/30"
                  )}
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-discrete pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-primary/90">{children}</strong>,
                      code: ({ children }) => <code className="bg-primary/10 text-primary px-1 rounded text-xs font-mono">{children}</code>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-3 border border-primary/10 rounded-lg">
                          <table className="min-w-full divide-y divide-primary/10">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-primary/5">{children}</thead>,
                      th: ({ children }) => <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 text-xs border-t border-primary/5">{children}</td>,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col gap-2 items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Beyond</span>
                <div className="bg-muted/50 border border-primary/10 rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="p-6 border-t bg-muted/20 space-y-4 shrink-0">
            {!messages.length || messages.length < 3 && !searchQuery && (
              <div className="flex flex-wrap gap-2">
                {quickActions.map(action => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="px-3 py-1.5 rounded-full border border-primary/20 bg-background text-[10px] font-bold uppercase tracking-tight hover:bg-primary/5 hover:border-primary/40 transition-all text-muted-foreground hover:text-primary"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(inputValue)
              }}
              className="relative flex items-center"
            >
              <Input
                autoFocus
                placeholder="Ask Beyond..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-12 h-12 rounded-xl bg-background border-primary/10 focus-visible:ring-primary/20 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 h-9 w-9 rounded-lg"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest opacity-50 mb-2">
              Powered by Gemini 2.0 Flash via OpenRouter
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

