import { PromptState } from '../types';

export interface AIResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  localMode?: boolean;
}

async function postToGemini(action: string, payload: { promptData?: PromptState; query?: string }): Promise<AIResponse> {
  try {
    // Try Netlify function path first, fallback to /api/gemini
    let res: Response;
    try {
      res = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
    } catch {
      res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
    }

    if (!res.ok) {
      return {
        ok: false,
        error: `Server responded with status ${res.status}`,
        localMode: true,
      };
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'Gagal tersambung ke layanan AI. Mode lokal tetap aktif.',
      localMode: true,
    };
  }
}

export async function checkAiAvailability(): Promise<{ available: boolean; message: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return {
        available: Boolean(data.hasGeminiKey),
        message: data.hasGeminiKey
          ? 'Gemini AI Assistant aktif & terhubung.'
          : 'AI Assistant is not configured yet. Local mode is active.',
      };
    }
  } catch {
    // ignore
  }
  return {
    available: false,
    message: 'AI Assistant is not configured yet. Local mode is active.',
  };
}

export async function aiImprovePrompt(promptData: PromptState) {
  return postToGemini('improve', { promptData });
}

export async function aiGenerateRole(instruction: string, context?: string) {
  return postToGemini('generate_role', { query: instruction, promptData: { instruction, context } as any });
}

export async function aiGenerateContext(role: string, instruction: string) {
  return postToGemini('generate_context', { promptData: { role, instruction } as any });
}

export async function aiSuggestConstraints(role: string, instruction: string) {
  return postToGemini('suggest_constraints', { promptData: { role, instruction } as any });
}

export async function aiSuggestFormat(instruction: string) {
  return postToGemini('suggest_format', { query: instruction, promptData: { instruction } as any });
}

export async function aiGenerateFewShot(instruction: string, outputFormat: string) {
  return postToGemini('generate_fewshot', { promptData: { instruction, outputFormat } as any });
}

export async function aiExplainPrompt(promptData: PromptState) {
  return postToGemini('explain', { promptData });
}

export async function aiReviewChallenge(scenario: string, promptData: PromptState) {
  return postToGemini('challenge_review', { query: scenario, promptData });
}
