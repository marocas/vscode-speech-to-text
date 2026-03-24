import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Writes the actual dev server URL to dist/.dev-server-url once Vite is listening. */
function writeDevServerUrl(): Plugin {
  return {
    name: 'write-dev-server-url',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer!.address();
        const port = typeof address === 'object' && address ? address.port : 3000;
        const url = `http://localhost:${port}`;
        fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
        fs.writeFileSync(path.join(__dirname, 'dist/.dev-server-url'), url, 'utf-8');
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), writeDevServerUrl()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'vendor-mui';
          }

          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@main': path.resolve(__dirname, './src/main'),
    },
  },
});
