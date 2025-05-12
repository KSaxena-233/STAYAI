'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const router = useRouter()

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    router.push('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image src="/STAY.png" alt="STAY Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Welcome to STAY
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-gray-700"
        >
          STAY is your AI-powered companion for mental wellness. We're here to listen, support, and help you navigate life's challenges—always with empathy, privacy, and care.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-left mx-auto max-w-md"
        >
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Our Mission</h2>
          <p className="text-gray-700 mb-4">To empower teens with a safe, modern, and supportive space for mental health, using the best of AI and psychology.</p>
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Your Privacy</h2>
          <p className="text-gray-700">Your conversations are private and never shared. STAY is here for you, judgment-free and confidential.</p>
        </motion.div>
        <button
          onClick={handleGetStarted}
          className="inline-block mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg shadow-lg hover:opacity-90 transition-opacity"
        >
          Get Started
        </button>
      </motion.div>
    </main>
  )
} 