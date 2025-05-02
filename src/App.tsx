import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { theme } from './theme'
import Chat from './components/chat/Chat'
import Privacy from './components/privacy/Privacy'

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
