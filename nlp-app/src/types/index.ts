export interface TextAnalysis {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  averageWordLength: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface AnalysisState {
  text: string;
  analysis: TextAnalysis | null;
  loading: boolean;
  error: string | null;
} 