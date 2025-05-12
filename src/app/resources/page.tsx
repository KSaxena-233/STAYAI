'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneIcon, GlobeAltIcon, HeartIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { mentalHealthResources } from '../../data/mentalHealthResources'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

const nationalResources = [
  {
    title: 'National Suicide Prevention Lifeline',
    description: '24/7, free and confidential support for people in suicidal crisis or emotional distress.',
    phone: '988',
    website: 'https://988lifeline.org',
    icon: PhoneIcon,
  },
  {
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 to connect with a Crisis Counselor.',
    phone: '741741',
    website: 'https://www.crisistextline.org',
    icon: HeartIcon,
  },
  {
    title: 'SAMHSA National Helpline',
    description: 'Treatment referral and information service for individuals facing mental health or substance use disorders.',
    phone: '1-800-662-4357',
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    icon: PhoneIcon,
  },
]

const tips = [
  'Remember that your feelings are valid and temporary',
  'Practice self-care and take things one step at a time',
  'Stay connected with trusted friends and family',
  'Consider talking to a mental health professional',
  'Use grounding techniques when feeling overwhelmed',
  'Keep a journal to express your thoughts and feelings',
  'Try mindfulness and meditation exercises',
  'Remember that asking for help is a sign of strength',
]

export default function Resources() {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [touched, setTouched] = useState(false)
  const [resources, setResources] = useState<any[]>([])
  const defaultCenter: [number, number] = [37.0902, -95.7129]; // USA center
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMap, setShowMap] = useState(false)
  // Extract unique states from the data (move inside component)
  const states = Array.from(new Set(mentalHealthResources.map(r => r.state)))
  const cities = state ? mentalHealthResources.filter(r => r.state === state).map(r => r.city) : []

  useEffect(() => {
    setShowMap(true)
  }, [])

  // Geocode city/state to lat/lng
  const geocodeCity = async (city: string, state: string) => {
    try {
      const resp = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          city,
          state,
          country: 'USA',
          format: 'json',
          limit: 1,
        },
      })
      if (resp.data && resp.data.length > 0) {
        return [parseFloat(resp.data[0].lat), parseFloat(resp.data[0].lon)]
      }
    } catch {}
    return [37.0902, -95.7129] // fallback: USA center
  }

  // Fetch resources from SAMHSA API (or similar)
  const fetchResources = async (city: string, state: string) => {
    setLoading(true)
    setError('')
    setResources([])
    try {
      // Geocode first
      const center = await geocodeCity(city, state)
      setMapCenter(center as [number, number])
      // Example: Use SAMHSA API (public, no key needed for basic queries)
      // Docs: https://findtreatment.samhsa.gov/locator
      const resp = await axios.get('https://findtreatment.samhsa.gov/locator/service', {
        params: {
          address: `${city}, ${state}`,
          radius: 25, // miles
          limit: 20,
        },
      })
      if (resp.data && Array.isArray(resp.data)) {
        setResources(resp.data)
      } else {
        setResources([])
      }
    } catch (e) {
      setError('Could not fetch resources for this location.')
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setTouched(true)
    if (city && state) {
      await fetchResources(city, state)
    }
  }

  // Find the selected city/state resource from mentalHealthResources
  const selectedCityResource =
    state && city
      ? mentalHealthResources.find(r =>
          r.state.toLowerCase().trim() === state.toLowerCase().trim() &&
          r.city.toLowerCase().trim() === city.toLowerCase().trim()
        )
      : undefined;

  const showNoMatch = touched && state && city && !selectedCityResource;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4 drop-shadow-lg">
            Help is Available
          </h1>
          <p className="text-lg text-gray-700">
            You're not alone. Here are some resources that can help you right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center gap-4 mb-8"
          >
            <div>
              <label className="block font-bold text-purple-700 mb-1">State</label>
              <select
                className="rounded-lg border px-3 py-2 w-48 text-gray-800 bg-white"
                value={state}
                onChange={e => {
                  setState(e.target.value)
                  setCity('') // Reset city when state changes
                }}
                required
              >
                <option value="">Select a state</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-pink-700 mb-1">City</label>
              <select
                className="rounded-lg border px-3 py-2 w-48 text-gray-800 bg-white"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                disabled={!state}
              >
                <option value="">Select a city</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:from-pink-500 hover:to-purple-500 transition"
              disabled={!state || !city}
            >
              <span className="mr-2">🔍</span>Search
            </button>
          </form>
        </motion.div>

        {showNoMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-pink-600 font-semibold mb-8"
          >
            No local resources found for {city}, {state}. Showing national resources below.
          </motion.div>
        )}
        {!state && !city && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-purple-600 font-medium mb-8"
          >
            Enter your state and city to find local resources, or browse national resources below.
          </motion.div>
        )}

        {/* Map Section */}
        {!loading && resources.length > 0 && mapCenter !== defaultCenter && showMap && (
          <div className="mb-8">
            <div className="h-[350px] w-full rounded-2xl overflow-hidden shadow-lg border border-purple-200">
              <MapContainer
                key={`${mapCenter.join(',')}-${city}-${state}`}
                center={mapCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {resources.map((r, i) =>
                  r.latitude && r.longitude ? (
                    <Marker key={i} position={[r.latitude, r.longitude]}>
                      <Popup>
                        <div>
                          <b>{r.name || r.title}</b><br />
                          {r.address && <span>{r.address}<br /></span>}
                          {r.phone && <a href={`tel:${r.phone}`}>{r.phone}</a>}<br />
                          {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer">Website</a>}
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                )}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="grid gap-6 mb-12">
          {loading && <div className="text-center text-purple-600 font-semibold">Loading resources...</div>}
          {error && <div className="text-center text-pink-600 font-semibold">{error}</div>}
          {selectedCityResource && selectedCityResource.resources.length > 0 ? (
            selectedCityResource.resources.map((r, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:scale-[1.02] transition-transform relative overflow-hidden">
                <div className="flex items-start gap-4 z-10 relative">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MapPinIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {r.name}
                    </h2>
                    <p className="text-gray-700 mb-4">{r.address}</p>
                    <div className="flex flex-wrap gap-4">
                      {r.phone && (
                        <a href={`tel:${r.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white hover:opacity-90 transition-opacity">
                          <PhoneIcon className="w-5 h-5" />
                          Call {r.phone}
                        </a>
                      )}
                      {r.website && (
                        <a href={r.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 text-white hover:opacity-90 transition-opacity">
                          <GlobeAltIcon className="w-5 h-5" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) :
            !loading && !error && (
              <div className="text-center text-purple-600 font-medium mb-8">
                No local resources found. Showing national resources below.
              </div>
            )
          }
        </div>

        {/* National Resources Fallback */}
        {(!resources.length && !loading) && (
          <div className="grid gap-6 mb-12">
            {nationalResources.map((resource, index) => (
              <div key={resource.title} className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30 hover:scale-[1.02] transition-transform relative overflow-hidden">
                <div className="flex items-start gap-4 z-10 relative">
                  <div className="p-3 bg-pink-100 rounded-xl">
                    <resource.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {resource.title}
                    </h2>
                    <p className="text-gray-700 mb-4">{resource.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <a href={`tel:${resource.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 text-white hover:opacity-90 transition-opacity">
                        <PhoneIcon className="w-5 h-5" />
                        Call {resource.phone}
                      </a>
                      <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white hover:opacity-90 transition-opacity">
                        <GlobeAltIcon className="w-5 h-5" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 mb-8 relative overflow-hidden"
          style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)', background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(200,150,255,0.2) 100%)'}}
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 z-10 relative">Self-Care Tips</h2>
          <ul className="list-disc list-inside text-gray-700 z-10 relative space-y-1">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
} 