import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { awardStageCompletion } from '../../services/authStore';
import { CertificateItem } from '../../types';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Download, 
  Palette, 
  Music, 
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { downloadCertificateAsPdf } from '../../utils/certificate';

interface Level5Props {
  initialStage?: number;
  onBackToDashboard: () => void;
  onRestartAll: () => void;
}

interface SandboxCommand {
  id: string;
  type: 'MOVE' | 'TURN' | 'JUMP' | 'COLOR' | 'SOUND';
  label: string;
  icon: string;
  value?: string | number;
}

const COMMAND_PALETTE: Omit<SandboxCommand, 'id'>[] = [
  { type: 'MOVE', label: 'Maju 40 Langkah', icon: '🏃‍♂️', value: 40 },
  { type: 'TURN', label: 'Putar Kanan 90°', icon: '↪️', value: 90 },
  { type: 'JUMP', label: 'Lompat Gembira', icon: '🦘', value: 20 },
  { type: 'COLOR', label: 'Ubah Warna Lampu', icon: '🎨', value: '#EC4899' },
  { type: 'SOUND', label: 'Bunyikan Nada Riang', icon: '🎵', value: 'CHIME' },
];

export const Level5Sandbox: React.FC<Level5Props> = ({
  initialStage = 1,
  onBackToDashboard,
  onRestartAll,
}) => {
  const [stage, setStage] = useState(initialStage);
  const [program, setProgram] = useState<SandboxCommand[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Robot state on canvas
  const [robotState, setRobotState] = useState({
    x: 250,
    y: 200,
    angle: 0,
    scale: 1,
    color: '#3B82F6',
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isStageCleared, setIsStageCleared] = useState(false);
  const [newCert, setNewCert] = useState<CertificateItem | null>(null);

  // Reset Stage & Canvas
  const resetCanvas = () => {
    setRobotState({
      x: 250,
      y: 200,
      angle: 0,
      scale: 1,
      color: '#3B82F6',
    });
    setIsPlaying(false);
    setIsStageCleared(false);
    clearCanvasDrawing();
  };

  const clearCanvasDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Add command to program timeline
  const addCommand = (cmd: Omit<SandboxCommand, 'id'>) => {
    sounds.playClick();
    if (program.length >= 10) {
      sounds.playWrong();
      return;
    }
    const newCmd: SandboxCommand = {
      ...cmd,
      id: `cmd-${Date.now()}-${Math.random()}`,
    };
    setProgram(prev => [...prev, newCmd]);
  };

  const removeCommand = (id: string) => {
    sounds.playClick();
    setProgram(prev => prev.filter(c => c.id !== id));
  };

  // Run Program sequentially
  const runProgram = () => {
    if (program.length === 0) {
      sounds.playWrong();
      return;
    }

    setIsPlaying(true);
    resetCanvas();

    let curX = 250;
    let curY = 200;
    let curAngle = 0;
    let curColor = '#3B82F6';

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    let step = 0;
    const timer = setInterval(async () => {
      if (step >= program.length) {
        clearInterval(timer);
        setIsPlaying(false);

        // Verification logic for stages
        sounds.playSuccess();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setIsStageCleared(true);

        const xpMap: Record<number, number> = { 1: 100, 2: 120, 3: 150 };
        const res = await awardStageCompletion(5, stage, xpMap[stage] || 100);
        if (res.newCert) {
          setNewCert(res.newCert);
        }
        return;
      }

      const cmd = program[step];

      if (cmd.type === 'MOVE') {
        sounds.playClick();
        const rad = (curAngle * Math.PI) / 180;
        const dist = (cmd.value as number) || 40;
        const nextX = Math.max(40, Math.min(460, curX + Math.cos(rad) * dist));
        const nextY = Math.max(40, Math.min(360, curY + Math.sin(rad) * dist));

        // Draw trail line on canvas
        if (ctx) {
          ctx.strokeStyle = curColor;
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }

        curX = nextX;
        curY = nextY;
      } else if (cmd.type === 'TURN') {
        sounds.playClick();
        curAngle = (curAngle + ((cmd.value as number) || 90)) % 360;
      } else if (cmd.type === 'JUMP') {
        sounds.playCoin();
        setRobotState(prev => ({ ...prev, scale: 1.4 }));
        setTimeout(() => {
          setRobotState(prev => ({ ...prev, scale: 1 }));
        }, 300);
      } else if (cmd.type === 'COLOR') {
        sounds.playClick();
        const colors = ['#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6'];
        curColor = colors[Math.floor(Math.random() * colors.length)];
      } else if (cmd.type === 'SOUND') {
        sounds.playSuccess();
      }

      setRobotState({
        x: curX,
        y: curY,
        angle: curAngle,
        scale: 1,
        color: curColor,
      });

      step++;
    }, 500);
  };

  const handleNextStage = () => {
    sounds.playClick();
    if (stage < 3) {
      setStage(stage + 1);
      setProgram([]);
      resetCanvas();
    } else {
      sounds.playSuccess();
      onBackToDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-white to-amber-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative pr-16">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/25 text-xs font-black">
                LEVEL 5 : PROJECT SANDBOX
              </span>
              <span className="text-xs font-bold text-rose-100">
                Puncak Pembelajaran: Merancang Program & Animasi Cilik
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
              {stage === 1 && 'Stage 1: Tarian Si Robot Coding'}
              {stage === 2 && 'Stage 2: Melukis Bentuk Geometri Persegi'}
              {stage === 3 && 'Stage 3: Sandbox Bebas Tanpa Batas'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              Susun blok aksi untuk menggerakkan sprite robot, mengubah warna jejak, melompat, dan menari di panggung pementasan.
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
                    setProgram([]);
                    resetCanvas();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    stage === st
                      ? 'bg-white text-rose-600 shadow-md scale-105'
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
              aria-label="Tutup Halaman Level 5"
              title="Tutup Halaman (Kembali)"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-20 group border border-white/25"
            >
              <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Level 5 Grand Certificate celebration */}
        {newCert && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in">
            <div className="flex items-center gap-4">
              <span className="text-6xl animate-bounce">🏆</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-heading">
                  SELAMAT LUAR BIASA! KAMU LULUS LEVEL 5 (MASTER KODING)!
                </h3>
                <p className="text-xs sm:text-sm text-amber-100">
                  Kamu telah menyelesaikan seluruh 5 Level Kurikulum KodingKids. Sertifikat Kehormatan Tertinggi siap diunduh!
                </p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playSuccess(); downloadCertificateAsPdf(newCert); }}
              className="px-6 py-3 rounded-2xl bg-white text-orange-700 font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-amber-500" /> Unduh Sertifikat Master PDF
            </button>
          </div>
        )}

        {/* Sandbox Canvas & Code Timeline Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Canvas Stage Viewport */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-3 border-rose-200 shadow-md flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" /> Panggung Animasi Robot (Live Canvas)
              </span>
              <button
                onClick={resetCanvas}
                disabled={isPlaying}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Hapus Jejak & Reset
              </button>
            </div>

            {/* Stage Canvas Area */}
            <div className="relative w-full max-w-[500px] h-[380px] bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-inner">
              
              {/* Grid backdrop */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* Drawing Trail Canvas */}
              <canvas
                ref={canvasRef}
                width={500}
                height={380}
                className="absolute inset-0 z-10 pointer-events-none"
              />

              {/* Animated Robot Sprite */}
              <div
                style={{
                  transform: `translate(${robotState.x - 24}px, ${robotState.y - 24}px) rotate(${robotState.angle}deg) scale(${robotState.scale})`,
                  transition: 'transform 0.4s ease-out',
                }}
                className="absolute z-20 w-12 h-12 flex items-center justify-center text-4xl select-none"
              >
                🤖
              </div>

              {/* Halo Glow Under Robot */}
              <div
                style={{
                  transform: `translate(${robotState.x - 20}px, ${robotState.y - 10}px)`,
                  backgroundColor: robotState.color,
                  transition: 'all 0.4s ease-out',
                }}
                className="absolute z-15 w-10 h-10 rounded-full blur-md opacity-60"
              />

            </div>

            {/* Canvas Status footer */}
            <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Posisi Robot: ({Math.round(robotState.x)}, {Math.round(robotState.y)})</span>
              <span className="flex items-center gap-1">
                Arah Hadap: <b>{robotState.angle}°</b>
              </span>
            </div>

          </div>

          {/* Right Programming Timeline */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Timeline slots */}
            <div className="bg-white rounded-3xl p-5 border-3 border-rose-200 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-black text-sm text-slate-800">
                  Program Animasi ({program.length} / 10 Baris)
                </h3>
                <span className="text-xs font-black text-rose-600">
                  +120 XP
                </span>
              </div>

              {/* Sequence list */}
              <div className="min-h-[170px] max-h-[220px] overflow-y-auto bg-slate-50 rounded-2xl p-3 border-2 border-dashed border-slate-200 space-y-2">
                {program.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-slate-400 text-center px-4">
                    <Sparkles className="w-8 h-8 text-rose-300 mb-1 animate-pulse" />
                    <p className="text-xs font-bold">Program Masih Kosong</p>
                    <p className="text-[10px] text-slate-400">Tambahkan blok aksi di bawah untuk mulai menganimasikan robot!</p>
                  </div>
                ) : (
                  program.map((cmd, idx) => (
                    <div
                      key={cmd.id}
                      className="p-2.5 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-base">{cmd.icon}</span>
                        <span className="text-xs font-black">{cmd.label}</span>
                      </div>
                      <button
                        onClick={() => removeCommand(cmd.id)}
                        disabled={isPlaying}
                        className="text-white/80 hover:text-white text-xs px-2 py-0.5 hover:bg-black/10 rounded-md"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Run Action */}
              <div className="mt-4">
                <button
                  onClick={runProgram}
                  disabled={isPlaying || program.length === 0}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {isPlaying ? 'Memutar Animasi...' : 'JALANKAN ANIMASI ROBOT 🚀'}
                </button>
              </div>

            </div>

            {/* Block Palette */}
            <div className="bg-white rounded-3xl p-5 border-3 border-rose-200 shadow-md">
              <h4 className="font-heading font-black text-xs text-slate-500 uppercase tracking-wider mb-3">
                Blok Aksi Tersedia (Ketuk untuk Menambahkan)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {COMMAND_PALETTE.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => addCommand(cmd)}
                    disabled={isPlaying}
                    className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-black text-xs flex items-center gap-2 text-left hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="text-xl">{cmd.icon}</span>
                    <span className="leading-tight">{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Stage Clear Banner */}
        {isStageCleared && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-center text-white animate-in zoom-in">
            <h3 className="text-lg font-black font-heading">
              🎉 PROJECT TERCIPTA DENGAN SUKSES!
            </h3>
            <button
              onClick={handleNextStage}
              className="mt-3 px-8 py-3 bg-white text-emerald-800 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              {stage < 3 ? `Lanjut ke Stage ${stage + 1} 🌟` : 'Kembali ke Dasbor Siswa 🏆'}
            </button>
          </div>
        )}

        {/* Back and Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => { sounds.playClick(); onBackToDashboard(); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            ← Kembali ke Dasbor Siswa
          </button>

          <button
            onClick={() => { sounds.playClick(); onRestartAll(); }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800"
          >
            Ulangi Dari Level 1 🔄
          </button>
        </div>

      </div>
    </div>
  );
};
