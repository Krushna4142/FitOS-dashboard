"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, AlertCircle } from "lucide-react"

interface RiskAssessmentCardProps {
  riskScore: number
}

export function RiskAssessmentCard({ riskScore }: RiskAssessmentCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Low", color: "text-chart-2", bgColor: "bg-chart-2", icon: Shield }
    if (score <= 70) return { level: "Moderate", color: "text-chart-3", bgColor: "bg-chart-3", icon: AlertCircle }
    return { level: "High", color: "text-chart-4", bgColor: "bg-chart-4", icon: AlertTriangle }
  }

  const risk = getRiskLevel(riskScore)
  const Icon = risk.icon

  const circumference = 2 * Math.PI * 40
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (riskScore / 100) * circumference

  const riskFactors = [
    { factor: "Cardiovascular Health", risk: 25, description: "Blood pressure and heart rate within normal ranges" },
    { factor: "Sleep Patterns", risk: 45, description: "Irregular sleep schedule detected" },
    { factor: "Physical Activity", risk: 20, description: "Meeting recommended activity levels" },
    { factor: "Stress Levels", risk: 60, description: "Elevated stress indicators this week" },
    { factor: "Nutrition", risk: 15, description: "Balanced diet with good nutrient intake" },
  ]

  const suggestions = [
    "Consider establishing a consistent bedtime routine",
    "Try 10 minutes of meditation before sleep",
    "Reduce caffeine intake after 2 PM",
    "Schedule regular stress-relief activities",
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Icon className={`h-4 w-4 ${risk.color}`} />
          <span>Risk Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showDetails ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted opacity-20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={`${risk.color} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">{riskScore}</span>
                  <span className="text-xs text-muted-foreground">Risk Score</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className={`text-lg font-semibold ${risk.color}`}>{risk.level} Risk</div>
              <p className="text-xs text-muted-foreground mt-1">
                {risk.level === "Low"
                  ? "Great job maintaining healthy habits!"
                  : risk.level === "Moderate"
                    ? "Some areas need attention"
                    : "Several risk factors identified"}
              </p>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => setShowDetails(true)}>
              View Breakdown
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Risk Factors</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="text-xs">
                Back
              </Button>
            </div>

            <div className="space-y-3">
              {riskFactors.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{item.factor}</span>
                    <span
                      className={`text-xs ${item.risk <= 30 ? "text-chart-2" : item.risk <= 60 ? "text-chart-3" : "text-chart-4"}`}
                    >
                      {item.risk}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.risk <= 30 ? "bg-chart-2" : item.risk <= 60 ? "bg-chart-3" : "bg-chart-4"
                      }`}
                      style={{ width: `${item.risk}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold mb-2">Suggestions</h5>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start">
                    <span className="mr-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
