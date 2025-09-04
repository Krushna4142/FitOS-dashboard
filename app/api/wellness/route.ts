import { NextResponse } from "next/server"

const generateChallenges = () => {
  return [
    {
      id: 1,
      title: "30-Day Step Challenge",
      description: "Walk 10,000 steps daily for 30 days",
      duration: "30 days",
      participants: Math.floor(Math.random() * 500) + 1000,
      difficulty: "Beginner",
      reward: "Step Master Badge + 500 points",
      progress: Math.floor(Math.random() * 30),
      category: "fitness",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    {
      id: 2,
      title: "Mindful January",
      description: "Complete 15 minutes of meditation daily",
      duration: "31 days",
      participants: Math.floor(Math.random() * 300) + 700,
      difficulty: "Intermediate",
      reward: "Zen Master Badge + 750 points",
      progress: Math.floor(Math.random() * 31),
      category: "mindfulness",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    {
      id: 3,
      title: "Hydration Hero",
      description: "Drink 8 glasses of water daily",
      duration: "21 days",
      participants: Math.floor(Math.random() * 800) + 1500,
      difficulty: "Beginner",
      reward: "Hydration Hero Badge + 400 points",
      progress: Math.floor(Math.random() * 21),
      category: "nutrition",
      startDate: "2024-01-15",
      endDate: "2024-02-05",
    },
    {
      id: 4,
      title: "Sleep Optimization",
      description: "Get 7-9 hours of sleep for 14 consecutive nights",
      duration: "14 days",
      participants: Math.floor(Math.random() * 200) + 500,
      difficulty: "Advanced",
      reward: "Sleep Champion Badge + 600 points",
      progress: Math.floor(Math.random() * 14),
      category: "sleep",
      startDate: "2024-01-20",
      endDate: "2024-02-03",
    },
  ]
}

const generateMealPlans = () => {
  return [
    {
      id: 1,
      name: "Mediterranean Delight",
      type: "mediterranean",
      calories: 1800,
      meals: [
        {
          type: "breakfast",
          name: "Greek Yogurt with Berries",
          calories: 320,
          ingredients: ["Greek yogurt", "Mixed berries", "Honey", "Granola"],
        },
        {
          type: "lunch",
          name: "Quinoa Tabbouleh",
          calories: 450,
          ingredients: ["Quinoa", "Tomatoes", "Cucumber", "Parsley", "Lemon"],
        },
        {
          type: "dinner",
          name: "Grilled Salmon with Vegetables",
          calories: 520,
          ingredients: ["Salmon fillet", "Zucchini", "Bell peppers", "Olive oil"],
        },
        {
          type: "snack",
          name: "Hummus with Vegetables",
          calories: 180,
          ingredients: ["Hummus", "Carrots", "Celery", "Bell peppers"],
        },
      ],
    },
    {
      id: 2,
      name: "Plant-Based Power",
      type: "vegan",
      calories: 1650,
      meals: [
        {
          type: "breakfast",
          name: "Overnight Oats with Chia",
          calories: 380,
          ingredients: ["Oats", "Chia seeds", "Almond milk", "Banana", "Maple syrup"],
        },
        {
          type: "lunch",
          name: "Buddha Bowl",
          calories: 420,
          ingredients: ["Brown rice", "Chickpeas", "Avocado", "Kale", "Tahini"],
        },
        {
          type: "dinner",
          name: "Lentil Curry",
          calories: 480,
          ingredients: ["Red lentils", "Coconut milk", "Spinach", "Spices"],
        },
        {
          type: "snack",
          name: "Mixed Nuts and Fruit",
          calories: 220,
          ingredients: ["Almonds", "Walnuts", "Apple", "Dates"],
        },
      ],
    },
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  await new Promise((resolve) => setTimeout(resolve, 250))

  if (type === "challenges") {
    return NextResponse.json({
      challenges: generateChallenges(),
      success: true,
    })
  }

  if (type === "meals") {
    return NextResponse.json({
      mealPlans: generateMealPlans(),
      success: true,
    })
  }

  return NextResponse.json({
    challenges: generateChallenges(),
    mealPlans: generateMealPlans(),
    success: true,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 700))

  return NextResponse.json({
    success: true,
    message: "Activity logged successfully",
    data: {
      id: Date.now(),
      ...body,
      timestamp: new Date().toISOString(),
    },
  })
}
