import React, { useState } from 'react';
import { PromptState } from '../../types';
import { parseRawPrompt } from '../../lib/promptParser';
import { Upload, FileText, Clipboard, X, Check, Sparkles } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (state: PromptState) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onApply }) => {
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const parsedPreview = parseRawPrompt(importText);
  const hasContent = importText.trim().length > 0;

  const handleApply = () => {
    if (!hasContent) return;
    onApply(parsedPreview);
    onClose();
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setImportText(content);
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="import-prompt-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="import-prompt-modal"
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden light:bg-white light:border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Import & Parse Existing Prompt
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 light:border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'paste'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 light:text-slate-600'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Paste Prompt Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 light:text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Upload File (.txt / .json)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'paste' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                Tempel teks prompt Anda di bawah:
              </label>
              <textarea
                id="input-paste-prompt"
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="ROLE: Kamu adalah ahli biologi...\nCONTEXT: ...\nTASK: ...\nCONSTRAINTS: ..."
                className="w-full text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
              />
            </div>
          ) : (
            <div
              id="upload-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/40 light:border-slate-300 light:bg-slate-50'
              }`}
            >
              <FileText className="w-10 h-10 mx-auto mb-2 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-200 light:text-slate-800">
                Tarik file .txt atau .json ke sini, atau klik untuk memilih
              </p>
              <input
                id="file-upload-input"
                type="file"
                accept=".txt,.json,.md"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="mt-3 text-xs text-slate-400"
              />
            </div>
          )}

          {/* Live Detected Structure Preview */}
          {hasContent && (
            <div
              id="parsed-detection-preview"
              className="p-4 rounded-xl border bg-slate-950/80 border-slate-800 text-xs space-y-2 light:bg-slate-50 light:border-slate-200"
            >
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deteksi Parser Otomatis:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-700">
                  <span className="font-semibold text-slate-400 block">Role Terdeteksi:</span>
                  <span className="line-clamp-2">{parsedPreview.role || '(Belum terdeteksi)'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-700">
                  <span className="font-semibold text-slate-400 block">Format Output:</span>
                  <span>{parsedPreview.outputFormat}</span>
                </div>
                <div className="col-span-full p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-700">
                  <span className="font-semibold text-slate-400 block">Instruksi Utama:</span>
                  <span className="line-clamp-2">{parsedPreview.instruction || '(Belum terdeteksi)'}</span>
                </div>
                <div className="col-span-full p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 light:bg-white light:border-slate-200 light:text-slate-700">
                  <span className="font-semibold text-slate-400 block">
                    Batasan ({parsedPreview.constraints.length}):
                  </span>
                  <span className="line-clamp-2">
                    {parsedPreview.constraints.join(' • ') || '(Tidak ada batasan terdeteksi)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 light:text-slate-700"
          >
            Batal
          </button>
          <button
            id="btn-apply-parsed-prompt"
            type="button"
            disabled={!hasContent}
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 disabled:opacity-40"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan ke Studio Builder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
