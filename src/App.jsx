import React from 'react'
import { WorkforceProvider } from './data/mock/WorkforceProvider'
import AppRouter from './AppRouter'

function App() {
  return (
    <WorkforceProvider>
      <AppRouter />
    </WorkforceProvider>
  )
}

export default App
