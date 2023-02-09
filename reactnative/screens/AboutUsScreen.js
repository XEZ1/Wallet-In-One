import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    ImageBackground,
  } from "react-native";
import React from "react";
  
export default function AboutUsScreen ({ navigation }) {
    return (
      <ImageBackground
        source={require('reactnative/assets/background.png')}
        style={styles.background}
      >
      <ScrollView
      contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
      style={styles.aboutContainer}
      >
        <Image
            source={require('reactnative/assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          >
        </Image>
        <View>
          <Image
            style={styles.imgStyle}
            source={require('reactnative/assets/wallets.webp')}
          />
        </View>
  
        <View style={styles.aboutLayout}>
          <Text style={styles.aboutSubHeader}> About us </Text>
          <Text style={[styles.paraStyle, styles.aboutPara]}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit. Aenean commodo ligula eget dolor.
          </Text>
        </View>
        
        <TouchableOpacity
            onPress={() => navigation.navigate('Start')}
        >
           <Text style={styles.homepage}>Home Page</Text>
        </TouchableOpacity>
  
      </ScrollView>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    aboutContainer: {
      display: "flex",
      //backgroundColor: "black",
      flex: 1
    },
    background: {
        width: '100%',
        height: '100%'
    },
    logo:{
        width: 290,
        height: 280,
        marginTop: '-10%',
        alignSelf:'center'
    },
    imgStyle: {
      width: 370,
      height: 150,
      borderRadius: 40,
      marginTop: '-10%',
      alignSelf:'center'
    },
    paraStyle: {
      fontSize: 16,
      color: "red",
      paddingBottom: 30,
    },
    aboutLayout: {
      backgroundColor: "red",
      paddingHorizontal: 30,
      marginVertical: 30,
    },
    aboutSubHeader: {
      fontSize: 18,
      color: "#fff",
      textTransform: "uppercase",
      fontWeight: "500",
      marginVertical: 15,
      alignSelf: "center",
    },
    aboutPara: {
      color: "#fff",
    },
    homepage: {
      backgroundColor: 'white',
      color: 'red',
      width: "75%",
      borderRadius: 25,
      textAlign: 'center',
      fontWeight: 'bold',
      marginLeft: '11%',
      padding: "2%",
      fontSize:  27,
      marginTop: '0%'
    },
  });