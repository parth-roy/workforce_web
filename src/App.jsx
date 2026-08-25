import React from 'react'
import { WorkforceProvider } from './data/mock/WorkforceProvider'
import { UCCartProvider } from './context/UCCartContext'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './AppRouter'
import AuthModal from './components/auth/AuthModal'

function App() {
  return (
    <AuthProvider>
      <WorkforceProvider>
        <UCCartProvider>
          <AuthModal />
          <AppRouter />
        </UCCartProvider>
      </WorkforceProvider>
    </AuthProvider>
  )
}

export default App
