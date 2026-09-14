import React from 'react';
import { PromptState } from '../../types';
import { SplitSquareVertical, X, ArrowDown, Code2, Sparkles, Terminal } from 'lucide-react';

interface InterpolationDemoProps {
  isOpen: boolean;
  onClose: () => void;
  state: PromptState;
}

export const InterpolationDemo: React.FC<InterpolationDemoProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="interpolation-demo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="interpolation-demo-modal"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border bg-slate-900 border-slate-800 shadow-2xl overflow-hidden light:bg-white light:border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 light:bg-slate-50 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white light:text-slate-900">
                How Prompt Generation Works
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-500">
                Konsep String Interpolation & Rekayasa Template Literal
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Conceptual explanation */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 space-y-1.5 light:bg-cyan-50 light:border-cyan-200 light:text-cyan-900">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Prinsip Rekayasa Komputasi
            </p>
            <p className="text-xs leading-relaxed text-cyan-200/90 light:text-cyan-800">
              Dalam rekayasa perangkat lunak dan Prompt Engineering, prompt tidak ditulis acak, melainkan dirakit secara deterministik melalui ekspresi{' '}
              <code className="px-1 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-mono text-[11px]">
                {`\`ROLE: \${role}\\nCONTEXT: \${context}...\``}
              </code>
              . Dengan cara ini, sistem software dapat mengotomasi pengkondisian LLM secara konsisten.
            </p>
          </div>

          {/* Visual Assembly Pipeline */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Alur Perakit Variabel Realtime
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Variable 1 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-indigo-400 font-mono text-xs font-bold block mb-1">
                  const role =
                </span>
                <p className="text-xs font-mono text-slate-300 line-clamp-2 light:text-slate-700">
                  "{state.role || '(kosong)'}"
                </p>
              </div>

              {/* Variable 2 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-indigo-400 font-mono text-xs font-bold block mb-1">
                  const context =
                </span>
                <p className="text-xs font-mono text-slate-300 line-clamp-2 light:text-slate-700">
                  "{state.context || '(kosong)'}"
                </p>
              </div>

              {/* Variable 3 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-indigo-400 font-mono text-xs font-bold block mb-1">
                  const instruction =
                </span>
                <p className="text-xs font-mono text-slate-300 line-clamp-2 light:text-slate-700">
                  "{state.instruction || '(kosong)'}"
                </p>
              </div>

              {/* Variable 4 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-indigo-400 font-mono text-xs font-bold block mb-1">
                  const constraints = [{state.constraints.length} aturan]
                </span>
                <p className="text-xs font-mono text-slate-300 line-clamp-2 light:text-slate-700">
                  {state.constraints.map((c, i) => `- ${c}`).join(' ') || '(kosong)'}
                </p>
              </div>
            </div>

            <div className="flex justify-center my-2 text-indigo-400">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* Compiled Output Code Block */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 light:bg-slate-900">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-indigo-300">
                  <Terminal className="w-3.5 h-3.5" />
                  Compiled Prompt Output
                </span>
                <span className="font-mono">String Literal Output</span>
              </div>
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {`ROLE: ${state.role}\n\nCONTEXT: ${state.context}\n\nMAIN INSTRUCTION: ${state.instruction}\n\nCONSTRAINTS:\n${state.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nOUTPUT FORMAT: ${state.outputFormat}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end light:bg-slate-50 light:border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Mengerti, Lanjutkan Studio
          </button>
        </div>
      </div>
    </div>
  );
};
