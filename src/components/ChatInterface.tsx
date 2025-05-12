'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const STAY_AVATAR = '/newstay.png' // Use your STAY logo or avatar image path

export default function ChatInterface() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const NUM_BUBBLES = 12;
  const bubbles = useMemo(() => (
    Array.from({ length: NUM_BUBBLES }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 24 + Math.random() * 32,
      height: 24 + Math.random() * 32,
      delay: Math.random() * 8,
    }))
  ), []);

  // On first load, show STAY companion greeting if no messages
  useEffect(() => {
    const localMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    if (localMessages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi there! I'm your STAY companion. I'm here to listen and support you. How are you feeling today?",
          timestamp: new Date().toISOString(),
        },
      ])
    } else {
      setMessages(localMessages)
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    if (selected.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selected))
    } else {
      setFilePreview(selected.name)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !file) return
    setIsLoading(true)

    let fileUrl: string | undefined
    let fileType: string | undefined
    if (file) {
      if (file.type.startsWith('image/')) {
        fileUrl = filePreview || ''
        fileType = file.type
      } else {
        fileUrl = filePreview || file.name
        fileType = file.type
      }
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      file_url: fileUrl,
      file_type: fileType,
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setFile(null)
    setFilePreview(null)

    // Get AI response (always use real API, no demo)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          fileUrl,
          fileType,
          systemPrompt: `
            You are STAY, a supportive AI companion, therapist, and counselor. 
            Always respond with empathy, warmth, and evidence-based techniques from neuroscience and psychology (CBT, motivational interviewing, active listening, validation, etc.).
            Your goal is to help the user feel heard, supported, and empowered. 
            Never give medical advice or diagnose, but offer coping strategies, validation, and encouragement.
            Use a conversational, friendly, and non-judgmental tone.
          `
        }),
      })
      let aiContent = "Sorry, I'm having trouble responding right now. Please try again."
      if (response.ok) {
        const data = await response.json()
        aiContent = data.message
      }
      // Always respond as STAY companion
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent || "I'm STAY, your companion. How can I support you today?",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      {/* Main Chat Content layered above */}
      <div className="max-w-3xl mx-auto p-4 relative z-10">
        {/* Section Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-purple-700 mb-2 tracking-tight">STAY Chat</h1>
          <p className="text-lg text-purple-600 mb-2">Talk to your AI companion. Your conversations are private, supportive, and always here for you.</p>
          <hr className="border-t-2 border-purple-200 my-4" />
        </div>
        {/* Motivational quotes in glossy bubble */}
        <div className="mb-4 flex justify-center">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-white rounded-3xl shadow-2xl p-6 text-center text-xl font-semibold animate-pulse select-none max-w-2xl">
            <div>"Your pain is real. So is your strength."</div>
            <div className="text-lg mt-2">"You are not alone. Every storm runs out of rain."</div>
            <div className="text-base mt-1">"Small steps every day still move you forward."</div>
          </div>
        </div>
        {/* Info card with emojis */}
        <div className="mb-8 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 flex flex-col items-center gap-2 relative overflow-hidden">
          <h2 className="text-lg font-bold text-purple-700 mb-1">How to Use STAY Chat</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1 text-base">
            <li>💬 Type anything on your mind—STAY is here to listen and support you.</li>
            <li>📎 Share PDFs, images, documents, or spreadsheets to get AI insights.</li>
            <li>🔒 Conversations are private and confidential <span className="inline-block align-text-bottom text-green-500">✔️</span>.</li>
            <li>🧠 Ask for advice, coping strategies, or just talk about your day.</li>
            <li>🚨 If you need urgent help, use the "Need Help Now" button or call 988.</li>
            <li>🩺 STAY is not a replacement for professional care, but can connect you to resources.</li>
          </ul>
        </div>
        {/* Chat Area Section Heading */}
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-purple-700">Your Conversation</h2>
          <span className="flex-1 border-t border-purple-200" />
        </div>
        {/* Chat area */}
        <div className="flex flex-col h-[60vh] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-4 mb-6 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl shadow relative transition-all duration-200
                ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 text-right text-purple-900 shadow-md'
                  : 'bg-gradient-to-r from-pink-200 via-purple-100 to-yellow-100 border-2 border-pink-200 text-left pl-12 text-purple-900 shadow-lg'}
              `}>
                {msg.role === 'assistant' && (
                  <img src={STAY_AVATAR} alt="STAY" className="w-8 h-8 rounded-full absolute left-0 top-2 shadow-md border-2 border-pink-200 bg-white -translate-x-1/2" />
                )}
                <div className="whitespace-pre-line">{msg.content}</div>
                {msg.file_url && (
                  <div className="mt-2">
                    {msg.file_type && msg.file_type.startsWith('image/') ? (
                      <img src={msg.file_url} alt="Uploaded" className="max-w-xs max-h-40 rounded-lg" />
                    ) : (
                      <span className="text-xs text-gray-500">{msg.file_url}</span>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area in a glassy card */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-purple-100 px-4 py-3">
          <label className="p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 cursor-pointer border-2 border-purple-200 flex items-center justify-center">
            <PaperClipIcon className="w-5 h-5 text-purple-500" />
            <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileChange} className="hidden" />
          </label>
          {filePreview && (
            <div className="flex items-center gap-2 bg-white/90 rounded-xl shadow px-3 py-2 border border-purple-200">
              {file && file.type.startsWith('image/') ? (
                <img src={filePreview} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
              ) : (
                <span className="text-purple-700 font-semibold">{filePreview}</span>
              )}
              <button type="button" onClick={handleRemoveFile} className="ml-2 text-gray-500 hover:text-red-500">✕</button>
            </div>
          )}
          <input
            className="flex-1 border rounded-l px-3 py-2 text-purple-900 placeholder-gray-400 bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-r shadow hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            disabled={isLoading}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
} 