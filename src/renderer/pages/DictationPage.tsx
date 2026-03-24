import { DictationHistoryPanel } from '@/components/DictationHistoryPanel';
import {
  blobToMonoWav,
  findSupportedAudioMimeType,
  playStartBell,
  playStopBell,
} from '@/utils/audio';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { DEFAULT_DICTATION_LANGUAGE, DEFAULT_SOURCE_LANGUAGE } from '@shared/constants';
import type { DictationHistoryEntry } from '@shared/types';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface DictationPageProps {
  externalCommand?: { action: 'start' | 'stop'; nonce: number } | null;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}

export const DictationPage: React.FC<DictationPageProps> = ({
  externalCommand,
  onRecordingStateChange,
  onProcessingStateChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<DictationHistoryEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const outputLanguageRef = useRef(DEFAULT_DICTATION_LANGUAGE);
  const sourceLanguageRef = useRef(DEFAULT_SOURCE_LANGUAGE);
  const isRecordingRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const hotkeyHeldRef = useRef(false);
  const stopAfterTransitionRef = useRef(false);
  const handleStartRef = useRef<() => Promise<void>>(async () => {});
  const handleStopRef = useRef<() => Promise<void>>(async () => {});
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.api.getMachineSettings();
        const outputLanguage = settings.defaultDictationLanguage || DEFAULT_DICTATION_LANGUAGE;
        const sourceLanguage = settings.sourceLanguage || DEFAULT_SOURCE_LANGUAGE;

        outputLanguageRef.current = outputLanguage;
        sourceLanguageRef.current = sourceLanguage;
      } catch {
        // Keep default language if settings retrieval fails.
      }
    };

    void loadSettings();
  }, []);

  useEffect(() => {
    return () => {
      stopSilenceDetection();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    };
  }, []);

  const SILENCE_THRESHOLD = 0.005; // RMS below this = silence (lowered for built-in mics)
  const INITIAL_SILENCE_MS = 2500; // abort if no sound in first 2.5s

  const stopSilenceDetection = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    audioContextRef.current?.close();
    audioContextRef.current = null;
  };

  const startSilenceDetection = (stream: MediaStream, onSilenceAbort: () => void) => {
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Float32Array(analyser.fftSize);
    let soundDetected = false;
    const startTime = Date.now();

    const schedule = () => {
      // If recording has already stopped, clean up
      if (!isRecordingRef.current) {
        stopSilenceDetection();
        return;
      }

      analyser.getFloatTimeDomainData(data);
      const rms = Math.sqrt(data.reduce((sum, v) => sum + v * v, 0) / data.length);

      if (rms >= SILENCE_THRESHOLD) {
        soundDetected = true;
      }

      if (!soundDetected && Date.now() - startTime >= INITIAL_SILENCE_MS) {
        // Timeout reached with no sound — abort
        toast.info('No sound detected. Recording cancelled.');
        onSilenceAbort();
        return;
      }

      // Keep polling every 150ms (whether or not sound detected yet)
      silenceTimerRef.current = setTimeout(schedule, 150);
    };

    silenceTimerRef.current = setTimeout(schedule, 150);
  };

  const handleStart = async () => {
    if (isTransitioningRef.current || isRecordingRef.current) {
      return;
    }

    try {
      isTransitioningRef.current = true;

      const readiness = await window.api.getSttReadiness();
      if (readiness.platform === 'darwin' && readiness.microphonePermission !== 'granted') {
        const permissionResult = await window.api.requestMicrophonePermission();
        if (!permissionResult.success) {
          toast.error(
            'Microphone access is required. Enable it in System Settings > Privacy & Security > Microphone.'
          );
          await window.api.openMicrophonePrivacySettings();
          return;
        }
      }

      const settings = await window.api.getMachineSettings();
      const outputLanguage = settings.defaultDictationLanguage || outputLanguageRef.current;
      const sourceLanguage = settings.sourceLanguage || sourceLanguageRef.current;

      outputLanguageRef.current = outputLanguage;
      sourceLanguageRef.current = sourceLanguage;

      await window.api.startDictation({ targetLanguage: outputLanguage });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = findSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(200);
      setIsRecording(true);
      void window.api.setBubbleState('recording');

      // Handle audio device disconnection (e.g. headphones unplugged)
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.addEventListener(
          'ended',
          async () => {
            if (!isRecordingRef.current) return;

            // Re-acquire mic from the new default device
            try {
              const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              mediaStreamRef.current = newStream;

              // Restart the MediaRecorder with the new stream
              if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
              }
              const newRecorder = mimeType
                ? new MediaRecorder(newStream, { mimeType })
                : new MediaRecorder(newStream);
              newRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
                }
              };
              mediaRecorderRef.current = newRecorder;
              newRecorder.start(200);
              toast.info('Audio device changed — switched to new microphone.');
            } catch {
              toast.error('Audio device disconnected and no alternative microphone found.');
            }
          },
          { once: true }
        );
      }

      // Silence detection: abort recording if no sound in first 2.5s
      startSilenceDetection(stream, () => {
        // Abort: stop recorder and discard audio without transcribing
        audioChunksRef.current = [];
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        void window.api.stopDictation();
        setIsRecording(false);
        isRecordingRef.current = false;
        isTransitioningRef.current = false;
        stopSilenceDetection();
        void window.api.setBubbleState('idle');
      });

      toast.info('Recording locally with whisper.cpp. Release hotkey (or click stop) when done.');
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to start dictation';
      toast.error(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
      setIsRecording(false);
      void window.api.setBubbleState('idle');

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
    } finally {
      isTransitioningRef.current = false;

      if (stopAfterTransitionRef.current && isRecordingRef.current) {
        stopAfterTransitionRef.current = false;
        void handleStopRef.current();
      }
    }
  };

  const handleStop = async () => {
    if (isTransitioningRef.current || !isRecordingRef.current) {
      return;
    }
    stopSilenceDetection();

    try {
      isTransitioningRef.current = true;
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        toast.info('No active recording to stop.');
        setIsRecording(false);
        return;
      }

      const recordingBlob = await new Promise<Blob>((resolve, reject) => {
        recorder.addEventListener(
          'stop',
          () => {
            const chunks = audioChunksRef.current;
            audioChunksRef.current = [];
            resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
          },
          { once: true }
        );
        recorder.addEventListener('error', () => reject(new Error('Audio recording failed.')), {
          once: true,
        });
        recorder.stop();
      });

      mediaRecorderRef.current = null;
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      playStopBell();

      await window.api.stopDictation();

      // Start processing phase
      setIsRecording(false);
      setIsProcessing(true);
      void window.api.setBubbleState('processing');

      if (!recordingBlob.size) {
        toast.info('No audio captured. Please try again.');
        return;
      }

      const wavBuffer = await blobToMonoWav(recordingBlob);
      const rawText = (
        await window.api.transcribeAudio(wavBuffer, sourceLanguageRef.current)
      ).trim();

      if (/^\[?blank_audio\]?$/i.test(rawText)) {
        toast.error(
          'No speech detected. Check microphone permissions and selected input device, then try again.'
        );
        return;
      }

      if (rawText) {
        const processed = await window.api.processDictationText(rawText, outputLanguageRef.current);
        const textForOutput = processed.text?.trim() || rawText;

        await window.api.saveDictation(textForOutput);
        const sendResult = await window.api.sendToVSCode(textForOutput);
        toast.success(sendResult.message || 'Dictation transcribed and sent to VS Code.');
      } else {
        toast.info('No transcript detected from whisper.cpp. Try a clearer and longer sample.');
      }

      await loadHistory();
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to stop dictation';
      toast.error(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
      setIsRecording(false);

      mediaRecorderRef.current = null;
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    } finally {
      setIsProcessing(false);
      void window.api.setBubbleState('idle');
      isTransitioningRef.current = false;
      stopAfterTransitionRef.current = false;
    }
  };

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  useEffect(() => {
    onProcessingStateChange?.(isProcessing);
  }, [isProcessing, onProcessingStateChange]);

  useEffect(() => {
    handleStartRef.current = handleStart;
    handleStopRef.current = handleStop;
  }, [handleStart, handleStop]);

  useEffect(() => {
    if (!externalCommand) {
      return;
    }

    if (externalCommand.action === 'start') {
      if (!isTransitioningRef.current && !isRecordingRef.current) {
        void handleStartRef.current();
      }
      return;
    }

    if (!isTransitioningRef.current && isRecordingRef.current) {
      void handleStopRef.current();
    }
  }, [externalCommand]);

  useEffect(() => {
    const unsubscribePressed = window.api.onGlobalDictationHotkeyPressed(() => {
      hotkeyHeldRef.current = true;

      if (isTransitioningRef.current || isRecordingRef.current) {
        return;
      }

      playStartBell();
      setTimeout(() => void handleStartRef.current(), 150);
    });

    const unsubscribeReleased = window.api.onGlobalDictationHotkeyReleased(() => {
      hotkeyHeldRef.current = false;

      if (isTransitioningRef.current) {
        stopAfterTransitionRef.current = true;
        return;
      }

      if (isRecordingRef.current) {
        void handleStopRef.current();
      }
    });

    return () => {
      unsubscribePressed();
      unsubscribeReleased();
    };
  }, []);

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
