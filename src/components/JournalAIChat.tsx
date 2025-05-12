import React, { useState, useRef } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface JournalAIChatProps {
  entries: any[];
  moods: { emoji: string; value: number; label: string; color: string }[];
  tags: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const JournalAIChat: React.FC<JournalAIChatProps> = ({ entries, moods, tags }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm your Journal AI. Ask me anything about your entries, moods, or trends!"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          question: userMsg.content,
          entries,
          moods,
          tags,
        }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.insight || 'Sorry, I could not find an answer.' }]);
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open Journal AI Chat"
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7" />
        </button>
      )}
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white">
            <span className="font-semibold">Journal AI</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-purple-50" style={{ maxHeight: 350 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-3 py-2 max-w-[80%] text-sm shadow ${msg.role === 'user' ? 'bg-purple-200 text-purple-900' : 'bg-white text-purple-800 border border-purple-100'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex items-center gap-2 border-t border-purple-100 bg-white px-3 py-2"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              className="flex-1 rounded-lg border border-purple-200 px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
              type="text"
              placeholder="Ask me about your journal..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-colors disabled:opacity-50"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default JournalAIChat; 