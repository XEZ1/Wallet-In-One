import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import { styles } from 'reactnative/screens/All_Styles.style.js';


export default function MainAccountPage({ navigation }) {
    const { dark, colors, setScheme } = useTheme();

    return (

        <View style={[styles(dark, colors).container, {alignItems: 'center', justifyContent: 'flex-start'}]}>
            <StatusBar style="auto" />
            <TouchableOpacity onPress={() => navigation.navigate("Bank Accounts")}>
                <View style={stylesInternal.cards}>
                    <Text>Bank Account(s)</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Wallets")}>
                <View style={stylesInternal.cards}>
                    <Text>Crypto Wallet(s)</Text>
                </View>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => navigation.navigate("Crypto exchanges")}>
                <View style={stylesInternal.cards}>
                    <Text>Crypto Exchange(s)</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity >
                <View style={stylesInternal.cards}>
                    <Text>Stock Accounts(s)</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}


const stylesInternal = StyleSheet.create({
    cards: {
        backgroundColor: '#fff',
        padding: 40,
        margin: 5,
        marginTop: 30,
        width: '80%',
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5
        },
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});