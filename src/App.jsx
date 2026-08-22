import React from 'react'
import { WorkforceProvider } from './data/mock/WorkforceProvider'
import { UCCartProvider } from './context/UCCartContext'
import AppRouter from './AppRouter'

function App() {
  return (
    <WorkforceProvider>
      <UCCartProvider>
        <AppRouter />
      </UCCartProvider>
    </WorkforceProvider>
  )
}

export default App
