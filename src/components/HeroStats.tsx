import React from 'react';
import { AppStats } from '../types';
import { Sparkles, BookmarkCheck, Library, Target, Award } from 'lucide-react';

interface HeroStatsProps {
  stats: AppStats;
  currentScore: number;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ stats, currentScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <section
      id="hero-stats-banner"
      className="mb-6 rounded-2xl border bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/40 p-5 sm:p-6 border-slate-800/80 backdrop-blur-sm shadow-xl shadow-black/20 light:bg-gradient-to-r light:from-white light:via-slate-50 light:to-indigo-50/50 light:border-slate-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Hero Copy */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-2 light:bg-indigo-100 light:text-indigo-800 light:border-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Prompt Laboratory</span>
          </div>
          <h2
            id="hero-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white light:text-slate-900"
          >
            Build prompts with purpose.
          </h2>
          <p
            id="hero-description"
            className="mt-1 text-sm text-slate-400 light:text-slate-600 leading-relaxed"
          >
            Rancang prompt yang lebih jelas, terstruktur, dan konsisten menggunakan framework 6-pilar Prompt Engineering untuk kebutuhan akademik, riset, dan produktivitas.
          </p>
        </div>

        {/* Interactive Stats Grid */}
        <div
          id="stats-counters-grid"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0"
        >
          {/* Prompts Dibuat */}
          <div
            id="stat-card-created"
            className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800/80 flex flex-col light:bg-white light:border-slate-200"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prompt Dibuat</span>
            </div>
            <span
              id="stat-val-created"
              className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900"
            >
              {stats.promptsCreated}
            </span>
            <span className="text-[10px] text-slate-500 light:text-slate-400">Total sesi aktif</span>
          </div>

          {/* Prompts Tersimpan */}
          <div
            id="stat-card-saved"
            className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800/80 flex flex-col light:bg-white light:border-slate-200"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 mb-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tersimpan</span>
            </div>
            <span
              id="stat-val-saved"
              className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900"
            >
              {stats.promptsSaved}
            </span>
            <span className="text-[10px] text-slate-500 light:text-slate-400">Di LocalStorage</span>
          </div>

          {/* Template Tersedia */}
          <div
            id="stat-card-templates"
            className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800/80 flex flex-col light:bg-white light:border-slate-200"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 mb-1">
              <Library className="w-3.5 h-3.5 text-purple-400" />
              <span>Template</span>
            </div>
            <span
              id="stat-val-templates"
              className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900"
            >
              {stats.templatesAvailable}
            </span>
            <span className="text-[10px] text-slate-500 light:text-slate-400">Katalog kurasi</span>
          </div>

          {/* Current / Last Prompt Score */}
          <div
            id="stat-card-score"
            className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800/80 flex flex-col light:bg-white light:border-slate-200"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-500 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Skor Prompt</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                id="stat-val-score"
                className={`text-xl sm:text-2xl font-black tracking-tight px-1.5 py-0.5 rounded-md border ${getScoreColor(
                  currentScore
                )}`}
              >
                {currentScore}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 light:text-slate-400">Analisis lokal realtime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
