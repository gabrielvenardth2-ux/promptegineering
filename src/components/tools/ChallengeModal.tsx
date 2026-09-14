import React, { useState } from 'react';
import { PROMPT_CHALLENGES } from '../../data/challenges';
import { PromptChallenge, PromptScore, PromptState } from '../../types';
import { parseRawPrompt } from '../../lib/promptParser';
import { calculateLocalPromptScore } from '../../lib/scoringEngine';
import { aiReviewChallenge } from '../../lib/aiService';
import {
  Trophy,
  X,
  Shuffle,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  Activity
} from 'lucide-react';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToStudio: (state: PromptState) => void;
  isAiAvailable: boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  onApplyToStudio,
  isAiAvailable,
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userPromptText, setUserPromptText] = useState('');
  const [analyzedScore, setAnalyzedScore] = useState<PromptScore | null>(null);
  const [aiReviewText, setAiReviewText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const currentChallenge: PromptChallenge = PROMPT_CHALLENGES[challengeIndex];

  const handleNextChallenge = () => {
    setChallengeIndex((prev) => (prev + 1) % PROMPT_CHALLENGES.length);
    setUserPromptText('');
    setAnalyzedScore(null);
    setAiReviewText(null);
  };

  const handleAnalyzePrompt = async () => {
    if (!userPromptText.trim()) return;
    setIsAnalyzing(true);
    setAiReviewText(null);

    // 1. Local scoring
    const parsed = parseRawPrompt(userPromptText);
    const score = calculateLocalPromptScore(parsed);
    setAnalyzedScore(score);

    // 2. AI Review if available
    if (isAiAvailable) {
      try {
        const res = await aiReviewChallenge(currentChallenge.scenario, parsed);
        if (res.ok && res.data?.review) {
          setAiReviewText(res.data.review);
        }
      } catch {
        // ignore
      }
    }

    setIsAnalyzing(false);
  };

  const handleLoadToStudio = () => {
    const parsed = parseRawPrompt(userPromptText);
    onApplyToStudio(parsed);
    onClose();
  };

  return (
    <div
      id="prompt-challenge-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="prompt-challenge-modal"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden light:bg-white light:border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white light:text-slate-900">
                Random Prompt Challenge
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-500">
                Latih insting menyusun prompt dengan skenario dunia nyata
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNextChallenge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors light:bg-slate-100 light:text-slate-700"
              title="Acak skenario berikutnya"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-400" />
              <span>Ganti Skenario</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Scenario Card */}
          <div
            id="challenge-scenario-card"
            className="p-4 rounded-xl border bg-purple-950/20 border-purple-500/30 space-y-2 light:bg-purple-50 light:border-purple-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 light:text-purple-800 uppercase tracking-wider">
                Tantangan: {currentChallenge.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-500/20 text-purple-200">
                Tingkat: {currentChallenge.difficulty}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 leading-relaxed">
              "{currentChallenge.scenario}"
            </p>

            <div className="pt-2 border-t border-purple-500/20 text-xs text-purple-200/90 light:text-purple-800">
              <strong className="block text-[11px] mb-1">Target Persona:</strong>
              <span>{currentChallenge.targetRole}</span>
            </div>

            {currentChallenge.hints.length > 0 && (
              <div className="text-[11px] text-purple-300/80 light:text-purple-700 space-y-1">
                <strong className="block">Petunjuk Tambahan:</strong>
                {currentChallenge.hints.map((hint, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-purple-400" />
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Prompt Input Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 light:text-slate-700">
                Rancang prompt lengkapmu di sini (sertakan Role, Context, Task, Constraints, & Format):
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {userPromptText.length} karakter
              </span>
            </div>

            <textarea
              id="input-challenge-prompt"
              rows={6}
              value={userPromptText}
              onChange={(e) => setUserPromptText(e.target.value)}
              placeholder="ROLE: Kamu adalah...\n\nCONTEXT: ...\n\nMAIN INSTRUCTION: ...\n\nCONSTRAINTS:\n1. ...\n\nOUTPUT FORMAT: Table"
              className="w-full text-xs sm:text-sm font-mono rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
            />
          </div>

          {/* Analyze Action */}
          <div className="flex justify-end">
            <button
              id="btn-analyze-challenge-prompt"
              type="button"
              disabled={!userPromptText.trim() || isAnalyzing}
              onClick={handleAnalyzePrompt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Menganalisis...' : 'Analyze Prompt'}</span>
            </button>
          </div>

          {/* Analysis Results Display */}
          {analyzedScore && (
            <div
              id="challenge-score-result-box"
              className="p-5 rounded-2xl border bg-slate-950/90 border-purple-500/30 space-y-4 animate-in fade-in light:bg-slate-50 light:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Hasil Evaluasi Lokal
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-white light:text-slate-900">
                      {analyzedScore.total}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/100</span>
                    <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {analyzedScore.grade}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadToStudio}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  <span>Buka di Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Feedback list */}
              <div className="space-y-1.5">
                <strong className="text-xs text-slate-300 light:text-slate-700 block">
                  Ulasan Sistem:
                </strong>
                {analyzedScore.feedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>

              {/* AI review commentary if available */}
              {aiReviewText && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed light:bg-purple-50 light:text-purple-900 light:border-purple-300">
                  <strong className="block text-[11px] text-purple-300 font-bold mb-1">
                    AI Mentor Feedback:
                  </strong>
                  <span>{aiReviewText}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
