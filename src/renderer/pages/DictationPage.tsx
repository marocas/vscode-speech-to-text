import { DictationHistoryPanel } from '@/components/DictationHistoryPanel';
import { playStartBell } from '@/utils/audio';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import type { DictationHistoryEntry } from '@shared/types';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface DictationPageProps {
  externalCommand?: { action: 'start' | 'stop'; nonce: number } | null;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}

/**
 * DictationPage — UI-only component.
 * The native agent handles the full pipeline (hotkey → audio → whisper → ollama → paste).
 * This page reflects agent state and manages dictation history.
 */
export const DictationPage: React.FC<DictationPageProps> = ({
  onRecordingStateChange,
  onProcessingStateChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<DictationHistoryEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const isRecordingRef = useRef(false);

  const loadHistory = async () => {
    try {
      const rows = await window.api.getDictations(30);
      setHistory(rows);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load dictation history');
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  // Reflect recording/processing state from agent state-changed events
  useEffect(() => {
    const unsubscribe = window.api.onAgentStateChanged(
      (payload: { state: string; previousState: string }) => {
        if (payload.state === 'recording') {
          setIsRecording(true);
          setIsProcessing(false);
        } else if (payload.state === 'processing') {
          setIsRecording(false);
          setIsProcessing(true);
        } else {
          setIsRecording(false);
          setIsProcessing(false);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // Optimistically prepend new entry when agent delivers a pipeline result
  useEffect(() => {
    const unsubscribe = window.api.onAgentPipelineResult(
      (payload: {
        text: string;
        rawText: string;
        ollamaText?: string;
        language: string;
        sourceApp?: string;
        audioPath?: string;
      }) => {
        if (payload.text) {
          const optimisticEntry: DictationHistoryEntry = {
            id: `optimistic-${Date.now()}`,
            text: payload.text,
            rawText: payload.rawText,
            ollamaText: payload.ollamaText,
            language: payload.language || 'unknown',
            charCount: payload.text.length,
            sourceApp: payload.sourceApp,
            audioPath: payload.audioPath,
            createdAt: new Date(),
          };
          setHistory((prev) => [optimisticEntry, ...prev]);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // Play start bell when hotkey pressed (agent handles recording natively)
  useEffect(() => {
    const unsubscribePressed = window.api.onGlobalDictationHotkeyPressed(() => {
      if (!isRecordingRef.current) {
        playStartBell();
      }
    });

    return () => {
      unsubscribePressed();
    };
  }, []);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  useEffect(() => {
    onProcessingStateChange?.(isProcessing);
  }, [isProcessing, onProcessingStateChange]);

  const handleDeleteHistory = async (id: string) => {
    try {
      await window.api.deleteDictation(id);
      await loadHistory();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete dictation from history');
    }
  };

  const handleClearHistory = async () => {
    if (history.length === 0) {
      return;
    }

    setShowClearConfirm(true);
  };

  const handleConfirmClearHistory = async () => {
    setShowClearConfirm(false);

    try {
      const deletedCount = await window.api.clearDictationHistory();
      await loadHistory();
      toast.success(`Deleted ${deletedCount} dictation entr${deletedCount === 1 ? 'y' : 'ies'}.`);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to clear dictation history');
    }
  };

  return (
    <Stack spacing={3}>
      <DictationHistoryPanel
        history={history}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
        onRefresh={loadHistory}
      />

      <Dialog open={showClearConfirm} onClose={() => setShowClearConfirm(false)}>
        <DialogTitle>Delete All Dictation History?</DialogTitle>
        <DialogContent>
          This action cannot be undone. All {history.length} dictation
          {history.length === 1 ? '' : 's'} will be permanently deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearConfirm(false)}>Cancel</Button>
          <Button
            onClick={() => void handleConfirmClearHistory()}
            color="error"
            variant="contained"
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
