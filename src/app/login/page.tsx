import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    localStorage.setItem('stayai_user', JSON.stringify({ email, password, remember }));
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
        {/* Login Card */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Login</h1>
          <div className="mb-6 text-gray-500 text-sm">
            Doesn't have an account yet? <a href="#" className="text-purple-600 font-bold hover:underline">Sign Up</a>
          </div>
          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <span className="mr-2 text-gray-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm8 0a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
                </span>
                <input
                  type="email"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <span className="mr-2 text-gray-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="12" height="8" x="6" y="11" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4" /></svg>
                </span>
                <input
                  type="password"
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                  placeholder="Enter 6 character or more"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" checked={remember} onChange={() => setRemember(!remember)} className="mr-2" />
                <label htmlFor="remember" className="text-xs text-gray-500">Remember me</label>
              </div>
              <a href="#" className="text-xs text-purple-500 hover:underline">Forgot Password?</a>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button type="submit" className="w-full py-3 rounded font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors mb-4">LOGIN</button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-400 text-xs">or login with</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <div className="flex gap-4 mb-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded py-2 hover:bg-gray-100">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              <span className="font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded py-2 hover:bg-gray-100">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-5 h-5" />
              <span className="font-semibold text-gray-700">Facebook</span>
            </button>
          </div>
        </div>
        {/* Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
          <img src="https://www.svgrepo.com/show/331993/working-woman.svg" alt="Login Illustration" className="w-80 h-80 object-contain" />
        </div>
      </div>
    </div>
  );
} 