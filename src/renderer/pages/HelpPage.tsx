import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

export const HelpPage: React.FC = () => {
  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
          <HelpIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Help
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Learn how to set up and use Smart Transcription Daemon.
        </Typography>
      </Box>

      {/* Getting Started */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Getting Started
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Smart Transcription Daemon converts your voice into text using a local Whisper engine and
          optionally refines or translates the output with a local Ollama LLM. The transcribed text
          is sent to your active application (e.g. VS Code) via clipboard paste.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          To get started, you need to: grant system permissions, install Whisper, download a Whisper
          model, and optionally install Ollama for text refinement and translation.
        </Typography>
      </Paper>

      {/* Permissions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          System Permissions (macOS)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          The app requires two macOS permissions to function correctly. You can manage these in the{' '}
          <strong>Settings → Permissions</strong> tab.
        </Typography>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              🎤 Microphone Access
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Required to capture audio from your microphone for speech-to-text transcription.
              Without this permission, the app cannot record your voice.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              <strong>How to enable:</strong> Go to{' '}
              <em>System Settings → Privacy & Security → Microphone</em> and toggle on Smart
              Transcription Daemon. Alternatively, use the toggle in the Permissions tab — the app
              will prompt you automatically.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              ♿ Accessibility Access
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Required for two features: <strong>global hotkeys</strong> (to start/stop dictation
              from any app) and <strong>auto-paste</strong> (to automatically paste transcribed text
              into the focused text field).
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              <strong>How to enable:</strong> Go to{' '}
              <em>System Settings → Privacy & Security → Accessibility</em> and add Smart
              Transcription Daemon. You can also toggle it in the Permissions tab — a system prompt
              will appear.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              <strong>Note:</strong> After granting permission, you may need to restart the app for
              changes to take effect. If the toggle doesn&apos;t update, try quitting and reopening
              the app.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Whisper Setup */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Setting Up Whisper
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Whisper is the speech-to-text engine that runs locally on your machine. You need to
          install the <code>whisper.cpp</code> CLI tool and download a model file.
        </Typography>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              1. Install whisper-cli
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>macOS (Homebrew):</strong>
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, mt: 1, mb: 1.5, bgcolor: 'action.hover' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                brew install whisper-cpp
              </Typography>
            </Paper>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              After installation, the command is typically available at:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'monospace', fontSize: '0.85rem', mt: 0.5 }}
            >
              • Apple Silicon: <code>/opt/homebrew/bin/whisper-cli</code>
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              • Intel Mac: <code>/usr/local/bin/whisper-cli</code>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
              <strong>Windows:</strong> Download from the{' '}
              <Link
                href="https://github.com/ggml-org/whisper.cpp/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                whisper.cpp releases page
              </Link>{' '}
              and place the executable somewhere accessible (e.g.{' '}
              <code>C:\whisper\whisper-cli.exe</code>).
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
              Set the full path in <strong>Settings → Engine → Whisper Command</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              2. Download a Whisper model
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Download a model file from the{' '}
              <Link
                href="https://huggingface.co/ggerganov/whisper.cpp/tree/main"
                target="_blank"
                rel="noopener noreferrer"
              >
                whisper.cpp models page
              </Link>
              . Recommended models:
            </Typography>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>ggml-base.bin</strong> — Fast, good for most use cases (~148 MB)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>ggml-small.bin</strong> — Better accuracy, slower (~488 MB)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>ggml-medium.bin</strong> — Best accuracy for non-English (~1.5 GB)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>ggml-large-v3-turbo.bin</strong> — Best overall quality (~1.6 GB)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              After downloading, select the model file in{' '}
              <strong>Settings → Engine → Whisper Model File</strong> using the Browse button.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Ollama Setup */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Setting Up Ollama (Optional)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Ollama is a local LLM server used to refine transcription output — fixing punctuation,
          grammar, and speech-to-text errors. It also powers the translation feature. Ollama is
          optional; without it, raw Whisper output is used directly.
        </Typography>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              1. Install Ollama
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Download and install Ollama from{' '}
              <Link href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">
                ollama.com/download
              </Link>
              . After installation, Ollama runs as a background service on{' '}
              <code>http://127.0.0.1:11434</code>.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Verify it&apos;s running by opening a terminal and running:
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: 'action.hover' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                ollama list
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              2. Download a model
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You can download models directly from the app in <strong>Settings → LLM</strong> using
              the &quot;Download Model&quot; field, or from the terminal:
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, mt: 1, mb: 1, bgcolor: 'action.hover' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                ollama pull llama3.2:latest
              </Typography>
            </Paper>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Recommended models for text refinement/translation:
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>llama3.2:latest</strong> — Good balance of speed and quality (~2 GB)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>qwen2.5:7b</strong> — Excellent multilingual support (~4.7 GB)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>gemma3:4b</strong> — Fast and lightweight (~3 GB)
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              3. Configure in the app
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Go to <strong>Settings → LLM</strong> and configure:
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>Ollama Base URL</strong> — Usually <code>http://127.0.0.1:11434</code>{' '}
                (default)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>Ollama Model</strong> — Select from discovered models or enter manually
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>System Prompt</strong> — Customize how the LLM processes your
                transcriptions. Use presets (Clean, Translate, Developer Format) or write your own.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Translation */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Translation
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          To translate dictated text, configure different source and output languages in{' '}
          <strong>Settings → Translation</strong>. For example, set the source language to
          Portuguese and the output language to English. The Ollama LLM handles the translation
          automatically. Translation requires Ollama to be installed and configured.
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2.5, mb: 1 }}>
          Recommended Models for Translation
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Strengths</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  model: 'translategemma:4b',
                  size: '~3 GB',
                  strengths: 'Purpose-built for translation, good quality',
                },
                {
                  model: 'qwen2.5:7b',
                  size: '~4.7 GB',
                  strengths: 'Excellent multilingual support, strong at PT↔EN',
                },
                {
                  model: 'gemma3:12b',
                  size: '~8 GB',
                  strengths: 'Great multilingual quality, good with European languages',
                },
                {
                  model: 'aya:8b',
                  size: '~4.8 GB',
                  strengths: 'Built for multilingual tasks (101 languages)',
                },
                {
                  model: 'qwen2.5:3b',
                  size: '~2 GB',
                  strengths: 'Decent multilingual, very fast (lightweight)',
                },
                {
                  model: 'gemma3:4b',
                  size: '~3 GB',
                  strengths: 'Good balance of speed and quality',
                },
              ].map((row) => (
                <TableRow key={row.model}>
                  <TableCell>
                    <code>{row.model}</code>
                  </TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.strengths}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
          Install any model via terminal: <code>ollama pull model-name</code>, or use the download
          field in <strong>Settings → LLM</strong>.
        </Typography>
      </Paper>

      {/* Troubleshooting */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Troubleshooting
        </Typography>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Hotkey doesn&apos;t work
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ensure Accessibility permission is granted. Try restarting the app after granting it.
              Check <strong>Settings → Hotkeys</strong> to verify the hotkey combination. Some
              combinations may conflict with other apps.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Text not pasting into apps
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Check that Accessibility permission is granted and the &quot;Auto-paste into focused
              app&quot; toggle is enabled in <strong>Settings → Permissions</strong>. If auto-paste
              fails, the text is still copied to your clipboard — you can paste manually with ⌘V.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              &quot;No speech detected&quot; error
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ensure the correct microphone is selected in your system sound settings. Check that
              microphone permission is granted. Try speaking louder or longer — very short clips may
              not produce usable audio.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Ollama not connecting
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Verify Ollama is running (<code>ollama list</code> in terminal). Check the Base URL in{' '}
              <strong>Settings → LLM</strong> matches your Ollama server address. If using a remote
              server, ensure the URL is accessible from your machine.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Stack>
  );
};
