import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('bubbleAPI', {
  onStateChange: (callback: (state: string) => void) => {
    ipcRenderer.on('bubble-state', (_event, state: string) => callback(state));
  },
});
