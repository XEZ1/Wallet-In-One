import { View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function StockAsset({ route, navigation }){

    const deleteAccount = async () => {
        const response = await fetch('http://10.0.2.2:8000/stocks/delete_account/', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${await SecureStore.getItemAsync("token")}`
            },
            body: JSON.stringify({
                account_id: route.params.accountID
            }),
          });
    }

    return(
    <View>
        <TouchableOpacity onPress={async ()=> {await deleteAccount(), navigation.navigate('Stock Account List')}}><Text>REMOVE</Text></TouchableOpacity>
    </View>

    );
}