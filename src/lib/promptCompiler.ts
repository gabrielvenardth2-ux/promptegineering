import { PromptState } from '../types';

export function compilePrompt(state: PromptState): string {
  const sections: string[] = [];

  // 01. Role
  if (state.role && state.role.trim().length > 0) {
    sections.push(`ROLE:\n${state.role.trim()}`);
  }

  // 02. Context
  if (state.context && state.context.trim().length > 0) {
    sections.push(`CONTEXT:\n${state.context.trim()}`);
  }

  // 03. Main Instruction / Task
  if (state.instruction && state.instruction.trim().length > 0) {
    sections.push(`TASK:\n${state.instruction.trim()}`);
  }

  // 04. Constraints
  const activeConstraints = state.constraints.filter(
    (c) => c && c.trim().length > 0
  );
  if (activeConstraints.length > 0) {
    const formattedConstraints = activeConstraints
      .map((c) => `- ${c.trim()}`)
      .join('\n');
    sections.push(`CONSTRAINTS:\n${formattedConstraints}`);
  }

  // 05. Output Format
  let formatDesc = '';
  if (state.outputFormat === 'Custom') {
    formatDesc = state.customOutputFormat.trim();
  } else {
    formatDesc = state.outputFormat;
  }

  if (formatDesc && formatDesc.length > 0) {
    sections.push(`OUTPUT FORMAT:\n${formatDesc}`);
  }

  // 06. Few-shot Example
  if (
    state.enableFewShot &&
    (state.fewShot.input.trim().length > 0 || state.fewShot.output.trim().length > 0)
  ) {
    const parts: string[] = [];
    if (state.fewShot.input.trim().length > 0) {
      parts.push(`Input:\n${state.fewShot.input.trim()}`);
    }
    if (state.fewShot.output.trim().length > 0) {
      parts.push(`Output:\n${state.fewShot.output.trim()}`);
    }
    sections.push(`EXAMPLE:\n${parts.join('\n\n')}`);
  }

  return sections.join('\n\n');
}

export function estimateStats(text: string) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Rule of thumb for token estimation (1 token ~= 4 chars or 0.75 words)
  const tokenCount = Math.round(wordCount * 1.33) || Math.round(charCount / 4);
  const lineCount = text ? text.split('\n').length : 0;

  return { charCount, wordCount, tokenCount, lineCount };
}
