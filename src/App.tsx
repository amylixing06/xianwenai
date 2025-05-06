import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Chat from './components/chat/Chat'
import Privacy from './components/privacy/Privacy'
import Terms from './components/terms/Terms'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
      </Routes>
    </Router>
  )
}

export default App
