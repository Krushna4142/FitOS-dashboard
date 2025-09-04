"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Brain } from "lucide-react"

const generatePredictiveData = () => {
  const data = []
  const today = new Date()

  // Historical data (last 7 days)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actual: Math.floor(Math.random() * 15) + 75 + Math.sin(i * 0.3) * 5,
      type: "historical",
    })
  }

  // Predicted data (next 7 days)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const predicted = Math.floor(Math.random() * 10) + 80 + Math.sin(i * 0.2) * 3
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      predicted: predicted,
      upperBound: predicted + 8,
      lowerBound: predicted - 8,
      type: "predicted",
    })
  }

  return data
}

export function PredictiveAnalyticsCard() {
  const data = generatePredictiveData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === "actual"
                ? "Actual"
                : entry.dataKey === "predicted"
                  ? "Predicted"
                  : entry.dataKey === "upperBound"
                    ? "Upper Bound"
                    : "Lower Bound"}
              : {Math.round(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>Predictive Analytics</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">AI-powered health score forecast for the next 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Confidence interval area */}
              <Area type="monotone" dataKey="upperBound" stackId="1" stroke="none" fill="url(#confidenceGradient)" />
              <Area type="monotone" dataKey="lowerBound" stackId="1" stroke="none" fill="url(#confidenceGradient)" />

              {/* Historical actual line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                connectNulls={false}
              />

              {/* Predicted line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
            <span>Historical Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>AI Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
            <span>Confidence Interval</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
