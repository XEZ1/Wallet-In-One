import { useState } from 'react';
import {ThemeProvider} from './src/theme/ThemeProvider'

import 'react-native-gesture-handler';
import Navigation from './Navigation';

import { userContext } from './data';

export default function App() {
  
  const user = useState({
    'signedIn': false
  });

  return (
    <ThemeProvider>
      <userContext.Provider value={user}>
        <Navigation></Navigation>
      </userContext.Provider>
    </ThemeProvider>
  );
}
