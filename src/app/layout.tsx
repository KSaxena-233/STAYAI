import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import OnboardingRedirect from '@/components/OnboardingRedirect'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'STAY - Your AI Companion for Mental Wellness',
  description: 'A modern, AI-powered platform for teen mental health support and suicide prevention.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50`}>
        <OnboardingRedirect />
        <Navigation />
        <div className="pt-16">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
