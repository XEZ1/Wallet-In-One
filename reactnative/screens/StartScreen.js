import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';

export default function StartScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableHighlight style={styles.button}> 
        <Button title="Sign Up" onPress={() => navigation.navigate('Sign Up')} />
      </TouchableHighlight>
      <TouchableHighlight style={styles.button}> 
        <Button title="Login" />
      </TouchableHighlight>
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
  button:{
    margin:10,
  }
});
