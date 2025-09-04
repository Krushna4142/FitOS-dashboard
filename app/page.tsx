"use client"

import { Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { HealthScoreCard } from "@/components/health-score-card"
import { HealthIndicatorsCard } from "@/components/health-indicators-card"
import { HealthTrendsChart } from "@/components/health-trends-chart"
import { PredictiveAnalyticsCard } from "@/components/predictive-analytics-card"
import { RiskAssessmentCard } from "@/components/risk-assessment-card"
import { DailyHealthBrief } from "@/components/daily-health-brief"
import { WellnessHubCard } from "@/components/wellness-hub-card"
import { GamificationCard } from "@/components/gamification-card"
import { QuickAddButtons } from "@/components/quick-add-buttons"
import { AppointmentsChallengesCard } from "@/components/appointments-challenges-card"
import { AiChatModal } from "@/components/ai-chat-modal"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { AuthModal } from "@/components/auth-modal"
import { NutritionLoggerCard } from "@/components/nutrition-logger-card"
import { HealthInputCard } from "@/components/health-input-card"
import { QuickLogCard } from "@/components/quick-log-card"
import { useAuth } from "@/components/auth-provider"
import { UserProfileCard } from "@/components/user-profile-card"
import { DashboardFooter } from "@/components/dashboard-footer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
}

const welcomeVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      duration: 0.8,
    },
  },
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthModal(true)
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardSkeleton />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <motion.div
          className="min-h-screen bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              FitOS
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Your AI-powered health companion
            </motion.p>
          </motion.div>
        </motion.div>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      </>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader />

      <main className="container mx-auto px-4 py-4 flex-1">
        <div className="flex justify-between items-start mb-4">
          <motion.div variants={welcomeVariants} initial="hidden" animate="visible">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, {user.username}!</h1>
            <p className="text-muted-foreground text-pretty">Here's your health overview for today.</p>
          </motion.div>
          <UserProfileCard />
        </div>

        <ErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {/* Row 1: Health Score | Key Indicators | Trends | Predictive Analytics */}
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={cardVariants}>
                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <HealthScoreCard score={85} trend={2} />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <HealthIndicatorsCard />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <HealthTrendsChart />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <PredictiveAnalyticsCard />
                  </motion.div>
                </ErrorBoundary>
              </motion.div>

              {/* Row 2: Risk Assessment | Daily Health Brief | Food & Nutrition | Wellness Hub */}
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={cardVariants}>
                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <RiskAssessmentCard riskScore={45} />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <DailyHealthBrief />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <NutritionLoggerCard />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <WellnessHubCard />
                  </motion.div>
                </ErrorBoundary>
              </motion.div>

              {/* Row 3: Progress & Streaks | Badges | Quick Add */}
              <motion.div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" variants={cardVariants}>
                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <GamificationCard />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <GamificationCard />
                  </motion.div>
                </ErrorBoundary>

                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <QuickLogCard />
                  </motion.div>
                </ErrorBoundary>
              </motion.div>

              {/* Row 4: Health Input Card (Full Width) */}
              <motion.div className="w-full" variants={cardVariants}>
                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
                    <HealthInputCard />
                  </motion.div>
                </ErrorBoundary>
              </motion.div>

              {/* Row 5: Featured Challenges & Upcoming Appointments (Horizontal Layout) */}
              <motion.div className="w-full" variants={cardVariants}>
                <ErrorBoundary>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}>
                    <AppointmentsChallengesCard />
                  </motion.div>
                </ErrorBoundary>
              </motion.div>
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>

      <DashboardFooter />

      <AiChatModal />
      <Toaster />
    </motion.div>
  )
}
