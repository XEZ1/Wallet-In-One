import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Image,
  View,
  Text,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

export default function StartScreen ({ navigation }) {

    return (
      <ImageBackground
          source={require('reactnative/assets/background.png')}
          style={styles.background}
      >
        <View>
          <FocusAwareStatusBar />
          <Image
            source={require('reactnative/assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          >
          </Image>
          {/* <StatusBar style="auto" /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('About Us')}
          >
            <Text style={styles.aboutUs}>About Us</Text>
          </TouchableOpacity>

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
    marginTop: '-15%',
  },
  signup: {
    backgroundColor: 'red',
    color: 'white',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '65%'
  },
  login: {
    backgroundColor: 'white',
    color: 'red',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '5%'
  },
  aboutUs: {
    backgroundColor: 'black',
    color: 'red',
    width: "30%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "2%",
    fontSize:  17,
    marginTop: '-10%',
    alignSelf: 'center'
  }
});
