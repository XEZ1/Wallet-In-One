import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import { useContext } from 'react';
import { userContext } from '../data';

export default function SignUpScreen({ navigation }) {

  const [user, setUser] = useContext(userContext)

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title="Login" onPress={() => setUser({...user, 'signedIn': true})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
