import { NextResponse } from "next/server"

const generateInsights = () => {
  const insights = [
    {
      type: "sleep",
      title: "Sleep Pattern Analysis",
      message: "Your sleep quality has improved by 12% this week. Your consistent bedtime routine is working well.",
      priority: "positive",
      actionable: true,
      suggestion: "Continue your current bedtime routine and consider reducing screen time 30 minutes before sleep.",
    },
    {
      type: "activity",
      title: "Activity Trend",
      message: "You're averaging 8,200 steps daily. Just 1,800 more steps would help you reach your goal consistently.",
      priority: "neutral",
      actionable: true,
      suggestion: "Try taking a 15-minute walk after lunch to boost your daily step count.",
    },
    {
      type: "heart_rate",
      title: "Cardiovascular Health",
      message:
        "Your resting heart rate has decreased by 3 BPM over the past month - excellent cardiovascular improvement!",
      priority: "positive",
      actionable: false,
      suggestion: "Keep up your current exercise routine to maintain this positive trend.",
    },
    {
      type: "stress",
      title: "Stress Management",
      message:
        "Elevated stress indicators detected this week. Your heart rate variability suggests you need more recovery time.",
      priority: "warning",
      actionable: true,
      suggestion: "Try 10 minutes of deep breathing exercises or meditation before bed.",
    },
    {
      type: "nutrition",
      title: "Nutrition Balance",
      message: "Your meal logging shows consistent protein intake but could benefit from more vegetables.",
      priority: "neutral",
      actionable: true,
      suggestion: "Add a serving of leafy greens to your lunch and dinner for better nutrient balance.",
    },
  ]

  // Return 2-3 random insights
  const shuffled = insights.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2)
}

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

const generateRiskAssessment = () => {
  const factors = [
    { factor: "Cardiovascular Health", risk: Math.floor(Math.random() * 30) + 15 },
    { factor: "Sleep Patterns", risk: Math.floor(Math.random() * 40) + 30 },
    { factor: "Physical Activity", risk: Math.floor(Math.random() * 25) + 10 },
    { factor: "Stress Levels", risk: Math.floor(Math.random() * 50) + 40 },
    { factor: "Nutrition", risk: Math.floor(Math.random() * 20) + 10 },
  ]

  const overallRisk = Math.floor(factors.reduce((acc, f) => acc + f.risk, 0) / factors.length)

  return {
    overallRisk,
    factors,
    recommendations: [
      "Establish a consistent sleep schedule",
      "Incorporate 30 minutes of daily exercise",
      "Practice stress-reduction techniques",
      "Maintain a balanced diet with regular meals",
    ],
  }
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 300))

  return NextResponse.json({
    insights: generateInsights(),
    predictiveData: generatePredictiveData(),
    riskAssessment: generateRiskAssessment(),
    success: true,
  })
}
