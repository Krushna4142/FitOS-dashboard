"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Utensils, Activity, Heart, Clock } from "lucide-react"
import { wellnessApi } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

interface LogEntry {
  id: string
  type: "meal" | "exercise" | "mood"
  data: any
  timestamp: string
}

export function QuickAddButtons() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(`quickLogs_${user?.username || "demo"}`)
    if (saved) {
      setRecentLogs(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`quickLogs_${user?.username || "demo"}`, JSON.stringify(recentLogs))
  }, [recentLogs, user])

  const handleQuickAdd = async (type: string, data: any) => {
    setIsLoading(true)

    try {
      await wellnessApi.logActivity({ type, ...data })

      const newLog: LogEntry = {
        id: Date.now().toString(),
        type: type as "meal" | "exercise" | "mood",
        data,
        timestamp: new Date().toISOString(),
      }

      setRecentLogs((prev) => [newLog, ...prev.slice(0, 4)]) // Keep only 5 most recent

      toast({
        title: "Successfully logged!",
        description: `Your ${type} has been recorded.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to log ${type}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatLogEntry = (log: LogEntry) => {
    const timeAgo = new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    switch (log.type) {
      case "meal":
        return `${log.data.meal}, ${log.data.calories} cal`
      case "exercise":
        return `${log.data.exercise}, ${log.data.duration} min`
      case "mood":
        const moodEmojis = { excellent: "😄", good: "😊", okay: "😐", poor: "😔", terrible: "😢" }
        return `Mood: ${moodEmojis[log.data.mood as keyof typeof moodEmojis] || "😐"} ${log.data.mood}`
      default:
        return "Unknown activity"
    }
  }

  const MealForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [meal, setMeal] = useState("")
    const [calories, setCalories] = useState("")
    const [mealType, setMealType] = useState("")

    // Mock calorie estimation based on meal description
    const estimateCalories = (description: string) => {
      const keywords = {
        salad: 150,
        chicken: 200,
        rice: 150,
        pasta: 300,
        pizza: 400,
        burger: 500,
        sandwich: 250,
        soup: 100,
        fruit: 80,
        yogurt: 120,
      }

      let estimated = 200 // base estimate
      Object.entries(keywords).forEach(([keyword, cals]) => {
        if (description.toLowerCase().includes(keyword)) {
          estimated = cals
        }
      })

      return estimated
    }

    const handleMealChange = (value: string) => {
      setMeal(value)
      if (value && !calories) {
        setCalories(estimateCalories(value).toString())
      }
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="meal-type">Meal Type</Label>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="meal">What did you eat?</Label>
          <Textarea
            id="meal"
            placeholder="e.g., Grilled chicken salad with quinoa"
            value={meal}
            onChange={(e) => handleMealChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="calories">Estimated Calories</Label>
          <Input
            id="calories"
            type="number"
            placeholder="e.g., 450"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Auto-estimated based on your description</p>
        </div>
        <Button
          onClick={() => onSubmit({ meal, calories: Number(calories), mealType })}
          disabled={!meal || !mealType || isLoading}
          className="w-full"
        >
          {isLoading ? "Logging..." : "Log Meal"}
        </Button>
      </div>
    )
  }

  const ExerciseForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [exercise, setExercise] = useState("")
    const [duration, setDuration] = useState("")
    const [intensity, setIntensity] = useState("")

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="exercise">Exercise Type</Label>
          <Input
            id="exercise"
            placeholder="e.g., Running, Yoga, Weight training"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="e.g., 30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="intensity">Intensity</Label>
          <Select value={intensity} onValueChange={setIntensity}>
            <SelectTrigger>
              <SelectValue placeholder="Select intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => onSubmit({ exercise, duration, intensity })}
          disabled={!exercise || !duration || !intensity || isLoading}
          className="w-full"
        >
          {isLoading ? "Logging..." : "Log Exercise"}
        </Button>
      </div>
    )
  }

  const MoodForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [mood, setMood] = useState("")
    const [energy, setEnergy] = useState("")
    const [notes, setNotes] = useState("")

    const moodOptions = [
      { value: "excellent", label: "😄 Excellent", color: "text-chart-2" },
      { value: "good", label: "😊 Good", color: "text-chart-2" },
      { value: "okay", label: "😐 Okay", color: "text-chart-3" },
      { value: "poor", label: "😔 Poor", color: "text-chart-4" },
      { value: "terrible", label: "😢 Terrible", color: "text-chart-4" },
    ]

    return (
      <div className="space-y-4">
        <div>
          <Label>How are you feeling?</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                variant={mood === option.value ? "default" : "outline"}
                className="justify-start bg-transparent"
                onClick={() => setMood(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="energy">Energy Level (1-10)</Label>
          <Input
            id="energy"
            type="number"
            min="1"
            max="10"
            placeholder="e.g., 7"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional thoughts or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button
          onClick={() => onSubmit({ mood, energy, notes })}
          disabled={!mood || !energy || isLoading}
          className="w-full"
        >
          {isLoading ? "Logging..." : "Log Mood"}
        </Button>
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Quick Add</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Log your daily activities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Utensils className="h-4 w-4 mr-2 text-chart-2" />
                Log Meal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
              </DialogHeader>
              <MealForm onSubmit={(data) => handleQuickAdd("meal", data)} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Activity className="h-4 w-4 mr-2 text-chart-1" />
                Log Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Exercise</DialogTitle>
              </DialogHeader>
              <ExerciseForm onSubmit={(data) => handleQuickAdd("exercise", data)} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Heart className="h-4 w-4 mr-2 text-chart-4" />
                Log Mood
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Mood</DialogTitle>
              </DialogHeader>
              <MoodForm onSubmit={(data) => handleQuickAdd("mood", data)} />
            </DialogContent>
          </Dialog>
        </div>

        {recentLogs.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="font-semibold text-sm mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Recent Logs
            </h4>
            <div className="space-y-2">
              {recentLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="text-xs p-2 rounded bg-muted/20 border">
                  <p className="font-medium">{formatLogEntry(log)}</p>
                  <p className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
