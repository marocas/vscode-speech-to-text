import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { DictionaryEntry } from '@shared/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const DictionaryManager: React.FC = () => {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState('custom');
  const [searchTerm, setSearchTerm] = useState('');

  const loadDictionary = async () => {
    try {
      const data = await window.api.getDictionary();
      setDictionary(data);
    } catch (error) {
      const errorMsg = 'Error loading dictionary';
      console.error(errorMsg, error);
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  useEffect(() => {
    loadDictionary();
  }, []);

  const handleAddWord = async () => {
    if (!newWord.trim()) {
      toast.warn('Please enter a word');
      return;
    }

    try {
      await window.api.addToDictionary(newWord, newCategory);
      setNewWord('');
      await loadDictionary();
    } catch (error) {
      const errorMsg = 'Failed to add word to dictionary';
      toast.error(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const filteredDictionary = dictionary.filter((entry) =>
    entry.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['custom', 'dev-terms', 'acronym'];

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          📚 Personal Dictionary
        </Typography>
      </div>

      <Alert severity="info">
        Build your personal dictionary to improve transcription accuracy for domain-specific terms.
      </Alert>

      <Stack spacing={2}>
        <Stack direction="row" spacing={1}>
          <TextField
            placeholder="Add a new word (e.g., Supabase, camelCase)"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
            fullWidth
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleAddWord}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add
          </Button>
        </Stack>

        <TextField
          placeholder="Search dictionary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Stack>

      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {filteredDictionary.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            No words in dictionary yet
          </Typography>
        ) : (
          <Stack spacing={1}>
            {filteredDictionary.map((entry) => (
              <Paper
                key={entry.word}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {entry.word}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {entry.category} • Used {entry.frequency} times
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: 'action.hover',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {entry.category}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};
