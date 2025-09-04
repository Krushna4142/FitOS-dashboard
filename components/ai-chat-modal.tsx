"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send, Bot, User, AlertTriangle, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface HealthContext {
  healthScore: number
  recentMeals: number
  sleepHours: number
  stressLevel: number
  mood: number
  heartRate: number
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
}

const floatingButtonVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 1,
    },
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
}

const quickQuestionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.02,
    backgroundColor: "rgba(var(--primary), 0.05)",
    transition: { duration: 0.2 },
  },
}

export function AiChatModal() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [healthContext, setHealthContext] = useState<HealthContext | null>(null)

  useEffect(() => {
    const healthData = localStorage.getItem("fitos-health-data")
    const foodLog = localStorage.getItem("fitos-food-log")

    if (healthData) {
      const parsed = JSON.parse(healthData)
      const foodParsed = foodLog ? JSON.parse(foodLog) : []

      setHealthContext({
        healthScore: 85,
        recentMeals: foodParsed.length,
        sleepHours: parsed.sleepHours || 7.5,
        stressLevel: parsed.stressLevel || 3,
        mood: parsed.mood || 3,
        heartRate: parsed.heartRate || 75,
      })
    }

    const welcomeMessage: Message = {
      id: "welcome",
      content: getPersonalizedWelcome(),
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  const getPersonalizedWelcome = (): string => {
    if (!healthContext) {
      return "Hello! I'm your FitOS AI assistant. I can help you understand your health data and provide personalized recommendations. What would you like to know?"
    }

    const { healthScore, sleepHours, stressLevel, recentMeals } = healthContext

    let welcome = `Hello! I've analyzed your recent health data. `

    if (healthScore >= 80) {
      welcome += `Your health score of ${healthScore} is excellent! `
    } else if (healthScore >= 60) {
      welcome += `Your health score of ${healthScore} is good, but there's room for improvement. `
    } else {
      welcome += `Your health score of ${healthScore} suggests we should focus on some key areas. `
    }

    if (sleepHours < 7) {
      welcome += `I notice you're getting ${sleepHours} hours of sleep - let's work on improving that. `
    }

    if (stressLevel >= 4) {
      welcome += `Your stress levels seem elevated. I can help with relaxation techniques. `
    }

    if (recentMeals === 0) {
      welcome += `You haven't logged any meals today - nutrition tracking can really help optimize your health! `
    }

    welcome += `What would you like to focus on today?`

    return welcome
  }

  const generateContextAwareResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (!healthContext) {
      return generateBasicResponse(message)
    }

    const { healthScore, sleepHours, stressLevel, mood, heartRate, recentMeals } = healthContext

    if (message.includes("sleep") || message.includes("tired") || message.includes("rest")) {
      if (sleepHours < 7) {
        return `Based on your logged ${sleepHours} hours of sleep, you're below the recommended 7-9 hours. This could be impacting your health score of ${healthScore}. Try setting a consistent bedtime routine and avoiding screens 1 hour before sleep. Your elevated heart rate of ${heartRate} BPM might also be related to insufficient rest.`
      } else {
        return `Great job on getting ${sleepHours} hours of sleep! This is contributing positively to your health score of ${healthScore}. To maintain this, keep your sleep schedule consistent even on weekends.`
      }
    }

    if (message.includes("exercise") || message.includes("workout") || message.includes("activity")) {
      if (healthScore < 70) {
        return `Your current health score of ${healthScore} suggests increasing physical activity could help. Start with 20-30 minutes of moderate exercise daily. Given your stress level of ${stressLevel}/5, try activities like yoga or walking which can reduce both stress and improve fitness.`
      } else {
        return `Your health score of ${healthScore} shows you're doing well! To maintain this, aim for 150 minutes of moderate exercise weekly. Mix cardio with strength training for optimal results.`
      }
    }

    if (
      message.includes("food") ||
      message.includes("nutrition") ||
      message.includes("diet") ||
      message.includes("eat")
    ) {
      if (recentMeals === 0) {
        return `I notice you haven't logged any meals today. Consistent nutrition tracking helps optimize your health score (currently ${healthScore}). Start by logging your next meal - I can help analyze the nutritional content!`
      } else {
        return `You've logged ${recentMeals} meals recently - great job tracking! Based on your health score of ${healthScore}, focus on balanced meals with lean protein, complex carbs, and healthy fats. Your current stress level of ${stressLevel}/5 might benefit from foods rich in omega-3s and magnesium.`
      }
    }

    if (message.includes("stress") || message.includes("anxiety") || message.includes("worried")) {
      if (stressLevel >= 4) {
        return `Your stress level of ${stressLevel}/5 is quite high and may be affecting your health score of ${healthScore}. Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Your heart rate of ${heartRate} BPM suggests your body is responding to stress. Practice this 3 times daily.`
      } else {
        return `Your stress level of ${stressLevel}/5 is manageable! To keep it low, maintain your current sleep schedule of ${sleepHours} hours and continue regular exercise. Meditation apps can help maintain this balance.`
      }
    }

    if (message.includes("mood") || message.includes("feeling") || message.includes("emotion")) {
      if (mood <= 2) {
        return `I see your mood has been low (${mood}/5). This can impact your overall health score of ${healthScore}. Regular exercise, adequate sleep (you're getting ${sleepHours} hours), and social connections help. Consider tracking what activities boost your mood most.`
      } else {
        return `Your mood of ${mood}/5 is positive! This contributes to your health score of ${healthScore}. Keep doing what's working - whether it's your ${sleepHours} hours of sleep or stress management techniques.`
      }
    }

    if (message.includes("heart") || message.includes("bpm") || message.includes("pulse")) {
      if (heartRate > 100) {
        return `Your heart rate of ${heartRate} BPM is elevated. This correlates with your stress level of ${stressLevel}/5 and may be impacting your health score of ${healthScore}. Focus on relaxation techniques and ensure you're getting adequate sleep (currently ${sleepHours} hours).`
      } else {
        return `Your heart rate of ${heartRate} BPM is within normal range and contributing positively to your health score of ${healthScore}. Keep up your current lifestyle habits!`
      }
    }

    return generateBasicResponse(message)
  }

  const generateBasicResponse = (message: string): string => {
    const predefinedResponses = {
      sleep:
        "For optimal recovery, try maintaining a consistent bedtime and avoiding screens 1 hour before sleep. Aim for 7-9 hours nightly.",
      exercise:
        "Regular physical activity is key to health. Start with 20-30 minutes of moderate exercise daily and gradually increase intensity.",
      nutrition:
        "Focus on balanced meals with lean protein, complex carbohydrates, and healthy fats. Stay hydrated and eat regular meals.",
      stress:
        "Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Practice mindfulness and regular exercise to manage stress.",
      mood: "Regular exercise, adequate sleep, and social connections are key mood boosters. Consider tracking what activities make you feel best.",
      default:
        "I'm here to help with your health questions! I can provide insights about sleep, exercise, nutrition, stress management, and more based on your tracked data.",
    }

    if (message.includes("sleep")) return predefinedResponses.sleep
    if (message.includes("exercise") || message.includes("workout")) return predefinedResponses.exercise
    if (message.includes("food") || message.includes("nutrition")) return predefinedResponses.nutrition
    if (message.includes("stress") || message.includes("anxiety")) return predefinedResponses.stress
    if (message.includes("mood") || message.includes("feeling")) return predefinedResponses.mood

    return predefinedResponses.default
  }

  const quickQuestions = [
    "How can I improve my sleep?",
    "What about my exercise routine?",
    "Any nutrition tips?",
    "Help with stress management",
    "Analyze my health score",
    "What should I focus on today?",
  ]

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateContextAwareResponse(content),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        variants={floatingButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-chart-1 border-0"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] w-[95vw] sm:w-full flex flex-col p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Bot className="h-5 w-5 text-primary" />
                </motion.div>
                <span>FitOS AI Assistant</span>
                <Sparkles className="h-4 w-4 text-chart-1" />
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 p-6 min-h-0 flex flex-col">
              <ScrollArea className="flex-1 min-h-0 pr-4">
                <div className="space-y-4 pb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`flex items-start space-x-2 ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender === "ai" && (
                          <motion.div
                            className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-chart-1/10 flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Bot className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                        <motion.div
                          className={`max-w-[80%] p-3 rounded-lg break-words ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-primary to-chart-1 text-primary-foreground"
                              : "bg-muted"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </motion.div>
                        {message.sender === "user" && (
                          <motion.div
                            className="p-2 rounded-full bg-primary/10 flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <User className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-start space-x-2"
                      >
                        <div className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-chart-1/10 flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-muted-foreground rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <AnimatePresence>
                {messages.length === 1 && (
                  <motion.div
                    className="space-y-2 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xs text-muted-foreground">Quick questions:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {quickQuestions.map((question, index) => (
                        <motion.div
                          key={index}
                          variants={quickQuestionVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-2 px-3 bg-transparent w-full text-left justify-start"
                            onClick={() => handleQuickQuestion(question)}
                          >
                            {question}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 flex-shrink-0">
                <motion.div
                  className="flex space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    placeholder="Ask about your health data..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                    className="flex-1"
                  />
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-primary to-chart-1 flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-2 p-2 bg-muted/50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This AI assistant provides general wellness information and is not a substitute for professional
                    medical advice.
                  </p>
                </motion.div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  )
}
