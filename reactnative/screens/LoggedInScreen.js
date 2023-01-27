import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import { useContext } from 'react';
import { userContext } from '../data';

export default function LoggedInScreen({ navigation }) {

  const [user, setUser] = useContext(userContext)

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>You are logged in</Text>
      <Button title="Logout" onPress={() => setUser({...user, 'signedIn': false})} />
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
