'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartBarIcon } from '@heroicons/react/24/outline'

interface MoodEntry {
  date: string
  mood: number
  note?: string
}

const moods = [
  { emoji: '😢', value: 1, label: 'Very Low' },
  { emoji: '😕', value: 2, label: 'Low' },
  { emoji: '😐', value: 3, label: 'Neutral' },
  { emoji: '🙂', value: 4, label: 'Good' },
  { emoji: '😊', value: 5, label: 'Great' },
]

export default function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value)
  }

  const handleSubmit = () => {
    if (selectedMood === null) return

    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      note: note.trim() || undefined,
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries))
    
    setSelectedMood(null)
    setNote('')
  }

  const getMoodEmoji = (value: number) => {
    return moods.find(m => m.value === value)?.emoji || '😐'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">How are you feeling today?</h2>
        
        <div className="flex justify-center gap-4 mb-6">
          {moods.map(({ emoji, value, label }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(value)}
              className={`p-4 rounded-full text-2xl transition-colors ${
                selectedMood === value
                  ? 'bg-purple-100 ring-2 ring-purple-500'
                  : 'bg-gray-100 hover:bg-purple-50'
              }`}
              title={label}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about your mood (optional)"
          className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/80 backdrop-blur-sm mb-4"
          rows={3}
        />

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <ChartBarIcon className="w-5 h-5" />
            {showHistory ? 'Hide History' : 'Show History'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedMood === null}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Save Mood
          </button>
        </div>

        <AnimatePresence>
          {showHistory && entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">Mood History</h3>
              <div className="space-y-3">
                {entries.slice().reverse().map((entry, index) => (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl"
                  >
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      {entry.note && (
                        <p className="text-gray-700 mt-1">{entry.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 