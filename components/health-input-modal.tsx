"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Heart, Moon, Activity, Brain, AlertTriangle } from "lucide-react"

interface HealthInputModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onHealthUpdate: (data: HealthInputData) => void
}

export interface HealthInputData {
  mood: number
  heartRate: number
  sleepHours: number
  stressLevel: number
  problems: string[]
}

const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"]
const heartRateRanges = {
  normal: { min: 60, max: 100, color: "text-green-500", label: "Normal" },
  elevated: { min: 101, max: 120, color: "text-yellow-500", label: "Elevated" },
  high: { min: 121, max: 200, color: "text-red-500", label: "High" },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
}

const emojiVariants = {
  inactive: { scale: 1, rotate: 0 },
  active: {
    scale: 1.2,
    rotate: [0, -10, 10, 0],
    transition: {
      scale: { type: "spring", stiffness: 300, damping: 20 },
      rotate: { duration: 0.3 },
    },
  },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
}

export function HealthInputModal({ open, onOpenChange, onHealthUpdate }: HealthInputModalProps) {
  const [mood, setMood] = useState([3])
  const [heartRate, setHeartRate] = useState(75)
  const [sleepHours, setSleepHours] = useState(7.5)
  const [stressLevel, setStressLevel] = useState([2])
  const [problems, setProblems] = useState("")
  const { toast } = useToast()

  const getHeartRateStatus = (hr: number) => {
    if (hr <= 100) return heartRateRanges.normal
    if (hr <= 120) return heartRateRanges.elevated
    return heartRateRanges.high
  }

  const calculateHealthScore = () => {
    let score = 100

    // Sleep penalty
    if (sleepHours < 7) score -= 15

    // Heart rate penalty
    const hrStatus = getHeartRateStatus(heartRate)
    if (hrStatus === heartRateRanges.elevated) score -= 10
    if (hrStatus === heartRateRanges.high) score -= 20

    // Stress penalty
    if (stressLevel[0] >= 4) score -= 15

    // Mood penalty
    if (mood[0] <= 2) score -= 10

    // Problems penalty
    const problemList = problems.split(",").filter((p) => p.trim())
    score -= problemList.length * 5

    return Math.max(0, Math.min(100, score))
  }

  const handleSubmit = () => {
    const healthData: HealthInputData = {
      mood: mood[0],
      heartRate,
      sleepHours,
      stressLevel: stressLevel[0],
      problems: problems
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    }

    onHealthUpdate(healthData)

    toast({
      title: "Health data updated!",
      description: `Your health score is now ${calculateHealthScore()}`,
    })

    onOpenChange(false)
  }

  const hrStatus = getHeartRateStatus(heartRate)

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Daily Health Check-in</DialogTitle>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Inputs */}
                <div className="space-y-6">
                  {/* Mood Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Mood Today
                    </Label>
                    <div className="flex items-center justify-between text-2xl">
                      {moodEmojis.map((emoji, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          className={`p-2 rounded-lg transition-all ${
                            mood[0] === index + 1 ? "bg-primary/20" : "hover:bg-muted"
                          }`}
                          onClick={() => setMood([index + 1])}
                          variants={emojiVariants}
                          animate={mood[0] === index + 1 ? "active" : "inactive"}
                          whileHover="hover"
                          whileTap={{ scale: 0.95 }}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                    <Slider value={mood} onValueChange={setMood} max={5} min={1} step={1} className="w-full" />
                  </motion.div>

                  {/* Heart Rate Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Heart Rate (BPM)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={heartRate}
                        onChange={(e) => setHeartRate(Number(e.target.value))}
                        min={40}
                        max={200}
                        className="w-24"
                      />
                      <motion.span
                        className={`text-sm font-medium ${hrStatus.color}`}
                        key={hrStatus.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {hrStatus.label}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Sleep Hours Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Sleep Hours
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(Number(e.target.value))}
                        min={0}
                        max={24}
                        step={0.5}
                        className="w-24"
                      />
                      <motion.span
                        className="text-sm text-muted-foreground"
                        key={sleepHours < 7 ? "below" : "good"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {sleepHours < 7 ? "Below recommended" : "Good"}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Stress Level */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Stress Level
                    </Label>
                    <Slider
                      value={stressLevel}
                      onValueChange={setStressLevel}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Low</span>
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                      <span>Very High</span>
                    </div>
                  </motion.div>

                  {/* Problems Input */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Any Health Concerns?
                    </Label>
                    <Textarea
                      value={problems}
                      onChange={(e) => setProblems(e.target.value)}
                      placeholder="Separate multiple concerns with commas (e.g., headache, fatigue, back pain)"
                      className="min-h-[80px]"
                    />
                  </motion.div>
                </div>

                {/* Right Column - Tips & Preview */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Health Tips</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          <strong>Heart Rate:</strong> Normal resting: 60-100 bpm
                        </p>
                        <p>
                          <strong>Sleep:</strong> 7-9 hours recommended for adults
                        </p>
                        <p>
                          <strong>Stress:</strong> Try deep breathing exercises
                        </p>
                        <p>
                          <strong>Blood Pressure:</strong> Normal: 120/80 mmHg
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Predicted Health Score</h3>
                      <div className="text-center">
                        <motion.div
                          className="text-3xl font-bold text-primary"
                          key={calculateHealthScore()}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {calculateHealthScore()}
                        </motion.div>
                        <p className="text-sm text-muted-foreground">Based on your current inputs</p>
                      </div>
                    </CardContent>
                  </Card>

                  <AnimatePresence>
                    {sleepHours < 7 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-yellow-500/50">
                          <CardContent className="p-4">
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              💡 Consider getting more sleep for better health scores
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                className="flex gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleSubmit} className="w-full">
                    Update Health Score
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
