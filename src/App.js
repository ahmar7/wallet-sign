import React from 'react';
import '@fontsource/carrois-gothic-sc/400.css';
import '@fontsource/carrois-gothic/400.css';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import theme from './Theme';
import MainPage from './MainPage';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <MainPage />
    </ChakraProvider>
  );
}

export default App;
