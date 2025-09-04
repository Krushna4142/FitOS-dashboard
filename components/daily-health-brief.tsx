"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, Moon, Activity, Heart } from "lucide-react"

const generateInsights = () => {
  const insights = [
    {
      icon: Moon,
      title: "Sleep Improvement",
      message: "Your sleep quality improved by 15% this week. Your consistent 10:30 PM bedtime is paying off!",
      type: "positive",
    },
    {
      icon: Activity,
      title: "Activity Goal",
      message: "You're 1,568 steps away from your daily goal. A 15-minute walk would get you there.",
      type: "neutral",
    },
    {
      icon: Heart,
      title: "Heart Rate Variability",
      message: "Your resting heart rate has decreased by 3 BPM over the past month - excellent progress!",
      type: "positive",
    },
    {
      icon: TrendingUp,
      title: "Weekly Trend",
      message: "Your overall health score is trending upward. Keep up the great work with your morning routine.",
      type: "positive",
    },
  ]

  // Return 2-3 random insights
  const shuffled = insights.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2)
}

export function DailyHealthBrief() {
  const insights = generateInsights()

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-chart-2"
      case "warning":
        return "text-chart-3"
      case "alert":
        return "text-chart-4"
      default:
        return "text-primary"
    }
  }

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Daily Health Brief</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">AI-generated insights based on your recent activity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                <div className={`p-2 rounded-full bg-background ${getInsightColor(insight.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong>Today's Recommendation:</strong> Try incorporating 5 minutes of deep breathing exercises into your
            evening routine to further improve your sleep quality and reduce stress levels.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
