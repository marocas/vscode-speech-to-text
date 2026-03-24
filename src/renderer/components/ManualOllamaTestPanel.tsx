import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { DEFAULT_DICTATION_LANGUAGE, DEFAULT_SOURCE_LANGUAGE } from '@shared/constants';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LanguageSelector } from './DictationPanel';

export const ManualOllamaTestPanel: React.FC = () => {
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ raw: string; processed: string } | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState(DEFAULT_SOURCE_LANGUAGE);
  const [outputLanguage, setOutputLanguage] = useState(DEFAULT_DICTATION_LANGUAGE);

  useEffect(() => {
    window.api
      .getMachineSettings()
      .then((settings) => {
        if (settings.sourceLanguage) {
          setSourceLanguage(settings.sourceLanguage);
        }
        if (settings.defaultDictationLanguage) {
          setOutputLanguage(settings.defaultDictationLanguage);
        }
      })
      .catch(() => {});
  }, []);

  const handleProcess = async () => {
    const rawText = manualInput.trim();
    if (!rawText) {
      toast.error('Enter text first to test Ollama processing.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const processed = await window.api.processDictationText(
        rawText,
        outputLanguage,
        sourceLanguage
      );
      const textForOutput = processed.text?.trim() || rawText;

      setResult({ raw: rawText, processed: textForOutput });

      await window.api.saveDictation(textForOutput);
      const sendResult = await window.api.sendToVSCode(textForOutput);
      toast.success(`Sent to VS Code: ${sendResult.message}`);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to process manual text with Ollama');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Write or paste raw text to test the Ollama processing pipeline (dictionary corrections + LLM
        prompt). The processed result will be sent to VS Code.
      </Typography>

      <LanguageSelector
        currentLanguage={sourceLanguage}
        onLanguageChange={setSourceLanguage}
        label="Input language"
      />
      <LanguageSelector
        currentLanguage={outputLanguage}
        onLanguageChange={setOutputLanguage}
        label="Output language"
      />

      <TextField
        label="Raw input"
        multiline
        minRows={3}
        placeholder="Paste raw transcript text here..."
        value={manualInput}
        onChange={(event) => setManualInput(event.target.value)}
        disabled={loading}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={() => void handleProcess()}
        disabled={loading || !manualInput.trim()}
      >
        {loading ? 'Processing...' : 'Process with Ollama'}
      </Button>

      {result && (
        <>
          <Divider />
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Result
            </Typography>

            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
              >
                Raw input:
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fafafa' }}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  {result.raw}
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
              >
                Processed output (sent to VS Code):
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: result.processed !== result.raw ? '#e8f5e9' : '#fafafa',
                  borderColor: result.processed !== result.raw ? '#4caf50' : undefined,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: result.processed !== result.raw ? '#2e7d32' : 'text.secondary',
                  }}
                >
                  {result.processed}
                </Typography>
              </Paper>
              {result.processed === result.raw && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
                >
                  No changes applied by Ollama.
                </Typography>
              )}
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
};
