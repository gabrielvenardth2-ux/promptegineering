import React from 'react';
import { PromptState } from '../../types';
import { Zap, X, ThumbsDown, ThumbsUp, ArrowRight, Sparkles, Check } from 'lucide-react';

interface BeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImproved: (state: PromptState) => void;
}

const TRANSFORMED_EXAMPLE: PromptState = {
  role: 'Kamu adalah guru dan tutor fisika SMA kelas 11 yang komunikatif, sabar, dan terbiasa menggunakan analogi visual dunia nyata.',
  context: 'Siswa sedang mempersiapkan ujian akhir semester materi Dinamika Gerak dan Hukum Newton. Siswa memiliki kelemahan dalam membedakan konsep gaya gesek statis vs kinetis.',
  instruction: 'Jelaskan konsep perbedaan gaya gesek statis dan kinetis menggunakan analogi mendorong lemari pakaian yang berat di atas lantai kayu. Berikan 1 contoh soal numerik kontekstual untuk menghitung gaya gesek statis maksimum (koefisien mu_s = 0.4, massa lemari = 50 kg, g = 9.8 m/s²).',
  constraints: [
    'Gunakan bahasa Indonesia yang santun, akrab, dan mudah dimengerti siswa SMA.',
    'Sajikan tahapan penyelesaian rumus secara terurai langkah demi langkah.',
    'Maksimal 350 kata.',
    'Sertakan 1 tips trik mengingat perbedaan statis vs kinetis agar tidak terbalik saat ujian.'
  ],
  outputFormat: 'Step-by-step',
  customOutputFormat: '',
  enableFewShot: true,
  fewShot: {
    input: 'Kapan gaya gesek statis berubah menjadi gaya gesek kinetis?',
    output: 'Tepat saat gaya dorong luar melampaui gaya gesek statis maksimum (F_dorong > fs_max), benda mulai bergerak dan gaya yang bekerja langsung beralih ke gaya gesek kinetis (fk)!'
  }
};

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({
  isOpen,
  onClose,
  onApplyImproved,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onApplyImproved(TRANSFORMED_EXAMPLE);
    onClose();
  };

  return (
    <div
      id="before-after-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="before-after-modal"
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden light:bg-white light:border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white light:text-slate-900">
                Prompt Transformation
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-500">
                Bandingkan prompt mentah vs prompt arsitektur berstandar studio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Comparison */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* BEFORE COLUMN */}
            <div className="flex flex-col rounded-2xl border bg-rose-950/20 border-rose-500/30 p-5 space-y-4 light:bg-rose-50 light:border-rose-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Sebelum (Unstructured)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Skor: 18/100
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 font-mono text-xs text-rose-200 leading-relaxed light:bg-white light:text-rose-900">
                "Bantu saya belajar fisika."
              </div>

              <div className="space-y-2 text-xs text-rose-200/80 light:text-rose-800">
                <p className="font-semibold text-rose-300 light:text-rose-900">
                  Kelemahan Masif:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>AI tidak tahu topik spesifik fisika apa yang dimaksud.</li>
                  <li>Tidak ada profil siswa (apakah SD, SMP, SMA, atau mahasiswa).</li>
                  <li>Tidak ada batasan panjang, format, maupun nada penjelasan.</li>
                  <li>Hasilnya: respon terlalu panjang, membosankan, dan tidak relevan.</li>
                </ul>
              </div>
            </div>

            {/* AFTER COLUMN */}
            <div className="flex flex-col rounded-2xl border bg-emerald-950/20 border-emerald-500/30 p-5 space-y-4 light:bg-emerald-50 light:border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Sesudah (Prompt Studio Architecture)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Skor: 96/100
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 font-mono text-xs text-emerald-200 leading-relaxed space-y-2 max-h-56 overflow-y-auto light:bg-white light:text-emerald-900">
                <div>
                  <strong className="text-emerald-400 block text-[10px]">ROLE:</strong>
                  <span>{TRANSFORMED_EXAMPLE.role}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 block text-[10px]">CONTEXT:</strong>
                  <span>{TRANSFORMED_EXAMPLE.context}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 block text-[10px]">TASK:</strong>
                  <span>{TRANSFORMED_EXAMPLE.instruction}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 block text-[10px]">CONSTRAINTS:</strong>
                  <span>{TRANSFORMED_EXAMPLE.constraints.join(' • ')}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 block text-[10px]">OUTPUT FORMAT:</strong>
                  <span>{TRANSFORMED_EXAMPLE.outputFormat}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200/80 light:text-emerald-800">
                <p className="font-semibold text-emerald-300 light:text-emerald-900">
                  Kekuatan Arsitektur:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Otoritas tutor SMA berpengalaman dan gaya sokratik empatik.</li>
                  <li>Konteks fokus tepat pada Dinamika Gerak & gaya gesek statis vs kinetis.</li>
                  <li>Batasan operasional mencegah teks melebar lebih dari 350 kata.</li>
                  <li>Format step-by-step langsung terintegrasi untuk review belajar.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <span className="text-xs text-slate-400">
            Ingin menguji prompt berstandar studio ini?
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 light:text-slate-700"
            >
              Tutup
            </button>
            <button
              id="btn-improve-this-prompt-load"
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Improve This Prompt (Muat ke Builder)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
