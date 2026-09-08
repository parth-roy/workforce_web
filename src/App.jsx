import React from 'react'
import { WorkforceProvider } from './data/mock/WorkforceProvider'
import { UCCartProvider } from './context/UCCartContext'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import AppRouter from './AppRouter'
import AuthModal from './components/auth/AuthModal'
import CartDrawer from './components/shared/CartDrawer'

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <WorkforceProvider>
          <UCCartProvider>
            <AuthModal />
            <CartDrawer />
            <AppRouter />
          </UCCartProvider>
        </WorkforceProvider>
      </CityProvider>
    </AuthProvider>
  )
}

export default App
