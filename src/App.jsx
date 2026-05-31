import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import ModelsPage from './pages/ModelsPage'
import SimulationPage from './pages/SimulationPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
