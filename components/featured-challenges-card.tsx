"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Calendar, Flame, Play, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  icon: any
  color: string
  bgColor: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ActiveChallenge {
  id: string
  title: string
  currentDay: number
  totalDays: number
  startDate: string
  progress: number
}

const challenges: Challenge[] = [
  {
    id: "30-day-step",
    title: "30-Day Step Challenge",
    description: "Walk 10,000 steps daily for 30 days",
    duration: 30,
    icon: Target,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    difficulty: "Medium",
  },
  {
    id: "hydration-hero",
    title: "Hydration Hero",
    description: "Drink 8 glasses of water daily for 21 days",
    duration: 21,
    icon: Trophy,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    difficulty: "Easy",
  },
  {
    id: "mindful-minutes",
    title: "Mindful Minutes",
    description: "Meditate for 10 minutes daily for 14 days",
    duration: 14,
    icon: Calendar,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    difficulty: "Easy",
  },
  {
    id: "strength-streak",
    title: "Strength Streak",
    description: "Complete strength training 3x/week for 4 weeks",
    duration: 28,
    icon: Flame,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    difficulty: "Hard",
  },
]

export function FeaturedChallengesCard() {
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem(`activeChallenges_${user?.username || "demo"}`)
    if (saved) {
      setActiveChallenges(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`activeChallenges_${user?.username || "demo"}`, JSON.stringify(activeChallenges))
  }, [activeChallenges, user])

  const startChallenge = (challenge: Challenge) => {
    const newActiveChallenge: ActiveChallenge = {
      id: challenge.id,
      title: challenge.title,
      currentDay: 1,
      totalDays: challenge.duration,
      startDate: new Date().toISOString(),
      progress: 0,
    }

    setActiveChallenges((prev) => [...prev, newActiveChallenge])
    toast({
      title: "Challenge Started! 🚀",
      description: `You've joined the ${challenge.title}. Day 1 begins now!`,
    })
  }

  const updateProgress = (challengeId: string) => {
    setActiveChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id === challengeId) {
          const newDay = Math.min(challenge.currentDay + 1, challenge.totalDays)
          const newProgress = (newDay / challenge.totalDays) * 100
          return { ...challenge, currentDay: newDay, progress: newProgress }
        }
        return challenge
      }),
    )
    toast({
      title: "Progress Updated! 📈",
      description: "Great job completing today's challenge!",
    })
  }

  const completeChallenge = (challengeId: string) => {
    setActiveChallenges((prev) => prev.filter((challenge) => challenge.id !== challengeId))
    toast({
      title: "Challenge Completed! 🏆",
      description: "Congratulations on finishing your challenge!",
    })
  }

  const isAlreadyActive = (challengeId: string) => {
    return activeChallenges.some((active) => active.id === challengeId)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Featured Challenges</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Join challenges to stay motivated</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeChallenges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Active Challenges</h4>
            {activeChallenges.map((challenge) => {
              const isCompleted = challenge.currentDay >= challenge.totalDays

              return (
                <div key={challenge.id} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{challenge.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Day {challenge.currentDay}/{challenge.totalDays} • {Math.round(challenge.progress)}% complete
                      </p>
                    </div>
                    {isCompleted ? (
                      <Button size="sm" variant="outline" onClick={() => completeChallenge(challenge.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => updateProgress(challenge.id)}>
                        Day Done
                      </Button>
                    )}
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Available Challenges</h4>
          {challenges.map((challenge) => {
            const Icon = challenge.icon
            const isActive = isAlreadyActive(challenge.id)

            return (
              <div key={challenge.id} className="p-3 rounded-lg border hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${challenge.bgColor}`}>
                      <Icon className={`h-4 w-4 ${challenge.color}`} />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{challenge.title}</h5>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {challenge.duration} days
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? "secondary" : "outline"}
                    onClick={() => !isActive && startChallenge(challenge)}
                    disabled={isActive}
                  >
                    {isActive ? (
                      "Active"
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Join
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
