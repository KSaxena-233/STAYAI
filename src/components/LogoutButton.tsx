"use client";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }
  return (
    <button
      onClick={handleLogout}
      className="bg-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-pink-600 transition"
    >
      Log Out
    </button>
  );
} 