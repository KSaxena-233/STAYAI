import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type JournalEntry = {
  id: string;
  user_id: string;
  date: string;
  content: string;
  prompt?: string;
  mood?: number;
  tags?: string[];
  aiInsights?: string;
  wordCount?: number;
  sentiment?: number;
  stressors?: string[];
  positives?: string[];
  personality?: string[];
  aiCategory?: string;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  file_url?: string;
  file_type?: string;
};

export type HopePhoto = {
  id: string;
  user_id: string;
  url: string;
  caption?: string;
  created_at: string;
};

export type WhyIStayStory = {
  id: string;
  user_id: string;
  content: string;
  photo_url?: string;
  created_at: string;
};

// Helper functions for data persistence
export async function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select();
  
  if (error) throw error;
  return { data: data ? data[0] : null, error: null };
}

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
}

export async function saveChatMessage(message: Omit<ChatMessage, 'id'>) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getChatMessages(userId: string, days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', cutoffDate.toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data;
}

export async function saveHopePhoto(photo: Omit<HopePhoto, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('hope_photos')
    .insert([photo])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getHopePhotos(userId: string) {
  const { data, error } = await supabase
    .from('hope_photos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveWhyIStayStory(story: Omit<WhyIStayStory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('why_i_stay_stories')
    .insert([story])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getWhyIStayStories(userId: string) {
  const { data, error } = await supabase
    .from('why_i_stay_stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
} 