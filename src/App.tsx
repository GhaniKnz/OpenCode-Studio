import { Routes, Route } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { MainPage } from './pages/MainPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SettingsPage } from './pages/SettingsPage'
import { useAppStore } from './stores/appStore'

export default function App() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding)

  if (!hasCompletedOnboarding) {
    return <OnboardingPage />
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  )
}
