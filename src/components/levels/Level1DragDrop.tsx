import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { awardStageCompletion } from '../../services/authStore';
import { CertificateItem } from '../../types';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  ArrowRight, 
  Trophy, 
  Sparkles, 
  Hand, 
  HelpCircle,
  Award,
  Trash2,
  GripVertical,
  MousePointerClick,
  X
} from 'lucide-react';
import { downloadCertificateAsPdf } from '../../utils/certificate';

interface Level1Props {
  initialStage?: number;
  onBackToDashboard: () => void;
  onNextLevel: () => void;
}

export interface BlockDef {
  id: string;
  label: string;
  action: 'MAJU' | 'PUTAR_KANAN' | 'PUTAR_KIRI' | 'LOMPAT';
  icon: string;
  color: string;
  border: string;
  bgLight: string;
}

export const AVAILABLE_BLOCKS: BlockDef[] = [
  { 
    id: 'b-maju', 
    label: 'MAJU 1 LANGKAH', 
    action: 'MAJU', 
    icon: '⬆️', 
    color: 'bg-blue-600 text-white hover:bg-blue-700',
    border: 'border-blue-400',
    bgLight: 'bg-blue-50 text-blue-900 border-blue-200'
  },
  { 
    id: 'b-kanan', 
    label: 'PUTAR KANAN 90°', 
    action: 'PUTAR_KANAN', 
    icon: '↷', 
    color: 'bg-amber-500 text-white hover:bg-amber-600',
    border: 'border-amber-400',
    bgLight: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  { 
    id: 'b-kiri', 
    label: 'PUTAR KIRI 90°', 
    action: 'PUTAR_KIRI', 
    icon: '↶', 
    color: 'bg-purple-600 text-white hover:bg-purple-700',
    border: 'border-purple-400',
    bgLight: 'bg-purple-50 text-purple-900 border-purple-200'
  },
  { 
    id: 'b-lompat', 
    label: 'LOMPAT TINGGI', 
    action: 'LOMPAT', 
    icon: '🦘', 
    color: 'bg-emerald-600 text-white hover:bg-emerald-700',
    border: 'border-emerald-400',
    bgLight: 'bg-emerald-50 text-emerald-900 border-emerald-200'
  },
];

interface StageConfig {
  title: string;
  desc: string;
  hint: string;
  start: { x: number; y: number; dir: 'RIGHT' | 'DOWN' | 'UP' | 'LEFT' };
  target: { x: number; y: number };
  targetName: string;
  targetIcon: string;
  obstacles?: { x: number; y: number }[];
  xp: number;
}

const STAGE_CONFIGS: Record<number, StageConfig> = {
  1: {
    title: 'Stage 1: Langkah Pertama Si Robot',
    desc: 'Tarik blok MAJU ke dalam kotak instruksi untuk membawa Robot mengambil Koin Emas!',
    hint: 'Robot menghadap ke Kanan. Pasang 2 blok [MAJU 1 LANGKAH].',
    start: { x: 0, y: 1, dir: 'RIGHT' },
    target: { x: 2, y: 1 },
    targetName: 'Koin Emas',
    targetIcon: '🪙',
    xp: 50,
  },
  2: {
    title: 'Stage 2: Belok Menuju Permata Biru',
    desc: 'Permata berada di bawah kanan. Susun perintah belok kanan dan maju!',
    hint: 'Maju 1 langkah, Putar Kanan 90° menghadap ke bawah, lalu Maju 1 langkah!',
    start: { x: 1, y: 1, dir: 'RIGHT' },
    target: { x: 2, y: 2 },
    targetName: 'Permata Ajaib',
    targetIcon: '💎',
    xp: 75,
  },
  3: {
    title: 'Stage 3: Menembus Labirin Mahkota Raja',
    desc: 'Rute lebih panjang! Kombinasikan langkah maju, putaran arah, dan navigasi presisi.',
    hint: 'Maju 2 langkah ke kanan, Putar Kanan menghadap bawah, lalu Maju 2 langkah!',
    start: { x: 0, y: 0, dir: 'RIGHT' },
    target: { x: 2, y: 2 },
    targetName: 'Mahkota Raja',
    targetIcon: '👑',
    obstacles: [{ x: 1, y: 1 }],
    xp: 100,
  },
};

export const Level1DragDrop: React.FC<Level1Props> = ({
  initialStage = 1,
  onBackToDashboard,
  onNextLevel,
}) => {
  const [stage, setStage] = useState(initialStage);
  const currentCfg = STAGE_CONFIGS[stage] || STAGE_CONFIGS[1];

  const [sequence, setSequence] = useState<BlockDef[]>([]);
  const [robotPos, setRobotPos] = useState({ ...currentCfg.start });
  const [visitedTrail, setVisitedTrail] = useState<{ x: number; y: number }[]>([currentCfg.start]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    '🖐️ Tarik (drag) atau klik blok di bawah, lalu masukkan ke dalam kotak urutan program!'
  );
  const [isStageCleared, setIsStageCleared] = useState(false);
  const [newCert, setNewCert] = useState<CertificateItem | null>(null);

  // Drag-and-drop state
  const [draggedBlock, setDraggedBlock] = useState<BlockDef | null>(null);
  const [draggedSequenceIdx, setDraggedSequenceIdx] = useState<number | null>(null);
  const [isDropZoneOver, setIsDropZoneOver] = useState(false);

  // Reset board
  const resetBoard = () => {
    setSequence([]);
    setRobotPos({ ...currentCfg.start });
    setVisitedTrail([{ x: currentCfg.start.x, y: currentCfg.start.y }]);
    setIsExecuting(false);
    setActiveStepIndex(null);
    setIsStageCleared(false);
    setStatusMessage('Kotak perintah dibersihkan. Susun kembali instruksi kodingmu!');
  };

  const handleStageSelect = (st: number) => {
    sounds.playClick();
    setStage(st);
    const cfg = STAGE_CONFIGS[st];
    setSequence([]);
    setRobotPos({ ...cfg.start });
    setVisitedTrail([{ x: cfg.start.x, y: cfg.start.y }]);
    setIsExecuting(false);
    setActiveStepIndex(null);
    setIsStageCleared(false);
    setStatusMessage(`Memulai ${cfg.title}. Tarik blok perintah ke kotak urutan!`);
  };

  // Add block to sequence
  const addBlockToSequence = (block: BlockDef, targetIdx?: number) => {
    sounds.playClick();
    if (sequence.length >= 8) {
      sounds.playWrong();
      setStatusMessage('⚠️ Maksimal 8 blok perintah dalam satu program!');
      return;
    }

    setSequence(prev => {
      const next = [...prev];
      if (typeof targetIdx === 'number' && targetIdx >= 0 && targetIdx <= next.length) {
        next.splice(targetIdx, 0, block);
      } else {
        next.push(block);
      }
      return next;
    });

    setStatusMessage(`✅ Menambahkan [${block.label}]. Klik "Jalankan Program" untuk menguji!`);
  };

  const handleRemoveBlock = (idx: number) => {
    sounds.playClick();
    setSequence(prev => prev.filter((_, i) => i !== idx));
  };

  // -------------------------------------------------------------
  // HTML5 Drag and Drop Event Handlers
  // -------------------------------------------------------------
  const handlePaletteDragStart = (e: React.DragEvent, block: BlockDef) => {
    sounds.playClick();
    setDraggedBlock(block);
    setDraggedSequenceIdx(null);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleSequenceDragStart = (e: React.DragEvent, index: number) => {
    sounds.playClick();
    setDraggedBlock(null);
    setDraggedSequenceIdx(index);
    e.dataTransfer.setData('text/plain', `seq-${index}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDropZoneOver) setIsDropZoneOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if left the actual container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropZoneOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault();
    setIsDropZoneOver(false);

    if (draggedBlock) {
      // Dropping from palette into sequence
      addBlockToSequence(draggedBlock, dropIndex);
      setDraggedBlock(null);
    } else if (draggedSequenceIdx !== null && typeof dropIndex === 'number') {
      // Reordering within sequence
      if (draggedSequenceIdx === dropIndex) return;
      sounds.playClick();
      setSequence(prev => {
        const next = [...prev];
        const [moved] = next.splice(draggedSequenceIdx, 1);
        next.splice(dropIndex, 0, moved);
        return next;
      });
      setDraggedSequenceIdx(null);
      setStatusMessage('Urutan blok berhasil diubah!');
    }
  };

  // -------------------------------------------------------------
  // Execution Simulation Logic
  // -------------------------------------------------------------
  const handleExecute = async () => {
    if (sequence.length === 0) {
      sounds.playWrong();
      setStatusMessage('Tambahkan minimal 1 blok perintah terlebih dahulu!');
      return;
    }

    setIsExecuting(true);
    setIsStageCleared(false);
    setStatusMessage('🚀 Program dimulai! Robot mengeksekusi instruksi langkah demi langkah...');
    sounds.playClick();

    // Reset robot to starting position before stepping
    let curX = currentCfg.start.x;
    let curY = currentCfg.start.y;
    let curDir = currentCfg.start.dir;
    const trail = [{ x: curX, y: curY }];

    setRobotPos({ x: curX, y: curY, dir: curDir });
    setVisitedTrail(trail);

    let step = 0;
    const interval = setInterval(async () => {
      if (step >= sequence.length) {
        clearInterval(interval);
        setIsExecuting(false);
        setActiveStepIndex(null);

        // Check target arrival
        if (curX === currentCfg.target.x && curY === currentCfg.target.y) {
          sounds.playSuccess();
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setIsStageCleared(true);
          setStatusMessage(`🎉 HEBAT SEKALI! Target ${currentCfg.targetName} berhasil diraih! Kamu mendapat +${currentCfg.xp} XP.`);

          const res = await awardStageCompletion(1, stage, currentCfg.xp);
          if (res.newCert) {
            setNewCert(res.newCert);
          }
        } else {
          sounds.playWrong();
          setStatusMessage('🤔 Robot belum sampai ke target yang dituju! Cek petunjuk (Hint) dan periksa kembali urutan blokmu.');
        }
        return;
      }

      setActiveStepIndex(step);
      const action = sequence[step].action;
      sounds.playClick();

      if (action === 'MAJU') {
        let nextX = curX;
        let nextY = curY;
        if (curDir === 'RIGHT') nextX = Math.min(3, curX + 1);
        else if (curDir === 'DOWN') nextY = Math.min(3, curY + 1);
        else if (curDir === 'LEFT') nextX = Math.max(0, curX - 1);
        else if (curDir === 'UP') nextY = Math.max(0, curY - 1);

        // Check obstacle collision if any
        const hitObstacle = currentCfg.obstacles?.some(obs => obs.x === nextX && obs.y === nextY);
        if (hitObstacle) {
          sounds.playWrong();
          setStatusMessage('💥 Oops! Ada rintangan batu di depan. Robot tidak bisa lewat!');
        } else {
          curX = nextX;
          curY = nextY;
          trail.push({ x: curX, y: curY });
        }
      } else if (action === 'PUTAR_KANAN') {
        const turns: Record<string, 'RIGHT' | 'DOWN' | 'UP' | 'LEFT'> = {
          RIGHT: 'DOWN',
          DOWN: 'LEFT',
          LEFT: 'UP',
          UP: 'RIGHT',
        };
        curDir = turns[curDir];
      } else if (action === 'PUTAR_KIRI') {
        const turns: Record<string, 'RIGHT' | 'DOWN' | 'UP' | 'LEFT'> = {
          RIGHT: 'UP',
          UP: 'LEFT',
          LEFT: 'DOWN',
          DOWN: 'RIGHT',
        };
        curDir = turns[curDir];
      } else if (action === 'LOMPAT') {
        // Jump moves 1 block forward in current direction
        if (curDir === 'RIGHT') curX = Math.min(3, curX + 1);
        else if (curDir === 'DOWN') curY = Math.min(3, curY + 1);
        else if (curDir === 'LEFT') curX = Math.max(0, curX - 1);
        else if (curDir === 'UP') curY = Math.max(0, curY - 1);
        trail.push({ x: curX, y: curY });
      }

      setRobotPos({ x: curX, y: curY, dir: curDir });
      setVisitedTrail([...trail]);
      step++;
    }, 650);
  };

  const handleNextStage = () => {
    sounds.playClick();
    if (stage < 3) {
      handleStageSelect(stage + 1);
    } else {
      onNextLevel();
    }
  };

  const getDirectionArrow = (dir: string) => {
    switch (dir) {
      case 'RIGHT': return '➡️';
      case 'DOWN': return '⬇️';
      case 'LEFT': return '⬅️';
      case 'UP': return '⬆️';
      default: return '➡️';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/60 via-white to-amber-50/60 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Ribbon with Stage Selector */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-amber-300 relative pr-16 md:pr-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wide uppercase">
                LEVEL 1: DRAG & DROP BLOK KODING
              </span>
              <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Motorik & Sequencing Algoritma
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1.5">
              {currentCfg.title}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl leading-relaxed">
              {currentCfg.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Tabs */}
            <div className="flex items-center gap-1.5 bg-black/15 p-1.5 rounded-2xl self-start md:self-auto">
              {[1, 2, 3].map(st => (
                <button
                  key={st}
                  onClick={() => handleStageSelect(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    stage === st
                      ? 'bg-white text-orange-600 shadow-md scale-105'
                      : 'text-white/90 hover:bg-white/15'
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
              aria-label="Tutup Halaman Level 1"
              title="Tutup Halaman (Kembali)"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-20 group border border-white/25"
            >
              <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Certificate Banner (when stage 3 completed) */}
        {newCert && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 border-2 border-emerald-300">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="text-5xl animate-bounce">🏅</span>
              <div>
                <h3 className="text-xl font-black font-heading">SELAMAT! KAMU MENUNTASKAN LEVEL 1!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Sertifikat kelulusan resmi KodingKids telah diterbitkan atas nama <b>{newCert.studentName}</b>.
                </p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playSuccess(); downloadCertificateAsPdf(newCert); }}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" /> Unduh Sertifikat Resmi (PDF)
            </button>
          </div>
        )}

        {/* Workspace: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 4x4 Grid Stage Arena */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Arena Panggung Robot (Grid 4x4)
                </span>
              </div>
              <button
                onClick={resetBoard}
                disabled={isExecuting}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                title="Reset posisi robot dan kosongkan slot"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Panggung
              </button>
            </div>

            {/* 4x4 Interactive Grid */}
            <div className="grid grid-cols-4 gap-2.5 bg-linear-to-b from-amber-50 to-orange-50/50 p-4 rounded-3xl border-2 border-amber-200 aspect-square w-full max-w-[380px] relative shadow-inner">
              {[0, 1, 2, 3].map(y => (
                [0, 1, 2, 3].map(x => {
                  const isRobotHere = robotPos.x === x && robotPos.y === y;
                  const isTargetHere = currentCfg.target.x === x && currentCfg.target.y === y;
                  const isStartHere = currentCfg.start.x === x && currentCfg.start.y === y;
                  const isObstacle = currentCfg.obstacles?.some(obs => obs.x === x && obs.y === y);
                  const isVisited = visitedTrail.some(t => t.x === x && t.y === y) && !isRobotHere;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 select-none ${
                        isTargetHere
                          ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300/60'
                          : isRobotHere
                          ? 'bg-blue-100 border-blue-500 shadow-md scale-105 z-10'
                          : isObstacle
                          ? 'bg-stone-200 border-stone-400'
                          : isStartHere
                          ? 'bg-emerald-50 border-emerald-300'
                          : isVisited
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      {/* Coordinate label */}
                      <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-300 font-bold">
                        {x},{y}
                      </span>

                      {/* Visited Breadcrumbs Trail */}
                      {isVisited && !isTargetHere && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300/80 animate-ping absolute" />
                      )}

                      {/* Start marker text */}
                      {isStartHere && !isRobotHere && (
                        <span className="absolute bottom-1 text-[8px] font-black text-emerald-600 uppercase">
                          START
                        </span>
                      )}

                      {/* Obstacle Rock */}
                      {isObstacle && (
                        <div className="text-2xl" title="Rintangan Batu">
                          🪨
                        </div>
                      )}

                      {/* Target Item */}
                      {isTargetHere && !isRobotHere && (
                        <div className="text-3xl animate-bounce" title={currentCfg.targetName}>
                          {currentCfg.targetIcon}
                        </div>
                      )}

                      {/* Robot Sprite */}
                      {isRobotHere && (
                        <div className="flex flex-col items-center justify-center transition-transform duration-300">
                          <span className="text-3xl filter drop-shadow-md">🤖</span>
                          <span className="text-[10px] font-black bg-blue-600 text-white px-1.5 py-0.2 rounded-full mt-0.5 shadow-xs flex items-center gap-0.5">
                            {getDirectionArrow(robotPos.dir)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>

            {/* Hint & Status message box */}
            <div className="w-full mt-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-bold text-center leading-relaxed">
              {statusMessage}
            </div>

            {/* Stage Hint helper */}
            <div className="w-full mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <b>Petunjuk:</b> {currentCfg.hint}
              </span>
              <span className="font-mono font-bold text-amber-600">
                +{currentCfg.xp} XP
              </span>
            </div>

          </div>

          {/* Right Column: Drag & Drop Timeline & Block Palette */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* 1. Droppable Command Sequence Timeline */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-800">
                    Kotak Urutan Program Koding ({sequence.length} / 8 Blok)
                  </h3>
                </div>
                {sequence.length > 0 && (
                  <button
                    onClick={() => { sounds.playClick(); setSequence([]); }}
                    disabled={isExecuting}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
                  </button>
                )}
              </div>

              {/* Main Drop Target Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, sequence.length)}
                className={`min-h-[190px] rounded-2xl p-3.5 border-2 transition-all space-y-2 ${
                  isDropZoneOver
                    ? 'border-emerald-500 bg-emerald-50/70 ring-4 ring-emerald-200'
                    : sequence.length === 0
                    ? 'border-dashed border-slate-300 bg-slate-50/70'
                    : 'border-amber-200 bg-slate-50/50'
                }`}
              >
                {sequence.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-slate-400 text-center px-4 space-y-1.5">
                    <Hand className={`w-8 h-8 ${isDropZoneOver ? 'text-emerald-600 animate-bounce' : 'text-amber-500'}`} />
                    <p className="text-xs font-black text-slate-700">
                      {isDropZoneOver ? 'Lepaskan blok di sini!' : 'Area Kotak Program Masih Kosong'}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Tarik blok dari pilihan di bawah atau ketuk tombol blok untuk menambahkannya ke dalam antrean program.
                    </p>
                  </div>
                ) : (
                  sequence.map((block, idx) => {
                    const isActive = activeStepIndex === idx;

                    return (
                      <div
                        key={`${block.id}-${idx}`}
                        draggable={!isExecuting}
                        onDragStart={(e) => handleSequenceDragStart(e, idx)}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.stopPropagation(); handleDrop(e, idx); }}
                        className={`p-2.5 rounded-xl ${block.color} flex items-center justify-between shadow-xs transition-all select-none cursor-grab active:cursor-grabbing ${
                          isActive 
                            ? 'ring-4 ring-yellow-400 scale-[1.02] shadow-lg animate-pulse' 
                            : 'hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <GripVertical className="w-4 h-4 text-white/60 shrink-0" />
                          <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-base">{block.icon}</span>
                          <span className="text-xs font-black tracking-wide">{block.label}</span>
                        </div>

                        <button
                          onClick={() => handleRemoveBlock(idx)}
                          disabled={isExecuting}
                          className="w-6 h-6 rounded-lg text-white/80 hover:text-white hover:bg-black/20 text-xs font-black flex items-center justify-center transition-colors"
                          title="Hapus blok ini"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Execution Action Button */}
              <div className="mt-4 pt-2 flex items-center gap-3">
                {!isStageCleared ? (
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting || sequence.length === 0}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isExecuting ? 'Robot Sedang Bergerak...' : 'JALANKAN PROGRAM 🚀'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextStage}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    {stage < 3 ? `Lanjut ke Stage ${stage + 1} 🌟` : 'Lanjut ke Level 2: Scrolling Navigasi 🚀'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* 2. Draggable & Clickable Block Palette */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-black text-xs text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-amber-500" />
                  Koleksi Blok Perintah (Bisa Ditarik / Diklik)
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  Tarik ke kotak atas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_BLOCKS.map(blk => (
                  <div
                    key={blk.id}
                    draggable={!isExecuting}
                    onDragStart={(e) => handlePaletteDragStart(e, blk)}
                    onClick={() => !isExecuting && addBlockToSequence(blk)}
                    className={`p-3 rounded-2xl border-2 ${blk.border} ${blk.color} shadow-xs font-black text-xs cursor-grab active:cursor-grabbing hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group select-none`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{blk.icon}</span>
                      <span className="tracking-tight">{blk.label}</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-lg opacity-80 group-hover:opacity-100">
                      + Tambah
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                💡 <i>Anak dapat menarik (drag & drop) atau cukup mengeklik tombol blok untuk menyusun algoritma!</i>
              </p>
            </div>

          </div>

        </div>

        {/* Footer Navigation Back */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={() => { sounds.playClick(); onBackToDashboard(); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Kembali ke Dasbor Siswa
          </button>

          <button
            onClick={() => { sounds.playClick(); onNextLevel(); }}
            className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors"
          >
            Menuju Level 2: Scrolling Samudra →
          </button>
        </div>

      </div>
    </div>
  );
};
