import React, { useState } from 'react';
import { PromptCategory } from '../../types';
import { BookmarkPlus, X } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, category: PromptCategory) => void;
  defaultTitle?: string;
}

const CATEGORIES: PromptCategory[] = [
  'Academic',
  'Research',
  'Study',
  'Writing',
  'STEM',
  'Productivity'
];

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultTitle = '',
}) => {
  const [title, setTitle] = useState(defaultTitle || 'Prompt Eksperimen');
  const [category, setCategory] = useState<PromptCategory>('Academic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), category);
    onClose();
  };

  return (
    <div
      id="save-prompt-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="save-prompt-modal"
        className="w-full max-w-md rounded-2xl border bg-slate-900 border-slate-800 p-5 sm:p-6 shadow-2xl light:bg-white light:border-slate-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Simpan ke Prompt History
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Judul Prompt:
            </label>
            <input
              id="input-save-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Analisis Jurnal Metodologi..."
              className="w-full text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Kategori:
            </label>
            <select
              id="select-save-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PromptCategory)}
              className="w-full text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 light:text-slate-700 light:hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-confirm-save"
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
            >
              Simpan Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
