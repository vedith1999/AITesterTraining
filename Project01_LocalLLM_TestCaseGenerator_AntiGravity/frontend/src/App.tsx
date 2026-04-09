import { MainLayout } from './components/layout/MainLayout'
import { SettingsProvider } from './context/SettingsContext'

function App() {
  return (
    <SettingsProvider>
      <MainLayout />
    </SettingsProvider>
  )
}

export default App
