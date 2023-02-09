import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, View, Button, Text, ImageBackground, TouchableOpacity } from 'react-native';

export default function StartScreen ({ navigation }) {

    return (
      <ImageBackground
          source={require('reactnative/assets/background.png')}
          style={styles.background}
      >
        <View>
          <Image
            source={require('reactnative/assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          >
          </Image>
          {/* <StatusBar style="auto" /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Sign Up')}
          >
            <Text style={styles.signup}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.login}>Log In</Text>
          </TouchableOpacity>
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
  },
  logo:{
    width: 280,
    height: 280,
    marginLeft: '15%',
    marginTop: '0%',
  },
  signup: {
    backgroundColor: 'white',
    color: 'red',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '35%'
  },
  login: {
    backgroundColor: 'red',
    color: 'white',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '5%'
  }
});
