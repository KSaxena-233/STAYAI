'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'
import AffirmationCard from '@/components/AffirmationCard'

const stats = [
  {
    value: '45%',
    label: 'of young people ages 10–24 have struggled with their mental health in the past two years',
    color: 'from-pink-500 to-purple-500',
  },
  {
    value: '29%',
    label: 'have engaged in or considered self-harm',
    color: 'from-purple-500 to-pink-500',
  },
  {
    value: '95%',
    label: 'believe there are people in their lives who care about them',
    color: 'from-green-400 to-blue-500',
  },
  {
    value: '76%',
    label: 'feel a sense of belonging',
    color: 'from-blue-500 to-purple-400',
  },
  {
    value: '83%',
    label: 'are optimistic about their future',
    color: 'from-yellow-400 to-pink-400',
  },
  {
    value: '40%',
    label: 'of high schoolers felt persistently sad or hopeless in the past year (down from 42%)',
    color: 'from-pink-400 to-purple-400',
  },
  {
    value: '25%',
    label: 'reduction in suicide attempts at schools with prevention programs',
    color: 'from-green-500 to-blue-400',
  },
]

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
      <AffirmationCard />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full space-y-8 text-center relative z-10"
      >
        <div className="relative w-32 h-32 mx-auto mb-8 drop-shadow-xl">
          <Image
            src="/newstay.png"
            alt="STAY Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg">
          Welcome to STAY
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-3xl mb-8"
        >
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                className={`rounded-3xl p-6 shadow-2xl border border-white/30 bg-gradient-to-br ${stat.color} text-white flex flex-col items-center justify-center backdrop-blur-2xl`}
                style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)'}}
              >
                <span className="text-4xl font-extrabold mb-2 drop-shadow-lg">{stat.value}</span>
                <span className="text-base font-medium text-white/90 drop-shadow-sm">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto max-w-2xl mb-8"
        >
          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
            <SparklesIcon className="w-10 h-10 text-pink-400 mb-2 z-10 relative animate-pulse" />
            <h2 className="text-2xl font-bold text-purple-700 mb-2 z-10 relative">Our Mission</h2>
            <p className="text-gray-700 z-10 relative mb-2">
              STAY is dedicated to empowering young people with a safe, modern, and supportive space for mental health. We use the best of AI and psychology to help you navigate life's challenges, build resilience, and find hope.
            </p>
            <h3 className="text-lg font-semibold text-pink-600 z-10 relative mb-1">Why STAY?</h3>
            <ul className="list-disc list-inside text-gray-700 z-10 relative space-y-1 mb-2">
              <li>Private, AI-powered journaling and chat for real support</li>
              <li>Beautiful, interactive 3D analytics to visualize your journey</li>
              <li>Evidence-based resources and crisis help</li>
              <li>Designed for Gen Z, by people who care</li>
            </ul>
            <span className="text-xs text-gray-500 z-10 relative">Stats: <a href="https://jedfoundation.org/what-we-expect-in-2025-new-years-trends-in-youth-mental-health/" target="_blank" className="underline hover:text-purple-600">The Jed Foundation</a></span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/chat"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="/newstay.png"
              alt="STAY"
              width={24}
              height={24}
              className="rounded-full"
            />
            Start Talking
          </Link>
          <Link
            href="/resources"
            className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-700 font-semibold bg-white/70 shadow-lg hover:bg-purple-50 transition-colors"
          >
            Find Resources
          </Link>
          <Link
            href="/journal"
            className="px-8 py-3 rounded-full border-2 border-pink-600 text-pink-700 font-semibold bg-white/70 shadow-lg hover:bg-pink-50 transition-colors"
          >
            Journal
          </Link>
        </div>

        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-12 p-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 mx-auto max-w-2xl relative overflow-hidden"
          style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(200,150,255,0.3) 100%)'}}
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 z-10 relative">
            You're Not Alone
          </h2>
          <p className="text-gray-700 z-10 relative">
            STAY uses advanced AI to provide immediate support and connect you with professional resources when needed. Your privacy and well-being are our top priorities.
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}
