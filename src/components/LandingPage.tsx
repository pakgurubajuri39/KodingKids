import React from 'react';
import { sounds } from '../utils/audio';
import { 
  Sparkles, 
  Play, 
  Trophy, 
  Compass, 
  Award, 
  CheckCircle2, 
  Smile, 
  Zap, 
  Layers, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  MousePointerClick,
  Scroll,
  Keyboard,
  Brain,
  Code
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';

interface LandingPageProps {
  onStartLearning: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onNavigateLevel: (levelId: number) => void;
  onNavigateUnplugged: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onOpenAuth,
  onNavigateLevel,
  onNavigateUnplugged
}) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-sky-50/50 to-amber-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Floating background decorative bubbles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-44 h-44 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-60 h-60 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs sm:text-sm font-extrabold shadow-xs animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Edisi Spesial: Belajar Coding Cilik Interaktif #1 di Indonesia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-heading leading-tight tracking-tight">
                Mulai Petualangan <br />
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  Coding-mu!
                </span> 🚀
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
                Ubah rasa penasaran anak menjadi kecakapan digital masa depan! Melalui visual drag-and-drop, tantangan navigasi scroll, mengetik kode ajaib, hingga merancang game animasi sendiri—semuanya menyenangkan dan ramah anak.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => { sounds.playClick(); onStartLearning(); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-lg shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <Play className="w-5 h-5 fill-white group-hover:animate-pulse" />
                  Mulai Belajar Sekarang
                </button>

                <button
                  onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-3 border-amber-300 text-amber-700 font-black text-lg hover:bg-amber-50 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Daftar Siswa Gratis
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5 Tingkat Kurikulum Terstruktur
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sertifikat Digital Resmi
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lembar Kerja Offline Cetak
                </div>
              </div>

            </div>

            {/* Hero Right Interactive Mascot Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Cute Floating Robot Character Banner */}
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-200 text-center">
                  
                  {/* Glowing halo */}
                  <div className="w-40 h-40 mx-auto rounded-full bg-linear-to-tr from-amber-300 via-orange-300 to-pink-300 flex items-center justify-center shadow-inner relative">
                    <span className="text-7xl animate-float select-none">🤖</span>
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                      Level 5!
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black font-heading text-slate-800">
                    Halo, Sahabat Koding!
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    "Aku Robi! Aku siap menemanimu belajar logika koding langkah demi langkah!"
                  </p>

                  {/* Gamification preview badge */}
                  <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <div className="text-left">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">XP Hadiah Misi</p>
                        <p className="text-xs font-black text-amber-700">+50 s/d +150 XP per Stage</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-xs font-black rounded-lg">
                      Sertifikat 🏅
                    </span>
                  </div>

                  {/* Sample code snippet block */}
                  <div className="mt-3 bg-slate-900 text-left p-3 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-700">
                    <p className="text-slate-400">// Petualangan dimulai:</p>
                    <p><span className="text-purple-400">ROBOT</span>.<span className="text-blue-400">Maju</span>(1);</p>
                    <p><span className="text-purple-400">ROBOT</span>.<span className="text-yellow-400">AmbilKoin</span>();</p>
                    <p><span className="text-pink-400">MENANG</span>! 🎉</p>
                  </div>

                </div>

                {/* Floating mini badges */}
                <div className="absolute -top-4 -left-4 bg-emerald-500 text-white font-black text-xs px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1 animate-pulse">
                  <Zap className="w-3.5 h-3.5" /> Mobile & Tablet Ready!
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-lg flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Pak GuruAI EdTech
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FITUR UNGGULAN: 5 LEVEL PEMBELAJARAN */}
      <section className="py-16 bg-white border-y-2 border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-block px-3.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full mb-3">
              KURIKULUM TERSTRUKTUR & BERTAHAP
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
              5 Tingkat Petualangan Coding Cilik
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
              Setiap level memiliki antarmuka interaktif yang dirancang khusus untuk kemampuan anak, terbagi dalam beberapa sub-tingkat bertahap (Stage 1, 2, dan 3).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Level 1 Card */}
            <div className="group bg-linear-to-b from-amber-50 to-white rounded-3xl p-6 border-3 border-amber-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-xl font-black shadow-md">
                    1
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                    3 Sub-Tingkat
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-amber-600 transition-colors">
                  Level 1: Drag and Drop
                </h3>
                <p className="text-xs font-bold text-amber-600 mt-0.5">Latihan Motorik & Pengenalan Blok</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Menggeser dan meletakkan blok visual dasar untuk menggerakkan karakter. Melatih koordinasi motorik halus pada tablet, ponsel, maupun laptop.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onNavigateLevel(1); }}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Coba Level 1 <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Level 2 Card */}
            <div className="group bg-linear-to-b from-emerald-50 to-white rounded-3xl p-6 border-3 border-emerald-200 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black shadow-md">
                    2
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    3 Sub-Tingkat
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Level 2: Scrolling Navigasi
                </h3>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">Navigasi Menggulir Layar & Labirin</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Latihan menjelajah halaman dengan menggulir (scroll) untuk menemukan petunjuk tersembunyi, menghindari rintangan, dan melewati labirin bertingkat.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onNavigateLevel(2); }}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Coba Level 2 <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Level 3 Card */}
            <div className="group bg-linear-to-b from-blue-50 to-white rounded-3xl p-6 border-3 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-black shadow-md">
                    3
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                    3 Sub-Tingkat
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-blue-600 transition-colors">
                  Level 3: Mengetik Kode Cilik
                </h3>
                <p className="text-xs font-bold text-blue-600 mt-0.5">Keyboard Visual Ceria & Sintaks Awal</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Anak belajar mengetik kata-kata perintah kode sederhana dengan keyboard interaktif warna-warni di layar sentuh atau tombol keyboard fisik.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onNavigateLevel(3); }}
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Coba Level 3 <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Level 4 Card */}
            <div className="group bg-linear-to-b from-purple-50 to-white rounded-3xl p-6 border-3 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-xl font-black shadow-md">
                    4
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black">
                    3 Sub-Tingkat
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-purple-600 transition-colors">
                  Level 4: Computational Thinking
                </h3>
                <p className="text-xs font-bold text-purple-600 mt-0.5">Pola Logika & Pengurutan Langkah</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Teka-teki logika interaktif untuk mengasah pengenalan pola berulang (loop), pengurutan algoritma (sequencing), dan pemecahan masalah secara runtut.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onNavigateLevel(4); }}
                className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Coba Level 4 <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Level 5 Card */}
            <div className="group bg-linear-to-b from-rose-50 to-white rounded-3xl p-6 border-3 border-rose-200 hover:border-rose-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-black shadow-md">
                    5
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black">
                    Sandbox Kreatif
                  </span>
                </div>
                <h3 className="text-xl font-black font-heading text-slate-900 group-hover:text-rose-600 transition-colors">
                  Level 5: Membuat Project Sederhana (Creative Sandbox)
                </h3>
                <p className="text-xs font-bold text-rose-600 mt-0.5">Gabungkan Logika Level 1-4 untuk Menggerakkan Karakter</p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Ruang kreasi bebas di mana anak dapat menyusun perintah gerakan, belokan, suara, dan efek warna untuk menggerakkan sprite robot secara langsung di atas kanvas panggung pertunjukan.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onNavigateLevel(5); }}
                className="mt-6 w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Buka Sandbox Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. GAMIFIKASI & REWARD (XP & SERTIFIKAT DIGITAL) */}
      <section className="py-16 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wide">
                SISTEM MOTIVASI & PENGHARGAAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
                Gamifikasi: Poin XP dan Sertifikat Digital Resmi! 🏆
              </h2>
              <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
                Belajar bukan lagi tugas yang membosankan! Di KodingKids, setiap penyelesaian sub-tingkat memberikan <b>XP (Experience Points)</b>, memicu efek visual perayaan, dan saat menyelesaikan 1 Level penuh anak langsung menerima <b>Sertifikat Digital</b> siap cetak dengan namanya!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-2 text-yellow-300 text-lg font-black font-heading">
                    <Trophy className="w-5 h-5" /> Poin XP Dinamis
                  </div>
                  <p className="text-xs text-amber-100 mt-1">
                    Progress bar level naik bertahap, membuka lencana kehormatan dari "Pemula Cilik" hingga "Master Koding".
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-2 text-yellow-300 text-lg font-black font-heading">
                    <Award className="w-5 h-5" /> Unduh Sertifikat Otomatis
                  </div>
                  <p className="text-xs text-amber-100 mt-1">
                    Sertifikat resmi bertanda tangan Pak GuruAI dalam format PDF & Gambar berkualitas tinggi untuk pajangan kamar atau portofolio.
                  </p>
                </div>
              </div>

            </div>

            {/* Certificate Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-slate-800 rounded-2xl p-5 shadow-2xl border-4 border-yellow-300 transform rotate-1 hover:rotate-0 transition-transform max-w-sm w-full text-center">
                <div className="border-2 border-dashed border-amber-400 p-4 rounded-xl">
                  <span className="text-3xl">🎖️</span>
                  <h4 className="font-heading font-black text-base text-slate-800 mt-1">
                    SERTIFIKAT KELULUSAN
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold">Diberikan kepada Siswa Berprestasi</p>
                  <div className="my-2 py-1 bg-amber-100 rounded-lg text-amber-900 font-extrabold text-sm">
                    ANANDA HEBAT
                  </div>
                  <p className="text-[10px] text-slate-600">
                    Telah menyelesaikan seluruh tantangan Level Pembelajaran Coding Kids.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>ID: KK-CERT-AUTO</span>
                    <span className="text-blue-700 font-heading">Pak GuruAI</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MODE UNPLUGGED (OFFLINE LEARNING) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full mb-3">
              BELAJAR OFFLINE TANPA GADGET
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
              Mode Unplugged: Coding di Meja Bermain ✂️
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
              Istirahatkan mata anak dari layar tanpa menghentikan proses belajar! Unduh materi lembar kerja cetak (Printables) berupa labirin kertas, kartu logika, dan kerajinan kode biner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
                🗺️
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">Labirin Kertas Algoritma</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tantangan mencari rute tercepat dan menuliskan urutan kode panah gerak menggunakan pensil warna.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-4">
                🃏
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">Kartu Perintah Robot Cilik</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Gunting kartu aksi lalu susun di lantai. Jadikan teman atau orang tua sebagai robot yang mengikuti instruksi!
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4">
                📿
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">Gelang Manik Kode Biner</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Terjemahkan nama anak ke dalam angka biner 0 dan 1, lalu rangkai dalam manik-manik warna warni.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => { sounds.playClick(); onNavigateUnplugged(); }}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/25 transition-all inline-flex items-center gap-2"
            >
              <Compass className="w-5 h-5" /> Buka Halaman Unplugged & Unduh PDF
            </button>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONI & MANFAAT CODING UNTUK ANAK */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-block px-3.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-black rounded-full mb-3">
              MENGAPA CODING PENTING?
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
              Investasi Terbaik untuk Pikiran Kreatif Anak
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Bukan hanya tentang mengetik kode di komputer, coding melatih cara berpikir sistematis, ketangguhan menghadapi kesalahan (debugging), dan daya imajinasi tanpa batas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "Anak saya (8 tahun) awalnya gampang menyerah saat belajar. Tapi setelah bermain di KodingKids level Drag and Drop, dia jadi penasaran menyelesaikan setiap stage sendiri!"
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-300 flex items-center justify-center font-black text-amber-900">
                  I
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Ibu Ratna Dewi</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Orang Tua Murid (Bandung)</p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50/70 p-6 rounded-3xl border border-sky-200">
              <div className="flex items-center gap-1 text-sky-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-sky-400 text-sky-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "Sistem persetujuan admin sangat bagus untuk memantau pendaftaran murid di kelas. Mode unplugged-nya juga kami gunakan saat sesi istirahat komputer."
              </p>
              <div className="mt-4 pt-3 border-t border-sky-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-300 flex items-center justify-center font-black text-sky-900">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Pak Hendra, S.Pd</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Guru Komputer SD (Surabaya)</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50/70 p-6 rounded-3xl border border-purple-200">
              <div className="flex items-center gap-1 text-purple-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-purple-400 text-purple-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "Sertifikat digitalnya dicetak dan dibingkai di meja belajarnya. Anak saya sangat bangga memperlihatkan ke kakek-neneknya bahwa dia sudah bisa koding!"
              </p>
              <div className="mt-4 pt-3 border-t border-purple-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-300 flex items-center justify-center font-black text-purple-900">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Bunda Maya</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Orang Tua Murid (Jakarta)</p>
                </div>
              </div>
            </div>

          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-black font-heading mb-3">
              Siap Menjadi Programmer Cilik Hebat?
            </h3>
            <p className="text-amber-100 max-w-xl mx-auto text-sm sm:text-base font-medium mb-6">
              Daftar hari ini, kumpulkan XP, raih sertifikat resmimu, dan buat petualangan belajarmu mengesankan!
            </p>
            <button
              onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
              className="px-8 py-4 rounded-2xl bg-white text-orange-600 font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              Daftar Sekarang Juga
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
