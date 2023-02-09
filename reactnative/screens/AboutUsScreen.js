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
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent : 'center',
        paddingBottom: 20
        }}
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
            {/* Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer
            adipiscing elit. Aenean commodo ligula eget dolor. */}
            Welcome to Wallet-In-One! We are an all in one central finance
            app where you can access your credit cards, debit cards, stocks and
            crytocurrency. Simply connect your respective accounts and view
            the latest changes in your finances. {"\n"}
            This app was developed by second year students from King's College 
            London on the Computer Science course for the module 'Software
            Engineering Group Project' for a client. All IP belongs to the client
            and further development is to be continued by said client.
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
      marginTop: '-2%'
    },
  });