export enum ComparisonMode {
  TEXT = 'TEXT',
  JSON = 'JSON',
  SEMANTIC = 'SEMANTIC'
}

export interface DiffResult {
  isExactMatch: boolean;
  diffLines: Array<{
    lineNumber: number;
    content: string;
    status: 'added' | 'removed' | 'unchanged';
  }>;
}

export interface GeminiAnalysisResult {
  isSemanticMatch: boolean;
  similarityScore: number; // 0-100
  summary: string;
  keyDifferences: string[];
  suggestions?: string[];
}

export interface InputState {
  left: string;
  right: string;
}
