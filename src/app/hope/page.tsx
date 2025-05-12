import Hope from '@/components/Hope'

export default function HopePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-xl text-center text-sm font-semibold">
          Your Hope Gallery is <b>private</b> and only visible on <b>this device</b>. If you clear your browser data or use a different device, your gallery will be erased.
        </div>
        <Hope />
      </div>
    </div>
  )
} 