import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'

export default function ModelsPage() {
  const { theme } = useTheme()

  return (
    <div style={{ background: theme.bg, minHeight: '100vh' }}>
      <Navbar />
    </div>
  )
}
