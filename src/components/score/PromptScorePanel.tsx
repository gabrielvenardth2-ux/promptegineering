import React, { useState } from 'react';
import { PromptScore, PromptState } from '../../types';
import {
  Award,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Wand2,
  BookOpen,
  Info,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { aiImprovePrompt, aiExplainPrompt } from '../../lib/aiService';

interface PromptScorePanelProps {
  score: PromptScore;
  state: PromptState;
  onApplyImproved: (improved: Partial<PromptState>) => void;
  isAiAvailable: boolean;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const PromptScorePanel: React.FC<PromptScorePanelProps> = ({
  score,
  state,
  onApplyImproved,
  isAiAvailable,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'assistant'>('score');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [improvementResult, setImprovementResult] = useState<any | null>(null);
  const [explanationResult, setExplanationResult] = useState<any | null>(null);

  const getGradeBadge = (grade: PromptScore['grade']) => {
    switch (grade) {
      case 'Mastery':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Excellent':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Good':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Fair':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getScoreStroke = (total: number) => {
    if (total >= 90) return '#10b981'; // emerald-500
    if (total >= 75) return '#06b6d4'; // cyan-500
    if (total >= 60) return '#6366f1'; // indigo-500
    if (total >= 40) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  // Radial Gauge Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.total / 100) * circumference;

  // Handle Improve Prompt via AI or Local
  const handleImprovePrompt = async () => {
    setLoadingAction('improve');
    try {
      const res = await aiImprovePrompt(state);
      if (res.ok && res.data) {
        setImprovementResult(res.data);
        onShowToast('success', 'Rekomendasi perbaikan AI siap ditinjau!');
      } else {
        // Local mode fallback refinement
        const localImprovement = {
          improvedRole: state.role || 'Kamu adalah tutor ahli yang komunikatif dan terstruktur.',
          improvedContext: state.context || 'Audiens memerlukan pemahaman materi secara menyeluruh.',
          improvedInstruction: state.instruction
            ? `Analisis secara mendalam dan ${state.instruction}`
            : 'Jelaskan konsep ini dengan analogi sederhana dan berikan 2 contoh konkret.',
          suggestedConstraints: Array.from(
            new Set([
              ...state.constraints,
              'Gunakan bahasa Indonesia yang jelas dan objektif.',
              'Maksimal 400 kata.',
              'Hindari informasi spekulatif tanpa bukti.'
            ])
          ),
          suggestedOutputFormat: state.outputFormat === 'Custom' ? 'Step-by-step' : state.outputFormat,
          explanation: 'Rekomendasi lokal memperkuat peran, menambahkan kata kerja operasional, dan melengkapi batasan standar.'
        };
        setImprovementResult(localImprovement);
        onShowToast('info', 'Saran perbaikan dirumuskan (Local Mode)');
      }
    } catch {
      onShowToast('error', 'Gagal meminta perbaikan prompt.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Explain Prompt
  const handleExplainPrompt = async () => {
    setLoadingAction('explain');
    try {
      const res = await aiExplainPrompt(state);
      if (res.ok && res.data) {
        setExplanationResult(res.data);
        onShowToast('success', 'Analisis didaktis AI siap!');
      } else {
        // Local educational explanation
        setExplanationResult({
          strengths: [
            state.role ? 'Memiliki persona yang membatasi spektrum pengetahuan model.' : 'Cakupan instruksi langsung.',
            state.constraints.length > 0 ? `Dilengkapi ${state.constraints.length} batasan untuk mencegah halusinasi.` : 'Instruksi ringkas.',
            `Format keluaran ditentukan (${state.outputFormat}) sehingga memudahkan penelaahan.`
          ],
          potentialRisks: [
            state.constraints.length === 0 ? 'Belum ada batasan (risiko teks terlalu panjang).' : 'Pastikan konteks diperbarui sesuai data kasus.',
            !state.enableFewShot ? 'Belum menggunakan Few-shot example untuk memandu gaya sintaks.' : 'Contoh few-shot sudah baik.'
          ],
          pedagogicalInsight: 'Struktur modular memisahkan peran dari instruksi sehingga model memproses tugas dengan kejelasan konteks (context clarity) yang optimal.'
        });
        onShowToast('info', 'Analisis didaktis siap (Local Analysis)');
      }
    } catch {
      onShowToast('error', 'Gagal memuat penjelasan prompt.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApplyAllImprovements = () => {
    if (!improvementResult) return;
    onApplyImproved({
      role: improvementResult.improvedRole || state.role,
      context: improvementResult.improvedContext || state.context,
      instruction: improvementResult.improvedInstruction || state.instruction,
      constraints: improvementResult.suggestedConstraints || state.constraints,
      outputFormat: improvementResult.suggestedOutputFormat || state.outputFormat,
    });
    setImprovementResult(null);
    onShowToast('success', 'Perbaikan prompt berhasil diterapkan ke Builder!');
  };

  return (
    <div
      id="prompt-score-panel"
      className="rounded-2xl border bg-slate-900/80 border-slate-800/90 shadow-xl overflow-hidden backdrop-blur-sm light:bg-white light:border-slate-200"
    >
      {/* Panel Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
        <button
          id="tab-btn-local-score"
          type="button"
          onClick={() => setActiveTab('score')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'score'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5 light:text-indigo-700 light:border-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-200 light:text-slate-600'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Local Prompt Analysis</span>
        </button>

        <button
          id="tab-btn-ai-assistant"
          type="button"
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'assistant'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5 light:text-indigo-700 light:border-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-200 light:text-slate-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Assistant</span>
          {isAiAvailable && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'score' ? (
          /* TAB 1: LOCAL PROMPT ANALYSIS */
          <div className="space-y-4">
            {/* Radial Score Card */}
            <div
              id="score-radial-card"
              className="p-4 rounded-xl border bg-slate-950/70 border-slate-800/80 flex items-center justify-between gap-4 light:bg-slate-50 light:border-slate-200"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Prompt Quality Score
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    id="score-total-value"
                    className="text-3xl font-black text-white tracking-tight light:text-slate-900"
                  >
                    {score.total}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/100</span>
                </div>
                <div className="mt-1">
                  <span
                    id="score-grade-badge"
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getGradeBadge(
                      score.grade
                    )}`}
                  >
                    {score.grade}
                  </span>
                </div>
              </div>

              {/* SVG Radial Progress */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
                  {/* Background Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="transparent"
                    className="text-slate-800 light:text-slate-200"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke={getScoreStroke(score.total)}
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-300 light:text-slate-700">
                  {score.total}%
                </div>
              </div>
            </div>

            {/* Sub-Score Dimension Progress Bars */}
            <div id="sub-scores-container" className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">
                Dimensi Kualitas
              </span>

              {/* Clarity */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 light:text-slate-700">Clarity (Kejelasan Tugas)</span>
                  <span className="text-slate-400 font-mono">{score.breakdown.clarity}/20</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden light:bg-slate-200">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(score.breakdown.clarity / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Context */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 light:text-slate-700">Context & Role</span>
                  <span className="text-slate-400 font-mono">{score.breakdown.context}/20</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden light:bg-slate-200">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${(score.breakdown.context / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Specificity */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 light:text-slate-700">Specificity (Kedalaman)</span>
                  <span className="text-slate-400 font-mono">{score.breakdown.specificity}/20</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden light:bg-slate-200">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(score.breakdown.specificity / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Constraints */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 light:text-slate-700">Constraints (Pagar Pembatas)</span>
                  <span className="text-slate-400 font-mono">{score.breakdown.constraints}/20</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden light:bg-slate-200">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(score.breakdown.constraints / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Output Structure */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 light:text-slate-700">Output Structure</span>
                  <span className="text-slate-400 font-mono">{score.breakdown.outputStructure}/20</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden light:bg-slate-200">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${(score.breakdown.outputStructure / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Qualitative Feedback List */}
            <div id="score-feedback-card" className="space-y-2 pt-2 border-t border-slate-800 light:border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Ulasan & Rekomendasi
              </span>

              <div className="space-y-1.5">
                {score.feedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-snug light:bg-slate-50 light:border-slate-200 light:text-slate-700"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{fb}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: AI PROMPT ASSISTANT */
          <div className="space-y-4">
            {/* Status notice */}
            <div
              id="ai-status-notice"
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                isAiAvailable
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 light:bg-indigo-50 light:border-indigo-200 light:text-indigo-900'
              }`}
            >
              {isAiAvailable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div className="text-[11px] leading-relaxed">
                {isAiAvailable ? (
                  <span>
                    <strong>Gemini AI Assistant aktif.</strong> Siap melakukan analisis konteks mendalam, perbaikan kalimat, dan saran batasan.
                  </span>
                ) : (
                  <span>
                    <strong>AI Assistant is not configured yet.</strong> Local Builder is still available. Fitur bantuan tetap beroperasi menggunakan analisis heuristik cerdas tanpa membutuhkan koneksi server.
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="btn-ai-improve-prompt"
                type="button"
                onClick={handleImprovePrompt}
                disabled={loadingAction === 'improve'}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 ${loadingAction === 'improve' ? 'animate-spin' : ''}`} />
                <span>{loadingAction === 'improve' ? 'Menganalisis...' : 'Improve Prompt'}</span>
              </button>

              <button
                id="btn-ai-explain-prompt"
                type="button"
                onClick={handleExplainPrompt}
                disabled={loadingAction === 'explain'}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors disabled:opacity-50 light:bg-slate-100 light:text-slate-800 light:border-slate-300 light:hover:bg-slate-200"
              >
                <BookOpen className={`w-4 h-4 ${loadingAction === 'explain' ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                <span>{loadingAction === 'explain' ? 'Membedah...' : 'Explain Why This Works'}</span>
              </button>
            </div>

            {/* Improvement Results Card */}
            {improvementResult && (
              <div
                id="improvement-result-box"
                className="p-3.5 rounded-xl border bg-slate-950/80 border-indigo-500/40 text-xs space-y-2.5 animate-in fade-in light:bg-indigo-50/50 light:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 light:text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Saran Perbaikan Prompt
                  </span>
                  <button
                    id="btn-apply-improvement"
                    type="button"
                    onClick={handleApplyAllImprovements}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                  >
                    Terapkan ke Builder
                  </button>
                </div>

                <p className="text-slate-300 light:text-slate-700 leading-relaxed text-[11px]">
                  {improvementResult.explanation}
                </p>

                {improvementResult.improvedRole && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-800">
                    <strong className="text-indigo-400 block text-[10px] uppercase">Revisi Role:</strong>
                    <span>{improvementResult.improvedRole}</span>
                  </div>
                )}

                {improvementResult.improvedInstruction && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-800">
                    <strong className="text-indigo-400 block text-[10px] uppercase">Revisi Instruksi:</strong>
                    <span>{improvementResult.improvedInstruction}</span>
                  </div>
                )}
              </div>
            )}

            {/* Explanation Results Card */}
            {explanationResult && (
              <div
                id="explanation-result-box"
                className="p-3.5 rounded-xl border bg-slate-950/80 border-cyan-500/40 text-xs space-y-2.5 animate-in fade-in light:bg-cyan-50/50 light:border-cyan-300"
              >
                <span className="font-bold text-cyan-300 light:text-cyan-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Mengapa Prompt Ini Bekerja?
                </span>

                <p className="text-slate-300 light:text-slate-700 leading-relaxed text-[11px]">
                  {explanationResult.pedagogicalInsight}
                </p>

                {Array.isArray(explanationResult.strengths) && (
                  <div>
                    <strong className="text-emerald-400 block text-[10px] uppercase mb-1">
                      Kekuatan Arsitektur:
                    </strong>
                    <ul className="space-y-1">
                      {explanationResult.strengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300 light:text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
