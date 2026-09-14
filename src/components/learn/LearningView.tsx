import React, { useState } from 'react';
import { LEARNING_MODULES } from '../../data/learningModules';
import { LearningModule } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ThumbsDown,
  ThumbsUp,
  Lightbulb,
  Award,
  Sparkles
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({});

  const currentModule =
    LEARNING_MODULES.find((m) => m.id === selectedModuleId) || LEARNING_MODULES[0];

  const handleSelectQuizOption = (moduleId: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [moduleId]: optionIndex }));
    setShowQuizResults((prev) => ({ ...prev, [moduleId]: true }));
  };

  const selectedAnswer = quizAnswers[currentModule.id];
  const isAnswered = showQuizResults[currentModule.id];
  const isCorrect = isAnswered && selectedAnswer === currentModule.quiz.correctIndex;

  // Calculate total quizzes answered and correct
  const totalAnswered = Object.keys(showQuizResults).length;
  const totalCorrect = LEARNING_MODULES.filter(
    (m) => showQuizResults[m.id] && quizAnswers[m.id] === m.quiz.correctIndex
  ).length;

  return (
    <div id="learning-mode-view" className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            Prompt Engineering Academy
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
            Kuasai prinsip dasar pemikiran komputasional dan arsitektur instruksi AI.
          </p>
        </div>

        {/* Learning Progress Badge */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 light:bg-slate-100 light:border-slate-200 shrink-0">
          <Award className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 light:text-slate-600">Kuis Selesai: </span>
            <span className="font-bold text-white light:text-slate-900">
              {totalCorrect}/{LEARNING_MODULES.length} Benar
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Selector Sidebar (4 Cols) */}
        <div
          id="modules-sidebar"
          className="lg:col-span-4 space-y-2 p-3 rounded-2xl border bg-slate-900/70 border-slate-800 light:bg-white light:border-slate-200"
        >
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider block mb-2">
            Kurikulum Pembelajaran (8 Modul)
          </span>

          {LEARNING_MODULES.map((module) => {
            const isCurrent = module.id === currentModule.id;
            const hasPassedQuiz =
              showQuizResults[module.id] && quizAnswers[module.id] === module.quiz.correctIndex;

            return (
              <button
                key={module.id}
                id={`module-nav-item-${module.id}`}
                type="button"
                onClick={() => setSelectedModuleId(module.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 light:bg-slate-50 light:border-slate-200 light:text-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[11px] opacity-80">{module.title}</div>
                  <div className="text-xs font-semibold truncate mt-0.5">{module.concept}</div>
                </div>

                {hasPassedQuiz && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isCurrent ? 'text-white' : 'text-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Module Lesson & Quiz Area (8 Cols) */}
        <div
          id="module-lesson-content"
          className="lg:col-span-8 space-y-5 rounded-2xl border bg-slate-900/70 border-slate-800 p-5 sm:p-7 light:bg-white light:border-slate-200"
        >
          {/* Module Header */}
          <div>
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
              {currentModule.title}
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white light:text-slate-900 mt-1">
              {currentModule.concept}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 light:text-slate-600 mt-2 leading-relaxed">
              {currentModule.summary}
            </p>
          </div>

          {/* Bad vs Better Comparison Cards */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Studi Kasus Perbandingan
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Bad Example */}
              <div
                id="box-bad-example"
                className="p-4 rounded-xl border bg-rose-950/20 border-rose-500/30 text-xs space-y-2 light:bg-rose-50 light:border-rose-200"
              >
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Contoh Lemah / Acak</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-rose-500/20 font-mono text-[11px] text-rose-200 light:bg-white light:text-rose-900">
                  "{currentModule.badExample}"
                </div>
                <p className="text-[11px] text-rose-300/80 light:text-rose-700 leading-snug">
                  Terlalu singkat, ambigu, membiarkan AI berasumsi liar.
                </p>
              </div>

              {/* Better Example */}
              <div
                id="box-better-example"
                className="p-4 rounded-xl border bg-emerald-950/20 border-emerald-500/30 text-xs space-y-2 light:bg-emerald-50 light:border-emerald-200"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Contoh Terstruktur (Best Practice)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20 font-mono text-[11px] text-emerald-200 light:bg-white light:text-emerald-900">
                  "{currentModule.betterExample}"
                </div>
                <p className="text-[11px] text-emerald-300/80 light:text-emerald-700 leading-snug">
                  Lengkap dengan pembatas ruang lingkup, audiens, dan format.
                </p>
              </div>
            </div>

            {/* Why It Improved */}
            <div
              id="box-improvement-reason"
              className="p-3.5 rounded-xl border bg-slate-950/70 border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 light:bg-slate-50 light:border-slate-200 light:text-slate-700"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white light:text-slate-900 block mb-0.5">
                  Mengapa contoh di atas jauh lebih efektif?
                </strong>
                <p className="text-[11px] leading-relaxed text-slate-400 light:text-slate-600">
                  {currentModule.improvementReason}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Mini Quiz */}
          <div
            id="interactive-mini-quiz-card"
            className="p-5 rounded-2xl border bg-gradient-to-b from-slate-950 to-slate-900 border-indigo-500/30 space-y-4 light:from-slate-50 light:to-white light:border-indigo-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Mini Quiz Pemahaman
              </span>
              {isAnswered && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                    isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {isCorrect ? '✓ Jawaban Tepat!' : '✕ Coba Renungkan Lagi'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 leading-snug">
              {currentModule.quiz.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {currentModule.quiz.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectOption = idx === currentModule.quiz.correctIndex;

                let btnStyles =
                  'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 light:bg-white light:border-slate-200 light:text-slate-700';

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyles =
                      'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold light:bg-emerald-50 light:border-emerald-500 light:text-emerald-900';
                  } else if (isSelected && !isCorrectOption) {
                    btnStyles =
                      'bg-rose-950/40 border-rose-500 text-rose-200 light:bg-rose-50 light:border-rose-500 light:text-rose-900';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuizOption(currentModule.id, idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${btnStyles}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono shrink-0 light:bg-slate-100">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Quiz Explanation */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed animate-in fade-in light:bg-slate-100 light:border-slate-300 light:text-slate-800">
                <strong className="text-indigo-400 block mb-0.5">Penjelasan Pedagogis:</strong>
                {currentModule.quiz.explanation}
              </div>
            )}
          </div>

          {/* Module Navigation Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 light:border-slate-200">
            <button
              type="button"
              disabled={currentModule.id === 1}
              onClick={() => setSelectedModuleId((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed light:bg-slate-100 light:text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              disabled={currentModule.id === LEARNING_MODULES.length}
              onClick={() =>
                setSelectedModuleId((prev) => Math.min(LEARNING_MODULES.length, prev + 1))
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Modul Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
