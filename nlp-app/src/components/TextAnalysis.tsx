import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { RootState } from '../store/store';
import { setText, clearAnalysis } from '../store/analysisSlice';

const TextAnalysis: React.FC = () => {
  const dispatch = useDispatch();
  const { text, analysis } = useSelector((state: RootState) => state.analysis);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setText(event.target.value));
  };

  const handleClear = () => {
    dispatch(clearAnalysis());
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