import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
    electron({
      entry: 'electron/main.ts',
    }),
    renderer(),
  ],
  server: {
    port: 5173,
  },
});