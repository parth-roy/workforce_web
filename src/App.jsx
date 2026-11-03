import React, { useState, useEffect } from 'react'
import { WorkforceProvider } from './data/mock/WorkforceProvider'
import { UCCartProvider } from './context/UCCartContext'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import AppRouter from './AppRouter'
import AuthModal from './components/auth/AuthModal'
import CartDrawer from './components/shared/CartDrawer'
import WorkforceAppInterceptModal from './components/common/WorkforceAppInterceptModal'

function App() {
  const [isInterceptOpen, setIsInterceptOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsInterceptOpen(true);
    };
    window.addEventListener('open-workforce-modal', handleOpenModal);

    // Initial visit trigger: Prompt on session arrival after 2.5 seconds if not yet dismissed
    const alreadySeen = typeof window !== 'undefined' && sessionStorage.getItem('metro_mitra_intercept_dismissed');
    let timer = null;
    if (!alreadySeen) {
      timer = setTimeout(() => {
        setIsInterceptOpen(true);
      }, 2500);
    }

    // Intercept clicks on any booking/service/job actions across the entire site
    const handleGlobalClick = (e) => {
      // Don't intercept if user is clicking inside the open modal itself
      if (e.target.closest('[role="dialog"]')) return;

      const target = e.target.closest('a, button');
      if (!target) return;
      const href = (target.getAttribute('href') || '').toLowerCase();
      const text = (target.innerText || target.textContent || '').toLowerCase();

      // Check if user is clicking to hire, book, or work
      const isBookingOrWorkAction = 
        href.includes('/services') || 
        href.includes('/jobs') || 
        href.includes('/get-a-job') || 
        href.includes('/hire-workers') || 
        href.includes('/direct-contact') || 
        href.includes('/post-job') || 
        text.includes('hire') || 
        text.includes('book') || 
        text.includes('job') || 
        text.includes('work') || 
        text.includes('employee');

      if (isBookingOrWorkAction) {
        const dismissed = typeof window !== 'undefined' && sessionStorage.getItem('metro_mitra_intercept_dismissed');
        if (!dismissed) {
          setIsInterceptOpen(true);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('open-workforce-modal', handleOpenModal);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsInterceptOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('metro_mitra_intercept_dismissed', 'true');
    }
  };

  return (
    <AuthProvider>
      <CityProvider>
        <WorkforceProvider>
          <UCCartProvider>
            <AuthModal />
            <CartDrawer />
            <WorkforceAppInterceptModal 
              isOpen={isInterceptOpen} 
              onClose={handleClose} 
            />
            <AppRouter />
          </UCCartProvider>
        </WorkforceProvider>
      </CityProvider>
    </AuthProvider>
  )
}

export default App
