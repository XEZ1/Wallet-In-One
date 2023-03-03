import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';

import React from 'react';


export default function MainAccountPage({ navigation }) {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: 5,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
        },
        box: {
            flex: 1,
            borderRadius: 15,
            margin: 5,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center'
        },
        text: { 
            color: 'white', 
            fontSize: 23, 
            fontWeight: 'bold', 
            textAlign: 'center'
        }
    });

    return (
        <View style={styles.container}>
            {/* 3 buttons */}
            <TouchableOpacity style={[styles.box, { backgroundColor: '#5686f2' }]} onPress={() => navigation.navigate("Bank Accounts")}>
                <Icon style={{ color: 'white' }} name="bank" size={80} /><Text style={styles.text}>{'Bank Accounts'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box, { backgroundColor: 'red' }]} onPress={() => navigation.navigate("Wallets")}>
                <Icon2 style={{ color: 'white' }} name="wallet" size={80} /><Text style={styles.text}>{'Cryptocurrency'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box, { backgroundColor: '#55a755' }]} >
                <Icon style={{ color: 'white' }} name="line-chart" size={80} /><Text style={styles.text}>{'Stock Accounts'}</Text>
            </TouchableOpacity>
            
            {/* 4 buttons */}
            {/* <View style={styles.row}>
                <TouchableOpacity style={[styles.box,{backgroundColor: '#5686f2'}]} onPress={() => navigation.navigate("Bank Accounts")}>
                    <Icon style={{color:'white'}} name="bank" size={100} /><Text style={styles.text}>{'Bank \nAccounts'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.box,{backgroundColor: 'red'}]} onPress={() => navigation.navigate("Wallets")}>
                    <Icon2 style={{color:'white'}} name="wallet" size={100} /><Text style={styles.text}>{'Crypto \nWallet'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.box,{backgroundColor: '#5744d3'}]} onPress={() => navigation.navigate("Crypto exchanges")}>
                    <Icon style={{color:'white'}} name="exchange" size={100} /><Text style={styles.text}>{'Crypto \nExchange'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.box,{backgroundColor: '#55a755'}]} >
                    <Icon style={{color:'white'}} name="line-chart" size={100} /><Text style={styles.text}>{'Stock \nAccounts'}</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}
