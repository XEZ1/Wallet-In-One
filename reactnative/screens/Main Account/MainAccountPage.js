import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default function MainAccountPage({ navigation }) {

    return (

        <View style={styles.container}>
            <StatusBar style="auto" />
            <TouchableOpacity onPress={() => navigation.navigate("Bank Accounts")}>
                <View style={styles.cards}>
                    <Text>Bank Account(s)</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Wallets")}>
                <View style={styles.cards}>
                    <Text>Crypto Wallet(s)</Text>
                </View>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => navigation.navigate("Crypto exchanges")}>
                <View style={styles.cards}>
                    <Text>Crypto Exchange(s)</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity >
                <View style={styles.cards}>
                    <Text>Stock Accounts(s)</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

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