import React from 'react';
import {
  Layers,
  FileCode2,
  GraduationCap,
  History,
  Sun,
  Moon,
  RotateCcw,
  BookmarkPlus,
  Sparkles,
  Zap,
  SplitSquareVertical,
  Compass,
  Trophy
} from 'lucide-react';

export type ActiveTab = 'studio' | 'templates' | 'learn' | 'history';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenInterpolationDemo: () => void;
  onOpenBeforeAfter: () => void;
  onOpenChallenge: () => void;
  isAiAvailable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onReset,
  onSave,
  onOpenInterpolationDemo,
  onOpenBeforeAfter,
  onOpenChallenge,
  isAiAvailable,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 bg-slate-950/80 border-slate-800/80 light:bg-white/80 light:border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              id="brand-logo-container"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 shrink-0"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center light:bg-white">
                <Sparkles className="w-5 h-5 text-indigo-400 light:text-indigo-600" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1
                  id="brand-title"
                  className="text-base sm:text-lg font-bold tracking-tight text-white light:text-slate-900 truncate"
                >
                  Prompt Engineering Studio
                </h1>
                <span
                  id="badge-app-mode"
                  className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    isAiAvailable
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 light:bg-indigo-50 light:text-indigo-700 light:border-indigo-200'
                  }`}
                  title={
                    isAiAvailable
                      ? 'Gemini API aktif untuk assisten cerdas'
                      : 'Mode Lokal: Semua fitur builder, kalkulasi skor, template, & edukasi aktif tanpa internet/API.'
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAiAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                    }`}
                  />
                  {isAiAvailable ? 'AI Enabled' : 'Local Mode'}
                </span>
              </div>
              <p
                id="brand-subtitle"
                className="text-xs text-slate-400 light:text-slate-500 truncate hidden sm:block"
              >
                Design better prompts. Think better with AI.
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav
            id="main-navigation"
            className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 light:bg-slate-100 light:border-slate-200"
            aria-label="Main Navigation"
          >
            <button
              id="nav-tab-studio"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Studio
            </button>
            <button
              id="nav-tab-templates"
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Templates
            </button>
            <button
              id="nav-tab-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Learn
            </button>
            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </nav>

          {/* Interactive Tools & Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Quick helper popovers */}
            <div className="hidden xl:flex items-center gap-1.5 mr-1 border-r border-slate-800 light:border-slate-300 pr-2">
              <button
                id="btn-nav-interpolation-demo"
                onClick={onOpenInterpolationDemo}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300"
                title="Pelajari bagaimana String Interpolation menyusun prompt secara matematis"
              >
                <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interpolasi</span>
              </button>
              <button
                id="btn-nav-before-after"
                onClick={onOpenBeforeAfter}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300"
                title="Lihat transformasi Before vs After prompt acak menjadi prompt berstandar studio"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Transformasi</span>
              </button>
              <button
                id="btn-nav-challenge"
                onClick={onOpenChallenge}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200 light:border-slate-300"
                title="Uji keahlianmu menyelesaikan tantangan prompt skenario acak"
              >
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                <span>Challenge</span>
              </button>
            </div>

            {/* Reset Draft Button */}
            <button
              id="btn-header-reset"
              onClick={onReset}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all light:text-slate-600 light:hover:text-rose-600"
              title="Reset form ke draf awal"
              aria-label="Reset prompt builder"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Save Prompt Button */}
            <button
              id="btn-header-save"
              onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold shadow-sm transition-all light:bg-slate-100 light:text-slate-800 light:border-slate-300 light:hover:bg-slate-200"
              title="Simpan prompt saat ini ke History"
            >
              <BookmarkPlus className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 light:border-slate-300 light:text-slate-600 light:hover:bg-slate-200 transition-colors"
              title={theme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 light:border-slate-200 gap-1 overflow-x-auto">
          <button
            id="mobile-nav-tab-studio"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 light:text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Studio
          </button>
          <button
            id="mobile-nav-tab-templates"
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 light:text-slate-600'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Templates
          </button>
          <button
            id="mobile-nav-tab-learn"
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === 'learn'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 light:text-slate-600'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Learn
          </button>
          <button
            id="mobile-nav-tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 light:text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </div>
      </div>
    </header>
  );
};
