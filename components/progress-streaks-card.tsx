"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Target, Calendar, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface StreakData {
  healthInputs: number
  workouts: number
  meditation: number
  nutrition: number
  lastUpdated: string
}

export function ProgressStreaksCard() {
  const [streaks, setStreaks] = useState<StreakData>({
    healthInputs: 0,
    workouts: 0,
    meditation: 0,
    nutrition: 0,
    lastUpdated: new Date().toDateString(),
  })
  const { user } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem(`streaks_${user?.username || "demo"}`)
    if (saved) {
      const data = JSON.parse(saved)
      // Reset streaks if it's a new day
      if (data.lastUpdated !== new Date().toDateString()) {
        setStreaks((prev) => ({ ...prev, lastUpdated: new Date().toDateString() }))
      } else {
        setStreaks(data)
      }
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`streaks_${user?.username || "demo"}`, JSON.stringify(streaks))
  }, [streaks, user])

  const streakItems = [
    { label: "Health Check-ins", value: streaks.healthInputs, icon: Target, color: "text-chart-1" },
    { label: "Workouts", value: streaks.workouts, icon: TrendingUp, color: "text-chart-2" },
    { label: "Meditation", value: streaks.meditation, icon: Calendar, color: "text-chart-3" },
    { label: "Nutrition Logs", value: streaks.nutrition, icon: Flame, color: "text-chart-4" },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Progress & Streaks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {streakItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <Badge variant={item.value > 0 ? "default" : "secondary"}>{item.value} days</Badge>
            </div>
          )
        })}

        <div className="pt-2 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{Math.max(...streakItems.map((i) => i.value))}</p>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
