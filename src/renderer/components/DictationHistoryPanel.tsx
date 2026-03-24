import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import MicOffIcon from '@mui/icons-material/MicOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
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

  const filtered = useMemo(
    () =>
      search.trim()
        ? history.filter(
            (e) =>
              e.text.toLowerCase().includes(search.toLowerCase()) ||
              e.language.toLowerCase().includes(search.toLowerCase())
          )
        : history,
    [history, search]
  );

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
            No results for "{search}"
          </Typography>
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
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.55,
                              color: 'text.primary',
                              // overflow: 'hidden',
                              // display: '-webkit-box',
                              // WebkitLineClamp: 2,
                              // WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {entry.text}
                          </Typography>
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
