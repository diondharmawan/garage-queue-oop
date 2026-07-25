'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Key, Lock, AlertCircle, Wrench } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo admin authentication check
    if (username === 'admin' && password === 'admin123') {
      // Set admin session cookie
      document.cookie = `admin_session=authenticated_${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      router.push('/admin');
    } else {
      setError('Username atau password admin salah! (Gunakan: admin / admin123)');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <ShieldCheck className="w-40 h-40 text-amber-400" />
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/30 shadow-lg">
            <Wrench className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Login Admin Bengkel</h2>
          <p className="text-xs text-slate-400 mt-1">Masuk untuk mengelola antrian & pit mekanik</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username Admin</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow-lg hover:opacity-95 transition text-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Masuk ke Dashboard Admin'}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          Demo Admin Credentials: <code className="text-amber-400 font-mono font-bold">admin</code> / <code className="text-amber-400 font-mono font-bold">admin123</code>
        </div>
      </div>
    </div>
  );
}
