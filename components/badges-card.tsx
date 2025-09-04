"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Zap, Heart, Target, Calendar, Award, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: any
  earned: boolean
  earnedDate?: string
  category: string
}

export function BadgesCard() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<BadgeData[]>([
    {
      id: "first-login",
      name: "Welcome",
      description: "Joined FitOS",
      icon: Star,
      earned: true,
      category: "Getting Started",
    },
    {
      id: "health-input",
      name: "Health Tracker",
      description: "First health input",
      icon: Heart,
      earned: false,
      category: "Health",
    },
    {
      id: "week-streak",
      name: "Consistent",
      description: "7-day streak",
      icon: Calendar,
      earned: false,
      category: "Streaks",
    },
    {
      id: "nutrition-log",
      name: "Nutrition Pro",
      description: "Logged 10 meals",
      icon: Target,
      earned: false,
      category: "Nutrition",
    },
    {
      id: "meditation",
      name: "Mindful",
      description: "Completed meditation",
      icon: Zap,
      earned: false,
      category: "Wellness",
    },
    {
      id: "challenge",
      name: "Challenger",
      description: "Joined a challenge",
      icon: Trophy,
      earned: false,
      category: "Challenges",
    },
    {
      id: "month-active",
      name: "Dedicated",
      description: "30 days active",
      icon: Award,
      earned: false,
      category: "Milestones",
    },
    {
      id: "perfect-week",
      name: "Perfect Week",
      description: "All goals met for 7 days",
      icon: Crown,
      earned: false,
      category: "Achievements",
    },
  ])

  useEffect(() => {
    const saved = localStorage.getItem(`badges_${user?.username || "demo"}`)
    if (saved) {
      setBadges(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`badges_${user?.username || "demo"}`, JSON.stringify(badges))
  }, [badges, user])

  const earnedBadges = badges.filter((b) => b.earned)
  const totalBadges = badges.length

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Badges</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {earnedBadges.length}/{totalBadges} earned
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  badge.earned ? "bg-primary/10 border-primary/20 shadow-sm" : "bg-muted/20 border-muted opacity-50"
                }`}
                title={`${badge.name}: ${badge.description}`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-1 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-xs font-medium truncate">{badge.name}</p>
              </div>
            )
          })}
        </div>

        {earnedBadges.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Latest Achievement</p>
            <div className="flex items-center space-x-2">
              {(() => {
                const latest = earnedBadges[earnedBadges.length - 1]
                const Icon = latest.icon
                return (
                  <>
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{latest.name}</span>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
