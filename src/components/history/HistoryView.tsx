import React, { useState } from 'react';
import { HistoryItem } from '../../types';
import {
  History,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  Layers,
  Search,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  onDuplicateHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  onClearAll: () => void;
  onGoToStudio: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onLoadHistory,
  onDuplicateHistory,
  onDeleteHistory,
  onClearAll,
  onGoToStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.compiledPrompt.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="history-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Prompt History & Archives
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
            Daftar seluruh prompt yang telah kamu simpan di LocalStorage browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-history"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari prompt tersimpan..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-white light:border-slate-300 light:text-slate-900"
            />
          </div>

          {/* Clear All Button */}
          {history.length > 0 && (
            <button
              id="btn-clear-all-history"
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors shrink-0"
              title="Hapus seluruh riwayat"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Clear All */}
      {confirmClear && (
        <div
          id="confirm-clear-banner"
          className="p-4 rounded-xl border bg-rose-950/40 border-rose-500/40 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-2 text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Apakah kamu yakin ingin menghapus seluruh riwayat ({history.length} item)? Tindakan ini tidak dapat dibatalkan.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              id="btn-confirm-delete-all"
              type="button"
              onClick={() => {
                onClearAll();
                setConfirmClear(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Ya, Hapus Semua
            </button>
          </div>
        </div>
      )}

      {/* History Items Grid */}
      {history.length === 0 ? (
        /* Empty State */
        <div
          id="history-empty-state"
          className="py-16 text-center rounded-2xl border border-dashed border-slate-800 p-8 light:border-slate-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white light:text-slate-900">
            Your prompt laboratory is empty.
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 max-w-sm mx-auto mt-1 mb-4">
            Create your first structured prompt. Gunakan tombol "Save" pada header atau panel Studio untuk menyimpan draf ke sini.
          </p>
          <button
            type="button"
            onClick={onGoToStudio}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
          >
            <span>Buka Studio Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p className="text-sm">Tidak ditemukan riwayat dengan kata kunci tersebut.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className="flex flex-col justify-between p-4 rounded-2xl border bg-slate-900/70 border-slate-800/80 transition-all hover:border-slate-700 light:bg-white light:border-slate-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 light:bg-indigo-50 light:text-indigo-800 light:border-indigo-200">
                    {item.category || 'General'}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white light:text-slate-900 mb-1 leading-snug">
                  {item.title}
                </h4>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-300 line-clamp-3 mb-3 light:bg-slate-50 light:border-slate-200 light:text-slate-700">
                  {item.compiledPrompt}
                </div>

                {item.score !== undefined && (
                  <div className="text-[10px] text-slate-400 mb-2">
                    Skor Kualitas: <strong className="text-indigo-400">{item.score}/100</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 light:border-slate-200">
                <button
                  type="button"
                  onClick={() => onDeleteHistory(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Hapus prompt ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDuplicateHistory(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors light:bg-slate-100 light:text-slate-700"
                    title="Duplikat prompt"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplikat</span>
                  </button>

                  <button
                    id={`btn-open-history-${item.id}`}
                    type="button"
                    onClick={() => onLoadHistory(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Buka di Studio</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
