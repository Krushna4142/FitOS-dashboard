"use client"

import { motion } from "framer-motion"
import { Heart, Shield, Users, Zap } from "lucide-react"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-chart-1 flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">FitOS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your AI-powered health companion for a better, healthier life.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Zap className="h-3 w-3" />
                <span>AI Health Assistant</span>
              </li>
              <li className="flex items-center space-x-2">
                <Heart className="h-3 w-3" />
                <span>Health Tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="h-3 w-3" />
                <span>Wellness Programs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Privacy Protected</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center w-full space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              {currentYear} FitOS. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>HIPAA Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3 text-red-500" />
                <span>Made with care</span>
              </span>
            </div>
          </div>
          <div className="text-xs font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Crafted by Krushna
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
