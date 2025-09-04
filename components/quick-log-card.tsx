"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Utensils, Dumbbell, Heart, Plus, Clock } from "lucide-react"

interface QuickLogEntry {
  id: string
  type: "meal" | "exercise" | "mood"
  content: string
  details?: string
  timestamp: Date
  emoji?: string
}

const logTypes = [
  {
    type: "meal" as const,
    label: "Meal",
    icon: Utensils,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    placeholder: "What did you eat?",
    detailsPlaceholder: "Add details like portion size, calories, etc."
  },
  {
    type: "exercise" as const,
    label: "Exercise",
    icon: Dumbbell,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    placeholder: "What exercise did you do?",
    detailsPlaceholder: "Duration, intensity, reps, etc."
  },
  {
    type: "mood" as const,
    label: "Mood",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    placeholder: "How are you feeling?",
    detailsPlaceholder: "What's affecting your mood?"
  }
]

export function QuickLogCard() {
  const [entries, setEntries] = useState<QuickLogEntry[]>([])
  const [activeType, setActiveType] = useState<"meal" | "exercise" | "mood">("meal")
  const [content, setContent] = useState("")
  const [details, setDetails] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem(`quickLog_${user?.username || "demo"}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed.map((entry: any) => ({ ...entry, timestamp: new Date(entry.timestamp) })))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`quickLog_${user?.username || "demo"}`, JSON.stringify(entries))
  }, [entries, user])

  const addEntry = () => {
    if (!content.trim()) return

    const newEntry: QuickLogEntry = {
      id: Date.now().toString(),
      type: activeType,
      content: content.trim(),
      details: details.trim() || undefined,
      timestamp: new Date(),
      emoji: getRandomEmoji(activeType)
    }

    setEntries(prev => [newEntry, ...prev])
    setContent("")
    setDetails("")

    const typeLabel = logTypes.find(t => t.type === activeType)?.label
    toast({
      title: "Entry Added! 📝",
      description: `${typeLabel} logged successfully`,
    })
  }

  const getRandomEmoji = (type: "meal" | "exercise" | "mood"): string => {
    const emojis = {
      meal: ["🍎", "🥗", "🍗", "🥑", "🍌", "🥕", "🍇", "🥙"],
      exercise: ["💪", "🏃‍♂️", "🚴‍♀️", "🏋️‍♂️", "🧘‍♀️", "🏊‍♂️", "⚽", "🏸"],
      mood: ["😊", "😌", "😄", "🤗", "😇", "🥰", "😎", "🙂"]
    }
    const typeEmojis = emojis[type]
    return typeEmojis[Math.floor(Math.random() * typeEmojis.length)]
  }

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const activeTypeConfig = logTypes.find(t => t.type === activeType)!
  const ActiveIcon = activeTypeConfig.icon

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <span>Quick Log</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Track meals, exercise, and mood quickly</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Log Type Selector */}
        <div className="flex space-x-2">
          {logTypes.map((type) => {
            const Icon = type.icon
            return (
              <Button
                key={type.type}
                variant={activeType === type.type ? "default" : "outline"}
                size="sm"
                className="flex-1 h-auto py-2 flex flex-col space-y-1"
                onClick={() => setActiveType(type.type)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{type.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <ActiveIcon className={`h-4 w-4 ${activeTypeConfig.color}`} />
              <span>{activeTypeConfig.label}</span>
            </Label>
            <Input
              placeholder={activeTypeConfig.placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addEntry()}
            />
          </div>

          <div className="space-y-2">
            <Label>Details (Optional)</Label>
            <Textarea
              placeholder={activeTypeConfig.detailsPlaceholder}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <Button onClick={addEntry} disabled={!content.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Recent Entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Recent Entries</h4>
            <span className="text-xs text-muted-foreground">{entries.length} total</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {entries.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No entries yet</p>
                <p className="text-xs">Start logging your daily activities!</p>
              </div>
            ) : (
              entries.slice(0, 10).map((entry) => {
                const typeConfig = logTypes.find(t => t.type === entry.type)!
                const TypeIcon = typeConfig.icon
                
                return (
                  <div key={entry.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-full ${typeConfig.bgColor} flex-shrink-0`}>
                        <TypeIcon className={`h-3 w-3 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{entry.emoji}</span>
                          <p className="font-medium text-sm truncate">{entry.content}</p>
                        </div>
                        {entry.details && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.details}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.timestamp)}</span>
                          <span className="text-xs text-muted-foreground capitalize">{entry.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
