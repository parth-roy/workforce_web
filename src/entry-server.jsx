/**
 * src/entry-server.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Server-Side Rendering Entry Point
 * Phase F6.1 — Metadata Foundation
 *
 * SSR ARCHITECTURE
 * This file is loaded by the Vite dev SSR runner (scripts/test-ssr.js) and by
 * any production SSR server (e.g., Express + Vite preview).
 *
 * ROUTER
 * `StaticRouter` is imported from `react-router-dom` (NOT `react-router-dom/server`).
 * React Router v7 re-exports StaticRouter from the main package — there is no
 * separate `/server` subpath. Attempting to import from `/server` causes an
 * export-conditions error in Vite's SSR module runner.
 *
 * HELMET CONTEXT — react-helmet-async v3 API
 * v3 changed the SSR context API. You must use `new HelmetData({})` (not a plain
 * object `{}`). After `renderToString()`, the collected head tags live at:
 *
 *   helmetData.context.helmet.title    → <title> tag
 *   helmetData.context.helmet.meta     → <meta> tags
 *   helmetData.context.helmet.link     → <link> tags
 *   helmetData.context.helmet.script   → <script> tags
 *
 * This render() function returns { html, helmet } where helmet is
 * helmetData.context.helmet for convenient access by the test runner and
 * any production SSR server.
 *
 * HEAD ASSEMBLY (production)
 * const { html, helmet } = render('/some/path')
 * const fullHtml = `
 *   <!doctype html>
 *   <html>
 *     <head>
 *       ${helmet.title.toString()}
 *       ${helmet.meta.toString()}
 *       ${helmet.link.toString()}
 *       ${helmet.script.toString()}
 *     </head>
 *     <body><div id="root">${html}</div></body>
 *   </html>`
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider, HelmetData } from 'react-helmet-async'
import App from './App.jsx'

export function render(url) {
  // react-helmet-async v3 + React 19:
  // React 19 natively hoists <title>, <meta>, and <link> tags.
  // In renderToString(), they are prepended to the output string.
  // To separate head tags from body HTML, we wrap the app in a known div.
  const rawHtml = renderToString(
    <HelmetProvider>
      <StaticRouter location={url}>
        <div id="ssr-app-root"><App /></div>
      </StaticRouter>
    </HelmetProvider>
  )

  let parts = rawHtml.split('<div id="ssr-app-root">')
  let headTags = parts[0]
  // Extract the app HTML, removing the trailing </div>
  let appHtml = parts.length > 1 ? parts[1].slice(0, -6) : ''

  // React 19 does not natively hoist inline <script type="application/ld+json">
  // So we extract them from the appHtml and append to headTags
  const ldJsonRegex = /<script[^>]*type="application\/ld\+json"[^>]*>.*?<\/script>/gi
  let match
  while ((match = ldJsonRegex.exec(appHtml)) !== null) {
    headTags += match[0]
  }
  appHtml = appHtml.replace(ldJsonRegex, '')

  // Provide a backwards-compatible helmet object for the test runner/SSR server
  // that mimics the old API for extracting strings
  const helmet = {
    title: { toString: () => '' },
    meta: { toString: () => '' },
    link: { toString: () => '' },
    script: { toString: () => '' },
  }

  // The caller will now use `head` directly
  return { html: appHtml, head: headTags, helmet }
}
