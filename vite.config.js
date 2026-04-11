import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Kopiert die SpessaSynth-v4-Worklet-Datei aus node_modules nach public/,
// damit sie zur Laufzeit über addModule() erreichbar ist.
function copySpessaSynthWorklet() {
  return {
    name: 'copy-spessasynth-worklet',
    // Läuft beim Start von `vite dev` UND bei `vite build`
    config() {
      const src  = resolve('node_modules/spessasynth_lib/dist/spessasynth_processor.min.js')
      const dest = resolve('public/spessasynth_processor.min.js')
      try {
        // public/-Verzeichnis anlegen falls nicht vorhanden (z.B. frischer Checkout)
        mkdirSync(resolve('public'), { recursive: true })
        copyFileSync(src, dest)
        console.log('[ensemble] SpessaSynth-Worklet nach public/ kopiert.')
      } catch (e) {
        console.warn('[ensemble] Worklet-Copy fehlgeschlagen:', e.message)
      }
    },
  }
}

export default defineConfig({
  // Muss mit dem GitHub-Repository-Namen übereinstimmen: /Ensemble/
  // Für lokale Tests oder eigene Domain: base: '/'
  base: process.env.GITHUB_PAGES_BASE ?? '/Ensemble/',
  plugins: [copySpessaSynthWorklet()],
  build: {
    sourcemap: false,
    // Warnung ab 2 MB statt default 500 kB (SF2-Player hat großes Bundle)
    chunkSizeWarningLimit: 2048,
  },
})

