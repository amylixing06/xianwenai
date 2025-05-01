import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="*" element={<Chat />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
