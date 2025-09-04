"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Moon, Activity } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"

const heartRateData = [
  { value: 68 },
  { value: 72 },
  { value: 70 },
  { value: 75 },
  { value: 73 },
  { value: 71 },
  { value: 72 },
]

export function HealthIndicatorsCard() {
  const getHeartRateStatus = (bpm: number) => {
    if (bpm >= 60 && bpm <= 100) return { status: "Normal", color: "text-chart-2" }
    if (bpm < 60) return { status: "Low", color: "text-chart-4" }
    return { status: "High", color: "text-chart-4" }
  }

  const getSleepQualityStatus = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { status: "Good", color: "text-chart-2" }
    if (hours >= 6 && hours < 7) return { status: "Fair", color: "text-chart-3" }
    return { status: "Poor", color: "text-chart-4" }
  }

  const heartRate = 72
  const sleepHours = 7.5
  const steps = 8432
  const stepGoal = 10000

  const heartRateStatus = getHeartRateStatus(heartRate)
  const sleepStatus = getSleepQualityStatus(sleepHours)
  const stepProgress = (steps / stepGoal) * 100

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Key Health Indicators</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Heart Rate */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-chart-4" />
              <span className="text-sm font-medium">Heart Rate</span>
            </div>
            <div className="flex items-end space-x-3">
              <div>
                <div className="text-2xl font-bold">{heartRate}</div>
                <div className="text-xs text-muted-foreground">BPM</div>
              </div>
              <div className="flex-1 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="currentColor"
                      strokeWidth={2}
                      dot={false}
                      className="text-chart-4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={`text-xs ${heartRateStatus.color}`}>{heartRateStatus.status}</div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-chart-1" />
              <span className="text-sm font-medium">Sleep Quality</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{sleepHours}h</div>
              <div className="text-xs text-muted-foreground">Last night</div>
            </div>
            <div className={`text-xs ${sleepStatus.color}`}>{sleepStatus.status} quality</div>
          </div>

          {/* Activity */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-chart-2" />
              <span className="text-sm font-medium">Daily Steps</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{steps.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Goal: {stepGoal.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 transition-all duration-500"
                  style={{ width: `${Math.min(stepProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{Math.round(stepProgress)}% of goal</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
