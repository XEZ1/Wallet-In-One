import { View, Text } from 'react-native';

export default function StockAsset({ route, navigation }){
    return(
    <View>
        <Text>{route.params.accountID}</Text>
    </View>

    );
}