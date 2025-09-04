"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Target, Users, Trophy } from "lucide-react"

const appointments = [
  {
    id: 1,
    title: "Annual Physical",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-15",
    time: "10:30 AM",
    location: "Main Medical Center",
    type: "General Checkup",
  },
  {
    id: 2,
    title: "Dental Cleaning",
    doctor: "Dr. Mike Chen",
    date: "2024-01-22",
    time: "2:00 PM",
    location: "Smile Dental Clinic",
    type: "Dental",
  },
  {
    id: 3,
    title: "Eye Exam",
    doctor: "Dr. Lisa Park",
    date: "2024-02-05",
    time: "11:15 AM",
    location: "Vision Care Center",
    type: "Vision",
  },
]

const challenges = [
  {
    id: 1,
    title: "30-Day Step Challenge",
    description: "Walk 10,000 steps daily for 30 days",
    duration: "30 days",
    participants: 1247,
    difficulty: "Beginner",
    reward: "Step Master Badge + 500 points",
    progress: 0,
  },
  {
    id: 2,
    title: "Mindful January",
    description: "Complete 15 minutes of meditation daily",
    duration: "31 days",
    participants: 892,
    difficulty: "Intermediate",
    reward: "Zen Master Badge + 750 points",
    progress: 0,
  },
  {
    id: 3,
    title: "Hydration Hero",
    description: "Drink 8 glasses of water daily",
    duration: "21 days",
    participants: 2156,
    difficulty: "Beginner",
    reward: "Hydration Hero Badge + 400 points",
    progress: 0,
  },
  {
    id: 4,
    title: "Sleep Optimization",
    description: "Get 7-9 hours of sleep for 14 consecutive nights",
    duration: "14 days",
    participants: 634,
    difficulty: "Advanced",
    reward: "Sleep Champion Badge + 600 points",
    progress: 0,
  },
]

export function AppointmentsChallengesCard() {
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<(typeof challenges)[0] | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-chart-2/20 text-chart-2"
      case "Intermediate":
        return "bg-chart-3/20 text-chart-3"
      case "Advanced":
        return "bg-chart-4/20 text-chart-4"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="col-span-full grid gap-6 md:grid-cols-2">
      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Upcoming Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment) => (
              <Dialog key={appointment.id}>
                <DialogTrigger asChild>
                  <div className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{appointment.title}</h4>
                        <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatDate(appointment.date)}</div>
                        <div className="text-xs text-muted-foreground">{appointment.time}</div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{appointment.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Doctor</Label>
                        <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">Reschedule</Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-chart-3" />
            <span>Featured Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {challenges.map((challenge) => (
              <Dialog key={challenge.id}>
                <DialogTrigger asChild>
                  <div className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{challenge.participants.toLocaleString()} joined</span>
                        </div>
                        <span>{challenge.duration}</span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-chart-3" />
                      <span>{challenge.title}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{challenge.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Duration</Label>
                        <p className="text-sm text-muted-foreground">{challenge.duration}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Difficulty</Label>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{challenge.participants.toLocaleString()} participants</span>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <Trophy className="h-4 w-4 text-chart-3" />
                        <span className="text-sm font-medium">Reward</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.reward}</p>
                    </div>
                    <Button className="w-full">Join Challenge</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
