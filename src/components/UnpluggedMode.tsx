import React, { useState, useEffect } from 'react';
import { UNPLUGGED_ACTIVITIES, UnpluggedItem, generateUnpluggedPdf } from '../utils/unpluggedPdf';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Sparkles, 
  Scissors, 
  Compass, 
  CheckCircle2, 
  Heart,
  Eye,
  FileText,
  Clock,
  BookOpen,
  Award,
  Layers,
  Play,
  RotateCcw,
  Star,
  ChevronRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface UnpluggedProps {
  onBackToHome: () => void;
}

export const UnpluggedMode: React.FC<UnpluggedProps> = ({ onBackToHome }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeModalActivity, setActiveModalActivity] = useState<UnpluggedItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'guide' | 'interactive'>('guide');

  // Interactive state for LKPD 1: Maze
  const [mazePath, setMazePath] = useState<string[]>(['A1']);
  const [mazeCoins, setMazeCoins] = useState<string[]>([]);
  const [mazeStatus, setMazeStatus] = useState<'playing' | 'win' | 'bump'>('playing');

  // Interactive state for LKPD 2: Cards
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [robotActionIndex, setRobotActionIndex] = useState<number | null>(null);

  // Interactive state for LKPD 3: Binary
  const [binaryNameInput, setBinaryNameInput] = useState<string>('BUDI');

  // Interactive state for LKPD 4: Detective
  const [detectiveAnswers, setDetectiveAnswers] = useState<Record<number, string>>({});
  const [detectiveScore, setDetectiveScore] = useState<number | null>(null);

  const handleDownload = (activity: UnpluggedItem) => {
    sounds.playSuccess();
    setDownloadingId(activity.id);
    setTimeout(() => {
      generateUnpluggedPdf(activity);
      setDownloadingId(null);
    }, 450);
  };

  const openActivityModal = (act: UnpluggedItem, defaultTab: 'guide' | 'interactive' = 'guide') => {
    sounds.playClick();
    setActiveModalActivity(act);
    setActiveTab(defaultTab);
    
    // Reset specific simulators
    if (act.id === 'unplugged-1') {
      setMazePath(['A1']);
      setMazeCoins([]);
      setMazeStatus('playing');
    } else if (act.id === 'unplugged-2') {
      setSelectedCards([]);
      setRobotActionIndex(null);
    } else if (act.id === 'unplugged-3') {
      setBinaryNameInput('BUDI');
    } else if (act.id === 'unplugged-4') {
      setDetectiveAnswers({});
      setDetectiveScore(null);
    }
  };

  const filteredActivities = UNPLUGGED_ACTIVITIES.filter(act => {
    if (selectedCategory === 'all') return true;
    return act.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Listen to Escape key to close modal
  useEffect(() => {
    if (!activeModalActivity) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        setActiveModalActivity(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalActivity]);

  // -------------------------------------------------------------
  // LKPD 1: Interactive Maze Logic
  // -------------------------------------------------------------
  const obstacles = ['B3', 'D2', 'E5'];
  const starCoins = ['C4', 'E3'];

  const handleCellClick = (cellCoord: string) => {
    if (mazeStatus === 'win') return;
    sounds.playClick();

    if (obstacles.includes(cellCoord)) {
      sounds.playWrong();
      setMazeStatus('bump');
      setTimeout(() => setMazeStatus('playing'), 900);
      return;
    }

    if (starCoins.includes(cellCoord) && !mazeCoins.includes(cellCoord)) {
      sounds.playCoin();
      setMazeCoins(prev => [...prev, cellCoord]);
    }

    setMazePath(prev => {
      const next = [...prev, cellCoord];
      if (cellCoord === 'F6') {
        sounds.playSuccess();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setMazeStatus('win');
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // LKPD 2: Interactive Cards Logic
  // -------------------------------------------------------------
  const cardPool = [
    { id: 'c1', label: '↑ Maju 1 Langkah', icon: '⬆️' },
    { id: 'c2', label: '↓ Mundur 1 Langkah', icon: '⬇️' },
    { id: 'c3', label: '↶ Belok Kiri 90°', icon: '↺' },
    { id: 'c4', label: '↷ Belok Kanan 90°', icon: '↻' },
    { id: 'c5', label: '⚡ Lompat Rintangan', icon: '🦘' },
    { id: 'c6', label: '★ Ambil Koin Bintang', icon: '⭐' },
    { id: 'c7', label: '🔄 Ulangi 2 Kali', icon: '🔁' },
    { id: 'c8', label: '🛑 Stop & Selesai', icon: '⏹' },
  ];

  const handleAddCard = (label: string) => {
    if (selectedCards.length >= 6) return;
    sounds.playClick();
    setSelectedCards(prev => [...prev, label]);
  };

  const handleRunCards = () => {
    if (selectedCards.length === 0) return;
    sounds.playSuccess();
    setRobotActionIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= selectedCards.length) {
        clearInterval(interval);
        sounds.playSuccess();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setRobotActionIndex(null), 1500);
      } else {
        sounds.playClick();
        setRobotActionIndex(idx);
      }
    }, 600);
  };

  // -------------------------------------------------------------
  // LKPD 3: Binary Convert Helper
  // -------------------------------------------------------------
  const charToBinary = (char: string) => {
    const code = char.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return code.toString(2).padStart(8, '0');
    }
    return '01000001';
  };

  // -------------------------------------------------------------
  // LKPD 4: Detective Check Helper
  // -------------------------------------------------------------
  const handleCheckDetective = () => {
    sounds.playClick();
    let score = 0;
    if (detectiveAnswers[1] === 'Kotak') score++;
    if (detectiveAnswers[2] === '18') score++;
    if (detectiveAnswers[3] === 'Charger') score++;

    setDetectiveScore(score);
    if (score >= 2) {
      sounds.playSuccess();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border-2 border-emerald-400/40">
          {/* Close button to go back to Home */}
          <button
            type="button"
            onClick={() => { sounds.playClick(); onBackToHome(); }}
            aria-label="Tutup Halaman Unplugged"
            title="Tutup Halaman (Kembali ke Beranda)"
            className="absolute top-5 right-5 sm:top-7 sm:right-7 w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-20 group border border-white/25"
          >
            <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-xs">
              <Compass className="w-4 h-4 text-emerald-200" /> PUSAT BELAJAR UNPLUGGED RESMI (LKPD KODINGKIDS)
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight">
              Belajar Koding Nyata Bebas Layar ✂️📄
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Membangun fondasi logika berpikir komputasional (Computational Thinking) anak dengan media cetak, guntingan kertas, pensil warna, dan kolaborasi keluarga. Dilengkapi simulator interaktif dan format PDF cetak A4 2-halaman standar kurikulum.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-emerald-200 pt-1">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> PDF Standar Cetak A4 (2 Halaman Rinci)
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 text-amber-300" /> Rubrik Penilaian Guru & Orang Tua
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" /> Melatih Motorik & Logika Kinetik
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Kategori LKPD:
            </span>
            {[
              { id: 'all', label: 'Semua Lembar Kerja (4)' },
              { id: 'algoritma', label: '1. Algoritma Labirin' },
              { id: 'looping', label: '2. Kartu Gunting Tempel' },
              { id: 'biner', label: '3. Manik Kode Biner' },
              { id: 'thinking', label: '4. Detektif Pola' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { sounds.playClick(); setSelectedCategory(cat.id); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="text-xs font-bold text-slate-400">
            Diterbitkan oleh: <b className="text-slate-700">Pak GuruAI</b>
          </div>
        </div>

        {/* Grid of 4 Unplugged Learning Worksheets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredActivities.map((act) => {
            const isDownloading = downloadingId === act.id;

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black font-mono">
                        {act.docCode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                        {act.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{act.estimatedTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {act.description}
                  </p>

                  {/* Learning Goals (Capaian Pembelajaran) */}
                  <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                    <p className="font-black text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Capaian Kompetensi Belajar:
                    </p>
                    <ul className="space-y-1 text-xs text-emerald-900 font-medium">
                      {act.learningGoals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Age & Materials */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Sasaran Usia:</span>
                      <span className="font-black text-slate-800">{act.ageGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Alat & Bahan:</span>
                      <span className="font-bold text-slate-700 truncate block">{act.materials.slice(0, 2).join(', ')}...</span>
                    </div>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <button
                    onClick={() => handleDownload(act)}
                    disabled={isDownloading}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-xs sm:text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Menyusun PDF A4...' : 'Unduh PDF Lengkap (A4)'}
                  </button>

                  <button
                    onClick={() => openActivityModal(act, 'interactive')}
                    title="Coba Simulasi Langsung di Web"
                    className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Coba Digital</span>
                  </button>

                  <button
                    onClick={() => openActivityModal(act, 'guide')}
                    title="Buka Petunjuk & Rubrik"
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* =========================================================================
            DETAILED WORKSPACE & INTERACTIVE SIMULATOR MODAL
           ========================================================================= */}
        {activeModalActivity && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                sounds.playClick();
                setActiveModalActivity(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-3xl p-5 sm:p-7 max-w-3xl w-full border-4 border-emerald-300 shadow-2xl relative space-y-5 my-6 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Top Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black font-mono">
                      {activeModalActivity.docCode}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {activeModalActivity.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mt-1">
                    {activeModalActivity.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setActiveModalActivity(null); }}
                  aria-label="Tutup Halaman LKPD"
                  title="Tutup Halaman (X)"
                  className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 font-black flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs border border-slate-200 group"
                >
                  <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              {/* Mode Toggle inside Modal: 'guide' vs 'interactive' */}
              <div className="flex rounded-2xl bg-slate-100 p-1.5">
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('guide'); }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'guide'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Rincian Lembar Kerja & Rubrik Guru
                </button>
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('interactive'); }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'interactive'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Simulasi Coba Interaktif di Layar
                </button>
              </div>

              {/* TAB 1: GUIDE, OBJECTIVES & PRINT PREVIEW */}
              {activeTab === 'guide' && (
                <div className="space-y-4 text-xs">
                  {/* Specification pills */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">KELOMPOK USIA:</span>
                      <span className="font-black text-emerald-800">{activeModalActivity.ageGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">ESTIMASI WAKTU:</span>
                      <span className="font-black text-slate-800">{activeModalActivity.estimatedTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">FORMAT FILE:</span>
                      <span className="font-black text-purple-700">PDF A4 (2 Halaman)</span>
                    </div>
                  </div>

                  {/* Learning Goals */}
                  <div className="space-y-1.5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                    <h4 className="font-black text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" /> Capaian Kompetensi Belajar (Learning Objectives):
                    </h4>
                    <ul className="space-y-1 text-emerald-900">
                      {activeModalActivity.learningGoals.map((g, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step by Step instructions */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" /> Petunjuk Pengerjaan Rinci:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                      {activeModalActivity.instructions.map((inst, i) => (
                        <li key={i} className="leading-relaxed">{inst}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Tools & Rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1">
                      <span className="font-black text-amber-900 block uppercase text-[10px]">Alat & Bahan:</span>
                      <p className="text-amber-950">{activeModalActivity.materials.join(', ')}</p>
                    </div>
                    <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200 space-y-1">
                      <span className="font-black text-teal-900 block uppercase text-[10px]">Aturan Main:</span>
                      <p className="text-teal-950">{activeModalActivity.rules.join('. ')}</p>
                    </div>
                  </div>

                  {/* Rubric Preview */}
                  <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-purple-950">
                    <span className="font-black text-purple-900 block uppercase text-[10px]">Rubrik Evaluasi Karakter & Logika:</span>
                    <p>Mencakup penilaian: (1) Pemahaman Algoritma & Urutan Langkah, (2) Ketelitian & Analisis Masalah, (3) Kemandirian & Daya Juang, serta kolom tanda tangan Guru dan Orang Tua.</p>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE MINI SIMULATOR */}
              {activeTab === 'interactive' && (
                <div className="space-y-4">
                  
                  {/* Simulator for LKPD 1: Maze */}
                  {activeModalActivity.id === 'unplugged-1' && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-sm text-slate-800">Simulasi Interaktif: Jelajahi Labirin 6x6</h4>
                          <p className="text-xs text-slate-500">Klik petak untuk menggerakkan Robot dari START [A1] ke FINISH [F6]. Hindari batu dan kumpulkan koin!</p>
                        </div>
                        <button
                          onClick={() => { sounds.playClick(); setMazePath(['A1']); setMazeCoins([]); setMazeStatus('playing'); }}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                      </div>

                      {/* Status alerts */}
                      {mazeStatus === 'bump' && (
                        <div className="p-2.5 rounded-xl bg-red-100 text-red-800 font-bold text-xs text-center animate-bounce">
                          💥 Awas Rintangan! Robot tidak bisa melewati petak itu.
                        </div>
                      )}
                      {mazeStatus === 'win' && (
                        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs text-center border border-emerald-300 flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>HORE! Robot tiba di FINISH dengan {mazePath.length - 1} langkah dan {mazeCoins.length} koin bintang!</span>
                        </div>
                      )}

                      {/* 6x6 Grid Component */}
                      <div className="grid grid-cols-6 gap-1.5 max-w-sm mx-auto p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-inner">
                        {['A', 'B', 'C', 'D', 'E', 'F'].map((row) =>
                          ['1', '2', '3', '4', '5', '6'].map((col) => {
                            const coord = `${row}${col}`;
                            const isStart = coord === 'A1';
                            const isFinish = coord === 'F6';
                            const isObstacle = obstacles.includes(coord);
                            const isCoin = starCoins.includes(coord);
                            const hasCoinCollected = mazeCoins.includes(coord);
                            const isVisited = mazePath.includes(coord);
                            const isCurrent = mazePath[mazePath.length - 1] === coord;

                            let bgClass = 'bg-slate-50 border-slate-200 hover:bg-amber-50';
                            if (isStart) bgClass = 'bg-emerald-100 border-emerald-400 text-emerald-800';
                            else if (isFinish) bgClass = 'bg-amber-100 border-amber-400 text-amber-800';
                            else if (isObstacle) bgClass = 'bg-slate-300 border-slate-400 text-slate-700';
                            else if (isVisited) bgClass = 'bg-amber-100/70 border-amber-300';

                            return (
                              <button
                                key={coord}
                                onClick={() => handleCellClick(coord)}
                                className={`h-11 rounded-xl border-2 font-black text-[11px] flex flex-col items-center justify-center transition-all relative ${bgClass} ${
                                  isCurrent ? 'ring-2 ring-amber-500 scale-105 z-10 shadow-sm' : ''
                                }`}
                              >
                                <span className="text-[9px] text-slate-400 absolute top-0.5 left-1 font-mono">{coord}</span>
                                {isCurrent ? '🤖' : isStart ? 'START' : isFinish ? '⚡' : isObstacle ? '🪨' : isCoin && !hasCoinCollected ? '⭐' : isVisited ? '🐾' : ''}
                              </button>
                            );
                          })
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border">
                        <span>Langkah: <b>{mazePath.length - 1}</b></span>
                        <span>Koin Bintang: <b>{mazeCoins.length} / 2 ⭐</b></span>
                        <span>Posisi Robot: <b>[{mazePath[mazePath.length - 1]}]</b></span>
                      </div>
                    </div>
                  )}

                  {/* Simulator for LKPD 2: Cut & Paste Cards */}
                  {activeModalActivity.id === 'unplugged-2' && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-sm text-slate-800">Simulasi: Susun Kartu Instruksi Robot</h4>
                          <p className="text-xs text-slate-500">Pilih kartu aksi untuk dimasukkan ke dalam papan alur (Maks 6 kartu):</p>
                        </div>
                        <button
                          onClick={() => { sounds.playClick(); setSelectedCards([]); setRobotActionIndex(null); }}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Hapus Alur
                        </button>
                      </div>

                      {/* Card Pool Selection */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {cardPool.map(c => (
                          <button
                            key={c.id}
                            onClick={() => handleAddCard(c.label)}
                            disabled={selectedCards.length >= 6}
                            className="p-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-left transition-all disabled:opacity-50 text-xs font-bold shadow-2xs"
                          >
                            <span className="text-lg block mb-1">{c.icon}</span>
                            <span className="text-slate-800 text-[11px] leading-tight block">{c.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Pasting Slots */}
                      <div className="bg-white p-3.5 rounded-2xl border-2 border-dashed border-emerald-300 space-y-2">
                        <span className="text-[11px] font-black text-slate-600 uppercase">Papan Alur Instruksi (Timeline 6 Slot):</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {[0, 1, 2, 3, 4, 5].map(slotIdx => {
                            const card = selectedCards[slotIdx];
                            const isExecuting = robotActionIndex === slotIdx;

                            return (
                              <div
                                key={slotIdx}
                                className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center p-1 text-center transition-all ${
                                  card
                                    ? isExecuting
                                      ? 'bg-amber-400 text-white border-amber-600 scale-105 shadow-md'
                                      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}
                              >
                                <span className="text-[9px] font-bold opacity-60">Slot #{slotIdx + 1}</span>
                                {card ? (
                                  <span className="text-[10px] font-black leading-tight mt-0.5">{card}</span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">[ Kosong ]</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={handleRunCards}
                        disabled={selectedCards.length === 0 || robotActionIndex !== null}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {robotActionIndex !== null ? 'Robot Sedang Bergerak...' : 'Jalankan Program Robot!'}
                      </button>
                    </div>
                  )}

                  {/* Simulator for LKPD 3: Binary Bracelet */}
                  {activeModalActivity.id === 'unplugged-3' && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div>
                        <h4 className="font-black text-sm text-slate-800">Simulasi: Konverter Nama ke Gelang Biner 8-Bit</h4>
                        <p className="text-xs text-slate-500">Ketik nama panggilanmu untuk melihat bagaimana komputer menyimpan karakter huruf menjadi bit 0 dan 1:</p>
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">Nama Panggilan Siswa (Maks 6 Huruf):</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={binaryNameInput}
                          onChange={e => setBinaryNameInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                          className="w-full px-3 py-2 text-sm border-2 border-slate-300 rounded-xl focus:border-emerald-500 font-mono font-black tracking-widest uppercase outline-hidden"
                          placeholder="BUDI"
                        />
                      </div>

                      {/* Converted Table */}
                      <div className="space-y-2 bg-white p-3.5 rounded-2xl border">
                        <span className="text-[11px] font-black text-slate-600 uppercase">Dekomposisi Biner & Manik Gelang:</span>
                        {binaryNameInput.split('').map((char, ci) => {
                          const bin = charToBinary(char);
                          return (
                            <div key={ci} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                  {char}
                                </span>
                                <span className="font-mono text-xs font-bold text-slate-700">{bin}</span>
                              </div>

                              {/* Beads visualization */}
                              <div className="flex items-center gap-1.5">
                                {bin.split('').map((bit, bi) => (
                                  <div
                                    key={bi}
                                    title={`Bit ${bi + 1}: ${bit} (${bit === '1' ? 'Kuning / ON' : 'Biru / OFF'})`}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black shadow-2xs ${
                                      bit === '1'
                                        ? 'bg-amber-300 border-amber-500 text-amber-900'
                                        : 'bg-blue-500 border-blue-700 text-white'
                                    }`}
                                  >
                                    {bit}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Keterangan Warna Gelang: <b>Biru = Angka 0</b>, <b>Kuning = Angka 1</b>. Total ada 8 manik per 1 huruf (1 Byte).</span>
                      </div>
                    </div>
                  )}

                  {/* Simulator for LKPD 4: Detective Pattern */}
                  {activeModalActivity.id === 'unplugged-4' && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div>
                        <h4 className="font-black text-sm text-slate-800">Simulasi: Uji Detektif Pola & IF-ELSE</h4>
                        <p className="text-xs text-slate-500">Pecahkan 3 studi kasus logika di bawah ini:</p>
                      </div>

                      {/* Question 1 */}
                      <div className="bg-white p-3.5 rounded-2xl border space-y-2 text-xs">
                        <p className="font-black text-slate-800">1. Pola Bentuk: Lingkaran ➔ Segitiga ➔ Kotak ➔ Lingkaran ➔ Segitiga ➔ [ ? ]</p>
                        <div className="flex gap-2">
                          {['Kotak', 'Lingkaran', 'Bintang'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { sounds.playClick(); setDetectiveAnswers(p => ({ ...p, 1: opt })); }}
                              className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${
                                detectiveAnswers[1] === opt ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 2 */}
                      <div className="bg-white p-3.5 rounded-2xl border space-y-2 text-xs">
                        <p className="font-black text-slate-800">2. Deret Angka Lompat: 3 ➔ 6 ➔ 9 ➔ 12 ➔ 15 ➔ [ ? ]</p>
                        <div className="flex gap-2">
                          {['16', '18', '20'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { sounds.playClick(); setDetectiveAnswers(p => ({ ...p, 2: opt })); }}
                              className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${
                                detectiveAnswers[2] === opt ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 3 */}
                      <div className="bg-white p-3.5 rounded-2xl border space-y-2 text-xs">
                        <p className="font-black text-slate-800">3. IF - ELSE: Sisa baterai robot 14%. Aturan: JIKA baterai &lt; 20% MAKA harus...</p>
                        <div className="flex gap-2">
                          {['Charger', 'Terus Menjelajah'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => { sounds.playClick(); setDetectiveAnswers(p => ({ ...p, 3: opt })); }}
                              className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${
                                detectiveAnswers[3] === opt ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {opt === 'Charger' ? '🔌 Cari Charger' : '🚀 Jalan Terus'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {detectiveScore !== null && (
                        <div className={`p-3 rounded-xl font-bold text-xs text-center ${
                          detectiveScore >= 2 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          Skor Detektif Kamu: {detectiveScore} / 3 Jawaban Benar! {detectiveScore === 3 ? '🎉 Hebat sekali!' : 'Ayo coba periksa lagi!'}
                        </div>
                      )}

                      <button
                        onClick={handleCheckDetective}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 transition-colors"
                      >
                        Periksa Jawaban Logika
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Modal Bottom Footer Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => { handleDownload(activeModalActivity); }}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Unduh Dokumen PDF Lengkap Siap Cetak (A4)
                </button>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setActiveModalActivity(null); }}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Tutup Jendela
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Educational Tips for Teachers & Parents */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm text-slate-700 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-base sm:text-lg text-slate-900">
                Panduan Guru & Orang Tua: Pembelajaran Unplugged yang Efektif
              </h4>
              <p className="text-xs text-slate-500 font-bold">
                Mengembangkan cara berpikir komputasi sejak usia dini tanpa rasa cemas terhadap screen time.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Biarkan anak melakukan kesalahan logika (merasakan 'Bug') dan mencari solusi rute alternatif sendiri (Debugging). Ketika anak berhasil memecahkan tantangan tanpa bantuan, berikan apresiasi dan bintang pada kolom rubrik penilaian. Setiap dokumen PDF siap dicetak dalam ukuran kertas standar A4 dengan resolusi tinggi.
          </p>
        </div>

        {/* Back navigation button */}
        <div className="text-center pt-2">
          <button
            onClick={() => { sounds.playClick(); onBackToHome(); }}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
          >
            ← Kembali ke Halaman Utama
          </button>
        </div>

      </div>
    </div>
  );
};
