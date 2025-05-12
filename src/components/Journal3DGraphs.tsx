// @ts-nocheck
import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import type { FC } from 'react'

// Local JournalEntry type (sync with Journal.tsx)
interface JournalEntry {
  id: string
  date: string
  content: string
  prompt?: string
  mood?: number
  tags?: string[]
  aiInsights?: string
  wordCount?: number
  sentiment?: number
  stressors?: string[]
  positives?: string[]
  personality?: string[]
  aiCategory?: string
}

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Journal3DGraphsProps {
  entries: JournalEntry[]
  moods: { emoji: string; value: number; label: string; color: string }[]
  tags: string[]
}

const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const defaultMoods = ['Struggling', 'Down', 'Okay', 'Good', 'Great']
const defaultTags = ['Gratitude', 'Challenge', 'Achievement', 'Reflection', 'Goals']
const defaultHeatmap = [
  [1, 2, 3, 2, 1, 2, 3],
  [2, 3, 4, 3, 2, 3, 4],
  [3, 4, 5, 4, 3, 4, 5],
  [2, 3, 4, 3, 2, 3, 4],
  [1, 2, 3, 2, 1, 2, 3],
]
const defaultCube = [
  [2, 1, 0, 1, 2, 1, 0],
  [1, 2, 1, 2, 1, 2, 1],
  [0, 1, 2, 1, 0, 1, 2],
  [1, 0, 1, 2, 1, 0, 1],
  [2, 1, 0, 1, 2, 1, 0],
]

const Journal3DGraphs: FC<Journal3DGraphsProps> = ({ entries, moods, tags }) => {
  // Debug log to verify data
  console.log('3D Chart Data:', { entries, moods, tags });

  // Only generate mock entries on the client after hydration
  const [mockEntries, setMockEntries] = useState<JournalEntry[]>([]);
  useEffect(() => {
    setMockEntries([
      {
        id: '1',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        content: 'Had a great day at school!',
        mood: 5,
        aiCategory: 'achievement',
        tags: ['Achievement'],
        wordCount: 6,
      },
      {
        id: '2',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        content: 'Felt a bit down, but talked to a friend.',
        mood: 2,
        aiCategory: 'relationships',
        tags: ['Friends'],
        wordCount: 9,
      },
      {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        content: 'Went for a walk in nature.',
        mood: 4,
        aiCategory: 'self-care',
        tags: ['Self-Care', 'Nature'],
        wordCount: 6,
      },
      {
        id: '4',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        content: 'Worked hard on my project.',
        mood: 3,
        aiCategory: 'challenge',
        tags: ['Challenge', 'Work'],
        wordCount: 6,
      },
    ]);
  }, []);

  // Combine mock and real data for display
  const displayEntries = (entries && entries.length > 0)
    ? [...mockEntries, ...entries]
    : mockEntries;

  // Fallback moods and tags if props are empty
  const displayMoods = moods && moods.length > 0 ? moods : [
    { emoji: '😊', value: 5, label: 'Great', color: 'bg-green-500' },
    { emoji: '🙂', value: 4, label: 'Good', color: 'bg-green-300' },
    { emoji: '😐', value: 3, label: 'Okay', color: 'bg-yellow-300' },
    { emoji: '😔', value: 2, label: 'Down', color: 'bg-orange-300' },
    { emoji: '😢', value: 1, label: 'Struggling', color: 'bg-red-300' },
  ];
  const displayTags = tags && tags.length > 0 ? tags : [
    'Gratitude', 'Challenge', 'Achievement', 'Reflection', 
    'Goals', 'Relationships', 'Self-Care', 'Growth',
    'Learning', 'Creativity', 'Health', 'Family',
    'Friends', 'Work', 'Hobbies', 'Nature'
  ];

  // 3D Mood Heatmap Data
  const moodHeatmap = useMemo(() => {
    if (!displayEntries.length) return { days: defaultDays, moodLabels: defaultMoods, z: defaultHeatmap }
    const days = Array.from(new Set(displayEntries.map(e => new Date(e.date).toLocaleDateString())))
    const moodLabels = displayMoods.map(m => m.label)
    const z = displayMoods.map(mood =>
      days.map(day =>
        displayEntries.filter(e => new Date(e.date).toLocaleDateString() === day && e.mood === mood.value).length
      )
    )
    return { days, moodLabels, z }
  }, [displayEntries, displayMoods])

  // Debug log for moodHeatmap
  console.log('Mood Heatmap Data:', moodHeatmap);

  // Fallback if z is empty or all zeros
  const isHeatmapEmpty = !moodHeatmap.z || moodHeatmap.z.flat().every(v => v === 0);

  // 3D AI Category Cube Data (fully dynamic)
  const aiCategories = useMemo(() => {
    if (!displayEntries.length) return ['stress', 'gratitude', 'relationships', 'achievement', 'self-care', 'challenge', 'growth', 'other']
    return Array.from(new Set(displayEntries.map(e => e.aiCategory || 'other')))
  }, [displayEntries])

  const aiCategoryDays = useMemo(() => {
    if (!displayEntries.length) return defaultDays
    return Array.from(new Set(displayEntries.map(e => new Date(e.date).toLocaleDateString())))
  }, [displayEntries])

  const aiCategoryCube = useMemo(() => {
    if (!displayEntries.length) return { aiCategories, days: aiCategoryDays, z: defaultCube }
    const z = aiCategories.map(cat =>
      aiCategoryDays.map(day =>
        displayEntries.filter(e => new Date(e.date).toLocaleDateString() === day && (e.aiCategory || 'other') === cat).length
      )
    )
    return { aiCategories, days: aiCategoryDays, z }
  }, [displayEntries, aiCategories, aiCategoryDays])

  const isDefault = !entries || entries.length === 0;

  const [moodInsight, setMoodInsight] = useState<string | null>(null);
  const [catInsight, setCatInsight] = useState<string | null>(null);
  const [loadingMood, setLoadingMood] = useState(false);
  const [loadingCat, setLoadingCat] = useState(false);

  // Only send real user entries to AI insight endpoint
  const realEntries = entries && entries.length > 0 ? entries : [];

  const askAIMoodInsight = async () => {
    setLoadingMood(true);
    setMoodInsight(null);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mood-graph',
          entries: realEntries,
          moods: displayMoods,
        }),
      });
      const data = await response.json();
      setMoodInsight(data.insight || 'No insight available.');
    } catch {
      setMoodInsight('Failed to get AI insight.');
    } finally {
      setLoadingMood(false);
    }
  };

  const askAICatInsight = async () => {
    setLoadingCat(true);
    setCatInsight(null);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category-graph',
          entries: realEntries,
        }),
      });
      const data = await response.json();
      setCatInsight(data.insight || 'No insight available.');
    } catch {
      setCatInsight('Failed to get AI insight.');
    } finally {
      setLoadingCat(false);
    }
  };

  return (
    <div className="space-y-12">
      {isDefault && (
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-2">✨</div>
          <h3 className="text-2xl font-bold text-purple-700 mb-2">See Your Life in 3D!</h3>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Start journaling to unlock your own interactive 3D mood and life analytics. The graphs below are just a preview—your story will be unique!
          </p>
        </div>
      )}
      {/* 3D Mood Heatmap */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-8">
        <div className="order-2 md:order-1 md:w-1/3 flex flex-col justify-center mb-4 md:mb-0">
          <div className="bg-purple-50 border-l-4 border-purple-400 rounded-xl p-4 text-purple-800 shadow md:ml-8">
            <h4 className="font-semibold mb-2">How to interpret the Mood Heatmap</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><b>X-axis</b>: Days you made journal entries.</li>
              <li><b>Y-axis</b>: Mood you selected for each entry.</li>
              <li><b>Z-axis (height/color)</b>: Number of entries for each mood on each day.</li>
              <li>Peaks show days/moods with more entries. Use this to spot mood trends over time.</li>
            </ul>
            <button
              onClick={askAIMoodInsight}
              className="mt-4 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow"
              disabled={loadingMood}
            >
              {loadingMood ? 'Asking AI...' : 'Ask AI for insight about this graph'}
            </button>
            {moodInsight && (
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-purple-200 text-purple-900 text-sm shadow">
                <b>AI Insight:</b> {moodInsight}
              </div>
            )}
          </div>
        </div>
        <div className="order-1 md:order-2 flex-1 min-w-0" style={{ minWidth: 0, marginRight: '2.5rem' }}>
          <h3 className="text-xl font-bold mb-4 text-purple-700">3D Mood Heatmap</h3>
          {isHeatmapEmpty ? (
            <div className="text-center text-gray-400">No mood data to display yet. Try adding entries with a mood selected.</div>
          ) : (
            <Plot
              data={[{
                z: moodHeatmap.z,
                x: moodHeatmap.days,
                y: moodHeatmap.moodLabels,
                type: 'surface',
                colorscale: 'Viridis',
                showscale: true,
                contours: { z: { show: true, usecolormap: true } },
              }]}
              layout={{
                autosize: true,
                height: 400,
                margin: { l: 60, r: 30, b: 60, t: 40, rpad: 80 },
                scene: {
                  xaxis: { title: 'Day', tickangle: -45 },
                  yaxis: { title: 'Mood' },
                  zaxis: { title: 'Count' },
                  camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
                },
                paper_bgcolor: 'rgba(255,255,255,0.95)',
                plot_bgcolor: 'rgba(255,255,255,0.95)',
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          )}
        </div>
      </div>
      {/* 3D AI Category Cube */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-8">
        <div className="order-2 md:order-1 md:w-1/3 flex flex-col justify-center mb-4 md:mb-0">
          <div className="bg-pink-50 border-l-4 border-pink-400 rounded-xl p-4 text-pink-800 shadow md:ml-8">
            <h4 className="font-semibold mb-2">How to interpret the AI Category Cube</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><b>X-axis</b>: AI-categorized themes from your entries (e.g., stress, gratitude, relationships).</li>
              <li><b>Y-axis</b>: Days you made journal entries.</li>
              <li><b>Z-axis (height/color)</b>: Number of entries for each category on each day.</li>
              <li>Peaks show which themes the AI sees most often. Use this to spot patterns in your journaling topics.</li>
            </ul>
            <button
              onClick={askAICatInsight}
              className="mt-4 px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors shadow"
              disabled={loadingCat}
            >
              {loadingCat ? 'Asking AI...' : 'Ask AI for insight about this graph'}
            </button>
            {catInsight && (
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-pink-200 text-pink-900 text-sm shadow">
                <b>AI Insight:</b> {catInsight}
              </div>
            )}
          </div>
        </div>
        <div className="order-1 md:order-2 flex-1 min-w-0" style={{ minWidth: 0, marginRight: '2.5rem' }}>
          <h3 className="text-xl font-bold mb-4 text-pink-700">3D AI Category Cube</h3>
          <Plot
            data={[{
              z: aiCategoryCube.z,
              x: aiCategoryCube.aiCategories,
              y: aiCategoryCube.days,
              type: 'surface',
              colorscale: 'Rainbow',
              showscale: true,
              contours: { z: { show: true, usecolormap: true } },
            }]}
            layout={{
              autosize: true,
              height: 400,
              margin: { l: 60, r: 30, b: 60, t: 40, rpad: 80 },
              scene: {
                xaxis: { title: 'AI Category', tickangle: -45 },
                yaxis: { title: 'Day' },
                zaxis: { title: 'Count' },
                camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
              },
              paper_bgcolor: 'rgba(255,255,255,0.95)',
              plot_bgcolor: 'rgba(255,255,255,0.95)',
            }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>
      </div>
    </div>
  )
}

export default Journal3DGraphs

// Add this to your project (e.g., src/types/react-plotly.d.ts) if you want to suppress TS errors globally:
// declare module 'react-plotly.js'; 