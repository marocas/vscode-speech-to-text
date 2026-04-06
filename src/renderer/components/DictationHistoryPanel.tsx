import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ForumIcon from '@mui/icons-material/Forum';
import HistoryIcon from '@mui/icons-material/History';
import LanguageIcon from '@mui/icons-material/Language';
import MicOffIcon from '@mui/icons-material/MicOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import TerminalIcon from '@mui/icons-material/Terminal';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { CANCELLED_PREFIX } from '@shared/constants';
import { DictationHistoryEntry } from '@shared/types';
import React, { useMemo } from 'react';

// Deterministic color per language tag
const LANG_COLORS: Record<string, { bg: string; text: string }> = {
  'en-GB': { bg: '#4F46E5', text: '#fff' },
  'en-US': { bg: '#2563EB', text: '#fff' },
  'es-ES': { bg: '#D97706', text: '#fff' },
  'es-MX': { bg: '#B45309', text: '#fff' },
  'fr-FR': { bg: '#0891B2', text: '#fff' },
  'de-DE': { bg: '#7C3AED', text: '#fff' },
  'pt-BR': { bg: '#059669', text: '#fff' },
  'pt-PT': { bg: '#047857', text: '#fff' },
  'it-IT': { bg: '#DC2626', text: '#fff' },
  'zh-CN': { bg: '#B91C1C', text: '#fff' },
  'ja-JP': { bg: '#BE185D', text: '#fff' },
};
const defaultLangColor = { bg: '#6B7280', text: '#fff' };

// Source app display config
const SOURCE_APP_CONFIG: Record<string, { icon: React.ReactElement; bg: string }> = {
  'VS Code': { icon: <CodeIcon sx={{ fontSize: 11 }} />, bg: '#007ACC' },
  'VS Code Insiders': { icon: <CodeIcon sx={{ fontSize: 11 }} />, bg: '#24943E' },
  IntelliJ: { icon: <CodeIcon sx={{ fontSize: 11 }} />, bg: '#FE315D' },
  'Sublime Text': { icon: <CodeIcon sx={{ fontSize: 11 }} />, bg: '#FF9800' },
  Terminal: { icon: <TerminalIcon sx={{ fontSize: 11 }} />, bg: '#333' },
  iTerm2: { icon: <TerminalIcon sx={{ fontSize: 11 }} />, bg: '#333' },
  Warp: { icon: <TerminalIcon sx={{ fontSize: 11 }} />, bg: '#01A4FF' },
  Kitty: { icon: <TerminalIcon sx={{ fontSize: 11 }} />, bg: '#333' },
  Slack: { icon: <ForumIcon sx={{ fontSize: 11 }} />, bg: '#4A154B' },
  Teams: { icon: <ForumIcon sx={{ fontSize: 11 }} />, bg: '#6264A7' },
  Gmail: { icon: <EmailIcon sx={{ fontSize: 11 }} />, bg: '#EA4335' },
  Outlook: { icon: <EmailIcon sx={{ fontSize: 11 }} />, bg: '#0078D4' },
  Mail: { icon: <EmailIcon sx={{ fontSize: 11 }} />, bg: '#007AFF' },
  Chrome: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#4285F4' },
  Safari: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#006CFF' },
  Edge: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#0078D7' },
  Arc: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#FF6B2C' },
  Brave: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#FB542B' },
  GitHub: { icon: <CodeIcon sx={{ fontSize: 11 }} />, bg: '#24292F' },
  'Google Docs': { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#4285F4' },
  Notion: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#000' },
  Figma: { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#A259FF' },
  ChatGPT: { icon: <ForumIcon sx={{ fontSize: 11 }} />, bg: '#10A37F' },
  Claude: { icon: <ForumIcon sx={{ fontSize: 11 }} />, bg: '#D4A574' },
};
const defaultAppConfig = { icon: <LanguageIcon sx={{ fontSize: 11 }} />, bg: '#6B7280' };

function formatDateHeader(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

function formatTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(
  entries: DictationHistoryEntry[]
): { dateKey: string; entries: DictationHistoryEntry[] }[] {
  const map = new Map<string, DictationHistoryEntry[]>();
  for (const entry of entries) {
    const key = formatDateHeader(entry.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([dateKey, entries]) => ({ dateKey, entries }));
}

interface DictationHistoryPanelProps {
  history: DictationHistoryEntry[];
  loading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onClear: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

// Per-row action menu
const RowMenu: React.FC<{
  entry: DictationHistoryEntry;
  copiedId: string | null;
  onCopy: () => void;
  onDelete: () => void;
}> = ({ entry, copiedId, onCopy, onDelete }) => {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <Tooltip title="More options" arrow>
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            opacity: 0,
            '.row-hover:hover &': { opacity: 1 },
            transition: 'opacity 0.15s',
            color: 'text.secondary',
          }}
        >
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title={copiedId === entry.id ? 'Copied!' : 'Copy'} arrow>
        <IconButton
          size="small"
          onClick={onCopy}
          color={copiedId === entry.id ? 'success' : 'default'}
          sx={{ opacity: 0, '.row-hover:hover &': { opacity: 1 }, transition: 'opacity 0.15s' }}
        >
          <ContentCopyIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: { minWidth: 180, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onCopy();
            setAnchor(null);
          }}
          sx={{ fontSize: '0.875rem', gap: 1.5 }}
        >
          <ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          Copy transcript
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onDelete();
            setAnchor(null);
          }}
          sx={{
            fontSize: '0.875rem',
            gap: 1.5,
            color: 'error.main',
            '&:hover': { backgroundColor: 'rgba(220,38,38,0.06)' },
          }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          Delete transcript
        </MenuItem>
      </Menu>
    </>
  );
};

export const DictationHistoryPanel: React.FC<DictationHistoryPanelProps> = ({
  history,
  loading = false,
  onDelete,
  onClear,
  onRefresh,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePlayAudio = async (entryId: string, audioPath: string) => {
    // If already playing this entry, stop it
    if (playingId === entryId && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    console.log('[PlayAudio] Requesting audio for path:', audioPath);
    const dataUrl = await window.api.getAudioData(audioPath);
    console.log('[PlayAudio] Got data URL:', dataUrl ? `${dataUrl.length} chars` : 'null');
    if (!dataUrl) return;
    const audio = new Audio(dataUrl);
    audio.onerror = (e) => console.error('[PlayAudio] Audio error:', e);
    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
    audioRef.current = audio;
    setPlayingId(entryId);
    audio.play().catch((err) => console.error('[PlayAudio] Play failed:', err));
  };

  // Extract unique source apps and cancelled status from history
  const availableApps = useMemo(() => {
    const apps = new Map<string, number>();
    for (const e of history) {
      if (e.sourceApp) {
        apps.set(e.sourceApp, (apps.get(e.sourceApp) ?? 0) + 1);
      }
    }
    return Array.from(apps.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([app, count]) => ({ app, count }));
  }, [history]);

  const cancelledCount = useMemo(
    () => history.filter((e) => e.text.startsWith(CANCELLED_PREFIX)).length,
    [history]
  );

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  const clearFilters = () => setActiveFilters(new Set());

  const filtered = useMemo(() => {
    let result = history;

    // Apply source app / cancelled filters
    if (activeFilters.size > 0) {
      result = result.filter((e) => {
        if (activeFilters.has('cancelled') && e.text.startsWith(CANCELLED_PREFIX)) return true;
        if (e.sourceApp && activeFilters.has(e.sourceApp)) return true;
        return false;
      });
    }

    // Apply text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.text.toLowerCase().includes(q) ||
          e.language.toLowerCase().includes(q) ||
          (e.sourceApp && e.sourceApp.toLowerCase().includes(q))
      );
    }

    return result;
  }, [history, search, activeFilters]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const handleCopyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <Paper elevation={1} sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 1.75 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <HistoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          Dictation History
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => void onRefresh()}
            disabled={loading}
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.8rem' }}
          >
            Refresh
          </Button>
          <Button
            size="small"
            variant="text"
            color="error"
            onClick={() => void onClear()}
            disabled={loading || history.length === 0}
            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
          >
            Clear All
          </Button>
        </Stack>
      </Stack>

      {/* Search bar */}
      {history.length > 0 && (
        <Box sx={{ px: 2.5, py: 1.25 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search dictations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
          />
        </Box>
      )}

      {/* Filter chips */}
      {history.length > 0 && (availableApps.length > 0 || cancelledCount > 0) && (
        <Tabs
          value={false}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 'unset',
            px: 2.5,
            py: 1.25,
            '& .MuiTabs-scroller': { display: 'flex', alignItems: 'center' },
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: 0.5, alignItems: 'center' },
            '& .MuiTabScrollButton-root': {
              width: 20,
              color: 'text.secondary',
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          <Tab
            disabled
            icon={<FilterListIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
            sx={{ minWidth: 'unset', minHeight: 'unset', p: 0, mr: 0.5, opacity: '1 !important' }}
          />
          {availableApps.map(({ app, count }) => {
            const isActive = activeFilters.has(app);
            const appCfg = SOURCE_APP_CONFIG[app] ?? defaultAppConfig;
            return (
              <Tab
                key={app}
                disableRipple
                label={
                  <Chip
                    icon={appCfg.icon}
                    size="small"
                    label={`${app} (${count})`}
                    onClick={() => toggleFilter(app)}
                    sx={{
                      height: 22,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      bgcolor: isActive ? appCfg.bg : 'action.hover',
                      color: isActive ? '#fff' : 'text.secondary',
                      border: isActive ? 'none' : '1px solid',
                      borderColor: 'divider',
                      '& .MuiChip-icon': {
                        color: isActive ? '#fff' : 'text.secondary',
                        ml: 0.3,
                      },
                      '& .MuiChip-label': { px: 0.6 },
                      '&:hover': {
                        bgcolor: isActive ? appCfg.bg : 'action.selected',
                      },
                    }}
                  />
                }
                sx={{ minWidth: 'unset', minHeight: 'unset', p: 0 }}
              />
            );
          })}
          {cancelledCount > 0 && (
            <Tab
              disableRipple
              label={
                <Chip
                  icon={<CancelIcon sx={{ fontSize: 12 }} />}
                  size="small"
                  label={`Cancelled (${cancelledCount})`}
                  onClick={() => toggleFilter('cancelled')}
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    bgcolor: activeFilters.has('cancelled') ? '#EF4444' : 'action.hover',
                    color: activeFilters.has('cancelled') ? '#fff' : 'text.secondary',
                    border: activeFilters.has('cancelled') ? 'none' : '1px solid',
                    borderColor: 'divider',
                    '& .MuiChip-icon': {
                      color: activeFilters.has('cancelled') ? '#fff' : 'text.secondary',
                      ml: 0.3,
                    },
                    '& .MuiChip-label': { px: 0.6 },
                    '&:hover': {
                      bgcolor: activeFilters.has('cancelled') ? '#EF4444' : 'action.selected',
                    },
                  }}
                />
              }
              sx={{ minWidth: 'unset', minHeight: 'unset', p: 0 }}
            />
          )}
          {activeFilters.size > 0 && (
            <Tab
              disableRipple
              label={
                <Chip
                  icon={<CloseIcon sx={{ fontSize: 11 }} />}
                  size="small"
                  label="Clear"
                  onClick={clearFilters}
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    '& .MuiChip-icon': { color: 'text.secondary', ml: 0.3 },
                    '& .MuiChip-label': { px: 0.4 },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                />
              }
              sx={{ minWidth: 'unset', minHeight: 'unset', p: 0 }}
            />
          )}
        </Tabs>
      )}

      {/* Empty state */}
      {history.length === 0 ? (
        <Box
          sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(85,72,232,0.12), rgba(139,127,255,0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MicOffIcon sx={{ fontSize: 32, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            No dictations yet
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7 }}>
            Start recording to see your history here
          </Typography>
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {search.trim()
              ? `No results for "${search}"`
              : activeFilters.size > 0
                ? 'No dictations match the selected filters'
                : 'No results'}
          </Typography>
          {activeFilters.size > 0 && (
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ mt: 1, fontSize: '0.8rem', textTransform: 'none' }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {grouped.map(({ dateKey, entries: dayEntries }) => (
            <Box key={dateKey}>
              {/* Date header */}
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  px: 2.5,
                  pt: 2.5,
                  pb: 0.75,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                }}
              >
                {dateKey}
              </Typography>

              {/* Rows */}
              <Paper
                variant="outlined"
                sx={{
                  mx: 2.5,
                  mb: 2,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  borderColor: 'divider',
                }}
              >
                {dayEntries.map((entry, idx) => {
                  const langColor = LANG_COLORS[entry.language] ?? defaultLangColor;
                  const isCancelled = entry.text.startsWith(CANCELLED_PREFIX);
                  const displayText = isCancelled
                    ? entry.text.slice(CANCELLED_PREFIX.length)
                    : entry.text;
                  return (
                    <React.Fragment key={entry.id}>
                      <Box
                        className="row-hover"
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '72px 1fr auto',
                          alignItems: 'start',
                          gap: 2,
                          px: 2,
                          py: 1.25,
                          transition: 'background 0.12s',
                          '&:hover': { backgroundColor: 'action.hover' },
                          ...(isCancelled && { opacity: 0.6 }),
                        }}
                      >
                        {/* Time */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontVariantNumeric: 'tabular-nums',
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTime(entry.createdAt)}
                        </Typography>

                        {/* Text + chips on hover */}
                        <Box sx={{ minWidth: 0 }}>
                          {isCancelled && (
                            <Chip
                              icon={<CancelIcon sx={{ fontSize: 12 }} />}
                              size="small"
                              label="Cancelled"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                borderRadius: '4px',
                                bgcolor: '#EF4444',
                                color: '#fff',
                                mb: 0.5,
                                '& .MuiChip-label': { px: 0.6 },
                                '& .MuiChip-icon': { color: '#fff', ml: 0.3 },
                              }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.55,
                              color: 'text.primary',
                              ...(isCancelled && { textDecoration: 'line-through' }),
                            }}
                          >
                            {displayText}
                          </Typography>

                          {/* Pipeline stages toggle */}
                          {entry.rawText && (
                            <>
                              <Box
                                onClick={() => toggleExpanded(entry.id)}
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  mt: 0.3,
                                  '&:hover': { opacity: 0.8 },
                                }}
                              >
                                <ExpandMoreIcon
                                  sx={{
                                    fontSize: 14,
                                    color: 'text.secondary',
                                    transform: expandedIds.has(entry.id)
                                      ? 'rotate(180deg)'
                                      : 'none',
                                    transition: 'transform 0.2s',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'text.secondary', fontSize: '0.65rem', ml: 0.3 }}
                                >
                                  Pipeline
                                </Typography>
                              </Box>
                              <Collapse in={expandedIds.has(entry.id)} timeout={200}>
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    pl: 1,
                                    borderLeft: '2px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        fontWeight: 700,
                                        fontSize: '0.62rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                      }}
                                    >
                                      STT Original
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: 'block',
                                        color: 'text.secondary',
                                        fontSize: '0.72rem',
                                      }}
                                    >
                                      {entry.rawText}
                                    </Typography>
                                  </Box>
                                  {entry.audioPath && (
                                    <Box>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          void handlePlayAudio(entry.id, entry.audioPath!)
                                        }
                                        sx={{
                                          p: 0.3,
                                          bgcolor:
                                            playingId === entry.id
                                              ? 'primary.main'
                                              : 'action.hover',
                                          color: playingId === entry.id ? '#fff' : 'text.secondary',
                                          '&:hover': {
                                            bgcolor:
                                              playingId === entry.id
                                                ? 'primary.dark'
                                                : 'action.selected',
                                          },
                                        }}
                                      >
                                        {playingId === entry.id ? (
                                          <PauseIcon sx={{ fontSize: 14 }} />
                                        ) : (
                                          <PlayArrowIcon sx={{ fontSize: 14 }} />
                                        )}
                                      </IconButton>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'text.secondary',
                                          fontSize: '0.62rem',
                                          ml: 0.5,
                                          verticalAlign: 'middle',
                                        }}
                                      >
                                        Play audio
                                      </Typography>
                                    </Box>
                                  )}
                                  {entry.ollamaText && entry.ollamaText !== entry.rawText && (
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'text.secondary',
                                          fontWeight: 700,
                                          fontSize: '0.62rem',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.05em',
                                        }}
                                      >
                                        {entry.ollamaText !== entry.text
                                          ? 'Ollama Refinement'
                                          : 'Ollama Result'}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: 'block',
                                          color: 'text.secondary',
                                          fontSize: '0.72rem',
                                        }}
                                      >
                                        {entry.ollamaText}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </>
                          )}
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{
                              mt: 0.5,
                              opacity: 0,
                              '.row-hover:hover &': { opacity: 1 },
                              transition: 'opacity 0.15s',
                            }}
                          >
                            <Chip
                              size="small"
                              label={entry.language}
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                borderRadius: '4px',
                                bgcolor: langColor.bg,
                                color: langColor.text,
                                '& .MuiChip-label': { px: 0.6 },
                              }}
                            />

                            {entry.sourceApp &&
                              (() => {
                                const appCfg =
                                  SOURCE_APP_CONFIG[entry.sourceApp] ?? defaultAppConfig;
                                return (
                                  <Chip
                                    icon={appCfg.icon}
                                    size="small"
                                    label={entry.sourceApp}
                                    sx={{
                                      height: 18,
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      borderRadius: '4px',
                                      bgcolor: appCfg.bg,
                                      color: '#fff',
                                      '& .MuiChip-label': { px: 0.6 },
                                      '& .MuiChip-icon': { color: '#fff', ml: 0.3 },
                                    }}
                                  />
                                );
                              })()}

                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.68rem',
                                alignSelf: 'center',
                              }}
                            >
                              {entry.charCount} chars
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={0} sx={{ flexShrink: 0 }}>
                          <RowMenu
                            entry={entry}
                            copiedId={copiedId}
                            onCopy={() => void handleCopyToClipboard(entry.text, entry.id)}
                            onDelete={() => void onDelete(entry.id)}
                          />
                        </Stack>
                      </Box>
                      {idx < dayEntries.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </Paper>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
