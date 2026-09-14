import React, { useState } from 'react';
import { OutputFormatType, PromptState } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  Wand2,
  ListPlus,
  Check,
  ToggleLeft,
  ToggleRight,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  aiGenerateRole,
  aiGenerateContext,
  aiSuggestConstraints,
  aiSuggestFormat,
  aiGenerateFewShot
} from '../../lib/aiService';

interface PromptBuilderProps {
  state: PromptState;
  onChange: (updater: (prev: PromptState) => PromptState) => void;
  isAiAvailable: boolean;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

const OUTPUT_FORMAT_OPTIONS: { id: OutputFormatType; label: string; desc: string }[] = [
  { id: 'Bullet Points', label: 'Bullet Points', desc: 'Poin-poin ringkas (scannable)' },
  { id: 'Paragraph', label: 'Paragraph', desc: 'Uraian naratif mengalir' },
  { id: 'Numbered List', label: 'Numbered List', desc: 'Daftar berurutan hierarkis' },
  { id: 'Table', label: 'Table (Markdown)', desc: 'Kolom & baris komparasi' },
  { id: 'Step-by-step', label: 'Step-by-step', desc: 'Tahapan instruksi sekuensial' },
  { id: 'JSON', label: 'JSON Schema', desc: 'Format data terstruktur' },
  { id: 'Custom', label: 'Custom Format', desc: 'Tentukan pola spesifik sendiri' },
];

const PRESET_CONSTRAINTS = [
  'Gunakan bahasa Indonesia baku dan mudah dipahami.',
  'Jangan membuat informasi spekulatif yang tidak terverifikasi.',
  'Maksimal 400 kata.',
  'Gunakan analogi kehidupan sehari-hari.',
  'Sertakan 1 pertanyaan reflektif untuk verifikasi pemahaman.',
  'Sajikan jawaban secara objektif dan netral.'
];

const ROLE_PRESETS = [
  'Kamu adalah tutor fisika SMA berpengalaman yang ramah dan sabar.',
  'Kamu adalah reviewer jurnal ilmiah Scopus Q1 dengan spesialisasi metodologi penelitian.',
  'Kamu adalah editor esai akademik dan pengajar retorika universitas.',
  'Kamu adalah analis data strategis untuk presentasi eksekutif.'
];

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  state,
  onChange,
  isAiAvailable,
  onShowToast,
}) => {
  const [newConstraintText, setNewConstraintText] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Role AI Generator
  const handleGenerateRole = async () => {
    setLoadingAction('role');
    try {
      const res = await aiGenerateRole(state.instruction, state.context);
      if (res.ok && res.data?.role) {
        onChange((prev) => ({ ...prev, role: res.data.role }));
        onShowToast('success', 'Role berhasil digenerate!', res.data.explanation);
      } else {
        // Fallback in local mode
        const fallback = 'Kamu adalah pakar dan instruktur akademik yang berfokus pada penyederhanaan konsep rumit dengan pendekatan sokratik.';
        onChange((prev) => ({ ...prev, role: fallback }));
        onShowToast('info', 'Persona Role diterapkan (Mode Lokal)', 'Menetapkan persona ahli pengajar yang relevan.');
      }
    } catch {
      onChange((prev) => ({
        ...prev,
        role: 'Kamu adalah pakar dan instruktur akademik yang berfokus pada pendekatan sokratik.'
      }));
      onShowToast('info', 'Persona Role diterapkan (Fallback lokal)');
    } finally {
      setLoadingAction(null);
    }
  };

  // Context AI Generator
  const handleGenerateContext = async () => {
    setLoadingAction('context');
    try {
      const res = await aiGenerateContext(state.role, state.instruction);
      if (res.ok && res.data?.context) {
        onChange((prev) => ({ ...prev, context: res.data.context }));
        onShowToast('success', 'Konteks berhasil digenerate!', res.data.explanation);
      } else {
        const fallback = 'Pengguna adalah pembelajar mandiri yang membutuhkan pemahaman komprehensif, terstruktur, dan aplikatif untuk materi ini.';
        onChange((prev) => ({ ...prev, context: fallback }));
        onShowToast('info', 'Konteks terpasang (Mode Lokal)', 'Diterapkan latar belakang pembelajar mandiri.');
      }
    } catch {
      onShowToast('error', 'Gagal memproses konteks.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Constraints Handler
  const handleAddConstraint = (textToAdd?: string) => {
    const text = (textToAdd || newConstraintText).trim();
    if (!text) return;
    if (state.constraints.includes(text)) {
      onShowToast('info', 'Batasan sudah ada di dalam daftar.');
      return;
    }
    onChange((prev) => ({
      ...prev,
      constraints: [...prev.constraints, text],
    }));
    if (!textToAdd) setNewConstraintText('');
  };

  const handleRemoveConstraint = (index: number) => {
    onChange((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index),
    }));
  };

  const handleSuggestConstraints = async () => {
    setLoadingAction('constraints');
    try {
      const res = await aiSuggestConstraints(state.role, state.instruction);
      if (res.ok && Array.isArray(res.data?.constraints) && res.data.constraints.length > 0) {
        const unique = Array.from(new Set([...state.constraints, ...res.data.constraints]));
        onChange((prev) => ({ ...prev, constraints: unique }));
        onShowToast('success', 'Saran batasan ditambahkan!', `${res.data.constraints.length} batasan disarankan.`);
      } else {
        // Local fallback: add standard safety constraints
        const recommended = [
          'Gunakan bahasa Indonesia baku dan santun.',
          'Maksimal 400 kata.',
          'Jangan gunakan informasi spekulatif di luar data yang diberikan.'
        ];
        const unique = Array.from(new Set([...state.constraints, ...recommended]));
        onChange((prev) => ({ ...prev, constraints: unique }));
        onShowToast('info', 'Batasan standar ditambahkan (Mode Lokal)');
      }
    } catch {
      onShowToast('error', 'Gagal menyarankan batasan.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Format AI Suggestion
  const handleSuggestFormat = async () => {
    setLoadingAction('format');
    try {
      const res = await aiSuggestFormat(state.instruction);
      if (res.ok && res.data?.formatType) {
        const matched = OUTPUT_FORMAT_OPTIONS.find(
          (opt) => opt.id.toLowerCase() === res.data.formatType.toLowerCase()
        );
        if (matched) {
          onChange((prev) => ({ ...prev, outputFormat: matched.id }));
        } else {
          onChange((prev) => ({
            ...prev,
            outputFormat: 'Custom',
            customOutputFormat: res.data.formatStructure || res.data.formatType,
          }));
        }
        onShowToast('success', 'Format output disesuaikan!', res.data.explanation);
      } else {
        onChange((prev) => ({ ...prev, outputFormat: 'Table' }));
        onShowToast('info', 'Format Table direkomendasikan (Mode Lokal)');
      }
    } catch {
      onShowToast('error', 'Gagal menyarankan format.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Few Shot AI Generator
  const handleGenerateFewShot = async () => {
    setLoadingAction('fewshot');
    try {
      const res = await aiGenerateFewShot(state.instruction, state.outputFormat);
      if (res.ok && res.data?.exampleInput && res.data?.exampleOutput) {
        onChange((prev) => ({
          ...prev,
          enableFewShot: true,
          fewShot: {
            input: res.data.exampleInput,
            output: res.data.exampleOutput,
          },
        }));
        onShowToast('success', 'Contoh Few-shot dibuat!');
      } else {
        onChange((prev) => ({
          ...prev,
          enableFewShot: true,
          fewShot: {
            input: 'Contoh pertanyaan atau data uji singkat...',
            output: 'Jawaban presisi sesuai dengan format dan batasan di atas.'
          }
        }));
        onShowToast('info', 'Template Few-shot terpasang (Mode Lokal)');
      }
    } catch {
      onShowToast('error', 'Gagal generate contoh few-shot.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div id="prompt-builder-panel" className="space-y-4">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 light:border-slate-200">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Prompt Architecture Builder
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-500">
            Pilar 1–6 menyusun prompt AI berbobot tinggi.
          </p>
        </div>
      </div>

      {/* 01 — ROLE CARD */}
      <div
        id="builder-card-role"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">01 — Role</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Peran</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Siapa AI yang kamu ingin gunakan?
            </p>
          </div>

          <button
            id="btn-generate-role"
            type="button"
            onClick={handleGenerateRole}
            disabled={loadingAction === 'role'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors disabled:opacity-50 light:bg-indigo-50 light:text-indigo-700 light:border-indigo-300"
            title="Hasilkan definisi persona yang tepat menggunakan AI"
          >
            <Wand2 className={`w-3.5 h-3.5 ${loadingAction === 'role' ? 'animate-spin' : 'text-indigo-400'}`} />
            <span>{loadingAction === 'role' ? 'Generating...' : 'Generate Role with AI'}</span>
          </button>
        </div>

        <textarea
          id="input-role"
          rows={2}
          value={state.role}
          onChange={(e) => onChange((prev) => ({ ...prev, role: e.target.value }))}
          placeholder="Contoh: Kamu adalah seorang tutor matematika SMA yang berpengalaman."
          className="w-full text-xs sm:text-sm rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y light:bg-slate-50 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400"
        />

        {/* Quick Presets */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-medium mr-1">Inspirasi Cepat:</span>
          {ROLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, role: preset }))}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors truncate max-w-[200px] light:bg-slate-100 light:text-slate-700 light:border-slate-300"
              title={preset}
            >
              {preset.split(' ')[2] || 'Persona'} {preset.split(' ')[3] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* 02 — CONTEXT CARD */}
      <div
        id="builder-card-context"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">02 — Context</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Konteks</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Berikan informasi yang diperlukan AI untuk memahami situasi.
            </p>
          </div>

          <button
            id="btn-suggest-context"
            type="button"
            onClick={handleGenerateContext}
            disabled={loadingAction === 'context'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            title="Dapatkan rekomendasi konteks situasional"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAction === 'context' ? 'animate-spin text-indigo-400' : 'text-indigo-400'}`} />
            <span>{loadingAction === 'context' ? 'Thinking...' : 'Suggest Context'}</span>
          </button>
        </div>

        <textarea
          id="input-context"
          rows={3}
          value={state.context}
          onChange={(e) => onChange((prev) => ({ ...prev, context: e.target.value }))}
          placeholder="Contoh: Siswa kelas 11 sedang mempersiapkan ulangan harian materi Hukum Newton dan sering bingung membedakan konsep massa dan berat."
          className="w-full text-xs sm:text-sm rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y light:bg-slate-50 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400"
        />

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Sertakan profil audiens, tujuan, atau data pengantar</span>
          <span className="font-mono">{state.context.length} karakter</span>
        </div>
      </div>

      {/* 03 — MAIN INSTRUCTION CARD */}
      <div
        id="builder-card-instruction"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">03 — Main Instruction</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Instruksi Utama</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Apa tugas utama yang harus dilakukan AI?
            </p>
          </div>
        </div>

        <textarea
          id="input-instruction"
          rows={4}
          value={state.instruction}
          onChange={(e) => onChange((prev) => ({ ...prev, instruction: e.target.value }))}
          placeholder="Contoh: Jelaskan konsep perbedaan massa dan berat dengan analogi astronot yang mendarat di Bulan. Berikan 1 contoh soal perhitungan numerik sederhana untuk menghitung berat benda 50 kg di Bumi vs di Bulan."
          className="w-full text-xs sm:text-sm rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y font-medium light:bg-slate-50 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400"
        />

        {/* Action Verbs Helpers */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-medium mr-1">Kata Kerja Aksi:</span>
          {['Jelaskan...', 'Bandingkan...', 'Analisis...', 'Rangkum...', 'Susun kerangka...', 'Hitung...'].map((verb, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  instruction: prev.instruction ? `${prev.instruction} ${verb}` : verb,
                }))
              }
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700/60 transition-colors light:bg-slate-100 light:text-indigo-700 light:border-slate-300"
            >
              + {verb}
            </button>
          ))}
        </div>
      </div>

      {/* 04 — CONSTRAINTS CARD */}
      <div
        id="builder-card-constraints"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">04 — Constraints</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Batasan</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Aturan pagar pembatas agar AI tidak menyimpang dan akurat.
            </p>
          </div>

          <button
            id="btn-suggest-constraints"
            type="button"
            onClick={handleSuggestConstraints}
            disabled={loadingAction === 'constraints'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            title="Rekomendasikan batasan penting dari AI"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAction === 'constraints' ? 'animate-spin text-indigo-400' : 'text-indigo-400'}`} />
            <span>{loadingAction === 'constraints' ? 'Memproses...' : 'Suggest Constraints'}</span>
          </button>
        </div>

        {/* Existing Constraints List */}
        <div id="constraints-list-container" className="space-y-2 mb-3">
          {state.constraints.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 light:border-slate-300 light:text-slate-400">
              Belum ada batasan. Tambahkan batasan agar AI tidak bertele-tele atau berhalusinasi.
            </div>
          ) : (
            state.constraints.map((constraint, idx) => (
              <div
                key={idx}
                id={`constraint-item-${idx}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 group transition-all hover:border-slate-700 light:bg-slate-50 light:border-slate-300 light:text-slate-800"
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-[10px] font-mono shrink-0 light:bg-slate-200 light:text-indigo-600">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug break-words">{constraint}</span>
                <button
                  id={`btn-remove-constraint-${idx}`}
                  type="button"
                  onClick={() => handleRemoveConstraint(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-colors"
                  aria-label={`Hapus batasan ${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Constraint Input Form */}
        <div className="flex gap-2">
          <input
            id="input-new-constraint"
            type="text"
            value={newConstraintText}
            onChange={(e) => setNewConstraintText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddConstraint();
              }
            }}
            placeholder="Contoh: Jangan menggunakan istilah teknis tanpa penjelasan..."
            className="flex-1 text-xs rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400"
          />
          <button
            id="btn-add-constraint"
            type="button"
            onClick={() => handleAddConstraint()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Constraint</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-500 font-medium mr-1">Rekomendasi Cepat:</span>
          {PRESET_CONSTRAINTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddConstraint(preset)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 border border-slate-800 transition-colors light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 05 — OUTPUT FORMAT CARD */}
      <div
        id="builder-card-output-format"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">05 — Output Format</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Format Output</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Pilih struktur penyajian jawaban AI.
            </p>
          </div>

          <button
            id="btn-suggest-format"
            type="button"
            onClick={handleSuggestFormat}
            disabled={loadingAction === 'format'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
            title="Minta AI merekomendasikan format dokumen terbaik"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingAction === 'format' ? 'animate-spin text-indigo-400' : 'text-indigo-400'}`} />
            <span>{loadingAction === 'format' ? 'Analyzing...' : 'Suggest Format'}</span>
          </button>
        </div>

        {/* Output Format Options Grid */}
        <div
          id="format-selector-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3"
        >
          {OUTPUT_FORMAT_OPTIONS.map((opt) => {
            const isSelected = state.outputFormat === opt.id;
            return (
              <button
                key={opt.id}
                id={`format-option-${opt.id}`}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, outputFormat: opt.id }))}
                className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold shadow-sm light:bg-indigo-50 light:border-indigo-500 light:text-indigo-900'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 light:bg-slate-50 light:border-slate-200 light:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className="text-[10px] text-slate-500 light:text-slate-400 mt-0.5 line-clamp-1">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom format textarea if Custom selected */}
        {state.outputFormat === 'Custom' && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Jelaskan pola format kustom (skema/templat dokumen):
            </label>
            <textarea
              id="input-custom-output-format"
              rows={2}
              value={state.customOutputFormat}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, customOutputFormat: e.target.value }))
              }
              placeholder="Contoh: Format naskah berita: [Headline tebal] diikuti [Lead 1 kalimat], lalu [3 Poin Fakta Kunci], dan [Kutipan Narasumber]."
              className="w-full text-xs rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
            />
          </div>
        )}
      </div>

      {/* 06 — FEW-SHOT EXAMPLE CARD */}
      <div
        id="builder-card-few-shot"
        className="rounded-2xl border bg-slate-900/70 border-slate-800/80 p-4 transition-all hover:border-slate-700/80 light:bg-white light:border-slate-200"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 tracking-wider">06 — Few-shot Example</span>
              <span className="text-xs font-medium text-slate-400 light:text-slate-500">/ Contoh Output</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 mt-0.5">
              Few-shot prompting memberikan contoh kepada AI agar pola jawaban yang diinginkan lebih mudah dipahami.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {state.enableFewShot && (
              <button
                id="btn-generate-fewshot"
                type="button"
                onClick={handleGenerateFewShot}
                disabled={loadingAction === 'fewshot'}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 light:bg-slate-100 light:text-slate-700 light:border-slate-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Example</span>
              </button>
            )}

            {/* Enable Toggle Button */}
            <button
              id="btn-toggle-few-shot"
              type="button"
              onClick={() =>
                onChange((prev) => ({ ...prev, enableFewShot: !prev.enableFewShot }))
              }
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                state.enableFewShot
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 light:bg-slate-100 light:text-slate-600 light:border-slate-300'
              }`}
            >
              {state.enableFewShot ? (
                <>
                  <ToggleRight className="w-4 h-4" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  <span>Enable Few-shot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {state.enableFewShot ? (
          <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Example Input:
              </label>
              <textarea
                id="input-few-shot-input"
                rows={2}
                value={state.fewShot.input}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    fewShot: { ...prev.fewShot, input: e.target.value },
                  }))
                }
                placeholder="Contoh masukan (misal: soal tes atau teks mentah)..."
                className="w-full text-xs rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Example Output:
              </label>
              <textarea
                id="input-few-shot-output"
                rows={3}
                value={state.fewShot.output}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    fewShot: { ...prev.fewShot, output: e.target.value },
                  }))
                }
                placeholder="Contoh keluaran yang ideal sesuai format yang diinginkan..."
                className="w-full text-xs rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              />
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic mt-1">
            Few-shot prompting opsional. Aktifkan toggle di atas jika Anda ingin memberikan contoh sampel pasangan input-output.
          </p>
        )}
      </div>
    </div>
  );
};
