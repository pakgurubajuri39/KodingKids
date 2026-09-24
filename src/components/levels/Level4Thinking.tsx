import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { awardStageCompletion } from '../../services/authStore';
import { CertificateItem } from '../../types';
import { 
  Brain, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  HelpCircle,
  ArrowRight,
  Split,
  Layers,
  Search,
  X
} from 'lucide-react';
import { downloadCertificateAsPdf } from '../../utils/certificate';

interface Level4Props {
  initialStage?: number;
  onBackToDashboard: () => void;
  onNextLevel: () => void;
}

export const Level4Thinking: React.FC<Level4Props> = ({
  initialStage = 1,
  onBackToDashboard,
  onNextLevel,
}) => {
  const [stage, setStage] = useState(initialStage);
  const [isStageCleared, setIsStageCleared] = useState(false);
  const [feedback, setFeedback] = useState<string>('Pilih jawaban yang paling logis dan teliti!');
  const [newCert, setNewCert] = useState<CertificateItem | null>(null);

  // --- STAGE 1: PATTERN RECOGNITION ---
  const [patternSubQuestion, setPatternSubQuestion] = useState(0);
  const PATTERN_QUESTIONS = [
    {
      sequence: ['🔴', '🟡', '🔴', '🟡', '❓'],
      options: ['🔴', '🟡', '🟢', '🔵'],
      correct: '🔴',
      explanation: 'Pola berulang dua warna selang-seling: Merah, Kuning, Merah, Kuning, maka berikutnya adalah Merah!',
    },
    {
      sequence: ['⭐', '💎', '💎', '⭐', '💎', '❓'],
      options: ['⭐', '💎', '🚀', '🐱'],
      correct: '💎',
      explanation: 'Pola adalah 1 Bintang diikuti 2 Permata (⭐ - 💎 - 💎). Jadi setelah bintang dan permata adalah Permata kedua!',
    },
  ];

  // --- STAGE 2: SEQUENCING ---
  const INITIAL_STEPS = [
    { id: 's-power', text: 'Nyalakan Saklar Tombol Daya', order: 2 },
    { id: 's-charge', text: 'Pasang Kabel Pengisi Baterai', order: 1 },
    { id: 's-walk', text: 'Robot Siap Berjalan Menjelajah', order: 4 },
    { id: 's-code', text: 'Muat Program Perintah ke Memori', order: 3 },
  ];
  const [userStepOrder, setUserStepOrder] = useState(INITIAL_STEPS);

  // --- STAGE 3: CONDITIONAL (IF - ELSE) ---
  const [selectedConditionAnswer, setSelectedConditionAnswer] = useState<string | null>(null);

  const resetStage = () => {
    setIsStageCleared(false);
    setPatternSubQuestion(0);
    setUserStepOrder([...INITIAL_STEPS]);
    setSelectedConditionAnswer(null);
    setFeedback('Pilih jawaban atau susun langkah dengan teliti!');
  };

  const handleClearStage = async (stageId: number, xpVal: number) => {
    sounds.playSuccess();
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    setIsStageCleared(true);
    const res = await awardStageCompletion(4, stageId, xpVal);
    if (res.newCert) {
      setNewCert(res.newCert);
    }
  };

  // Handler for Stage 1: Pattern
  const handleAnswerPattern = (opt: string) => {
    const q = PATTERN_QUESTIONS[patternSubQuestion];
    if (opt === q.correct) {
      sounds.playCoin();
      if (patternSubQuestion + 1 < PATTERN_QUESTIONS.length) {
        setPatternSubQuestion(prev => prev + 1);
        setFeedback('Benar! Sekarang selesaikan teka-teki pola kedua!');
      } else {
        handleClearStage(1, 80);
        setFeedback('Luar biasa! Kamu adalah Detektif Pola sejati!');
      }
    } else {
      sounds.playWrong();
      setFeedback('Kurang tepat, amati kembali rangkaian bentuk yang berulang!');
    }
  };

  // Handler for Stage 2: Move step up/down
  const moveStep = (idx: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newArr = [...userStepOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[idx];
    newArr[idx] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setUserStepOrder(newArr);
  };

  const checkSequencing = () => {
    const isCorrect = userStepOrder.every((step, index) => step.order === index + 1);
    if (isCorrect) {
      handleClearStage(2, 100);
      setFeedback('Hebat! Urutan algoritmamu sangat logis dan terstruktur!');
    } else {
      sounds.playWrong();
      setFeedback('Urutan langkah belum tepat. Pikirkan langkah apa yang harus dilakukan paling awal!');
    }
  };

  // Handler for Stage 3: Conditional logic
  const handleSelectCondition = (ans: string) => {
    setSelectedConditionAnswer(ans);
    if (ans === 'PERAHU') {
      handleClearStage(3, 130);
      setFeedback('Tepat sekali! Karena kondisi cuaca "Banjir/Hujan Deras", robot memilih perahu!');
    } else {
      sounds.playWrong();
      setFeedback('Salah kendaraan! Cek kondisi: "IF JALAN BANJIR, MAKA..."');
    }
  };

  const handleNextStage = () => {
    sounds.playClick();
    if (stage < 3) {
      setStage(stage + 1);
      resetStage();
    } else {
      onNextLevel();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 via-white to-purple-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative pr-16">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/25 text-xs font-black">
                LEVEL 4 : COMPUTATIONAL THINKING
              </span>
              <span className="text-xs font-bold text-purple-100">
                Pola Logika, Pengurutan Langkah & Percabangan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
              {stage === 1 && 'Stage 1: Detektif Pola Berulang (Looping)'}
              {stage === 2 && 'Stage 2: Algoritma Menyiapkan Robot (Sequencing)'}
              {stage === 3 && 'Stage 3: Logika Keputusan Percabangan (IF-ELSE)'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
              Asah kemampuan berpikir analitis dan pemecahan masalah secara terstruktur seperti insinyur teknologi.
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
                    resetStage();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    stage === st
                      ? 'bg-white text-purple-800 shadow-md scale-105'
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
              aria-label="Tutup Halaman Level 4"
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
                <h3 className="text-xl font-black font-heading">SELAMAT! SERTIFIKAT LEVEL 4 DIBERIKAN!</h3>
                <p className="text-xs text-emerald-100">Kamu telah membuktikan kecerdasan logika komputasi anak hebat.</p>
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

        {/* Dynamic Puzzle Arena based on Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-200 shadow-xl space-y-6">
          
          {/* Feedback alert */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-bold text-xs sm:text-sm text-center">
            💡 {feedback}
          </div>

          {/* ============================================================= */}
          {/* STAGE 1: PATTERN RECOGNITION */}
          {/* ============================================================= */}
          {stage === 1 && (
            <div className="space-y-6 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Soal Pola #{patternSubQuestion + 1} dari {PATTERN_QUESTIONS.length}
              </span>

              {/* Visual sequence display */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap py-6 bg-slate-50 rounded-3xl border-2 border-slate-200">
                {PATTERN_QUESTIONS[patternSubQuestion].sequence.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md ${
                      item === '❓'
                        ? 'bg-amber-100 border-3 border-dashed border-amber-400 animate-bounce'
                        : 'bg-white border-2 border-slate-200'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Option choices */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3">
                  Pilih bentuk atau warna yang tepat untuk tanda tanya (❓):
                </p>
                <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                  {PATTERN_QUESTIONS[patternSubQuestion].options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerPattern(opt)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 hover:bg-purple-100 active:scale-95 border-3 border-purple-300 text-3xl sm:text-4xl flex items-center justify-center shadow-md transition-all hover:scale-105"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STAGE 2: SEQUENCING / PENGURUTAN LANGKAH */}
          {/* ============================================================= */}
          {stage === 2 && (
            <div className="space-y-4">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="font-heading font-black text-lg text-slate-800">
                  Susun 4 Langkah Menyiapkan Robot
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan tombol panah ⬆️ dan ⬇️ untuk menggeser kartu langkah sampai tersusun urut dari langkah awal ke akhir!
                </p>
              </div>

              <div className="space-y-2.5 max-w-xl mx-auto">
                {userStepOrder.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-800">
                        {step.text}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => moveStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => moveStep(idx, 'down')}
                        disabled={idx === userStepOrder.length - 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!isStageCleared && (
                <div className="text-center pt-3">
                  <button
                    onClick={checkSequencing}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    Periksa Urutan Algoritma ✨
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* STAGE 3: LOGIKA PERCABANGAN (IF - ELSE) */}
          {/* ============================================================= */}
          {stage === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              <div className="p-5 rounded-3xl bg-slate-900 text-white font-mono text-sm space-y-1.5 border-2 border-purple-400 shadow-inner">
                <p className="text-slate-400">// Algoritma Kondisi Robot Pintar:</p>
                <p><span className="text-purple-400">STATUS_CUACA</span> = <span className="text-yellow-300">"BANJIR_BESAR"</span>;</p>
                <div className="pl-4 border-l-2 border-purple-500 my-2 space-y-1">
                  <p><span className="text-pink-400">IF</span> (STATUS_CUACA == "BANJIR_BESAR") &#123;</p>
                  <p className="pl-4 text-emerald-400">PILIH_KENDARAAN = [ ? ];</p>
                  <p>&#125; <span className="text-pink-400">ELSE</span> &#123;</p>
                  <p className="pl-4 text-blue-400">PILIH_KENDARAAN = "SEPEDA";</p>
                  <p>&#125;</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 mb-4">
                  Berdasarkan kode logika di atas, kendaraan apa yang harus dipilih oleh Robot?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <button
                    onClick={() => handleSelectCondition('PERAHU')}
                    className={`p-5 rounded-2xl border-3 text-left transition-all hover:scale-105 active:scale-95 shadow-md ${
                      selectedConditionAnswer === 'PERAHU'
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-4xl mb-2 block">🛶</span>
                    <h4 className="font-heading font-black text-base text-slate-800">PERAHU KARET AMFIBI</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Cocok untuk kondisi jalur tergenang air banjir.
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectCondition('SEPEDA')}
                    className={`p-5 rounded-2xl border-3 text-left transition-all hover:scale-105 active:scale-95 shadow-md ${
                      selectedConditionAnswer === 'SEPEDA'
                        ? 'bg-red-50 border-red-400'
                        : 'bg-white border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-4xl mb-2 block">🚲</span>
                    <h4 className="font-heading font-black text-base text-slate-800">SEPEDA RODA DUA</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Hanya cocok untuk jalan kering tanpa genangan.
                    </p>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* Success Banner & Next Stage Button */}
          {isStageCleared && (
            <div className="p-4 rounded-2xl bg-emerald-600 text-center text-white animate-in zoom-in">
              <h3 className="text-lg font-black font-heading">
                🎉 HEBAT SEKALI! MISI LOGIKA BERHASIL DISELESAIKAN!
              </h3>
              <button
                onClick={handleNextStage}
                className="mt-3 px-8 py-3 bg-white text-emerald-800 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                {stage < 3 ? `Lanjut ke Stage ${stage + 1} 🌟` : 'Lanjut ke Level 5 (Sandbox Project) 🚀'}
              </button>
            </div>
          )}

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
            className="text-xs font-bold text-purple-700 hover:text-purple-900"
          >
            Menuju Level 5: Project Sandbox Sederhana →
          </button>
        </div>

      </div>
    </div>
  );
};
