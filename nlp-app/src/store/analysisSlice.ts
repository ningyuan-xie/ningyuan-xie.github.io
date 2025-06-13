import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisState, TextAnalysis } from '../types';

const initialState: AnalysisState = {
  text: '',
  analysis: null,
  loading: false,
  error: null,
};

const analyzeText = (text: string): TextAnalysis => {
  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const characters = text.replace(/\s/g, '').length;
  
  // Simple sentiment analysis based on positive/negative word counts
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate', 'horrible'];
  
  const positiveCount = words.filter(word => positiveWords.includes(word.toLowerCase())).length;
  const negativeCount = words.filter(word => negativeWords.includes(word.toLowerCase())).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';

  return {
    wordCount: words.length,
    characterCount: characters,
    sentenceCount: sentences.length,
    averageWordLength: characters / words.length || 0,
    sentiment,
  };
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      state.analysis = analyzeText(action.payload);
    },
    clearAnalysis: (state) => {
      state.text = '';
      state.analysis = null;
      state.error = null;
    },
  },
});

export const { setText, clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer; 