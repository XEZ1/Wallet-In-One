import { useState, createContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import 'react-native-gesture-handler';
import Navigation from './Navigation';

import { userContext } from './data';

export default function App() {
  
  const user = useState({
    'signedIn': false
  });

  // const [ signedIn, setsignedIn ] = useState(false)

  return (
    <userContext.Provider value={user}>
      <Navigation></Navigation>
    </userContext.Provider>
  );
}
