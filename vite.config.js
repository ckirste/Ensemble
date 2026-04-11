import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Kopiert spessasynth_processor.min.js aus node_modules nach public/.
// Muss in public/ liegen, damit Vite sie 1:1 nach dist/ kopiert
// und der Browser sie per addModule('./spessasynth_processor.min.js') laden kann.
function copySpessaSynthWorklet() {
  const src  = resolve(__dirname, 'node_modules/spessasynth_lib/dist/spessasynth_processor.min.js')
  const dest = resolve(__dirname, 'public/spessasynth_processor.min.js')

  function doCopy() {
    mkdirSync(resolve(__dirname, 'public'), { recursive: true })
    copyFileSync(src, dest)
    console.log('[ensemble] spessasynth_processor.min.js → public/ ✓')
  }

  return {
    name: 'copy-spessasynth-worklet',
    // Läuft bei `vite build`
    buildStart() { doCopy() },
    // Läuft bei `vite dev`
    configureServer() { doCopy() },
  }
}

export default defineConfig({
  // Muss mit dem GitHub-Repo-Namen übereinstimmen.
  // Für lokale Tests: GITHUB_PAGES_BASE=/ npm run dev
  base: process.env.GITHUB_PAGES_BASE ?? '/Ensemble/',
  plugins: [copySpessaSynthWorklet()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2048,
  },
})

