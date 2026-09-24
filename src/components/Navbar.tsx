import React, { useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from '../services/authStore';
import { StudentUser } from '../types';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, User, ShieldCheck, LogOut, BookOpen, Compass, Trophy } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, levelId?: number) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const [user, setUser] = useState<StudentUser | null>(getCurrentUser());
  const [soundOn, setSoundOn] = useState(sounds.enabled);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const toggleSound = () => {
    sounds.enabled = !soundOn;
    setSoundOn(sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const handleLogout = () => {
    sounds.playClick();
    setCurrentUser(null);
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { sounds.playClick(); onNavigate('home'); }} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-orange-300/40 group-hover:scale-105 transition-transform">
            <span className="text-2xl animate-float">🤖</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-slate-800 tracking-tight font-heading group-hover:text-amber-600 transition-colors">
                KODING<span className="text-amber-500">KIDS</span>
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest -mt-1">Petualangan Belajar Coding Cilik</p>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => { sounds.playClick(); onNavigate('home'); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              currentView === 'home'
                ? 'bg-amber-100 text-amber-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => { sounds.playClick(); onNavigate('curriculum'); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              currentView.startsWith('level') || currentView === 'curriculum'
                ? 'bg-amber-100 text-amber-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            5 Level Coding
          </button>

          <button
            onClick={() => { sounds.playClick(); onNavigate('unplugged'); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              currentView === 'unplugged'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-500" />
            Mode Unplugged
          </button>

          {user && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate(user.role === 'admin' ? 'admin' : 'dashboard');
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                currentView === 'dashboard' || currentView === 'admin'
                  ? 'bg-blue-100 text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-blue-500" />
              {user.role === 'admin' ? 'Dashboard Admin' : 'Dashboard Saya'}
            </button>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-amber-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* User Logged In Display */}
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => {
                  sounds.playClick();
                  onNavigate(user.role === 'admin' ? 'admin' : 'dashboard');
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-lg">
                  {user.avatar || '🧒'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                    {user.name.split(' ')[0]}
                    {user.role === 'admin' && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.2 rounded font-bold">Admin</span>
                    )}
                    {user.role === 'student' && user.status === 'Pending' && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.2 rounded font-bold">Pending</span>
                    )}
                    {user.role === 'student' && user.status === 'Active' && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-bold">Aktif</span>
                    )}
                  </div>
                  {user.role === 'student' && (
                    <div className="text-[11px] font-bold text-amber-600">★ {user.xp || 0} XP</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Keluar Akun"
                className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { sounds.playClick(); onOpenAuth('login'); }}
                className="px-3 sm:px-4 py-2 text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
                className="px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all"
              >
                Daftar Siswa
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
