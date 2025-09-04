import { NextResponse } from "next/server"

// Mock health data that simulates real-time updates
const generateHealthData = () => {
  const now = new Date()
  const variation = Math.sin(now.getMinutes() / 10) * 5 // Creates subtle real-time variation

  return {
    healthScore: Math.floor(82 + variation + Math.random() * 6),
    trend: Math.floor((Math.random() - 0.5) * 10),
    heartRate: Math.floor(68 + variation + Math.random() * 8),
    heartRateStatus: "normal",
    sleepHours: 7.2 + (Math.random() - 0.5) * 1.5,
    sleepQuality: "good",
    steps: Math.floor(7800 + variation * 200 + Math.random() * 1000),
    stepGoal: 10000,
    lastUpdated: now.toISOString(),
  }
}

const generateHealthHistory = () => {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      healthScore: Math.floor(75 + Math.random() * 20 + Math.sin(i * 0.1) * 10),
      heartRate: Math.floor(65 + Math.random() * 15 + Math.sin(i * 0.2) * 5),
      sleepHours: 6.5 + Math.random() * 2.5 + Math.sin(i * 0.15) * 0.5,
      steps: Math.floor(6000 + Math.random() * 5000 + Math.sin(i * 0.3) * 2000),
      mood: Math.floor(60 + Math.random() * 30 + Math.sin(i * 0.25) * 15),
    })
  }

  return data
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

  const currentData = generateHealthData()
  const historyData = generateHealthHistory()

  return NextResponse.json({
    current: currentData,
    history: historyData,
    success: true,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock response for logging health data
  return NextResponse.json({
    success: true,
    message: "Health data logged successfully",
    data: {
      id: Date.now(),
      ...body,
      timestamp: new Date().toISOString(),
    },
  })
}
