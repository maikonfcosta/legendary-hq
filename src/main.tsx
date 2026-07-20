import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { MultiplayerProvider } from './contexts/MultiplayerContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <MultiplayerProvider>
          <App />
        </MultiplayerProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
