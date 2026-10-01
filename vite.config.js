import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    // emptyOutDir is handled by the build script (fs.rmSync before vite build).
    // Setting false prevents Vite's internal non-recursive rmdir from crashing
    // on the 26,000+ prerendered subdirectories left by the previous SSG run.
    emptyOutDir: false,
  },
  ssr: {
    // Force react-helmet-async to be bundled through Vite's SSR transform
    // rather than loaded as a native Node.js CJS module. This ensures a single
    // module instance is used, preventing the dual-context bug where HelmetProvider
    // in entry-server.jsx and Helmet in SEO.jsx resolve to different instances.
    noExternal: ['react-helmet-async'],
  },
})
