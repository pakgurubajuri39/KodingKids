import React, { useState, useEffect } from 'react';
import { getUsers, approveStudent, rejectStudent, setCurrentUser, isFirebaseLive } from '../services/authStore';
import { StudentUser } from '../types';
import { sounds } from '../utils/audio';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Trophy, 
  Award,
  ExternalLink,
  RefreshCw,
  Filter,
  Database,
  Check,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateStudentView: () => void;
  onBackToHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateStudentView,
  onBackToHome
}) => {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Active'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  const loadData = () => {
    const all = getUsers();
    const list = all.filter(u => u.role === 'student');
    setStudents(list);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('auth_state_changed', handleUpdate);
    return () => window.removeEventListener('auth_state_changed', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApprove = async (id: string, name: string) => {
    sounds.playSuccess();
    setIsProcessingId(id);
    await approveStudent(id);
    loadData();
    setIsProcessingId(null);
    showToast(`✅ Berhasil menyetujui akun siswa: ${name}! Status akun tersimpan aktif di Firebase Firestore.`);
  };

  const handleReject = async (id: string, name: string) => {
    sounds.playWrong();
    setIsProcessingId(id);
    await rejectStudent(id);
    loadData();
    setIsProcessingId(null);
    showToast(`Status akun ${name} diubah menjadi Ditolak di Firestore.`);
  };

  const handleSimulateLoginAsStudent = (student: StudentUser) => {
    sounds.playClick();
    setCurrentUser(student);
    showToast(`Beralih ke sesi siswa: ${student.name}`);
    setTimeout(() => {
      onNavigateStudentView();
    }, 400);
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = filterStatus === 'All' || s.status === filterStatus;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = students.filter(s => s.status === 'Pending').length;
  const activeCount = students.filter(s => s.status === 'Active').length;
  const totalXp = students.reduce((acc, curr) => acc + (curr.xp || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Ribbon with Firebase Status */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-purple-700/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/40 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
              👑
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/40 text-purple-200 text-xs font-bold border border-purple-400/30">
                  Panel Administrator Resmi
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-400/40">
                  <Database className="w-3.5 h-3.5" /> Firebase: kodingkids-c6c58
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading mt-1">
                Dashboard Pembina & Admin (Pak GuruAI)
              </h1>
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                Persetujuan (Approval) pendaftaran murid baru & pemantauan perkembangan koding anak.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => { sounds.playClick(); loadData(); showToast('Data siswa disinkronkan dengan database!'); }}
              className="px-4 py-2 rounded-xl bg-purple-700/60 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-400/30 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sinkron Data
            </button>
            <button
              type="button"
              onClick={() => { 
                sounds.playClick(); 
                if (onBackToHome) onBackToHome(); 
                else onNavigateStudentView(); 
              }}
              aria-label="Tutup Halaman Dashboard Admin"
              title="Tutup Halaman (Kembali ke Beranda)"
              className="w-10 h-10 rounded-xl bg-purple-700/60 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all cursor-pointer border border-purple-400/30 active:scale-95 shadow-xs group"
            >
              <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {notification && (
          <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between text-sm font-bold animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-200 hover:text-white text-xs px-2 py-1">✕</button>
          </div>
        )}

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Siswa Terdaftar</p>
              <h3 className="text-2xl font-black font-heading text-slate-800 mt-1">{students.length} Siswa</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center justify-between bg-amber-50/40">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Menunggu Persetujuan</p>
              <h3 className="text-2xl font-black font-heading text-amber-600 mt-1">{pendingCount} Akun Pending</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm flex items-center justify-between bg-emerald-50/40">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Siswa Aktif Belajar</p>
              <h3 className="text-2xl font-black font-heading text-emerald-600 mt-1">{activeCount} Siswa</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total XP Siswa</p>
              <h3 className="text-2xl font-black font-heading text-orange-600 mt-1">{totalXp.toLocaleString()} XP</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Student Management Table Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          
          {/* Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['All', 'Pending', 'Active'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { sounds.playClick(); setFilterStatus(tab); }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === tab
                        ? 'bg-white text-slate-900 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'All' ? 'Semua Siswa' : tab === 'Pending' ? `Pending (${pendingCount})` : `Aktif (${activeCount})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau username..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

          </div>

          {/* List or Empty State */}
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm">Tidak ada siswa yang cocok dengan filter pencarian.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider">
                    <th className="py-3 px-3">Siswa</th>
                    <th className="py-3 px-3">Usia</th>
                    <th className="py-3 px-3">Status Akun</th>
                    <th className="py-3 px-3">Total XP</th>
                    <th className="py-3 px-3">Misi Selesai</th>
                    <th className="py-3 px-3">Sertifikat</th>
                    <th className="py-3 px-3 text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const completedCount = Object.keys(student.completedStages || {}).length;
                    const certCount = (student.certificates || []).length;
                    const isProcessing = isProcessingId === student.id;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Student Name & Avatar */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl shadow-xs">
                              {student.avatar || '🧒'}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{student.name}</p>
                              <p className="text-slate-400 text-[11px] font-mono">@{student.username} • {student.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Age */}
                        <td className="py-3.5 px-3 font-bold text-slate-600">
                          {student.age} Th
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          {student.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3 h-3 animate-spin" /> Menunggu Persetujuan
                            </span>
                          )}
                          {student.status === 'Active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> Aktif
                            </span>
                          )}
                          {student.status === 'Rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-800 border border-red-300">
                              <XCircle className="w-3 h-3" /> Ditolak
                            </span>
                          )}
                        </td>

                        {/* XP */}
                        <td className="py-3.5 px-3 font-black text-amber-600 text-sm">
                          ★ {student.xp || 0} XP
                        </td>

                        {/* Completed Stages */}
                        <td className="py-3.5 px-3 font-bold text-slate-600">
                          {completedCount} / 15 Stage
                        </td>

                        {/* Certificates */}
                        <td className="py-3.5 px-3">
                          {certCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-black">
                              <Award className="w-3.5 h-3.5" /> {certCount} Sertifikat
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {student.status === 'Pending' ? (
                              <button
                                onClick={() => handleApprove(student.id, student.name)}
                                disabled={isProcessing}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Setujui (Approve)
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReject(student.id, student.name)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-bold text-xs transition-colors"
                              >
                                Tangguhkan
                              </button>
                            )}

                            {/* View as Student Button */}
                            <button
                              onClick={() => handleSimulateLoginAsStudent(student)}
                              title="Masuk sebagai siswa ini untuk melihat tampilan dasbornya"
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-xs border border-purple-200 transition-all flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Intip Dasbor
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
