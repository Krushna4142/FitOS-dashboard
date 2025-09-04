import { NextResponse } from "next/server"

const generateUserData = () => {
  return {
    id: "user_123",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    preferences: {
      theme: "dark",
      notifications: true,
      units: "metric",
    },
    goals: {
      dailySteps: 10000,
      sleepHours: 8,
      workoutDays: 5,
      waterIntake: 8,
    },
    streaks: {
      dailyCheckin: Math.floor(Math.random() * 20) + 5,
      exerciseLog: Math.floor(Math.random() * 15) + 3,
      sleepTracking: Math.floor(Math.random() * 25) + 10,
    },
    badges: [
      { id: "early-bird", earned: true, earnedDate: "2024-01-10" },
      { id: "streak-master", earned: true, earnedDate: "2024-01-15" },
      { id: "wellness-warrior", earned: true, earnedDate: "2024-01-20" },
      { id: "step-champion", earned: false },
      { id: "consistency-king", earned: false },
      { id: "energy-booster", earned: false },
    ],
    totalPoints: Math.floor(Math.random() * 2000) + 1500,
    level: Math.floor(Math.random() * 5) + 3,
  }
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json({
    user: generateUserData(),
    success: true,
  })
}

export async function PUT(request: Request) {
  const body = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "User data updated successfully",
    user: {
      ...generateUserData(),
      ...body,
    },
  })
}
