import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `vite build`                  : site normal (dossier dist/, fichiers découpés, URL propres, pré-rendu SEO)
// `vite build --mode offline`   : un seul fichier dist-offline/index.html, qui s'ouvre par double-clic
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  return {
    base: offline ? './' : '/',
    plugins: [react(), tailwindcss(), ...(offline ? [viteSingleFile()] : [])],
    build: { outDir: offline ? 'dist-offline' : 'dist' },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      css: false,
    },
  }
})
