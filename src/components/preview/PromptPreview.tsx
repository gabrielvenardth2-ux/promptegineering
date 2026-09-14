import React, { useState } from 'react';
import { PromptState } from '../../types';
import { estimateStats } from '../../lib/promptCompiler';
import {
  Copy,
  Check,
  Download,
  Trash2,
  FileCode,
  Sparkles,
  Upload,
  FileText,
  FileJson,
  Hash,
  Terminal
} from 'lucide-react';

interface PromptPreviewProps {
  compiledPrompt: string;
  state: PromptState;
  onClear: () => void;
  onOpenImport: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  compiledPrompt,
  state,
  onClear,
  onOpenImport,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const stats = estimateStats(compiledPrompt);
  const isEmpty = compiledPrompt.trim().length === 0;

  // Copy plain text prompt
  const handleCopyPrompt = async () => {
    if (isEmpty) {
      onShowToast('info', 'Prompt masih kosong.');
      return;
    }
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setCopied(true);
      onShowToast('success', '✓ Copied!', 'Prompt berhasil disalin ke clipboard.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      fallbackCopy(compiledPrompt);
      setCopied(true);
      onShowToast('success', '✓ Copied!', 'Prompt disalin via fallback.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    if (isEmpty) return;
    const md = `\`\`\`markdown\n${compiledPrompt}\n\`\`\``;
    try {
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      onShowToast('success', '✓ Copied as Markdown!');
      setTimeout(() => setCopiedMd(false), 2500);
    } catch {
      fallbackCopy(md);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
    }
  };

  // Fallback copy using textarea
  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  // Download .txt
  const handleDownloadTxt = () => {
    if (isEmpty) {
      onShowToast('info', 'Prompt masih kosong untuk diunduh.');
      return;
    }
    try {
      const blob = new Blob([compiledPrompt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-engineering-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('success', 'File .txt berhasil diunduh!');
    } catch (e) {
      onShowToast('error', 'Gagal mengunduh file .txt');
    }
  };

  // Download .json
  const handleDownloadJson = () => {
    if (isEmpty) {
      onShowToast('info', 'Prompt masih kosong.');
      return;
    }
    try {
      const exportObject = {
        title: 'Prompt Engineering Studio Export',
        exportedAt: new Date().toISOString(),
        promptState: state,
        compiledPrompt: compiledPrompt,
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('success', 'File JSON berhasil diunduh!');
    } catch (e) {
      onShowToast('error', 'Gagal mengunduh JSON');
    }
  };

  return (
    <div
      id="prompt-preview-panel"
      className="flex flex-col h-full rounded-2xl border bg-slate-900/80 border-slate-800/90 shadow-xl overflow-hidden backdrop-blur-sm light:bg-white light:border-slate-200"
    >
      {/* Top Bar with Title and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-tight text-white light:text-slate-900">
            Generated Prompt
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono hidden sm:inline light:bg-cyan-50 light:text-cyan-700 light:border-cyan-200">
            Realtime Interpolation
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-import-prompt-trigger"
            type="button"
            onClick={onOpenImport}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
            title="Impor prompt dari teks atau file .txt"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            id="btn-preview-clear"
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Bersihkan isi seluruh form builder"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[360px] lg:min-h-[460px] bg-slate-950/40 light:bg-slate-50/50">
        {isEmpty ? (
          <div
            id="preview-empty-state"
            className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 my-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-slate-200 light:text-slate-700">
              Start building your prompt.
            </h4>
            <p className="text-xs text-slate-400 light:text-slate-500 max-w-sm mt-1 leading-relaxed">
              Isi peran, konteks, instruksi utama, dan batasan pada panel di sebelah kiri. Prompt terstruktur akan otomatis dirakit secara realtime di sini.
            </p>
          </div>
        ) : (
          <pre
            id="compiled-prompt-code"
            className="font-mono text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-normal break-words light:text-slate-800"
          >
            {compiledPrompt}
          </pre>
        )}
      </div>

      {/* Live Stats Bar */}
      <div
        id="preview-metrics-bar"
        className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-400 font-mono light:bg-white light:border-slate-200 light:text-slate-500"
      >
        <div className="flex items-center gap-4">
          <span>{stats.charCount} karakter</span>
          <span>{stats.wordCount} kata</span>
          <span>~{stats.tokenCount} token</span>
          <span className="hidden sm:inline">{stats.lineCount} baris</span>
        </div>
        <div className="text-[10px] text-slate-500">
          Target: AI Studio / LLM Ready
        </div>
      </div>

      {/* Primary Action Buttons Footer */}
      <div
        id="preview-actions-footer"
        className="flex flex-wrap items-center justify-between gap-2 p-3.5 border-t border-slate-800 bg-slate-900 light:bg-slate-100 light:border-slate-200"
      >
        {/* Main Copy Button */}
        <button
          id="btn-copy-prompt"
          type="button"
          onClick={handleCopyPrompt}
          disabled={isEmpty}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '✓ Copied!' : 'COPY PROMPT'}</span>
        </button>

        {/* Secondary Export Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-download-txt"
            type="button"
            onClick={handleDownloadTxt}
            disabled={isEmpty}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40 light:bg-white light:text-slate-700 light:border-slate-300 light:hover:bg-slate-100"
            title="Unduh sebagai file dokumen .txt"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>

          <button
            id="btn-copy-markdown"
            type="button"
            onClick={handleCopyMarkdown}
            disabled={isEmpty}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40 light:bg-white light:text-slate-700 light:border-slate-300 light:hover:bg-slate-100"
            title="Salin dalam blok kode Markdown"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{copiedMd ? '✓' : 'Markdown'}</span>
          </button>

          <button
            id="btn-download-json"
            type="button"
            onClick={handleDownloadJson}
            disabled={isEmpty}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40 light:bg-white light:text-slate-700 light:border-slate-300 light:hover:bg-slate-100"
            title="Unduh seluruh state dalam format JSON"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
