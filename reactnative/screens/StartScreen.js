import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableHighlight, ImageBackground } from 'react-native';

export default function StartScreen ({ navigation }) {

    return (
      <ImageBackground
          source={require('reactnative/assets/background.png')}
          style={styles.background}
      >
        <View>
          <StatusBar style="auto" />
          <TouchableHighlight style={styles.button}> 
            <Button title="Sign Up" onPress={() => navigation.navigate('Sign Up')} />
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}> 
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
}


const styles = StyleSheet.create({
  button:{
    margin:10,
  },
  background: {
    width: '100%',
    height: '100%'
  }
});
