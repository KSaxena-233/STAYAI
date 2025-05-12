"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Journal from '@/components/Journal'
import JournalAIChat from '@/components/JournalAIChat'

interface AnalyticsData {
  entries: any[]
  moods: { emoji: string; value: number; label: string; color: string }[]
  tags: string[]
}

const Journal3DGraphs = dynamic(() => import('@/components/Journal3DGraphs'), { ssr: false })

export default function JournalPage() {
  // We'll use a state to sync entries, moods, and tags from the Journal component
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({ entries: [], moods: [], tags: [] })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg leading-tight pb-2" style={{background: 'linear-gradient(90deg, #a21caf 0%, #db2777 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Your Magical Journal
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Express your thoughts, track your mood, and visualize your journey in 3D. Everything here is private, beautiful, and powered by AI.
          </p>
        </div>
        <Journal onAnalyticsUpdate={setAnalyticsData} />
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 drop-shadow">Advanced 3D Analytics</h2>
          <Journal3DGraphs entries={analyticsData.entries} moods={analyticsData.moods} tags={analyticsData.tags} />
        </div>
      </div>
      {/* Floating Journal AI Chat */}
      <JournalAIChat
        entries={analyticsData.entries}
        moods={analyticsData.moods}
        tags={analyticsData.tags}
      />
    </div>
  )
} 