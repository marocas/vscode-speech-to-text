import { DictionaryManager } from '@/components/DictionaryManager';
import { EngineSettingsPanel } from '@/components/EngineSettingsPanel';
import { HotkeysPanel } from '@/components/HotkeysPanel';
import { LLMPromptManager } from '@/components/LLMPromptManager';
import { ManualOllamaTestPanel } from '@/components/ManualOllamaTestPanel';
import { PermissionsPanel } from '@/components/PermissionsPanel';
import { SnippetManager } from '@/components/SnippetManager';
import { TranslationSettingsPanel } from '@/components/TranslationSettingsPanel';
import BuildIcon from '@mui/icons-material/Build';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MicIcon from '@mui/icons-material/Mic';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Box, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
          <SettingsIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Settings
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Configure speech engine, AI models, shortcuts, and app preferences
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        aria-label="settings tabs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          icon={<MicIcon />}
          iconPosition="start"
          label="Speech & Language"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
        <Tab
          icon={<SmartToyIcon />}
          iconPosition="start"
          label="AI Models"
          id="tab-1"
          aria-controls="tabpanel-1"
        />
        <Tab
          icon={<KeyboardIcon />}
          iconPosition="start"
          label="Shortcuts & Text"
          id="tab-2"
          aria-controls="tabpanel-2"
        />
        <Tab
          icon={<BuildIcon />}
          iconPosition="start"
          label="Advanced"
          id="tab-3"
          aria-controls="tabpanel-3"
        />
      </Tabs>

      {/* Speech & Language: Engine + Translation */}
      <TabPanel value={activeTab} index={0}>
        <Stack spacing={3}>
          <EngineSettingsPanel />
          <Divider />
          <TranslationSettingsPanel />
        </Stack>
      </TabPanel>

      {/* AI Models: LLM config */}
      <TabPanel value={activeTab} index={1}>
        <LLMPromptManager />
      </TabPanel>

      {/* Shortcuts & Text: Hotkeys + Dictionary + Snippets */}
      <TabPanel value={activeTab} index={2}>
        <Stack spacing={3}>
          <HotkeysPanel />
          <Divider />
          <DictionaryManager />
          <Divider />
          <SnippetManager />
        </Stack>
      </TabPanel>

      {/* Advanced: Permissions + Ollama Test */}
      <TabPanel value={activeTab} index={3}>
        <Stack spacing={3}>
          <PermissionsPanel />
          <Divider />
          <ManualOllamaTestPanel />
        </Stack>
      </TabPanel>
    </Stack>
  );
};
