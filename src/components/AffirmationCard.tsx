"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const affirmations = [
  "Your pain is real. So is your strength.",
  "You matter, even on the days you don't feel it.",
  "You are not alone.",
  "There is hope, even when your mind tells you there isn't.",
  "You are worthy of love and support.",
  "Every feeling is valid. Every step forward counts.",
  "Your story isn't over yet.",
  "You have survived 100% of your hardest days.",
  "It's okay to ask for help.",
]

export default function AffirmationCard() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % affirmations.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
        className="mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-white rounded-3xl shadow-2xl p-6 text-center text-xl font-semibold animate-pulse select-none"
      >
        <span>"{affirmations[index]}"</span>
      </motion.div>
    </AnimatePresence>
  )
} 