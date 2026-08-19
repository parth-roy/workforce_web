import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  ssr: {
    // Force react-helmet-async to be bundled through Vite's SSR transform
    // rather than loaded as a native Node.js CJS module. This ensures a single
    // module instance is used, preventing the dual-context bug where HelmetProvider
    // in entry-server.jsx and Helmet in SEO.jsx resolve to different instances.
    noExternal: ['react-helmet-async'],
  },
})
