import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { awardStageCompletion } from '../../services/authStore';
import { CertificateItem } from '../../types';
import { 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ArrowDown, 
  ArrowUp,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
import { downloadCertificateAsPdf } from '../../utils/certificate';

interface Level2Props {
  initialStage?: number;
  onBackToDashboard: () => void;
  onNextLevel: () => void;
}

interface SecretItem {
  id: number;
  title: string;
  icon: string;
  scrollTargetPercent: number; // 0 - 100
  collected: boolean;
  codeWord: string;
}

export const Level2Scrolling: React.FC<Level2Props> = ({
  initialStage = 1,
  onBackToDashboard,
  onNextLevel,
}) => {
  const [stage, setStage] = useState(initialStage);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [collectedItems, setCollectedItems] = useState<number[]>([]);
  const [isStageCleared, setIsStageCleared] = useState(false);
  const [newCert, setNewCert] = useState<CertificateItem | null>(null);

  const STAGE_CONFIGS: Record<number, {
    title: string;
    subtitle: string;
    desc: string;
    xp: number;
    bgTheme: string;
    items: SecretItem[];
  }> = {
    1: {
      title: 'Stage 1: Menyelam ke Palung Data Laut',
      subtitle: 'Scroll ke Bawah Mengumpulkan 3 Mutiara Kode',
      desc: 'Gulir layar ke bawah secara perlahan untuk menemukan 3 Mutiara Kode yang tersembunyi di kedalaman samudra!',
      xp: 60,
      bgTheme: 'from-sky-900 via-blue-950 to-indigo-950',
      items: [
        { id: 1, title: 'Mutiara Variabel', icon: '🔮', scrollTargetPercent: 25, collected: false, codeWord: 'LET' },
        { id: 2, title: 'Mutiara Fungsi', icon: '💎', scrollTargetPercent: 55, collected: false, codeWord: 'EXEC' },
        { id: 3, title: 'Mutiara Logika', icon: '⭐', scrollTargetPercent: 88, collected: false, codeWord: 'TRUE' },
      ],
    },
    2: {
      title: 'Stage 2: Ekspedisi Labirin Menara Vertikal',
      subtitle: 'Navigasi Naik & Turun Menemukan Kunci',
      desc: 'Gulir layar menara setinggi 100 meter. Temukan 3 Kristal Teleportasi yang ada di lantai 30m, 60m, dan 90m!',
      xp: 80,
      bgTheme: 'from-emerald-950 via-teal-900 to-slate-900',
      items: [
        { id: 1, title: 'Kristal Hijau', icon: '🟢', scrollTargetPercent: 30, collected: false, codeWord: 'START' },
        { id: 2, title: 'Kristal Kuning', icon: '🟡', scrollTargetPercent: 62, collected: false, codeWord: 'LOOP' },
        { id: 3, title: 'Kristal Ungu', icon: '🟣', scrollTargetPercent: 92, collected: false, codeWord: 'FINISH' },
      ],
    },
    3: {
      title: 'Stage 3: Pemburu Kode Rahasia Gulir Cepat',
      subtitle: 'Sinkronisasi Scroll di Koordinat Presisi',
      desc: 'Gulir layar dan berhenti di koordinat zona hijau untuk mengekstrak fragmen kode sandi!',
      xp: 110,
      bgTheme: 'from-purple-950 via-slate-900 to-slate-950',
      items: [
        { id: 1, title: 'Sandi Biner A', icon: '🧩', scrollTargetPercent: 20, collected: false, codeWord: '101' },
        { id: 2, title: 'Sandi Biner B', icon: '🔐', scrollTargetPercent: 50, collected: false, codeWord: '010' },
        { id: 3, title: 'Sandi Biner C', icon: '🏆', scrollTargetPercent: 85, collected: false, codeWord: '111' },
      ],
    },
  };

  const currentCfg = STAGE_CONFIGS[stage] || STAGE_CONFIGS[1];

  // Handle scroll listener
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const percent = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 0;
    setScrollProgress(percent);

    // Check item pickup range (±6% threshold)
    currentCfg.items.forEach(item => {
      if (!collectedItems.includes(item.id)) {
        if (Math.abs(percent - item.scrollTargetPercent) <= 6) {
          sounds.playCoin();
          setCollectedItems(prev => {
            const next = [...prev, item.id];
            // Check if all 3 collected
            if (next.length === currentCfg.items.length && !isStageCleared) {
              sounds.playSuccess();
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
              setIsStageCleared(true);
              awardStageCompletion(2, stage, currentCfg.xp).then(result => {
                if (result.newCert) {
                  setNewCert(result.newCert);
                }
              });
            }
            return next;
          });
        }
      }
    });
  };

  const resetStage = () => {
    setCollectedItems([]);
    setIsStageCleared(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleNextStage = () => {
    sounds.playClick();
    if (stage < 3) {
      setStage(stage + 1);
      setCollectedItems([]);
      setIsStageCleared(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } else {
      onNextLevel();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-emerald-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative pr-16">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/25 text-xs font-black">
                LEVEL 2 : SCROLLING NAVIGASI
              </span>
              <span className="text-xs font-bold text-emerald-100">
                Eksplorasi Menggulir Layar & Navigasi Labirin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
              {currentCfg.title}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              {currentCfg.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/20 p-1.5 rounded-2xl gap-1 self-start sm:self-auto">
              {[1, 2, 3].map(st => (
                <button
                  key={st}
                  onClick={() => {
                    sounds.playClick();
                    setStage(st);
                    setCollectedItems([]);
                    setIsStageCleared(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    stage === st
                      ? 'bg-white text-teal-800 shadow-md scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Stage {st}
                </button>
              ))}
            </div>

            {/* Tanda Silang (X) untuk Menutup Halaman Level */}
            <button
              type="button"
              onClick={() => { sounds.playClick(); onBackToDashboard(); }}
              aria-label="Tutup Halaman Level 2"
              title="Tutup Halaman (Kembali)"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-20 group border border-white/25"
            >
              <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Certificate Alert */}
        {newCert && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🏅</span>
              <div>
                <h3 className="text-xl font-black font-heading">SELAMAT! SERTIFIKAT LEVEL 2 DIRAIH!</h3>
                <p className="text-xs text-emerald-100">Kamu telah menguasai navigasi scrolling layar seutuhnya.</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playSuccess(); downloadCertificateAsPdf(newCert); }}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" /> Unduh Sertifikat PDF
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Scrollable Maze Viewport Container */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 border-4 border-emerald-300 shadow-xl flex flex-col relative overflow-hidden">
            
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-white text-xs px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="font-mono ml-2 text-emerald-400 font-bold">Kedalaman Scroll: {scrollProgress}%</span>
              </div>
              <button
                onClick={resetStage}
                className="hover:text-emerald-400 flex items-center gap-1 text-[11px] font-bold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Scroll
              </button>
            </div>

            {/* Scrollable Inner Canvas (Height ~1800px) */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              tabIndex={0}
              className={`h-[440px] overflow-y-auto rounded-2xl bg-gradient-to-b ${currentCfg.bgTheme} p-6 relative focus:outline-hidden`}
            >
              
              {/* Giant track container */}
              <div className="h-[1800px] relative flex flex-col justify-between py-6">
                
                {/* Start banner */}
                <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <span className="text-3xl">🚀</span>
                  <h4 className="font-heading font-black text-base mt-1">TITIK AWAL (START)</h4>
                  <p className="text-xs text-slate-300 flex items-center justify-center gap-1 mt-1">
                    <ArrowDown className="w-4 h-4 animate-bounce text-emerald-400" /> 
                    Gulir layar ke bawah (Scroll Down) dengan mouse / jari sentuh!
                  </p>
                </div>

                {/* Dynamic Collectible Items placed at their respective scroll % */}
                {currentCfg.items.map(item => {
                  const isTaken = collectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{ top: `${item.scrollTargetPercent}%` }}
                      className={`absolute left-4 right-4 p-4 rounded-3xl border-2 transition-all transform -translate-y-1/2 flex items-center justify-between ${
                        isTaken
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-white/15 backdrop-blur-md border-yellow-300 text-white animate-pulse'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{item.icon}</span>
                        <div>
                          <p className="font-heading font-black text-sm">{item.title}</p>
                          <p className="text-[11px] text-slate-300">
                            Kedalaman: {item.scrollTargetPercent}% • Kode: <span className="font-mono font-bold text-yellow-300">"{item.codeWord}"</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        {isTaken ? (
                          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Terkumpul!
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full animate-bounce">
                            Dekati Disini!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Finish banner */}
                <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <span className="text-4xl">🏁</span>
                  <h4 className="font-heading font-black text-lg mt-1">DASAR LABIRIN (FINISH)</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Pastikan semua 3 kristal sudah terkumpul untuk menyelesaikan misi!
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom scroll helper hint */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> Gunakan wheel mouse atau sentuh layar smartphone/tablet untuk menggulir.
              </span>
              <span className="font-bold text-emerald-400">
                {collectedItems.length} / 3 Misi Terkumpul
              </span>
            </div>

          </div>

          {/* Right Status Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white rounded-3xl p-5 border-3 border-emerald-200 shadow-md">
              <h3 className="font-heading font-black text-base text-slate-800 mb-2">
                Target Misi Scroll ({collectedItems.length} / 3)
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                Setiap item yang berhasil kamu capai dengan menggulir layar akan membuka baris kode:
              </p>

              <div className="space-y-2.5">
                {currentCfg.items.map(item => {
                  const isDone = collectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-black text-slate-800">{item.title}</p>
                          <p className="text-[10px] font-mono text-slate-500">Koordinat: {item.scrollTargetPercent}%</p>
                        </div>
                      </div>

                      <div>
                        {isDone ? (
                          <span className="text-xs font-black text-emerald-600 font-mono">
                            OK [{item.codeWord}]
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">
                            Belum
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress & Next stage action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isStageCleared ? (
                  <button
                    onClick={handleNextStage}
                    className="w-full py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {stage < 3 ? `Lanjut ke Stage ${stage + 1} 🌟` : 'Lanjut ke Level 3 (Mengetik) 🚀'}
                  </button>
                ) : (
                  <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500">
                    Gulir layar ke bawah untuk mencari 3 item di atas!
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Back and Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => { sounds.playClick(); onBackToDashboard(); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            ← Kembali ke Dasbor Siswa
          </button>

          <button
            onClick={() => { sounds.playClick(); onNextLevel(); }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Menuju Level 3: Mengetik Kode Cilik →
          </button>
        </div>

      </div>
    </div>
  );
};
