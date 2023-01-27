import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function StartScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title="Sign Up" onPress={() => navigation.navigate('Sign Up')} />
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
