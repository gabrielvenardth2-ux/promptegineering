import { AppStats, HistoryItem, PromptState } from '../types';
import { BUILT_IN_TEMPLATES } from '../data/templates';

const DRAFT_KEY = 'promptStudio_currentDraft';
const HISTORY_KEY = 'promptStudio_history';
const SETTINGS_KEY = 'promptStudio_settings';
const STATS_KEY = 'promptStudio_stats';

export const INITIAL_PROMPT_STATE: PromptState = {
  role: 'Kamu adalah tutor fisika SMA berpengalaman yang ramah dan sabar.',
  context: 'Siswa kelas 11 sedang mempersiapkan ulangan harian bab Hukum Newton tentang Gerak dan Gravitasi. Siswa sering keliru membedakan massa dan berat.',
  instruction: 'Jelaskan konsep perbedaan massa dan berat dengan analogi astronot yang mendarat di Bulan. Berikan 1 contoh soal perhitungan numerik sederhana untuk menghitung berat benda 50 kg di Bumi vs di Bulan (g_bulan = 1.6 m/s²).',
  constraints: [
    'Gunakan bahasa Indonesia yang santun dan mudah dipahami remaja.',
    'Jangan gunakan rumus matematika yang terlalu rumit.',
    'Maksimal 350 kata.',
    'Sertakan 1 pertanyaan reflektif di akhir untuk mengecek pemahaman.'
  ],
  outputFormat: 'Step-by-step',
  customOutputFormat: '',
  enableFewShot: true,
  fewShot: {
    input: 'Berapa massa benda jika di Bumi beratnya 98 N (g = 9.8 m/s²)?',
    output: 'Massa m = W / g = 98 / 9.8 = 10 kg. Ingat: Massa selalu tetap di mana pun benda berada!'
  }
};

export const INITIAL_STATS: AppStats = {
  promptsCreated: 1,
  promptsSaved: 0,
  templatesAvailable: BUILT_IN_TEMPLATES.length,
  lastScore: 92,
};

export function loadCurrentDraft(): PromptState {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return INITIAL_PROMPT_STATE;
    const parsed = JSON.parse(raw);
    return {
      role: parsed.role || '',
      context: parsed.context || '',
      instruction: parsed.instruction || '',
      constraints: Array.isArray(parsed.constraints) ? parsed.constraints : [],
      outputFormat: parsed.outputFormat || 'Bullet Points',
      customOutputFormat: parsed.customOutputFormat || '',
      enableFewShot: Boolean(parsed.enableFewShot),
      fewShot: {
        input: parsed.fewShot?.input || '',
        output: parsed.fewShot?.output || ''
      }
    };
  } catch (e) {
    console.warn('Failed to load draft from localStorage:', e);
    return INITIAL_PROMPT_STATE;
  }
}

export function saveCurrentDraft(draft: PromptState): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn('Failed to save draft to localStorage:', e);
  }
}

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load history from localStorage:', e);
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): void {
  try {
    const current = loadHistory();
    // Prepend new item
    const updated = [item, ...current.filter((h) => h.id !== item.id)];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save history item to localStorage:', e);
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const current = loadHistory();
    const updated = current.filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to delete history item:', e);
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear history:', e);
  }
}

export function loadStats(): AppStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      promptsCreated: typeof parsed.promptsCreated === 'number' ? parsed.promptsCreated : 1,
      promptsSaved: typeof parsed.promptsSaved === 'number' ? parsed.promptsSaved : 0,
      templatesAvailable: BUILT_IN_TEMPLATES.length,
      lastScore: typeof parsed.lastScore === 'number' ? parsed.lastScore : 88,
    };
  } catch (e) {
    return INITIAL_STATS;
  }
}

export function updateStats(partial: Partial<AppStats>): AppStats {
  try {
    const current = loadStats();
    const updated: AppStats = {
      ...current,
      ...partial,
      templatesAvailable: BUILT_IN_TEMPLATES.length,
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return INITIAL_STATS;
  }
}

export function loadThemeSetting(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return 'dark';
    const parsed = JSON.parse(raw);
    return parsed.theme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveThemeSetting(theme: 'dark' | 'light'): void {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.theme = theme;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.warn('Failed to save theme setting:', e);
  }
}
