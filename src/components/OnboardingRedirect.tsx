'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function OnboardingRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding && pathname === '/') {
      router.push('/onboarding')
    }
  }, [pathname, router])

  return null
} 