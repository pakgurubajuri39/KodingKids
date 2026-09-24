/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { UnpluggedMode } from './components/UnpluggedMode';
import { Level1DragDrop } from './components/levels/Level1DragDrop';
import { Level2Scrolling } from './components/levels/Level2Scrolling';
import { Level3Typing } from './components/levels/Level3Typing';
import { Level4Thinking } from './components/levels/Level4Thinking';
import { Level5Sandbox } from './components/levels/Level5Sandbox';
import { getCurrentUser } from './services/authStore';
import { StudentUser } from './types';
import { CURRICULUM_LEVELS } from './data/curriculum';
import { sounds } from './utils/audio';
import { BookOpen, Trophy, Compass, Sparkles, Lock, ArrowRight, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<StudentUser | null>(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const handleNavigate = (view: string, levelId?: number, stageId?: number) => {
    sounds.playClick();
    if (levelId) {
      setSelectedLevelId(levelId);
      if (stageId) setSelectedStageId(stageId);
      else setSelectedStageId(1);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    sounds.playClick();
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  // Guard for accessing level games:
  // If user is not logged in or is student with "Pending" status, prompt auth or explain
  const handleStartLearning = () => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    if (user.role === 'admin') {
      setCurrentView('admin');
      return;
    }
    if (user.status === 'Pending') {
      setCurrentView('dashboard');
      return;
    }
    setCurrentView('level-1');
  };

  const handleNavigateLevelCheck = (lvlId: number, stageId: number = 1) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    if (user.status === 'Pending') {
      setCurrentView('dashboard');
      return;
    }
    setSelectedLevelId(lvlId);
    setSelectedStageId(stageId);
    setCurrentView(`level-${lvlId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50 text-slate-800">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => handleNavigate(v)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* 1. Landing Page */}
        {currentView === 'home' && (
          <LandingPage
            onStartLearning={handleStartLearning}
            onOpenAuth={handleOpenAuth}
            onNavigateLevel={(lvl) => handleNavigateLevelCheck(lvl)}
            onNavigateUnplugged={() => handleNavigate('unplugged')}
          />
        )}

        {/* 2. Curriculum Overview List */}
        {currentView === 'curriculum' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative">
            {/* Tanda silang untuk menutup halaman kurikulum */}
            <button
              type="button"
              onClick={() => { sounds.playClick(); handleNavigate('home'); }}
              aria-label="Tutup Halaman Kurikulum"
              title="Tutup Halaman (Kembali ke Beranda)"
              className="absolute top-4 right-4 sm:top-6 sm:right-8 w-11 h-11 rounded-2xl bg-white hover:bg-red-500 hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 z-20 group border border-slate-200"
            >
              <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                KURIKULUM RESMI EDTECH
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mt-2">
                5 Level Petualangan Pemrograman Cilik
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Pilih level yang ingin kamu pelajari. Setiap level memiliki 3 sub-tingkat dan sertifikat kelulusan digital resmi!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CURRICULUM_LEVELS.map(lvl => (
                <div
                  key={lvl.id}
                  className={`bg-white rounded-3xl p-6 border-3 ${lvl.borderColor} shadow-md flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${lvl.color} text-white flex items-center justify-center text-xl font-black shadow-md`}>
                        {lvl.id}
                      </div>
                      <span className="text-xs font-black text-slate-400">
                        3 Sub-Tingkat
                      </span>
                    </div>
                    <h3 className="text-xl font-black font-heading text-slate-800">
                      Level {lvl.id}: {lvl.title}
                    </h3>
                    <p className="text-xs font-bold text-amber-600 mt-0.5">{lvl.subtitle}</p>
                    
                    <div className="mt-4 space-y-2">
                      {lvl.stages.map(st => (
                        <div key={st.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between border border-slate-100">
                          <span className="font-bold text-slate-700">{st.title}</span>
                          <span className="font-mono text-amber-600 font-bold">+{st.xpReward} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigateLevelCheck(lvl.id)}
                    className={`mt-6 w-full py-2.5 rounded-xl font-black text-xs text-white shadow-md flex items-center justify-center gap-2 bg-gradient-to-r ${lvl.color}`}
                  >
                    Buka Level {lvl.id} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Level 1 Interactive Game */}
        {currentView === 'level-1' && (
          <Level1DragDrop
            initialStage={selectedStageId}
            onBackToDashboard={() => handleNavigate(user ? 'dashboard' : 'home')}
            onNextLevel={() => handleNavigateLevelCheck(2)}
          />
        )}

        {/* 4. Level 2 Interactive Game */}
        {currentView === 'level-2' && (
          <Level2Scrolling
            initialStage={selectedStageId}
            onBackToDashboard={() => handleNavigate(user ? 'dashboard' : 'home')}
            onNextLevel={() => handleNavigateLevelCheck(3)}
          />
        )}

        {/* 5. Level 3 Interactive Game */}
        {currentView === 'level-3' && (
          <Level3Typing
            initialStage={selectedStageId}
            onBackToDashboard={() => handleNavigate(user ? 'dashboard' : 'home')}
            onNextLevel={() => handleNavigateLevelCheck(4)}
          />
        )}

        {/* 6. Level 4 Interactive Game */}
        {currentView === 'level-4' && (
          <Level4Thinking
            initialStage={selectedStageId}
            onBackToDashboard={() => handleNavigate(user ? 'dashboard' : 'home')}
            onNextLevel={() => handleNavigateLevelCheck(5)}
          />
        )}

        {/* 7. Level 5 Interactive Game */}
        {currentView === 'level-5' && (
          <Level5Sandbox
            initialStage={selectedStageId}
            onBackToDashboard={() => handleNavigate(user ? 'dashboard' : 'home')}
            onRestartAll={() => handleNavigateLevelCheck(1)}
          />
        )}

        {/* 8. Mode Unplugged */}
        {currentView === 'unplugged' && (
          <UnpluggedMode onBackToHome={() => handleNavigate('home')} />
        )}

        {/* 9. Student Dashboard */}
        {currentView === 'dashboard' && user && user.role === 'student' && (
          <StudentDashboard
            user={user}
            onNavigateLevel={(lvl, st) => handleNavigateLevelCheck(lvl, st)}
            onOpenUnplugged={() => handleNavigate('unplugged')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 10. Admin Dashboard */}
        {currentView === 'admin' && (
          <AdminDashboard
            onNavigateStudentView={() => handleNavigate('dashboard')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(view) => {
          setAuthModalOpen(false);
          handleNavigate(view);
        }}
      />

      {/* Sticky or static child-friendly Footer with "@Copyright by. Pak GuruAI" */}
      <Footer onNavigate={(v) => handleNavigate(v)} />

    </div>
  );
}
