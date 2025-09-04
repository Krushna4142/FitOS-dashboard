"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 1.5,
    },
  },
}

export function Footer() {
  return (
    <motion.footer
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>© 2025 FitOS. All rights reserved.</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Heart className="h-4 w-4 text-red-500" />
          </motion.div>
          <span>Made with care for your health</span>
        </div>
      </div>
    </motion.footer>
  )
}
