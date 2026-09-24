import React, { useState, useEffect } from 'react';
import { StudentUser, CertificateItem } from '../types';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { approveStudent } from '../services/authStore';
import { sounds } from '../utils/audio';
import { downloadCertificateAsPdf, downloadCertificateAsPng } from '../utils/certificate';
import { 
  Trophy, 
  Award, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Download, 
  Flame, 
  Star,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Database,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  user: StudentUser;
  onNavigateLevel: (levelId: number, stageId?: number) => void;
  onOpenUnplugged: () => void;
  onBackToHome?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigateLevel,
  onOpenUnplugged,
  onBackToHome
}) => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [isApprovingSelf, setIsApprovingSelf] = useState(false);

  // Close certificate modal on ESC key
  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  // Fast-approval testing helper
  const handleQuickApproveSelf = async () => {
    sounds.playSuccess();
    setIsApprovingSelf(true);
    await approveStudent(user.id);
    setIsApprovingSelf(false);
  };

  // XP & Level calculations
  const currentXp = user.xp || 0;
  // Rank badge based on XP
  let rankTitle = 'Pemula Cilik (Level 1)';
  let nextRankXp = 150;
  let rankIcon = '🌱';
  if (currentXp >= 600) {
    rankTitle = 'Master Koding Cilik (Bintang 5)';
    nextRankXp = 1000;
    rankIcon = '👑';
  } else if (currentXp >= 350) {
    rankTitle = 'Ahli Logika Komputasi';
    nextRankXp = 600;
    rankIcon = '🧙‍♂️';
  } else if (currentXp >= 150) {
    rankTitle = 'Penjelajah Kode Tangkas';
    nextRankXp = 350;
    rankIcon = '🚀';
  }
  const progressPercent = Math.min(100, Math.round((currentXp / nextRankXp) * 100));

  // =========================================================================
  // CASE 1: SISWA BERSTATUS PENDING
  // "Siswa yang berstatus 'Pending' hanya bisa melihat halaman profil/menunggu,
  // tidak bisa mengakses materi."
  // =========================================================================
  if (user.status === 'Pending') {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50/70 to-orange-50/70 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-3 border-amber-300 relative overflow-hidden">
            {onBackToHome && (
              <button
                type="button"
                onClick={() => { sounds.playClick(); onBackToHome(); }}
                aria-label="Tutup Halaman (Kembali)"
                title="Tutup Halaman (Kembali)"
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 z-20 group border border-slate-200"
              >
                <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
              </button>
            )}
            
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl mb-4 shadow-inner animate-pulse">
              {user.avatar || '🤖'}
            </div>

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-2xs">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" /> STATUS: MENUNGGU PERSETUJUAN (PENDING)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800">
              Halo, {user.name}! 🎉
            </h2>

            <p className="text-sm text-slate-600 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              Pendaftaran akunmu telah tersimpan di <b>Cloud Firestore</b>! Saat ini akunmu sedang menunggu konfirmasi persetujuan oleh <b>Pak GuruAI / Administrator</b>.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border-2 border-dashed border-amber-300 text-left space-y-2">
              <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" /> Mengapa Harus Menunggu Persetujuan?
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Untuk memastikan lingkungan belajar koding tetap aman, tertib, dan sesuai kelompok usia anak, setiap akun siswa baru diverifikasi terlebih dahulu oleh guru pembina.
              </p>
            </div>

            {/* Profile details */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <p className="text-slate-400 font-bold">Username Akun:</p>
                <p className="font-mono font-bold text-slate-700">@{user.username}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold">Usia Terdaftar:</p>
                <p className="font-bold text-slate-700">{user.age} Tahun</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold">Akses 5 Level:</p>
                <p className="font-black text-amber-600">Terkunci (Menunggu Approve)</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold">Penyimpanan Database:</p>
                <p className="font-bold text-emerald-700">Cloud Firestore (Real)</p>
              </div>
            </div>

            {/* Teacher Fast Approval Simulator */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-2.5">
                🧪 Uji Coba Cepat Persetujuan Akun:
              </p>
              <button
                onClick={handleQuickApproveSelf}
                disabled={isApprovingSelf}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> 
                {isApprovingSelf ? 'Menyetujui di Firestore...' : 'Setujui Akun Ini Sekarang (Approve)'}
              </button>
            </div>

          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-amber-200 text-xs text-slate-600">
            💡 Sambil menunggu, kamu bisa mencoba mengunduh lembar kerja di{' '}
            <button onClick={onOpenUnplugged} className="font-bold text-emerald-700 hover:underline">
              Mode Belajar Offline (Unplugged)
            </button>!
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: SISWA BERSTATUS ACTIVE
  // =========================================================================
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-white to-amber-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile & XP Gamification Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 border-amber-300">
          {onBackToHome && (
            <button
              type="button"
              onClick={() => { sounds.playClick(); onBackToHome(); }}
              aria-label="Tutup Halaman (Kembali ke Beranda)"
              title="Tutup Halaman (Kembali ke Beranda)"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-2xl bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 z-20 group border border-white/25"
            >
              <X className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          )}

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Student avatar & info */}
            <div className="md:col-span-6 flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-xs border-3 border-white/40 flex items-center justify-center text-5xl shadow-lg shrink-0">
                {user.avatar || '🤖'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/30 text-white text-[11px] font-black tracking-wide uppercase">
                    Status: Aktif Belajar
                  </span>
                  <span className="text-lg">{rankIcon}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {user.name}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-100">
                  {rankTitle} • @{user.username}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-100/90 pt-0.5">
                  <Database className="w-3 h-3 text-emerald-300" />
                  <span>Tersinkron ke Firebase: kodingkids-c6c58</span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar & Trophy */}
            <div className="md:col-span-6 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-pulse" />
                  <span className="font-heading font-black text-sm uppercase text-yellow-100">Poin XP Kamu</span>
                </div>
                <span className="text-xl font-black font-heading text-yellow-200">
                  ★ {currentXp} / {nextRankXp} XP
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-amber-200 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-amber-100 text-right mt-1.5">
                Butuh {Math.max(0, nextRankXp - currentXp)} XP lagi untuk naik gelar berikutnya!
              </p>
            </div>

          </div>

        </div>

        {/* Certificates Ribbon (if earned) */}
        {user.certificates && user.certificates.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
                  🏅
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-slate-800">Koleksi Sertifikat Digital Resmi</h3>
                  <p className="text-xs text-slate-500 font-bold">Hasil ketekunanmu menyelesaikan seluruh tingkatan stage!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.certificates.map(cert => (
                <div 
                  key={cert.id}
                  className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white border-2 border-amber-300 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-700 font-black mb-1">
                      <span>LEVEL {cert.levelNumber}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{cert.certificateCode}</span>
                    </div>
                    <h4 className="font-heading font-black text-slate-800 text-base">{cert.levelTitle}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Diterbitkan: {cert.issueDate}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center gap-2">
                    <button
                      onClick={() => { sounds.playClick(); downloadCertificateAsPdf(cert); }}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh PDF
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); downloadCertificateAsPng(cert); }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      title="Unduh Gambar PNG"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5 Levels Curriculum Map */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black font-heading text-slate-800">
                Peta Petualangan Belajar (5 Level)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Selesaikan setiap Stage untuk mengumpulkan XP dan membuka Sertifikat Kelulusan Resmi!
              </p>
            </div>

            <button
              onClick={() => { sounds.playClick(); onOpenUnplugged(); }}
              className="px-4 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl font-black text-xs transition-colors self-start sm:self-auto border border-emerald-300"
            >
              Belajar Offline (Unplugged) ✂️
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRICULUM_LEVELS.map(lvl => {
              const s1Done = user.completedStages?.[`${lvl.id}-1`];
              const s2Done = user.completedStages?.[`${lvl.id}-2`];
              const s3Done = user.completedStages?.[`${lvl.id}-3`];
              const completedCount = [s1Done, s2Done, s3Done].filter(Boolean).length;
              const allDone = completedCount === 3;
              const cert = user.certificates?.find(c => c.levelNumber === lvl.id);

              return (
                <div 
                  key={lvl.id}
                  className={`bg-white rounded-3xl p-6 border-2 ${lvl.borderColor} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div>
                    {/* Level Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${lvl.color} text-white flex items-center justify-center font-black text-xl shadow-md`}>
                        {lvl.id}
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          allDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {allDone ? 'Level Tuntas! 🎉' : `${completedCount} / 3 Selesai`}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black font-heading text-slate-800">
                      Level {lvl.id}: {lvl.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{lvl.subtitle}</p>

                    {/* Stages List */}
                    <div className="mt-4 space-y-2">
                      {lvl.stages.map(st => {
                        const isDone = user.completedStages?.[`${lvl.id}-${st.id}`];
                        return (
                          <div
                            key={st.id}
                            onClick={() => { sounds.playClick(); onNavigateLevel(lvl.id, st.id); }}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isDone
                                ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border-2 border-slate-300 text-[10px] font-bold flex items-center justify-center text-slate-400">
                                  {st.id}
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-700">
                                Stage {st.id}
                              </span>
                            </div>
                            <span className="text-[11px] font-black text-amber-600">
                              +{st.xpReward} XP
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Level Card Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { sounds.playClick(); onNavigateLevel(lvl.id); }}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs text-white shadow-xs flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r ${lvl.color} hover:scale-[1.01] active:scale-[0.99]`}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      {allDone ? 'Mainkan Ulang' : 'Mulai Belajar'}
                    </button>

                    {allDone && cert && (
                      <button
                        onClick={() => { sounds.playSuccess(); downloadCertificateAsPdf(cert); }}
                        title="Unduh Sertifikat Kelulusan"
                        className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Modal Pratinjau Sertifikat */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              sounds.playClick();
              setSelectedCert(null);
            }
          }}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => { sounds.playClick(); setSelectedCert(null); }}
              aria-label="Tutup Pratinjau Sertifikat (X)"
              title="Tutup Halaman (X)"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm group"
            >
              <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
            
            <div className="text-5xl animate-bounce">🏅</div>
            <h3 className="font-heading font-black text-2xl text-slate-800">
              Sertifikat Kelulusan
            </h3>
            <p className="text-sm font-bold text-amber-600">
              Level {selectedCert.levelNumber}: {selectedCert.levelTitle}
            </p>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-1.5 text-left font-mono">
              <div>Nama Siswa: <b className="font-sans text-slate-900">{selectedCert.studentName}</b></div>
              <div>Kode Sertifikat: <b className="text-amber-800">{selectedCert.certificateCode}</b></div>
              <div>Tanggal Terbit: <b>{selectedCert.issueDate}</b></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { sounds.playClick(); downloadCertificateAsPdf(selectedCert); }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Unduh PDF
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); downloadCertificateAsPng(selectedCert); }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                PNG
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
