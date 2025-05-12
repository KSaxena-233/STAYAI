'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AffirmationCard from './AffirmationCard'
import toast from 'react-hot-toast'
import { 
  ShieldCheckIcon, HeartIcon, FlagIcon, UserCircleIcon, LockClosedIcon, LockOpenIcon, 
  EyeIcon, EyeSlashIcon, ChatBubbleLeftIcon, ShareIcon, BookmarkIcon, 
  MagnifyingGlassIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon, 
  SparklesIcon, FireIcon, StarIcon, FaceSmileIcon, XMarkIcon
} from '@heroicons/react/24/outline'

interface HopePhoto {
  id: string;
  url: string;
  name: string;
  reported?: boolean;
  category?: Category;
  description?: string;
  tags?: string[];
  createdAt?: string;
  reactions?: {
    likes: number;
    hearts: number;
    stars: number;
  };
  isPrivate?: boolean;
  comments?: { id: string; text: string; author?: string; date?: string }[];
}

interface WhyIStayStory {
  id: string;
  text: string;
  photo?: string;
  date: string;
  reported?: boolean;
  category?: Category;
  tags?: string[];
  reactions?: {
    likes: number;
    hearts: number;
    stars: number;
  };
  isPrivate?: boolean;
  comments?: { id: string; text: string; author?: string; date?: string }[];
}

type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostReacted'
type Category = 'all' | 'family' | 'friends' | 'pets' | 'nature' | 'art' | 'other'

export default function Hope() {
  const [hopePhotos, setHopePhotos] = useState<HopePhoto[]>([])
  const [whyIStayStories, setWhyIStayStories] = useState<WhyIStayStory[]>([])
  const [storyText, setStoryText] = useState('')
  const [storyPhoto, setStoryPhoto] = useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [description, setDescription] = useState('')
  
  // UI state
  const [activeTab, setActiveTab] = useState<'gallery' | 'stories'>('gallery')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HopePhoto | WhyIStayStory | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storyPhotoInputRef = useRef<HTMLInputElement>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  
  // --- AI Assistant State ---
  const [aiMessage, setAiMessage] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [userStats, setUserStats] = useState({ photos: 0, stories: 0 });

  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setUserStats({ photos: hopePhotos.length, stories: whyIStayStories.length });
    if (hopePhotos.length === 0 && whyIStayStories.length === 0) {
      setAiMessage("👋 Hi there! I'm your Hope Companion. Ready to share a photo or a story? If you need inspiration, just ask!");
    } else if (activeTab === 'gallery' && hopePhotos.length > 0) {
      setAiMessage("🌸 Your gallery is growing! Would you like to add a story about one of your photos?");
    } else if (activeTab === 'stories' && whyIStayStories.length > 0) {
      setAiMessage("💬 Your words matter. Want a prompt for your next story?");
    } else {
      setAiMessage("✨ Keep sharing hope! If you need a prompt or help, just click 'Need Inspiration?'");
    }
  }, [hopePhotos, whyIStayStories, activeTab]);

  const aiPrompts = [
    "What gives you hope on tough days?",
    "Describe a memory with someone you love.",
    "What is one thing you're grateful for today?",
    "Share a message you wish someone would tell you.",
    "Who or what inspires you to keep going?"
  ];

  const handleShowPrompt = () => {
    setShowPrompt(true);
    setAiMessage(`📝 Try this: ${aiPrompts[Math.floor(Math.random() * aiPrompts.length)]}`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setHopePhotos(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          url: ev.target?.result as string,
          name: file.name,
          reported: false,
          category: selectedCategory,
          description: description,
          tags: tags.length > 0 ? [...tags] : [],
          createdAt: new Date().toISOString(),
          reactions: { likes: 0, hearts: 0, stars: 0 },
          isPrivate: isPrivate,
          comments: [],
        }
      ])
    }
    reader.readAsDataURL(file)
  }

  const handleStoryPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setStoryPhoto(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyText.trim()) return
    setWhyIStayStories(prev => [
      {
        id: Date.now().toString(),
        text: storyText.trim(),
        photo: storyPhoto,
        date: new Date().toISOString(),
        reported: false,
        category: selectedCategory,
        tags: tags.length > 0 ? [...tags] : [],
        reactions: { likes: 0, hearts: 0, stars: 0 },
        isPrivate: isPrivate,
        comments: [],
      },
      ...prev,
    ])
    setStoryText('')
    setStoryPhoto(undefined)
  }

  // Handle reactions
  const handleReaction = (type: 'photo' | 'story', id: string, reactionType: 'likes' | 'hearts' | 'stars') => {
    // Implementation needed
  }

  // Handle comments
  const handleAddComment = (type: 'photo' | 'story', id: string) => {
    // Implementation needed
  }

  // Handle reporting
  const handleReport = (type: 'photo' | 'story', id: string) => {
    // Implementation needed
  }

  // Toggle privacy
  const togglePrivacy = (type: 'photo' | 'story', id: string) => {
    // Implementation needed
  }

  // Add tag
  const handleAddTag = () => {
    // Implementation needed
  }

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    // Implementation needed
  }

  // Filter and sort content
  const filteredPhotos = hopePhotos
    .filter(photo => !photo.reported)
    .filter(photo => selectedCategory === 'all' || photo.category === selectedCategory)
    .filter(photo =>
      searchQuery === '' ||
      photo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (photo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        case 'oldest':
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        case 'mostLiked':
          return (b.reactions?.likes ?? 0) - (a.reactions?.likes ?? 0)
        case 'mostReacted':
          return ((b.reactions?.likes ?? 0) + (b.reactions?.hearts ?? 0) + (b.reactions?.stars ?? 0)) -
                 ((a.reactions?.likes ?? 0) + (a.reactions?.hearts ?? 0) + (a.reactions?.stars ?? 0))
        default:
          return 0
      }
    })

  const filteredStories = whyIStayStories
    .filter(story => !story.reported)
    .filter(story => selectedCategory === 'all' || story.category === selectedCategory)
    .filter(story =>
      searchQuery === '' ||
      story.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'mostLiked':
          return (b.reactions?.likes ?? 0) - (a.reactions?.likes ?? 0)
        case 'mostReacted':
          return ((b.reactions?.likes ?? 0) + (b.reactions?.hearts ?? 0) + (b.reactions?.stars ?? 0)) -
                 ((a.reactions?.likes ?? 0) + (a.reactions?.hearts ?? 0) + (a.reactions?.stars ?? 0))
        default:
          return 0
      }
    })

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Animated magical background */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-float-bg">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`absolute rounded-full opacity-30 animate-pulse`} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${24 + Math.random() * 32}px`,
            height: `${24 + Math.random() * 32}px`,
            background: 'radial-gradient(circle, #f472b6 0%, #a78bfa 100%)',
            filter: 'blur(2px)',
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}
      </div>

      <AffirmationCard />

      {/* Privacy/Safety Info Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-8 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-200 p-6 flex items-center gap-4 relative z-10"
      >
        <ShieldCheckIcon className="w-10 h-10 text-green-500 flex-shrink-0 animate-pulse" />
        <div>
          <h2 className="text-lg font-bold text-purple-700 mb-1">Privacy & Safety</h2>
          <p className="text-gray-700 text-base">
            Your uploads and stories are <span className="font-semibold text-purple-600">private to your device by default</span>. You can choose to share them anonymously in the future. All content is moderated for safety.
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-4 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by tags, description, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-700 font-medium"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-purple-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none bg-white/90 backdrop-blur-sm text-purple-800 font-semibold"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostReacted">Most Reacted</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-xl border-2 border-purple-300 hover:border-purple-600 focus:outline-none bg-white/90 backdrop-blur-sm flex items-center gap-2 text-purple-800 font-semibold"
            >
              <FunnelIcon className="w-5 h-5 text-purple-500" />
              Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/40 rounded-xl">
                {['all', 'family', 'friends', 'pets', 'nature', 'art', 'other'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as Category)}
                    className={`px-4 py-2 rounded-xl border-2 ${
                      selectedCategory === category
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-purple-200 hover:border-purple-300'
                    } transition-colors`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 rounded-xl border-2 ${
            activeTab === 'gallery'
              ? 'border-purple-500 bg-purple-100 text-purple-700'
              : 'border-purple-200 hover:border-purple-300'
          } transition-colors`}
        >
          Hope Gallery
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          className={`flex-1 py-3 rounded-xl border-2 ${
            activeTab === 'stories'
              ? 'border-pink-500 bg-pink-100 text-pink-700'
              : 'border-pink-200 hover:border-pink-300'
          } transition-colors`}
        >
          Why I Stay
        </button>
      </div>

      {/* AI Assistant Card & Stats */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200 px-5 py-4"
        >
          <FaceSmileIcon className="w-12 h-12 text-purple-400 bg-purple-100 rounded-full p-2 shadow" />
          <div>
            <div className="font-bold text-lg text-purple-800 mb-1">Hope Companion</div>
            <div className="text-purple-700 text-base">{aiMessage}</div>
            <button
              onClick={handleShowPrompt}
              className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition-colors text-sm"
            >
              Need Inspiration?
            </button>
            {showPrompt && (
              <div className="mt-2 text-pink-700 font-medium animate-pulse">{aiMessage}</div>
            )}
          </div>
        </motion.div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-purple-100 text-purple-800 rounded-xl px-4 py-2 font-semibold shadow border border-purple-200">
            <span className="font-bold">Your Stats:</span> {userStats.photos} Photos, {userStats.stories} Stories
          </div>
        </div>
      </div>
      {/* Section Headings & Dividers */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-2 tracking-tight">Hope Gallery & Stories</h1>
        <p className="text-lg text-purple-600 mb-2">Share your moments, memories, and reasons to stay. Your story can inspire others and yourself.</p>
        <hr className="border-t-2 border-purple-200 my-4" />
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 relative overflow-hidden z-10"
          >
            <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
            <h2 className="text-xl font-bold text-purple-700 mb-2 z-10 relative">Hope Gallery</h2>
            
            {/* Upload Form */}
            <div className="mb-6 z-10 relative">
              <h3 className="text-xl font-bold text-purple-700 mb-2">Step 1: Upload a Photo</h3>
              <label className="block text-purple-800 font-bold mb-2">Upload a photo of someone or something you love:</label>
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="hope-photo-upload" className="cursor-pointer px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-colors border-2 border-purple-300 focus-within:ring-2 focus-within:ring-purple-500">
                  Choose File
                  <input
                    id="hope-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-700 truncate">
                  {fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]?.name ? fileInputRef.current.files[0].name : 'No file chosen'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2 mt-6">Step 2: Add Details</h3>
              <div className="mb-4">
                <label className="block text-purple-800 font-bold mb-2">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description... (e.g. Why is this special to you?)"
                  className="w-full p-3 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none bg-white/80 backdrop-blur-md min-h-[80px] text-base text-purple-900 placeholder-gray-600 shadow-inner transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-purple-800 font-bold mb-2">Tags:</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag... (e.g. family, hope, summer)"
                    className="flex-1 p-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none bg-white/80 backdrop-blur-md text-base text-purple-900 placeholder-gray-600 shadow-inner transition-all"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-colors border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 flex items-center gap-2 border border-purple-300 shadow-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900 focus:outline-none"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <input 
                  type="checkbox" 
                  id="photoIsPrivate" 
                  checked={isPrivate} 
                  onChange={() => setIsPrivate(!isPrivate)} 
                  className="rounded border-purple-300 text-purple-700 focus:ring-purple-600"
                />
                <label htmlFor="photoIsPrivate">Keep this photo private (only visible to you)</label>
              </div>
            </div>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-10 relative">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="rounded-xl shadow-lg w-full aspect-square object-cover border-2 border-purple-200 group-hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setSelectedItem(photo)}
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        className="bg-white/80 rounded-full p-1 shadow hover:bg-pink-100 transition-colors flex items-center gap-1"
                        onClick={() => handleReaction('photo', photo.id, 'likes')}
                        title="Like"
                        type="button"
                      >
                        <HeartIcon className="w-5 h-5 text-pink-500" />
                        <span className="text-xs text-pink-600 font-bold">{photo.reactions?.likes}</span>
                      </button>
                      <button
                        className="bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition-colors"
                        onClick={() => {
                          setSelectedItem(photo)
                          setShowReportModal(true)
                        }}
                        title="Report"
                        type="button"
                      >
                        <FlagIcon className="w-4 h-4 text-red-400" />
                      </button>
                      <button
                        className="bg-white/80 rounded-full p-1 shadow hover:bg-blue-100 transition-colors"
                        onClick={() => togglePrivacy('photo', photo.id)}
                        title={photo.isPrivate ? "Make Public" : "Make Private"}
                        type="button"
                      >
                        {photo.isPrivate ? (
                          <LockClosedIcon className="w-4 h-4 text-blue-400" />
                        ) : (
                          <LockOpenIcon className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {photo.isPrivate && (
                    <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1 shadow">
                      <LockClosedIcon className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                  
                  {photo.description && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
                      <p className="text-white text-sm truncate">{photo.description}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="stories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 relative overflow-hidden z-10"
          >
            <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,0,255,0.08) 0%, transparent 70%)'}} />
            <h2 className="text-xl font-bold text-pink-700 mb-2 z-10 relative">Why I Stay</h2>
            
            {/* Story Form */}
            <form onSubmit={handleStorySubmit} className="mb-6 z-10 relative flex flex-col gap-2">
              <h3 className="text-xl font-bold text-pink-700 mb-2">Step 1: Write Your Story</h3>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder="Share your reason for staying... (your story can help others!)"
                className="w-full p-3 rounded-xl border-2 border-pink-300 focus:border-pink-600 focus:outline-none bg-white/90 backdrop-blur-md min-h-[80px] text-gray-900 placeholder-gray-700"
              />
              <h3 className="text-xl font-bold text-pink-700 mb-2 mt-6">Step 2: (Optional) Add a Photo or Tags</h3>
              <input type="file" accept="image/*" onChange={handleStoryPhotoUpload} ref={storyPhotoInputRef} className="mb-2" />
              <div className="mb-4">
                <label className="block text-pink-800 font-bold mb-2">Tags:</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add a tag... (e.g. hope, gratitude, resilience)"
                    className="flex-1 p-2 rounded-xl border-2 border-pink-300 focus:border-pink-600 focus:outline-none bg-white/90 backdrop-blur-md text-base text-pink-900 placeholder-gray-700 shadow-inner transition-all"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:from-pink-700 hover:to-purple-700 transition-colors border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-pink-200 text-pink-800 flex items-center gap-2 border border-pink-300 shadow-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-pink-900 focus:outline-none"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <input 
                  type="checkbox" 
                  id="storyIsPrivate" 
                  checked={isPrivate} 
                  onChange={() => setIsPrivate(!isPrivate)} 
                  className="rounded border-pink-300 text-pink-700 focus:ring-pink-600"
                />
                <label htmlFor="storyIsPrivate">Keep this story private (only visible to you)</label>
              </div>
              <span className="text-xs text-gray-700">Please do not share identifying information. All submissions are reviewed for safety.</span>
              <button type="submit" className="self-end px-8 py-2 rounded-full bg-gradient-to-r from-pink-700 to-purple-700 text-white font-bold shadow-lg hover:opacity-90 transition-opacity animate-glow">Share Hope</button>
            </form>
            
            {/* Stories Grid */}
            <div className="grid gap-4 md:grid-cols-2 z-10 relative">
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 rounded-2xl p-4 shadow-lg border border-pink-100 flex flex-col items-center group relative"
                >
                  {story.photo ? (
                    <img src={story.photo} alt="Why I Stay" className="rounded-xl w-20 h-20 object-cover mb-2" />
                  ) : (
                    <UserCircleIcon className="w-20 h-20 text-purple-200 mb-2" />
                  )}
                  
                  <p className="text-gray-800 italic mb-2">"{story.text}"</p>
                  
                  <span className="text-xs text-gray-500 mb-2">{new Date(story.date).toLocaleDateString()}</span>
                  
                  <div className="flex gap-2">
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-pink-100 transition-colors flex items-center gap-1"
                      onClick={() => handleReaction('story', story.id, 'likes')}
                      title="Like"
                      type="button"
                    >
                      <HeartIcon className="w-5 h-5 text-pink-500" />
                      <span className="text-xs text-pink-600 font-bold">{story.reactions?.likes}</span>
                    </button>
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-pink-100 transition-colors flex items-center gap-1"
                      onClick={() => handleReaction('story', story.id, 'hearts')}
                      title="Heart"
                      type="button"
                    >
                      <SparklesIcon className="w-5 h-5 text-pink-500" />
                      <span className="text-xs text-pink-600 font-bold">{story.reactions?.hearts}</span>
                    </button>
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-pink-100 transition-colors flex items-center gap-1"
                      onClick={() => handleReaction('story', story.id, 'stars')}
                      title="Star"
                      type="button"
                    >
                      <StarIcon className="w-5 h-5 text-pink-500" />
                      <span className="text-xs text-pink-600 font-bold">{story.reactions?.stars}</span>
                    </button>
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition-colors"
                      onClick={() => {
                        setSelectedItem(story)
                        setShowReportModal(true)
                      }}
                      title="Report"
                      type="button"
                    >
                      <FlagIcon className="w-4 h-4 text-red-400" />
                    </button>
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-blue-100 transition-colors"
                      onClick={() => togglePrivacy('story', story.id)}
                      title={story.isPrivate ? "Make Public" : "Make Private"}
                      type="button"
                    >
                      {story.isPrivate ? (
                        <LockClosedIcon className="w-4 h-4 text-blue-400" />
                      ) : (
                        <LockOpenIcon className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                    <button
                      className="bg-white/80 rounded-full p-1 shadow hover:bg-purple-100 transition-colors"
                      onClick={() => {
                        setSelectedItem(story)
                        setShowComments(true)
                      }}
                      title="Comments"
                      type="button"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                  
                  {story.isPrivate && (
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
                      <LockClosedIcon className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Comments Modal */}
        {showComments && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-700">Comments</h3>
                <button
                  onClick={() => {
                    setShowComments(false)
                    setSelectedItem(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white/80 backdrop-blur-sm min-h-[80px]"
                />
                <button
                  onClick={() => handleAddComment(selectedItem.hasOwnProperty('url') ? 'photo' : 'story', selectedItem.id)}
                  className="mt-2 px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Add Comment
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedItem.comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-700">{comment.author}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.date ?? '').toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Report Modal */}
        {showReportModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-700">Report Content</h3>
                <button
                  onClick={() => {
                    setShowReportModal(false)
                    setSelectedItem(null)
                    setReportReason('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Reason for reporting:</label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please explain why you're reporting this content..."
                  className="w-full p-3 rounded-xl border-2 border-red-200 focus:border-red-500 focus:outline-none bg-white/80 backdrop-blur-sm min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowReportModal(false)
                    setSelectedItem(null)
                    setReportReason('')
                  }}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReport(selectedItem.hasOwnProperty('url') ? 'photo' : 'story', selectedItem.id)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-700">Share</h3>
                <button
                  onClick={() => {
                    setShowShareModal(false)
                    setSelectedItem(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  {selectedItem.hasOwnProperty('url') 
                    ? 'Share this photo with others who might need hope.'
                    : 'Share this story with others who might need hope.'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Link copied to clipboard!')
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'STAY - Hope',
                          text: selectedItem.hasOwnProperty('url') 
                            ? 'Check out this photo of hope!'
                            : 'Read this story of hope!',
                          url: window.location.href
                        })
                      } else {
                        toast.error('Sharing is not supported on this device')
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Note: Only public content can be shared. Private content will remain visible only to you.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 