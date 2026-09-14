import { OutputFormatType, PromptState } from '../types';

export function parseImportedPrompt(rawText: string): PromptState {
  const defaultState: PromptState = {
    role: '',
    context: '',
    instruction: '',
    constraints: [],
    outputFormat: 'Bullet Points',
    customOutputFormat: '',
    enableFewShot: false,
    fewShot: { input: '', output: '' },
  };

  if (!rawText || rawText.trim().length === 0) {
    return defaultState;
  }

  const text = rawText.replace(/\r\n/g, '\n');

  // Regex patterns for standard section headers
  const roleMatch = text.match(/(?:ROLE|PERAN|ACT AS):\s*([\s\S]*?)(?=(?:CONTEXT|KONTEKS|TASK|INSTRUCTION|INSTRUKSI|CONSTRAINTS|BATASAN|OUTPUT FORMAT|FORMAT|EXAMPLE|CONTOH):|$)/i);
  const contextMatch = text.match(/(?:CONTEXT|KONTEKS|SITUASI):\s*([\s\S]*?)(?=(?:ROLE|PERAN|TASK|INSTRUCTION|INSTRUKSI|CONSTRAINTS|BATASAN|OUTPUT FORMAT|FORMAT|EXAMPLE|CONTOH):|$)/i);
  const taskMatch = text.match(/(?:TASK|INSTRUCTION|INSTRUKSI|TUGAS):\s*([\s\S]*?)(?=(?:ROLE|PERAN|CONTEXT|KONTEKS|CONSTRAINTS|BATASAN|OUTPUT FORMAT|FORMAT|EXAMPLE|CONTOH):|$)/i);
  const constraintsMatch = text.match(/(?:CONSTRAINTS|BATASAN|RULES|ATURAN):\s*([\s\S]*?)(?=(?:ROLE|PERAN|CONTEXT|KONTEKS|TASK|INSTRUCTION|INSTRUKSI|OUTPUT FORMAT|FORMAT|EXAMPLE|CONTOH):|$)/i);
  const formatMatch = text.match(/(?:OUTPUT FORMAT|FORMAT OUTPUT|FORMAT):\s*([\s\S]*?)(?=(?:ROLE|PERAN|CONTEXT|KONTEKS|TASK|INSTRUCTION|INSTRUKSI|CONSTRAINTS|BATASAN|EXAMPLE|CONTOH):|$)/i);
  const exampleMatch = text.match(/(?:EXAMPLE|CONTOH|FEW-SHOT):\s*([\s\S]*?)$/i);

  let hasDetectedSections = false;

  if (roleMatch && roleMatch[1].trim()) {
    defaultState.role = roleMatch[1].trim();
    hasDetectedSections = true;
  }
  if (contextMatch && contextMatch[1].trim()) {
    defaultState.context = contextMatch[1].trim();
    hasDetectedSections = true;
  }
  if (taskMatch && taskMatch[1].trim()) {
    defaultState.instruction = taskMatch[1].trim();
    hasDetectedSections = true;
  }

  if (constraintsMatch && constraintsMatch[1].trim()) {
    hasDetectedSections = true;
    const lines = constraintsMatch[1]
      .split('\n')
      .map((l) => l.replace(/^[-*•\d+.]\s*/, '').trim())
      .filter((l) => l.length > 0);
    if (lines.length > 0) {
      defaultState.constraints = lines;
    }
  }

  if (formatMatch && formatMatch[1].trim()) {
    hasDetectedSections = true;
    const fmt = formatMatch[1].trim();
    const lowerFmt = fmt.toLowerCase();
    if (lowerFmt.includes('bullet') || lowerFmt.includes('poin')) {
      defaultState.outputFormat = 'Bullet Points';
    } else if (lowerFmt.includes('number') || lowerFmt.includes('nomor')) {
      defaultState.outputFormat = 'Numbered List';
    } else if (lowerFmt.includes('table') || lowerFmt.includes('tabel')) {
      defaultState.outputFormat = 'Table';
    } else if (lowerFmt.includes('json')) {
      defaultState.outputFormat = 'JSON';
    } else if (lowerFmt.includes('step') || lowerFmt.includes('langkah')) {
      defaultState.outputFormat = 'Step-by-step';
    } else if (lowerFmt.includes('paragraph') || lowerFmt.includes('paragraf')) {
      defaultState.outputFormat = 'Paragraph';
    } else {
      defaultState.outputFormat = 'Custom';
      defaultState.customOutputFormat = fmt;
    }
  }

  if (exampleMatch && exampleMatch[1].trim()) {
    hasDetectedSections = true;
    defaultState.enableFewShot = true;
    const exText = exampleMatch[1].trim();
    const inputPart = exText.match(/(?:Input|Masukan):\s*([\s\S]*?)(?=(?:Output|Keluaran):|$)/i);
    const outputPart = exText.match(/(?:Output|Keluaran):\s*([\s\S]*?)$/i);
    if (inputPart && inputPart[1]) {
      defaultState.fewShot.input = inputPart[1].trim();
    }
    if (outputPart && outputPart[1]) {
      defaultState.fewShot.output = outputPart[1].trim();
    }
    if (!inputPart && !outputPart) {
      defaultState.fewShot.output = exText;
    }
  }

  // Fallback if no specific section delimiters were identified:
  // Place entire text into Instruction so user work is never lost!
  if (!hasDetectedSections) {
    defaultState.instruction = text.trim();
    defaultState.constraints = [
      'Gunakan bahasa Indonesia yang jelas dan mudah dipahami.',
      'Sajikan jawaban secara terstruktur dan hindari spekulasi yang tidak berdasar.'
    ];
  }

  return defaultState;
}

export const parseRawPrompt = parseImportedPrompt;
