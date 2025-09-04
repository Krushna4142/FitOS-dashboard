"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const generateData = (days: number) => {
  const data = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sleep: Math.floor(Math.random() * 3) + 6.5 + Math.sin(i * 0.3) * 0.5,
      activity: Math.floor(Math.random() * 3000) + 7000 + Math.sin(i * 0.2) * 1000,
      mood: Math.floor(Math.random() * 20) + 70 + Math.sin(i * 0.4) * 10,
      heartRate: Math.floor(Math.random() * 10) + 68 + Math.sin(i * 0.1) * 5,
    })
  }

  return data
}

export function HealthTrendsChart() {
  const [timeRange, setTimeRange] = useState<7 | 30>(7)
  const [visibleMetrics, setVisibleMetrics] = useState({
    sleep: true,
    activity: true,
    mood: true,
    heartRate: false,
  })

  const data = generateData(timeRange)

  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {entry.dataKey === "sleep"
                ? `${entry.value.toFixed(1)}h`
                : entry.dataKey === "activity"
                  ? `${entry.value.toLocaleString()} steps`
                  : entry.dataKey === "heartRate"
                    ? `${Math.round(entry.value)} BPM`
                    : `${Math.round(entry.value)}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Correlated Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Track your health metrics over time</p>
          </div>
          <div className="flex space-x-2">
            <Button variant={timeRange === 7 ? "default" : "outline"} size="sm" onClick={() => setTimeRange(7)}>
              7 Days
            </Button>
            <Button variant={timeRange === 30 ? "default" : "outline"} size="sm" onClick={() => setTimeRange(30)}>
              30 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={visibleMetrics.sleep ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric("sleep")}
            className="text-xs"
          >
            Sleep Quality
          </Button>
          <Button
            variant={visibleMetrics.activity ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric("activity")}
            className="text-xs"
          >
            Activity
          </Button>
          <Button
            variant={visibleMetrics.mood ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric("mood")}
            className="text-xs"
          >
            Mood
          </Button>
          <Button
            variant={visibleMetrics.heartRate ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric("heartRate")}
            className="text-xs"
          >
            Heart Rate
          </Button>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {visibleMetrics.sleep && (
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Sleep (hours)"
                />
              )}

              {visibleMetrics.activity && (
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Activity (steps)"
                  yAxisId="activity"
                />
              )}

              {visibleMetrics.mood && (
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Mood (%)"
                />
              )}

              {visibleMetrics.heartRate && (
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Heart Rate (BPM)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
