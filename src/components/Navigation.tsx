'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Hope', href: '/hope' },
  { name: 'Journal', href: '/journal' },
  { name: 'Chat', href: '/chat' },
  { name: 'Resources', href: '/resources' },
]

export default function Navigation() {
  const pathname = usePathname() || ''

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 shadow-md border-b border-purple-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
            STAY
          </Link>
          <div className="flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${pathname === item.href
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-700 hover:bg-purple-200 hover:text-purple-900'}`}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute left-0 right-0 -bottom-1 h-1 rounded-b bg-gradient-to-r from-purple-400 to-pink-400" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 