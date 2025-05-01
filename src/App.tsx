import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import Chat from './components/chat/Chat'

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Chat />
    </ChakraProvider>
  )
}

export default App
