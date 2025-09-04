"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, RefreshCw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHealthData } from "@/hooks/use-health-data"
import { HealthInputModal, type HealthInputData } from "@/components/health-input-modal"

interface HealthScoreCardProps {
  score?: number
  trend?: number
}

export function HealthScoreCard({ score: initialScore, trend: initialTrend }: HealthScoreCardProps) {
  const { data, loading, refresh } = useHealthData()
  const [displayScore, setDisplayScore] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInputModal, setShowInputModal] = useState(false)
  const [currentHealthData, setCurrentHealthData] = useState<HealthInputData | null>(null)

  const calculateHealthScore = (healthData: HealthInputData) => {
    let score = 100

    // Sleep penalty
    if (healthData.sleepHours < 7) score -= 15

    // Heart rate penalty
    if (healthData.heartRate > 100 && healthData.heartRate <= 120) score -= 10
    if (healthData.heartRate > 120) score -= 20

    // Stress penalty
    if (healthData.stressLevel >= 4) score -= 15

    // Mood penalty
    if (healthData.mood <= 2) score -= 10

    // Problems penalty
    score -= healthData.problems.length * 5

    return Math.max(0, Math.min(100, score))
  }

  // Use API data if available, fallback to props
  const score = currentHealthData
    ? calculateHealthScore(currentHealthData)
    : (data?.current?.healthScore ?? initialScore ?? 85)
  const trend = data?.current?.trend ?? initialTrend ?? 2

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  const handleHealthUpdate = (healthData: HealthInputData) => {
    setCurrentHealthData(healthData)
    // Store in localStorage for persistence
    localStorage.setItem("fitos-health-data", JSON.stringify(healthData))
  }

  // Load saved health data on mount
  useEffect(() => {
    const saved = localStorage.getItem("fitos-health-data")
    if (saved) {
      setCurrentHealthData(JSON.parse(saved))
    }
  }, [])

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  const factors = currentHealthData
    ? [
        { name: "Sleep Quality", value: currentHealthData.sleepHours >= 7 ? 85 : 60, color: "text-chart-2" },
        {
          name: "Heart Rate",
          value: currentHealthData.heartRate <= 100 ? 90 : currentHealthData.heartRate <= 120 ? 70 : 40,
          color: "text-chart-1",
        },
        { name: "Mood", value: currentHealthData.mood * 20, color: "text-chart-3" },
        { name: "Stress Level", value: Math.max(0, 100 - currentHealthData.stressLevel * 20), color: "text-chart-4" },
      ]
    : [
        { name: "Sleep Quality", value: 85, color: "text-chart-2" },
        { name: "Physical Activity", value: 78, color: "text-chart-1" },
        { name: "Nutrition", value: 92, color: "text-chart-3" },
        { name: "Stress Level", value: 65, color: "text-chart-4" },
      ]

  return (
    <>
      <Card
        className="col-span-1 cursor-pointer transition-all hover:shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInputModal(true)
                }}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refresh()
                }}
                disabled={loading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isExpanded ? (
            <div className="flex items-center justify-between">
              <div className="relative">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted opacity-20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(displayScore)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center text-sm ${trend >= 0 ? "text-chart-2" : "text-chart-4"}`}>
                  {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {Math.abs(trend)}%
                </div>
                <p className="text-xs text-muted-foreground">from yesterday</p>
                {loading && <p className="text-xs text-muted-foreground">Updating...</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(displayScore)}</div>
                <p className="text-sm text-muted-foreground">Overall Health Score</p>
              </div>
              <div className="space-y-3">
                {factors.map((factor) => (
                  <div key={factor.name} className="flex items-center justify-between">
                    <span className="text-sm">{factor.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-current transition-all duration-500 ${factor.color}`}
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{factor.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInputModal(true)
                }}
              >
                Update Health Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <HealthInputModal open={showInputModal} onOpenChange={setShowInputModal} onHealthUpdate={handleHealthUpdate} />
    </>
  )
}
