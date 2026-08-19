import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Layout & Home
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'

// Templates
import WorkerPageTemplate from './components/pages/WorkerPageTemplate'
import EmployerPageTemplate from './components/pages/EmployerPageTemplate'
import DualPageTemplate from './components/pages/DualPageTemplate'

// Data
import pages from './data/pages'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageRenderer({ page }) {
  switch (page.template) {
    case 'worker':
      return <WorkerPageTemplate page={page} />
    case 'employer':
      return <EmployerPageTemplate page={page} />
    case 'dual':
      return <DualPageTemplate page={page} />
    default:
      return <WorkerPageTemplate page={page} />
  }
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-6 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn-primary-blue">Return to Homepage</a>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Dynamically render all 20 pages from config */}
          {pages.map(page => (
            <Route 
              key={page.path} 
              path={page.path} 
              element={<PageRenderer page={page} />} 
            />
          ))}
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
