import React, { useState, useMemo } from 'react';
import { PromptCategory, PromptTemplate } from '../../types';
import { BUILT_IN_TEMPLATES } from '../../data/templates';
import {
  Search,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Tag,
  Check
} from 'lucide-react';

interface TemplatesViewProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

const CATEGORY_FILTERS: { id: PromptCategory | 'All'; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Academic', label: 'Academic' },
  { id: 'Research', label: 'Research' },
  { id: 'Study', label: 'Study Prep' },
  { id: 'Writing', label: 'Writing & Editing' },
  { id: 'STEM', label: 'STEM & Code' },
  { id: 'Productivity', label: 'Productivity' },
];

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return BUILT_IN_TEMPLATES.filter((tpl) => {
      const matchCategory =
        selectedCategory === 'All' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const title = tpl.title || tpl.name || '';
      const instruction = tpl.data?.instruction || '';
      const matchSearch =
        title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q) ||
        instruction.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const getDifficultyColor = (diff: PromptTemplate['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div id="templates-view" className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white light:text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Template Library
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
            Koleksi blueprint prompt berstandar tinggi yang siap dipakai ke Prompt Builder.
          </p>
        </div>

        {/* Realtime Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-search-templates"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 light:bg-white light:border-slate-300 light:text-slate-900"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div
        id="category-filters-container"
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-pill-${cat.id}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 light:bg-slate-100 light:border-slate-200 light:text-slate-700 light:hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div
        id="templates-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">Tidak ada template yang cocok</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const isExpanded = expandedId === template.id;
            return (
              <div
                key={template.id}
                id={`template-card-${template.id}`}
                className="flex flex-col justify-between rounded-2xl border bg-slate-900/70 border-slate-800/80 p-5 transition-all hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 light:bg-white light:border-slate-200"
              >
                <div>
                  {/* Category & Difficulty Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 light:bg-indigo-50 light:text-indigo-800 light:border-indigo-200">
                      {template.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyColor(
                        template.difficulty
                      )}`}
                    >
                      {template.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-white light:text-slate-900 mb-1.5 leading-snug">
                    {template.title || template.name}
                  </h3>
                  <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed mb-3">
                    {template.description}
                  </p>

                  {/* Expandable Preview Section */}
                  {isExpanded && (
                    <div className="p-3 mb-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-2 text-slate-300 animate-in fade-in light:bg-slate-50 light:border-slate-200 light:text-slate-700">
                      <div>
                        <strong className="text-indigo-400 block text-[10px] uppercase">Peran (Role):</strong>
                        <span className="line-clamp-2">{template.data?.role}</span>
                      </div>
                      <div>
                        <strong className="text-indigo-400 block text-[10px] uppercase">Instruksi:</strong>
                        <span className="line-clamp-3">{template.data?.instruction}</span>
                      </div>
                      <div>
                        <strong className="text-indigo-400 block text-[10px] uppercase">Format:</strong>
                        <span>{template.data?.outputFormat}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 light:border-slate-200 mt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : template.id)}
                    className="text-xs text-slate-400 hover:text-slate-200 light:hover:text-slate-700 flex items-center gap-1"
                  >
                    {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Tutup' : 'Intip'}</span>
                  </button>

                  <button
                    id={`btn-use-template-${template.id}`}
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
