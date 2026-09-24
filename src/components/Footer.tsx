import React from 'react';
import { Sparkles, Heart, Shield, Award, BookOpen, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                🤖
              </div>
              <span className="text-2xl font-black text-white font-heading tracking-tight">
                KODING<span className="text-amber-400">KIDS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Platform edukasi teknologi interaktif yang dirancang khusus untuk mengasah kemampuan motorik, logika komputasi, dan kreativitas anak sejak dini melalui petualangan gamifikasi yang seru dan aman.
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-400 font-bold">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> 100% Aman untuk Anak</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4" /> Sertifikat Resmi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-3">Jelajahi Belajar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { sounds.playClick(); onNavigate('curriculum'); }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> 5 Level Kurikulum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playClick(); onNavigate('unplugged'); }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> Mode Belajar Offline (Unplugged)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playClick(); onNavigate('dashboard'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Peringkat & Hadiah XP
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playClick(); onNavigate('admin'); }}
                  className="text-slate-400 hover:text-amber-400 text-xs mt-2"
                >
                  Portal Akses Guru & Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Curriculum summary */}
          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-3">Tingkatan Belajar</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="hover:text-amber-300 cursor-pointer" onClick={() => onNavigate('curriculum')}>Level 1: Drag & Drop Blok</p>
              <p className="hover:text-amber-300 cursor-pointer" onClick={() => onNavigate('curriculum')}>Level 2: Scrolling Navigasi</p>
              <p className="hover:text-amber-300 cursor-pointer" onClick={() => onNavigate('curriculum')}>Level 3: Mengetik Perintah Cilik</p>
              <p className="hover:text-amber-300 cursor-pointer" onClick={() => onNavigate('curriculum')}>Level 4: Computational Thinking</p>
              <p className="hover:text-amber-300 cursor-pointer" onClick={() => onNavigate('curriculum')}>Level 5: Sandbox Project Mandiri</p>
            </div>
          </div>

        </div>

        {/* Required Bottom Center Copyright */}
        <div className="pt-8 text-center">
          <p className="text-slate-400 text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5">
            Dibuat dengan rasa cinta untuk masa depan anak Indonesia <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          </p>
          <div className="mt-3 py-2 px-6 bg-slate-800/80 rounded-full inline-block border border-slate-700">
            <p className="text-amber-400 font-bold font-heading text-sm tracking-wider">
              @Copyright by. Pak GuruAI
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
