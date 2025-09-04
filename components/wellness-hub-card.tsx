"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Utensils, Clock, Play, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

const wellnessPrograms = [
  {
    id: "meditation",
    title: "Meditation",
    icon: Brain,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "Mindfulness and stress reduction",
    duration: "5-20 min",
    sessions: [
      { name: "Morning Mindfulness", duration: "10 min", difficulty: "Beginner" },
      { name: "Stress Relief", duration: "15 min", difficulty: "Intermediate" },
      { name: "Deep Sleep", duration: "20 min", difficulty: "Beginner" },
      { name: "Focus Boost", duration: "5 min", difficulty: "Beginner" },
    ],
  },
  {
    id: "nutrition",
    title: "Meal Plans",
    icon: Utensils,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "Personalized nutrition guidance",
    duration: "Daily",
    sessions: [
      { name: "Mediterranean Diet", duration: "7 days", difficulty: "Easy" },
      { name: "Plant-Based Power", duration: "14 days", difficulty: "Moderate" },
      { name: "Keto Kickstart", duration: "21 days", difficulty: "Advanced" },
      { name: "Balanced Basics", duration: "30 days", difficulty: "Easy" },
    ],
  },
  {
    id: "stress",
    title: "Stress Reduction",
    icon: Heart,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    description: "Techniques for better mental health",
    duration: "10-30 min",
    sessions: [
      { name: "Breathing Exercises", duration: "10 min", difficulty: "Beginner" },
      { name: "Progressive Relaxation", duration: "25 min", difficulty: "Intermediate" },
      { name: "Yoga Flow", duration: "30 min", difficulty: "Intermediate" },
      { name: "Quick Reset", duration: "5 min", difficulty: "Beginner" },
    ],
  },
]

interface ActiveProgram {
  id: string
  title: string
  sessionName: string
  currentDay: number
  totalDays: number
  startDate: string
}

export function WellnessHubCard() {
  const [selectedProgram, setSelectedProgram] = useState<(typeof wellnessPrograms)[0] | null>(null)
  const [activePrograms, setActivePrograms] = useState<ActiveProgram[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem(`activePrograms_${user?.username || "demo"}`)
    if (saved) {
      setActivePrograms(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(`activePrograms_${user?.username || "demo"}`, JSON.stringify(activePrograms))
  }, [activePrograms, user])

  const startProgram = (program: (typeof wellnessPrograms)[0], session: any) => {
    const totalDays = Number.parseInt(session.duration.match(/\d+/)?.[0] || "7")
    const newActiveProgram: ActiveProgram = {
      id: `${program.id}_${Date.now()}`,
      title: program.title,
      sessionName: session.name,
      currentDay: 1,
      totalDays,
      startDate: new Date().toISOString(),
    }

    setActivePrograms((prev) => [...prev, newActiveProgram])
    toast({
      title: "Program Started! 🎉",
      description: `You've enrolled in ${session.name}. Day 1 begins now!`,
    })
  }

  const advanceDay = (programId: string) => {
    setActivePrograms((prev) =>
      prev.map((program) =>
        program.id === programId
          ? { ...program, currentDay: Math.min(program.currentDay + 1, program.totalDays) }
          : program,
      ),
    )
    toast({
      title: "Progress Updated! 📈",
      description: "Great job completing today's session!",
    })
  }

  const completeProgram = (programId: string) => {
    setActivePrograms((prev) => prev.filter((program) => program.id !== programId))
    toast({
      title: "Program Completed! 🏆",
      description: "Congratulations on finishing your wellness program!",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Wellness Hub</CardTitle>
        <p className="text-sm text-muted-foreground">Explore programs designed for your wellbeing</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activePrograms.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Active Programs</h4>
            {activePrograms.map((program) => {
              const progress = (program.currentDay / program.totalDays) * 100
              const isCompleted = program.currentDay >= program.totalDays

              return (
                <div key={program.id} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">
                        {user?.username}, you're enrolled in {program.sessionName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Day {program.currentDay}/{program.totalDays} • {Math.round(progress)}% complete
                      </p>
                    </div>
                    {isCompleted ? (
                      <Button size="sm" variant="outline" onClick={() => completeProgram(program.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => advanceDay(program.id)}>
                        Next Day
                      </Button>
                    )}
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })}
          </div>
        )}

        <div className="flex space-x-3 overflow-x-auto pb-2">
          {wellnessPrograms.map((program) => {
            const Icon = program.icon
            return (
              <Dialog key={program.id}>
                <DialogTrigger asChild>
                  <div className="flex-shrink-0 w-40 p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all bg-card">
                    <div className={`p-2 rounded-full ${program.bgColor} w-fit mb-2`}>
                      <Icon className={`h-4 w-4 ${program.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{program.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{program.description}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${program.color}`} />
                      <span>{program.title}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{program.description}</p>
                    <div>
                      <h4 className="font-semibold mb-3">Available Sessions</h4>
                      <div className="space-y-2">
                        {program.sessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <h5 className="font-medium">{session.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {session.duration} • {session.difficulty}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => startProgram(program, session)}>
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
