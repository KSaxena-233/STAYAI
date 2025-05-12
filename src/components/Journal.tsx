'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChartBarIcon, ArrowDownTrayIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline'

const prompts = [
  "What's one thing that made you smile today?",
  "What's a challenge you're facing, and how are you handling it?",
  "What are three things you're grateful for right now?",
  "What's something you're looking forward to?",
  "What's a small victory you had today?",
  "What's something you'd like to improve about your day?",
  "What's a kind thing someone did for you recently?",
  "What's something you're proud of yourself for?",
  "What's a lesson you learned recently?",
  "What's a goal you're working towards?",
  "What's something that inspired you today?",
  "What's a way you showed kindness today?",
]

const moods = [
  { emoji: '😊', value: 5, label: 'Great', color: 'bg-green-500' },
  { emoji: '🙂', value: 4, label: 'Good', color: 'bg-green-300' },
  { emoji: '😐', value: 3, label: 'Okay', color: 'bg-yellow-300' },
  { emoji: '😔', value: 2, label: 'Down', color: 'bg-orange-300' },
  { emoji: '😢', value: 1, label: 'Struggling', color: 'bg-red-300' },
]

const tags = [
  'Gratitude', 'Challenge', 'Achievement', 'Reflection', 
  'Goals', 'Relationships', 'Self-Care', 'Growth',
  'Learning', 'Creativity', 'Health', 'Family',
  'Friends', 'Work', 'Hobbies', 'Nature'
]

const stressorOptions = [
  'School', 'Work', 'Family', 'Friends', 'Health', 'Finances', 'Loneliness', 'Uncertainty', 'Social Media', 'Self-Esteem', 'Other'
]
const positiveOptions = [
  'Supportive Friends', 'Family', 'Exercise', 'Music', 'Nature', 'Hobbies', 'Therapy', 'Pets', 'Achievements', 'Rest', 'Other'
]
const personalityOptions = [
  'Optimistic', 'Resilient', 'Introverted', 'Extroverted', 'Empathetic', 'Creative', 'Analytical', 'Adventurous', 'Calm', 'Sensitive', 'Other'
]

// Add prop type for onAnalyticsUpdate
interface AnalyticsData {
  entries: any[];
  moods: { emoji: string; value: number; label: string; color: string }[];
  tags: string[];
}

interface JournalProps {
  onAnalyticsUpdate?: (data: AnalyticsData) => void;
}

// Helper functions for localStorage CRUD
const LOCAL_STORAGE_KEY = 'journal_entries_v1';
function loadEntriesFromStorage() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveEntriesToStorage(entries: any[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
}

export default function Journal({ onAnalyticsUpdate }: JournalProps) {
  const [entries, setEntries] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStressors, setSelectedStressors] = useState<string[]>([])
  const [selectedPositives, setSelectedPositives] = useState<string[]>([])
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [entryDate, setEntryDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage
  useEffect(() => {
    const localEntries = loadEntriesFromStorage();
    setEntries(localEntries);
    if (onAnalyticsUpdate) {
      onAnalyticsUpdate({ entries: localEntries, moods: moods, tags });
    }
  }, [])

  useEffect(() => {
    setEntryDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleToggle = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    setSelected(selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value]
    )
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (!content.trim()) {
        setError('Please write something in your journal entry.')
        setLoading(false)
        return
      }
      // Build newEntry
      const newEntry: any = {
        id: Date.now().toString(),
        date: entryDate || new Date().toISOString().split('T')[0],
        content: content.trim(),
        prompt: selectedPrompt ?? undefined,
        mood: selectedMood ?? undefined,
        tags: selectedTags,
        stressors: selectedStressors,
        positives: selectedPositives,
        personality: selectedPersonality,
        wordCount: content.trim().split(/\s+/).length,
      };
      // Save entry to localStorage
      const updatedEntries = [newEntry, ...entries];
      saveEntriesToStorage(updatedEntries);
      setEntries(updatedEntries);
      if (onAnalyticsUpdate) {
        onAnalyticsUpdate({ entries: updatedEntries, moods: moods, tags });
      }
      setContent('')
      setSelectedPrompt(null)
      setSelectedMood(null)
      setSelectedTags([])
      setSelectedStressors([])
      setSelectedPositives([])
      setSelectedPersonality([])
      setEntryDate(new Date().toISOString().split('T')[0])
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getNewPrompt = () => {
    const unusedPrompts = prompts.filter(p => !entries?.some(e => e.prompt === p))
    const availablePrompts = unusedPrompts.length > 0 ? unusedPrompts : prompts
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
    setSelectedPrompt(randomPrompt)
  }

  // Export entries
  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `journal-entries-${new Date().toISOString().split('T')[0]}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import entries
  const importEntries = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const merged = [...imported, ...entries];
          saveEntriesToStorage(merged);
          setEntries(merged);
          if (onAnalyticsUpdate) {
            onAnalyticsUpdate({ entries: merged, moods: moods, tags });
          }
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white/80 rounded-3xl shadow-2xl border border-white/30 p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Journal</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={getNewPrompt} className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
            <SparklesIcon className="w-5 h-5" /> Get Prompt
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors">
            <PencilIcon className="w-5 h-5" /> {showHistory ? 'New Entry' : 'View History'}
          </button>
          <button onClick={exportEntries} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
            <ArrowDownTrayIcon className="w-5 h-5" /> Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors cursor-pointer">
            <input type="file" accept="application/json" onChange={importEntries} className="hidden" />
            Import
          </label>
        </div>
        {!showHistory ? (
          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            {selectedPrompt && <div className="text-purple-600 italic mb-2">{selectedPrompt}</div>}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${selectedMood === mood.value ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag) ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-purple-700 mb-1">Stressors</label>
                <div className="flex flex-wrap gap-2">
                  {stressorOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleToggle(option, selectedStressors, setSelectedStressors)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border-2 ${selectedStressors.includes(option) ? 'bg-pink-500 text-white border-pink-600' : 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-green-700 mb-1">Positive Factors</label>
                <div className="flex flex-wrap gap-2">
                  {positiveOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleToggle(option, selectedPositives, setSelectedPositives)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border-2 ${selectedPositives.includes(option) ? 'bg-green-500 text-white border-green-600' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-blue-700 mb-1">Personality Traits</label>
                <div className="flex flex-wrap gap-2">
                  {personalityOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleToggle(option, selectedPersonality, setSelectedPersonality)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border-2 ${selectedPersonality.includes(option) ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-purple-700 mb-1">Entry Date</label>
              <input
                type="date"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="rounded-lg border border-purple-200 px-3 py-2 focus:outline-none focus:border-purple-500 bg-white/80"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{content.trim().split(/\s+/).length} words</div>
              <button
                type="submit"
                className={`bg-purple-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400${loading ? ' opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
            {error && <div className="text-red-600 font-semibold mt-2 text-center">{error}</div>}
          </form>
        ) : (
          <div className="space-y-4">
            {(entries ?? []).length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg">No entries found. Start writing your first journal entry!</p>
              </div>
            ) :
              (entries ?? []).map((entry, idx) => {
                const formattedDate = useMemo(() => new Date(entry.date).toLocaleDateString(), [entry.date]);
                return (
                  <div key={entry.id} className="p-4 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-900">{formattedDate}</div>
                    </div>
                    {entry.mood && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{moods.find(m => m.value === entry.mood)?.emoji}</span>
                        <span className="text-gray-600">{moods.find(m => m.value === entry.mood)?.label}</span>
                      </div>
                    )}
                    {entry.prompt && <div className="text-purple-600 italic mb-2">{entry.prompt}</div>}
                    <p className="text-gray-900 whitespace-pre-wrap mb-2 leading-relaxed">{entry.content}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entry.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    </div>
  )
} 