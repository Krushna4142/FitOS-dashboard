"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Flame, Target, Star, Award, Zap, Crown, Heart, Utensils, Moon } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  icon: any
  earned: boolean
  description: string
  category: "health" | "nutrition" | "activity" | "consistency"
  points: number
}

interface StreakData {
  name: string
  current: number
  best: number
  icon: any
  lastUpdated: Date
}

export function GamificationCard() {
  const [badges, setBadges] = useState<BadgeData[]>([
    {
      id: "early-bird",
      name: "Early Bird",
      icon: Star,
      earned: false,
      description: "Log activity before 8 AM",
      category: "activity",
      points: 50,
    },
    {
      id: "streak-master",
      name: "Streak Master",
      icon: Flame,
      earned: false,
      description: "7-day logging streak",
      category: "consistency",
      points: 100,
    },
    {
      id: "step-champion",
      name: "Step Champion",
      icon: Target,
      earned: false,
      description: "10,000 steps in a day",
      category: "activity",
      points: 75,
    },
    {
      id: "wellness-warrior",
      name: "Wellness Warrior",
      icon: Award,
      earned: false,
      description: "Complete 5 wellness sessions",
      category: "health",
      points: 100,
    },
    {
      id: "consistency-king",
      name: "Consistency King",
      icon: Crown,
      earned: false,
      description: "30-day streak",
      category: "consistency",
      points: 200,
    },
    {
      id: "energy-booster",
      name: "Energy Booster",
      icon: Zap,
      earned: false,
      description: "Complete morning routine 10 times",
      category: "health",
      points: 75,
    },
    {
      id: "nutrition-ninja",
      name: "Nutrition Ninja",
      icon: Utensils,
      earned: false,
      description: "Log 20 meals",
      category: "nutrition",
      points: 100,
    },
    {
      id: "sleep-master",
      name: "Sleep Master",
      icon: Moon,
      earned: false,
      description: "Get 8+ hours sleep for 7 days",
      category: "health",
      points: 150,
    },
    {
      id: "heart-hero",
      name: "Heart Hero",
      icon: Heart,
      earned: false,
      description: "Maintain healthy heart rate for 14 days",
      category: "health",
      points: 125,
    },
  ])

  const [streaks, setStreaks] = useState<StreakData[]>([
    { name: "Daily Check-in", current: 0, best: 0, icon: Target, lastUpdated: new Date() },
    { name: "Exercise Log", current: 0, best: 0, icon: Trophy, lastUpdated: new Date() },
    { name: "Sleep Tracking", current: 0, best: 0, icon: Moon, lastUpdated: new Date() },
    { name: "Nutrition Log", current: 0, best: 0, icon: Utensils, lastUpdated: new Date() },
  ])

  // Load saved progress from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem("fitos-badges")
    const savedStreaks = localStorage.getItem("fitos-streaks")

    if (savedBadges) {
      setBadges(JSON.parse(savedBadges))
    }

    if (savedStreaks) {
      const parsed = JSON.parse(savedStreaks)
      setStreaks(
        parsed.map((streak: any) => ({
          ...streak,
          lastUpdated: new Date(streak.lastUpdated),
        })),
      )
    }

    // Check for new achievements
    checkAchievements()
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("fitos-badges", JSON.stringify(badges))
  }, [badges])

  useEffect(() => {
    localStorage.setItem("fitos-streaks", JSON.stringify(streaks))
  }, [streaks])

  const checkAchievements = () => {
    const healthData = localStorage.getItem("fitos-health-data")
    const foodLog = localStorage.getItem("fitos-food-log")

    if (healthData) {
      const parsed = JSON.parse(healthData)

      // Check sleep master badge
      if (parsed.sleepHours >= 8) {
        updateBadge("sleep-master", true)
      }

      // Check heart hero badge (normal heart rate)
      if (parsed.heartRate >= 60 && parsed.heartRate <= 100) {
        updateBadge("heart-hero", true)
      }
    }

    if (foodLog) {
      const meals = JSON.parse(foodLog)

      // Check nutrition ninja badge
      if (meals.length >= 5) {
        updateBadge("nutrition-ninja", true)
      }

      // Update nutrition streak
      updateStreak("Nutrition Log", meals.length > 0 ? 1 : 0)
    }

    // Simulate other achievements based on usage
    const now = new Date()
    const hour = now.getHours()

    // Early bird badge (activity before 8 AM)
    if (hour < 8) {
      updateBadge("early-bird", true)
    }

    // Update daily check-in streak (simulate based on health data entry)
    if (healthData) {
      updateStreak("Daily Check-in", 1)
    }
  }

  const updateBadge = (badgeId: string, earned: boolean) => {
    setBadges((prev) => prev.map((badge) => (badge.id === badgeId ? { ...badge, earned } : badge)))
  }

  const updateStreak = (streakName: string, increment: number) => {
    setStreaks((prev) =>
      prev.map((streak) => {
        if (streak.name === streakName) {
          const newCurrent = streak.current + increment
          return {
            ...streak,
            current: newCurrent,
            best: Math.max(streak.best, newCurrent),
            lastUpdated: new Date(),
          }
        }
        return streak
      }),
    )
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const totalPoints =
    earnedBadges.reduce((acc, badge) => acc + badge.points, 0) +
    streaks.reduce((acc, streak) => acc + streak.current * 10, 0)

  const currentLevel = Math.floor(totalPoints / 500) + 1
  const pointsToNextLevel = currentLevel * 500 - totalPoints

  const badgesByCategory = badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) acc[badge.category] = []
      acc[badge.category].push(badge)
      return acc
    },
    {} as Record<string, BadgeData[]>,
  )

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-chart-3" />
            <CardTitle>Your Progress</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={checkAchievements} className="bg-transparent">
            Check Progress
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Track your wellness journey and earn rewards</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Points and Level */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-chart-3/10 border border-primary/20">
            <div className="text-3xl font-bold text-primary">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
            <div className="mt-2 space-y-1">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Level {currentLevel}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {pointsToNextLevel} points to Level {currentLevel + 1}
              </div>
            </div>
          </div>

          {/* Health Streaks */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Flame className="h-4 w-4 text-chart-4" />
              <span>Health Streaks</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {streaks.map((streak, index) => {
                const Icon = streak.icon
                const isActive = streak.current > 0
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      isActive ? "bg-chart-4/10 border-chart-4/30" : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-4 w-4 ${isActive ? "text-chart-4" : "text-muted-foreground"}`} />
                      <div className={`text-lg font-bold ${isActive ? "text-chart-4" : "text-muted-foreground"}`}>
                        {streak.current}
                      </div>
                    </div>
                    <div className="text-xs font-medium">{streak.name}</div>
                    <div className="text-xs text-muted-foreground">Best: {streak.best} days</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Badges by Category */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Award className="h-4 w-4 text-chart-3" />
              <span>
                Badges ({earnedBadges.length}/{badges.length})
              </span>
            </h4>

            {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
              <div key={category} className="mb-4">
                <h5 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                  {category} ({categoryBadges.filter((b) => b.earned).length}/{categoryBadges.length})
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {categoryBadges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div
                        key={badge.id}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer hover:scale-105 ${
                          badge.earned
                            ? "bg-chart-3/10 border-chart-3/30 text-chart-3 shadow-sm"
                            : "bg-muted/20 border-muted text-muted-foreground opacity-50"
                        }`}
                        title={`${badge.description} (${badge.points} points)`}
                      >
                        <Icon
                          className={`h-5 w-5 mx-auto mb-1 ${badge.earned ? "text-chart-3" : "text-muted-foreground"}`}
                        />
                        <div className="text-xs font-medium leading-tight">{badge.name}</div>
                        {badge.earned && <div className="text-xs text-chart-3 font-bold">+{badge.points}</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
