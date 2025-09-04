"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Trophy, Star } from "lucide-react"

interface SuccessAnimationProps {
  show: boolean
  type: "health-update" | "badge-earned" | "goal-achieved"
  message: string
  onComplete?: () => void
}

const successVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.6,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: 180,
    transition: { duration: 0.3 },
  },
}

const iconMap = {
  "health-update": CheckCircle,
  "badge-earned": Trophy,
  "goal-achieved": Star,
}

const colorMap = {
  "health-update": "text-chart-2",
  "badge-earned": "text-chart-3",
  "goal-achieved": "text-chart-1",
}

export function SuccessAnimation({ show, type, message, onComplete }: SuccessAnimationProps) {
  const Icon = iconMap[type]
  const colorClass = colorMap[type]

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center space-y-4"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={`mx-auto w-16 h-16 ${colorClass}`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 0.5, repeat: 1 },
                rotate: { duration: 1, ease: "easeInOut" },
              }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.h2>
            <motion.div
              className="flex justify-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
