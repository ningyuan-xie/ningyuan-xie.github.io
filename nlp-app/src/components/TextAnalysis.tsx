import React, { useState } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Chip,
  Button,
} from '@mui/material';

interface TextAnalysisResult {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  averageWordLength: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<TextAnalysisResult | null>(null);

  const analyzeText = (text: string): TextAnalysisResult => {
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

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    setAnalysis(newText ? analyzeText(newText) : null);
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Text Analysis
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Enter your text"
          value={text}
          onChange={handleTextChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClear}
          sx={{ mb: 2 }}
        >
          Clear
        </Button>
      </Paper>

      {analysis && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Typography variant="subtitle1">Word Count</Typography>
              <Typography variant="h6">{analysis.wordCount}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Typography variant="subtitle1">Character Count</Typography>
              <Typography variant="h6">{analysis.characterCount}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Typography variant="subtitle1">Sentence Count</Typography>
              <Typography variant="h6">{analysis.sentenceCount}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Typography variant="subtitle1">Average Word Length</Typography>
              <Typography variant="h6">
                {analysis.averageWordLength.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Typography variant="subtitle1">Sentiment</Typography>
              <Chip
                label={analysis.sentiment}
                color={
                  analysis.sentiment === 'positive'
                    ? 'success'
                    : analysis.sentiment === 'negative'
                    ? 'error'
                    : 'default'
                }
              />
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TextAnalysis; 