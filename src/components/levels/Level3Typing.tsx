import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { awardStageCompletion } from '../../services/authStore';
import { CertificateItem } from '../../types';
import { 
  Keyboard as KeyboardIcon, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  CornerDownLeft, 
  Delete,
  Trophy,
  X
} from 'lucide-react';
import { downloadCertificateAsPdf } from '../../utils/certificate';

interface Level3Props {
  initialStage?: number;
  onBackToDashboard: () => void;
  onNextLevel: () => void;
}

interface TypingChallenge {
  id: number;
  targetWord: string;
  explanation: string;
}

export const Level3Typing: React.FC<Level3Props> = ({
  initialStage = 1,
  onBackToDashboard,
  onNextLevel,
}) => {
  const [stage, setStage] = useState(initialStage);
  const [wordIndex, setWordIndex] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [isStageCleared, setIsStageCleared] = useState(false);
  const [newCert, setNewCert] = useState<CertificateItem | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const STAGE_CONFIGS: Record<number, {
    title: string;
    desc: string;
    xp: number;
    challenges: TypingChallenge[];
  }> = {
    1: {
      title: 'Stage 1: Perintah Kata Ajaib',
      desc: 'Ketik kata-kata kode dasar menggunakan keyboard visual di layar atau keyboard fisikmu.',
      xp: 70,
      challenges: [
        { id: 1, targetWord: 'MAJU', explanation: 'Perintah agar robot melangkah ke depan' },
        { id: 2, targetWord: 'PUTAR', explanation: 'Perintah agar robot mengubah arah hadap' },
        { id: 3, targetWord: 'LARI', explanation: 'Perintah gerakan cepat' },
      ],
    },
    2: {
      title: 'Stage 2: Memanggil Fungsi Robot',
      desc: 'Ketik fungsi pemrograman sungguhan lengkap dengan tanda kurung buka dan tutup!',
      xp: 90,
      challenges: [
        { id: 1, targetWord: 'JUMP()', explanation: 'Membuat robot melompati rintangan' },
        { id: 2, targetWord: 'BEEP()', explanation: 'Membunyikan suara alarm lucu robot' },
        { id: 3, targetWord: 'LIGHT("ON")', explanation: 'Menyalakan lampu penerangan robot' },
      ],
    },
    3: {
      title: 'Stage 3: Mantra Logika Algoritma',
      desc: 'Tantangan mengetik baris sintaks logika IF dan loop bertaraf programmer handal!',
      xp: 120,
      challenges: [
        { id: 1, targetWord: 'IF (KOSONG) MAJU()', explanation: 'Jika jalan di depan kosong, maka robot maju' },
        { id: 2, targetWord: 'REPEAT (3) { JUMP(); }', explanation: 'Perulangan melompat sebanyak 3 kali' },
        { id: 3, targetWord: 'WIN = TRUE;', explanation: 'Status misi sukses dimenangkan!' },
      ],
    },
  };

  const currentCfg = STAGE_CONFIGS[stage] || STAGE_CONFIGS[1];
  const currentChallenge = currentCfg.challenges[wordIndex] || currentCfg.challenges[0];
  const targetText = currentChallenge.targetWord;

  // Handle typing input (either virtual or physical)
  const handleKeyPress = (char: string) => {
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 150);

    if (char === 'BACKSPACE') {
      sounds.playClick();
      setInputBuffer(prev => prev.slice(0, -1));
      return;
    }

    if (char === 'CLEAR') {
      sounds.playClick();
      setInputBuffer('');
      return;
    }

    // Check if next char matches target
    const nextIndex = inputBuffer.length;
    if (nextIndex < targetText.length) {
      const expectedChar = targetText[nextIndex];
      // Case-insensitive or sensitive matching
      if (char.toUpperCase() === expectedChar.toUpperCase() || char === expectedChar) {
        sounds.playKey();
        const newBuf = inputBuffer + expectedChar;
        setInputBuffer(newBuf);

        // Check if full target word is typed!
        if (newBuf === targetText) {
          sounds.playCoin();
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

          // Next word or complete stage
          if (wordIndex + 1 < currentCfg.challenges.length) {
            setTimeout(() => {
              setWordIndex(prev => prev + 1);
              setInputBuffer('');
            }, 500);
          } else {
            // Stage completed!
            setTimeout(async () => {
              sounds.playSuccess();
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
              setIsStageCleared(true);
              const res = await awardStageCompletion(3, stage, currentCfg.xp);
              if (res.newCert) {
                setNewCert(res.newCert);
              }
            }, 400);
          }
        }
      } else {
        // Wrong letter typed
        sounds.playWrong();
      }
    }
  };

  // Listen to physical keyboard events as well
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore navigation shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (e.key.length === 1) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inputBuffer, targetText, wordIndex, stage]);

  const handleNextStage = () => {
    sounds.playClick();
    if (stage < 3) {
      setStage(stage + 1);
      setWordIndex(0);
      setInputBuffer('');
      setIsStageCleared(false);
    } else {
      onNextLevel();
    }
  };

  // Virtual Keyboard layout rows
  const KEYBOARD_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '='],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', ';'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '"', "'"],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '/', '+', '-'],
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative pr-16">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/25 text-xs font-black">
                LEVEL 3 : MENGETIK KODE CILIK
              </span>
              <span className="text-xs font-bold text-blue-100">
                Visual Keyboard Ceria & Pengenalan Sintaks
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
              {currentCfg.title}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
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
                    setWordIndex(0);
                    setInputBuffer('');
                    setIsStageCleared(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    stage === st
                      ? 'bg-white text-indigo-700 shadow-md scale-105'
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
              aria-label="Tutup Halaman Level 3"
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
                <h3 className="text-xl font-black font-heading">SELAMAT! SERTIFIKAT LEVEL 3 DIRAIH!</h3>
                <p className="text-xs text-emerald-100">Kamu kini resmi menjadi Pengetik Kode Cilik Tangkas.</p>
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

        {/* Typing Terminal Display */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-blue-400 shadow-2xl text-white">
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs font-mono text-blue-300 ml-2 font-bold">
                Tantangan Kata #{wordIndex + 1} dari {currentCfg.challenges.length}
              </span>
            </div>
            <span className="text-xs font-black text-yellow-300 font-mono">
              +{currentCfg.xp} XP
            </span>
          </div>

          <div className="text-center py-6">
            <p className="text-xs text-blue-300 font-bold mb-2 uppercase tracking-widest">
              Ketik Kode Di Bawah Ini:
            </p>

            {/* Target text with matching highlights */}
            <div className="inline-flex items-center justify-center gap-1 sm:gap-2 flex-wrap py-3 px-6 bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-inner">
              {targetText.split('').map((char, i) => {
                const isTyped = i < inputBuffer.length;
                const isNext = i === inputBuffer.length;

                return (
                  <span
                    key={i}
                    className={`font-mono text-2xl sm:text-4xl font-black px-2 py-1 rounded-xl transition-all ${
                      isTyped
                        ? 'bg-emerald-500 text-white scale-105 shadow-xs'
                        : isNext
                        ? 'bg-blue-600 text-white animate-pulse border-2 border-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {char === ' ' ? '␣' : char}
                  </span>
                );
              })}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mt-4 font-medium italic">
              💡 {currentChallenge.explanation}
            </p>
          </div>

          {/* If Stage Cleared Banner */}
          {isStageCleared && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-600 text-center animate-in zoom-in">
              <h3 className="text-lg font-black font-heading text-white">
                🎉 LUAR BIASA! SEMUA KATA BERHASIL DIKETIK DENGAN SEMPURNA!
              </h3>
              <button
                onClick={handleNextStage}
                className="mt-3 px-8 py-3 bg-white text-emerald-800 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                {stage < 3 ? `Lanjut ke Stage ${stage + 1} 🌟` : 'Lanjut ke Level 4 (Thinking) 🚀'}
              </button>
            </div>
          )}

        </div>

        {/* Child-Friendly Virtual On-Screen Keyboard */}
        <div className="bg-white rounded-3xl p-5 border-3 border-blue-200 shadow-md">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <KeyboardIcon className="w-4 h-4 text-blue-500" /> Virtual Keyboard Cilik (Sentuh Layar atau Ketik di Laptop)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleKeyPress('BACKSPACE')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
              >
                <Delete className="w-3.5 h-3.5" /> Hapus
              </button>
              <button
                onClick={() => handleKeyPress('CLEAR')}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Bersihkan
              </button>
            </div>
          </div>

          {/* Keyboard Keys Layout */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                {row.map(k => {
                  const isCurrent = activeKey?.toUpperCase() === k.toUpperCase();
                  const isNextExpected = targetText[inputBuffer.length]?.toUpperCase() === k.toUpperCase();

                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKeyPress(k)}
                      className={`min-w-[28px] sm:min-w-[42px] h-10 sm:h-12 rounded-xl font-black text-xs sm:text-base transition-all active:scale-90 flex items-center justify-center shadow-xs border-b-3 ${
                        isCurrent
                          ? 'bg-yellow-400 text-slate-950 scale-110 border-yellow-600 shadow-md'
                          : isNextExpected
                          ? 'bg-blue-500 text-white border-blue-700 animate-bounce'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Bottom Special Spacebar Row */}
            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleKeyPress(' ')}
                className={`flex-1 max-w-xs h-10 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center shadow-xs border-b-3 ${
                  targetText[inputBuffer.length] === ' '
                    ? 'bg-blue-500 text-white border-blue-700 animate-bounce'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                SPASI (SPACEBAR)
              </button>
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
            className="text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            Menuju Level 4: Computational Thinking →
          </button>
        </div>

      </div>
    </div>
  );
};
