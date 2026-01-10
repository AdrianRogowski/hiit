import { useState, useCallback } from 'react'
import type { TimerConfig } from '@/types/timer'
import { SetupPage, TimerPage, CompletePage } from '@/pages'

type AppState = 'setup' | 'running' | 'complete'

export function App() {
  const [appState, setAppState] = useState<AppState>('setup')
  const [config, setConfig] = useState<TimerConfig | null>(null)

  const handleStart = useCallback((newConfig: TimerConfig) => {
    setConfig(newConfig)
    setAppState('running')
  }, [])

  const handleComplete = useCallback(() => {
    setAppState('complete')
  }, [])

  const handleStop = useCallback(() => {
    setAppState('setup')
  }, [])

  const handleStartAgain = useCallback(() => {
    setAppState('running')
  }, [])

  const handleNewTimer = useCallback(() => {
    setConfig(null)
    setAppState('setup')
  }, [])

  // Render based on app state
  switch (appState) {
    case 'setup':
      return <SetupPage onStart={handleStart} />

    case 'running':
      if (!config) {
        setAppState('setup')
        return null
      }
      return (
        <TimerPage
          config={config}
          onComplete={handleComplete}
          onStop={handleStop}
        />
      )

    case 'complete':
      if (!config) {
        setAppState('setup')
        return null
      }
      return (
        <CompletePage
          config={config}
          onStartAgain={handleStartAgain}
          onNewTimer={handleNewTimer}
        />
      )

    default:
      return <SetupPage onStart={handleStart} />
  }
}
