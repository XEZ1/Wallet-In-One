import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert, FlatList , TouchableOpacity, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { auth_get} from '../../authentication'
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'


export default function BankAccountsScreen({ navigation }) {
  const [ isLoading, setIsLoading ] = useState(true)
  const [ bankData, setBankData ] = useState([])
  const isFocused = useIsFocused();
  const {dark, colors, setScheme} = useTheme();
  
  useEffect(() =>{
    const fetchData = async () => {
        console.log('fetch bank data')
        const response = await auth_get('/banking/user_accounts')
        console.log('response', response)
        if (response.status == 200){
            setIsLoading(false)
            setBankData(response.body)
        }
    }
    fetchData()
  }, [isFocused])

  const displayTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return  date.toLocaleDateString() + " "+  date.toLocaleTimeString();
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 0,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: dark ? colors.background : '#ddd',
      overflow: 'hidden',
    },
    row:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    item:{
      padding: 20,
    },
    text:{
      color: colors.text
    },
  });
  
  

  if (isLoading){
    return <Loading/>
}

  return (
    <View style={{flex:1,  margin: 4, marginBottom: 54}} >
              <View style={[styles.container, {backgroundColor: colors.background}]}>
                  <FlatList data={bankData} renderItem={({item, index}) =>{
                      return (
                        <TouchableOpacity style={styles.item} key={index}>
                            <View style={styles.row}>
                                <Image
                                    source={{ uri: item.institution_logo }}
                                    style={{ width: 50, height: 50, marginRight: 10, resizeMode: 'contain'}}
                                />
                                <Text style={styles.text}>{item.institution_name}</Text>
                              </View>
                              {/* <Text>{'\n'}IBAN: {item.data.iban}</Text> */}
                            <Text style={styles.text}>Balance: {item.balance.string}</Text>
                            {/* <Text style={styles.text}>Created: {displayTimestamp(item.data.created)} </Text> */}
                          </TouchableOpacity>)
                      }}
                      ListEmptyComponent={<Text style={styles.text}>{'\nYou have no bank accounts\n'}</Text>}
                  />
              </View>
      </View>
  );
}