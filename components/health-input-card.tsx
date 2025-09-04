"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Heart, Brain, Activity, MessageSquare } from "lucide-react"

interface HealthInputs {
  heartRate: number
  heartRateStatus: "normal" | "high" | "low"
  mood: number
  feeling: "good" | "tired" | "unwell"
  symptoms: string
  timestamp: Date
}

interface HealthAdvice {
  title: string
  message: string
  icon: React.ComponentType<any>
  color: string
}

export function HealthInputCard() {
  const [inputs, setInputs] = useState<HealthInputs>({
    heartRate: 75,
    heartRateStatus: "normal",
    mood: 3,
    feeling: "good",
    symptoms: "",
    timestamp: new Date(),
  })
  const [healthScore, setHealthScore] = useState(85)
  const [advice, setAdvice] = useState<HealthAdvice[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem(`healthInputs_${user?.username || "demo"}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setInputs({ ...parsed, timestamp: new Date(parsed.timestamp) })
    }
  }, [user])

  const getHeartRateStatus = (hr: number): "normal" | "high" | "low" => {
    if (hr < 60) return "low"
    if (hr > 100) return "high"
    return "normal"
  }

  const calculateHealthScore = (inputs: HealthInputs): number => {
    let score = 85 // Base score

    // Heart rate impact
    if (inputs.heartRateStatus === "high") score -= 15
    if (inputs.heartRateStatus === "low") score -= 10

    // Mood impact
    if (inputs.mood <= 2) score -= 20
    if (inputs.mood >= 4) score += 10

    // Feeling impact
    if (inputs.feeling === "unwell") score -= 25
    if (inputs.feeling === "tired") score -= 15
    if (inputs.feeling === "good") score += 5

    // Symptoms impact
    if (inputs.symptoms.length > 0) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  const generateAdvice = (inputs: HealthInputs): HealthAdvice[] => {
    const advice: HealthAdvice[] = []

    if (inputs.heartRateStatus === "high") {
      advice.push({
        title: "Heart Rate Alert",
        message: "Your heart rate is elevated. Try 10 minutes of deep breathing exercises or a short walk to help lower it.",
        icon: Heart,
        color: "text-red-500",
      })
    }

    if (inputs.heartRateStatus === "low") {
      advice.push({
        title: "Low Heart Rate",
        message: "Your heart rate is below normal. Consider light physical activity to get your circulation going.",
        icon: Heart,
        color: "text-blue-500",
      })
    }

    if (inputs.mood <= 2) {
      advice.push({
        title: "Mood Support",
        message: "Your mood seems low today. Take a short walk, listen to music, or connect with a friend to lift your spirits.",
        icon: Brain,
        color: "text-purple-500",
      })
    }

    if (inputs.feeling === "tired") {
      advice.push({
        title: "Energy Boost",
        message: "Feeling tired? Ensure you're getting 7-9 hours of sleep and consider a 20-minute power nap if needed.",
        icon: Activity,
        color: "text-orange-500",
      })
    }

    if (inputs.feeling === "unwell") {
      advice.push({
        title: "Wellness Check",
        message: "Not feeling well? Stay hydrated, rest, and consider consulting a healthcare provider if symptoms persist.",
        icon: Activity,
        color: "text-red-500",
      })
    }

    if (inputs.symptoms.length > 0) {
      advice.push({
        title: "Symptom Tracking",
        message: "Keep monitoring your symptoms and note any patterns. Consider discussing them with your healthcare provider.",
        icon: MessageSquare,
        color: "text-yellow-500",
      })
    }

    if (advice.length === 0) {
      advice.push({
        title: "Great Health Status!",
        message: "Your vitals look good! Keep maintaining your healthy lifestyle with regular exercise and balanced nutrition.",
        icon: Heart,
        color: "text-green-500",
      })
    }

    return advice
  }

  const handleInputChange = (field: keyof HealthInputs, value: any) => {
    const newInputs = { ...inputs, [field]: value, timestamp: new Date() }
    
    if (field === "heartRate") {
      newInputs.heartRateStatus = getHeartRateStatus(value)
    }

    setInputs(newInputs)
    
    const newScore = calculateHealthScore(newInputs)
    setHealthScore(newScore)
    
    const newAdvice = generateAdvice(newInputs)
    setAdvice(newAdvice)

    // Save to localStorage
    localStorage.setItem(`healthInputs_${user?.username || "demo"}`, JSON.stringify(newInputs))
  }

  const handleSubmit = () => {
    toast({
      title: "Health Data Updated! 📊",
      description: `Your health score is ${healthScore}. Check your personalized advice below.`,
    })
  }

  const moodEmojis = ["😢", "😔", "😐", "😊", "😄"]
  const feelingOptions = [
    { value: "good", label: "Good", emoji: "😊" },
    { value: "tired", label: "Tired", emoji: "😴" },
    { value: "unwell", label: "Unwell", emoji: "🤒" },
  ]

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Health Check-In</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your vitals and get personalized health insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Today's Vitals</h3>
            
            {/* Heart Rate */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Heart Rate (BPM)</span>
              </Label>
              <Input
                type="number"
                min="40"
                max="200"
                value={inputs.heartRate}
                onChange={(e) => handleInputChange("heartRate", Number(e.target.value))}
                className="w-full"
              />
              <div className="flex space-x-2">
                {["low", "normal", "high"].map((status) => (
                  <div
                    key={status}
                    className={`px-2 py-1 rounded text-xs ${
                      inputs.heartRateStatus === status
                        ? status === "normal"
                          ? "bg-green-100 text-green-800"
                          : status === "high"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Mood ({inputs.mood}/5)</span>
              </Label>
              <Slider
                value={[inputs.mood]}
                onValueChange={(value) => handleInputChange("mood", value[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-2xl">
                {moodEmojis.map((emoji, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer transition-all ${
                      inputs.mood === index + 1 ? "scale-125" : "opacity-50"
                    }`}
                    onClick={() => handleInputChange("mood", index + 1)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Feeling */}
            <div className="space-y-2">
              <Label>How are you feeling?</Label>
              <div className="grid grid-cols-3 gap-2">
                {feelingOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={inputs.feeling === option.value ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col space-y-1"
                    onClick={() => handleInputChange("feeling", option.value)}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label>Any symptoms? (Optional)</Label>
              <Textarea
                placeholder="Describe any symptoms you're experiencing..."
                value={inputs.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Update Health Score
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Your Health Score</h3>
            
            {/* Health Score Display */}
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-chart-1/10 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{healthScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-chart-1 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Personalized Advice */}
            <div className="space-y-3">
              <h4 className="font-medium">Personalized Advice</h4>
              {advice.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 ${item.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <h5 className="font-medium text-sm">{item.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{item.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                ⚠️ This is not medical advice. Consult healthcare professionals for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
