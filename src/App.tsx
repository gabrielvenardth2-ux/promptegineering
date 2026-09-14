import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PromptCategory, PromptState, PromptTemplate, HistoryItem, AppStats } from './types';
import { compilePrompt } from './lib/promptCompiler';
import { calculateLocalPromptScore } from './lib/scoringEngine';
import {
  loadCurrentDraft,
  saveCurrentDraft,
  loadHistory,
  saveHistoryItem,
  deleteHistoryItem,
  clearAllHistory,
  loadStats,
  updateStats,
  loadThemeSetting,
  saveThemeSetting,
  INITIAL_PROMPT_STATE,
} from './lib/storage';
import { checkAiAvailability } from './lib/aiService';

// UI Components
import { Header, ActiveTab } from './components/Header';
import { HeroStats } from './components/HeroStats';
import { ToastContainer, ToastMessage } from './components/Toast';
import { PromptBuilder } from './components/builder/PromptBuilder';
import { PromptPreview } from './components/preview/PromptPreview';
import { PromptScorePanel } from './components/score/PromptScorePanel';
import { TemplatesView } from './components/templates/TemplatesView';
import { LearningView } from './components/learn/LearningView';
import { HistoryView } from './components/history/HistoryView';

// Modals & Tools
import { SaveModal } from './components/modals/SaveModal';
import { ImportModal } from './components/modals/ImportModal';
import { InterpolationDemo } from './components/tools/InterpolationDemo';
import { BeforeAfterModal } from './components/tools/BeforeAfterModal';
import { ChallengeModal } from './components/tools/ChallengeModal';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadThemeSetting());

  // Active view navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  // Core prompt state
  const [promptState, setPromptState] = useState<PromptState>(() => loadCurrentDraft());

  // App metrics & statistics
  const [stats, setStats] = useState<AppStats>(() => loadStats());

  // History list
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  // AI connectivity state
  const [isAiAvailable, setIsAiAvailable] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals visibility
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInterpolationModalOpen, setIsInterpolationModalOpen] = useState(false);
  const [isBeforeAfterModalOpen, setIsBeforeAfterModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // Sync theme with HTML class attribute
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    saveThemeSetting(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check AI Availability on mount
  useEffect(() => {
    let isMounted = true;
    checkAiAvailability().then((res) => {
      if (isMounted) {
        setIsAiAvailable(res.available);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Toast helper
  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Realtime string interpolation
  const compiledPrompt = useMemo(() => {
    return compilePrompt(promptState);
  }, [promptState]);

  // Realtime local scoring engine
  const localScore = useMemo(() => {
    return calculateLocalPromptScore(promptState);
  }, [promptState]);

  // Debounced auto-save draft to LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentDraft(promptState);
    }, 400);
    return () => clearTimeout(timer);
  }, [promptState]);

  // Update prompt created count and last score
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated = updateStats({
        lastScore: localScore.total,
      });
      setStats(updated);
    }, 1000);
    return () => clearTimeout(timer);
  }, [localScore.total]);

  // Action: Reset prompt builder to initial state
  const handleReset = () => {
    if (window.confirm('Reset form ke draf awal Prompt Engineering Studio?')) {
      setPromptState(INITIAL_PROMPT_STATE);
      showToast('info', 'Draf prompt telah direset ke format standar.');
    }
  };

  // Action: Clear prompt builder completely
  const handleClear = () => {
    if (window.confirm('Bersihkan seluruh isian form?')) {
      setPromptState({
        role: '',
        context: '',
        instruction: '',
        constraints: [],
        outputFormat: 'Bullet Points',
        customOutputFormat: '',
        enableFewShot: false,
        fewShot: { input: '', output: '' },
      });
      showToast('info', 'Form telah dikosongkan.');
    }
  };

  // Action: Save Prompt to History
  const handleConfirmSave = (title: string, category: PromptCategory) => {
    const now = new Date();
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      title,
      category,
      timestamp: Date.now(),
      dateStr: now.toLocaleDateString('id-ID'),
      createdAt: now.toISOString(),
      promptData: promptState,
      state: promptState,
      compiledPrompt,
      score: localScore.total,
    };

    saveHistoryItem(newItem);
    const updatedHistory = loadHistory();
    setHistory(updatedHistory);

    const updatedStats = updateStats({
      promptsSaved: stats.promptsSaved + 1,
      promptsCreated: stats.promptsCreated + 1,
      lastScore: localScore.total,
    });
    setStats(updatedStats);

    showToast('success', 'Prompt tersimpan!', `"${title}" disimpan ke riwayat.`);
  };

  // Action: Apply template from library
  const handleSelectTemplate = (template: PromptTemplate) => {
    const data = template.data || INITIAL_PROMPT_STATE;
    setPromptState(data);
    setActiveTab('studio');
    showToast('success', 'Template dimuat!', `Template "${template.title || template.name}" siap digunakan.`);
  };

  // Action: Load from History item
  const handleLoadHistoryItem = (item: HistoryItem) => {
    const data = item.promptData || item.state || INITIAL_PROMPT_STATE;
    setPromptState(data);
    setActiveTab('studio');
    showToast('success', 'Prompt dipulihkan!', `"${item.title}" dimuat ke builder.`);
  };

  // Action: Duplicate History item
  const handleDuplicateHistoryItem = (item: HistoryItem) => {
    const duplicated: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      title: `${item.title} (Salinan)`,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
    };
    saveHistoryItem(duplicated);
    setHistory(loadHistory());
    showToast('info', 'Prompt berhasil diduplikasi.');
  };

  // Action: Delete History item
  const handleDeleteHistoryItem = (id: string) => {
    deleteHistoryItem(id);
    setHistory(loadHistory());
    showToast('info', 'Prompt dihapus dari riwayat.');
  };

  // Action: Clear all History
  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
    updateStats({ promptsSaved: 0 });
    showToast('info', 'Seluruh riwayat prompt telah dibersihkan.');
  };

  // Action: Apply partial improvement from AI or Transformation
  const handleApplyPartialImprovement = (improved: Partial<PromptState>) => {
    setPromptState((prev) => ({
      ...prev,
      ...improved,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200 light:bg-slate-50 light:text-slate-900">
      {/* Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Primary Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={handleReset}
        onSave={() => setIsSaveModalOpen(true)}
        onOpenInterpolationDemo={() => setIsInterpolationModalOpen(true)}
        onOpenBeforeAfter={() => setIsBeforeAfterModalOpen(true)}
        onOpenChallenge={() => setIsChallengeModalOpen(true)}
        isAiAvailable={isAiAvailable}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* STUDIO WORKSPACE TAB */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Dashboard / Landing Area Header with Interactive Stats */}
            <HeroStats stats={stats} currentScore={localScore.total} />

            {/* Responsive 3-Column Studio Workspace */}
            <div
              id="studio-workspace-grid"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Column 1: Prompt Builder (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <PromptBuilder
                  state={promptState}
                  onChange={setPromptState}
                  isAiAvailable={isAiAvailable}
                  onShowToast={showToast}
                />
              </div>

              {/* Column 2: Live Prompt Preview (4 cols) */}
              <div className="lg:col-span-4 sticky top-24 space-y-4">
                <PromptPreview
                  compiledPrompt={compiledPrompt}
                  state={promptState}
                  onClear={handleClear}
                  onOpenImport={() => setIsImportModalOpen(true)}
                  onShowToast={showToast}
                />
              </div>

              {/* Column 3: Prompt Quality Score & AI Assistant (3 cols) */}
              <div className="lg:col-span-3 sticky top-24 space-y-4">
                <PromptScorePanel
                  score={localScore}
                  state={promptState}
                  onApplyImproved={handleApplyPartialImprovement}
                  isAiAvailable={isAiAvailable}
                  onShowToast={showToast}
                />
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES VIEW TAB */}
        {activeTab === 'templates' && (
          <TemplatesView onSelectTemplate={handleSelectTemplate} />
        )}

        {/* LEARN MODE TAB */}
        {activeTab === 'learn' && <LearningView />}

        {/* HISTORY ARCHIVE TAB */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onLoadHistory={handleLoadHistoryItem}
            onDuplicateHistory={handleDuplicateHistoryItem}
            onDeleteHistory={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Modals & Special Tools */}
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleConfirmSave}
        defaultTitle={
          promptState.instruction
            ? promptState.instruction.slice(0, 35) + '...'
            : 'Prompt Studio Draf'
        }
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApply={(newState) => {
          setPromptState(newState);
          showToast('success', 'Prompt berhasil diimpor ke builder!');
        }}
      />

      <InterpolationDemo
        isOpen={isInterpolationModalOpen}
        onClose={() => setIsInterpolationModalOpen(false)}
        state={promptState}
      />

      <BeforeAfterModal
        isOpen={isBeforeAfterModalOpen}
        onClose={() => setIsBeforeAfterModalOpen(false)}
        onApplyImproved={(transformed) => {
          setPromptState(transformed);
          setActiveTab('studio');
          showToast('success', 'Prompt terstruktur berhasil diterapkan!');
        }}
      />

      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        onApplyToStudio={(stateFromChallenge) => {
          setPromptState(stateFromChallenge);
          setActiveTab('studio');
          showToast('success', 'Prompt tantangan dimuat ke Builder!');
        }}
        isAiAvailable={isAiAvailable}
      />

      {/* Studio Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500 light:border-slate-200 light:bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 light:text-slate-600">
              Prompt Engineering Studio
            </span>
            <span>•</span>
            <span>Local-First & Netlify Deployment Ready</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Framework: Role • Context • Task • Constraints • Format • Examples</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
