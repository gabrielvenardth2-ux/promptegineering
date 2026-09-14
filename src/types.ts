export type OutputFormatType =
  | 'Paragraph'
  | 'Bullet Points'
  | 'Numbered List'
  | 'Table'
  | 'JSON'
  | 'Step-by-step'
  | 'Custom';

export interface PromptState {
  role: string;
  context: string;
  instruction: string;
  constraints: string[];
  outputFormat: OutputFormatType;
  customOutputFormat: string;
  enableFewShot: boolean;
  fewShot: {
    input: string;
    output: string;
  };
}

export interface PromptScoreBreakdown {
  clarity: number; // 0-20
  context: number; // 0-20
  specificity: number; // 0-20
  constraints: number; // 0-20
  outputStructure: number; // 0-20
}

export interface PromptScore {
  total: number; // 0-100
  breakdown: PromptScoreBreakdown;
  feedback: string[];
  grade: 'Needs Work' | 'Fair' | 'Good' | 'Excellent' | 'Mastery';
}

export type TemplateCategory =
  | 'All'
  | 'Academic'
  | 'Research'
  | 'Study'
  | 'Writing'
  | 'STEM'
  | 'Productivity';

export type PromptCategory = Exclude<TemplateCategory, 'All'>;

export interface PromptTemplate {
  id: string;
  name: string;
  title?: string;
  category: PromptCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  data: PromptState;
}

export interface LearningModule {
  id: number;
  title: string;
  concept: string;
  summary: string;
  badExample: string;
  betterExample: string;
  improvementReason: string;
  keyTakeaway: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  dateStr: string;
  createdAt?: string;
  score: number;
  category: string;
  promptData: PromptState;
  state?: PromptState;
  compiledPrompt: string;
}

export interface AppStats {
  promptsCreated: number;
  promptsSaved: number;
  templatesAvailable: number;
  lastScore: number;
}

export interface PromptChallenge {
  id: string;
  title: string;
  scenario: string;
  targetRole: string;
  hints: string[];
  difficulty: 'Mudah' | 'Menengah' | 'Tantangan';
}
