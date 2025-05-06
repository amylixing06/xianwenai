import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './theme'
import Chat from './components/chat/Chat'
import Privacy from './components/privacy/Privacy'
import Terms from './components/terms/Terms'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
