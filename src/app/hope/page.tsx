import Hope from '@/components/Hope'

export default function HopePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Hope />
      </div>
    </div>
  )
} 