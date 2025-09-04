"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, User, Activity, Bell, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
}

const logoVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.3 },
  },
}

const notificationVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const [notifications] = useState(3)
  const { user, logout } = useAuth()

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <motion.div className="flex items-center space-x-2" variants={itemVariants}>
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-chart-1"
            variants={logoVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <Activity className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <motion.span
            className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            FitOS
          </motion.span>
        </motion.div>

        {/* Right side controls */}
        <motion.div className="flex items-center space-x-4" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              {notifications > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {notifications}
                  </Badge>
                </motion.div>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </motion.div>

          {/* Theme toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <motion.div
                className="flex items-center justify-start gap-2 p-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.username || "User"}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email || "user@fitos.com"}</p>
                </div>
              </motion.div>
              <DropdownMenuSeparator />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </motion.header>
  )
}
