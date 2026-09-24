import React, { useState, useEffect } from 'react';
import { loginUser, registerStudent } from '../services/authStore';
import { sounds } from '../utils/audio';
import { X, Sparkles, KeyRound, User, Mail, Smile, ShieldAlert, CheckCircle2, Loader2, Send, Play } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (viewToNavigate: string) => void;
}

const AVATAR_OPTIONS = ['🤖', '🐱', '🚀', '🦄', '🦊', '🦁', '👾', '🐼'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(8);
  const [avatar, setAvatar] = useState('🤖');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!username || !password) {
        setErrorMsg('Harap isi username dan password!');
        sounds.playWrong();
        return;
      }
      setIsLoading(true);
      const res = loginUser(username, password);
      setIsLoading(false);

      if (res.success && res.user) {
        sounds.playSuccess();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          onSuccess(res.user?.role === 'admin' ? 'admin' : 'dashboard');
        }, 500);
      } else {
        sounds.playWrong();
        setErrorMsg(res.message);
      }
    } else {
      if (!name || !username || !password) {
        setErrorMsg('Lengkapi nama, username, dan kata sandi!');
        sounds.playWrong();
        return;
      }
      setIsLoading(true);
      const res = await registerStudent(name, username, email, age, avatar);
      setIsLoading(false);

      if (res.success && res.user) {
        sounds.playSuccess();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          onSuccess('dashboard');
        }, 1000);
      } else {
        sounds.playWrong();
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Ribbon (Sticky Top) */}
        <div className="shrink-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 sm:p-5 text-white text-center relative">
          <button
            type="button"
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation();
              sounds.playClick(); 
              onClose(); 
            }}
            aria-label="Tutup Halaman (X)"
            title="Tutup Halaman (X)"
            className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-red-500 hover:text-white flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer shadow-sm z-30"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="text-3xl mb-1 animate-bounce">🎒</div>
          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            {mode === 'login' ? 'Masuk ke KodingKids' : 'Daftar Siswa Cilik Baru'}
          </h3>
          <p className="text-amber-100 text-xs font-semibold mt-0.5">
            {mode === 'login' ? 'Lanjutkan petualangan seru kodingmu!' : 'Tersimpan otomatis di Cloud Firestore'}
          </p>

          {/* Mode Switch Tab */}
          <div className="mt-3 flex rounded-xl bg-white/20 p-1">
            <button
              type="button"
              onClick={() => { sounds.playClick(); setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'login' ? 'bg-white text-amber-700 shadow-xs' : 'text-white hover:bg-white/10'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'register' ? 'bg-white text-amber-700 shadow-xs' : 'text-white hover:bg-white/10'
              }`}
            >
              Daftar Murid Baru
            </button>
          </div>
        </div>

        {/* Form Body (Scrollable Container) */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">

          {errorMsg && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Nama Lengkap Siswa</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-0 outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Usia Anak</label>
                    <input
                      type="number"
                      min={5}
                      max={16}
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-0 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Pilih Avatar</label>
                    <div className="flex gap-1 overflow-x-auto py-1">
                      {AVATAR_OPTIONS.slice(0, 4).map(av => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => { sounds.playClick(); setAvatar(av); }}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border-2 transition-all cursor-pointer ${
                            avatar === av ? 'border-amber-500 bg-amber-100 scale-110' : 'border-slate-200'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Email Orang Tua / Siswa (Opsional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="orangtua@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-0 outline-hidden font-bold"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {mode === 'login' ? 'Username atau Email' : 'Buat Username'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={mode === 'login' ? 'Masukkan username atau email' : 'Contoh: budi_cilik'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-0 outline-hidden font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Kata Sandi (Password)</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Ketik kata sandi"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-0 outline-hidden font-bold"
                />
              </div>
            </div>

            {mode === 'register' && (
              <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed font-semibold">
                ℹ️ <b>Pemberitahuan Sistem:</b> Akun pendaftaran baru tersimpan ke Firestore berstatus <b>"Pending"</b> dan menunggu persetujuan Admin/Pak Guru sebelum bisa membuka materi belajar.
              </p>
            )}

            {/* Tombol Kirim Form / Submit Button (Sticky Bottom) */}
            <div className="sticky bottom-0 bg-white/95 pt-2 pb-1 backdrop-blur-xs border-t border-slate-100 z-10">
              <button
                type="submit"
                disabled={isLoading}
                id="btn-kirim-pendaftaran"
                aria-label={mode === 'login' ? 'Kirim Masuk Akun' : 'Kirim Pendaftaran Murid Baru'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirim Data...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Masuk Sekarang 🚀</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pendaftaran Murid Baru 🚀</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { sounds.playClick(); onClose(); }}
                className="w-full py-1.5 text-center text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <X className="w-3.5 h-3.5" /> Batal & Tutup
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
