import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { SnippetEntry } from '@shared/types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const SnippetManager: React.FC = () => {
  const [snippets, setSnippets] = useState<SnippetEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  const loadSnippets = async () => {
    try {
      const data = await window.api.getSnippets();
      setSnippets(data);
    } catch (error) {
      const errorMsg = 'Error loading snippets';
      console.error(errorMsg, error);
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  React.useEffect(() => {
    loadSnippets();
  }, []);

  const handleAddSnippet = async () => {
    if (!newTrigger.trim() || !newReplacement.trim()) {
      toast.warn('Please fill in all fields');
      return;
    }

    try {
      await window.api.addSnippet(newTrigger, newReplacement, newCategory);
      setNewTrigger('');
      setNewReplacement('');
      setNewCategory('general');
      setShowForm(false);
      await loadSnippets();
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to add snippet';
      toast.error(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    try {
      await window.api.deleteSnippet(id);
      await loadSnippets();
    } catch (error) {
      const errorMsg = 'Failed to delete snippet';
      toast.error(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          ✂️ Voice Snippets
        </Typography>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="contained"
          color="success"
          size="small"
          startIcon={<AddIcon />}
        >
          New Snippet
        </Button>
      </Box>

      <Collapse in={showForm} unmountOnExit>
        <Paper sx={{ p: 3, backgroundColor: 'action.hover' }}>
          <Stack spacing={2}>
            <TextField
              placeholder="Voice trigger (e.g., 'changelog')"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              fullWidth
              label="Trigger"
            />
            <TextField
              placeholder="Full text replacement"
              value={newReplacement}
              onChange={(e) => setNewReplacement(e.target.value)}
              multiline
              rows={3}
              fullWidth
              label="Replacement Text"
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="code-review">Code Review</MenuItem>
                <MenuItem value="pr-template">PR Template</MenuItem>
                <MenuItem value="bug-report">Bug Report</MenuItem>
                <MenuItem value="documentation">Documentation</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={handleAddSnippet}
                variant="contained"
                color="success"
                fullWidth
                size="small"
              >
                Save Snippet
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outlined" fullWidth size="small">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Collapse>

      <Box>
        {snippets.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            No snippets yet. Create your first one!
          </Typography>
        ) : (
          <Stack spacing={2}>
            {snippets.map((snippet) => (
              <Paper key={snippet.id} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      "{snippet.trigger}"
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                        mt: 0.5,
                      }}
                    >
                      {snippet.category}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteSnippet(snippet.id)}
                  >
                    Delete
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    backgroundColor: 'action.hover',
                    p: 1,
                    borderRadius: 1,
                    display: 'block',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '0.75rem',
                  }}
                >
                  {snippet.replacement}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};
