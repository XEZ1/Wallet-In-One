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
      paddingTop: 10,
      //borderWidth: 1,
      borderRadius: 5,
      borderColor: dark ? colors.background : '#ddd',
      overflow: 'hidden',
    },
    row:{
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    item:{
      padding: 20,
      borderRadius: 10,
    },
    text:{
      color: colors.text
    },
    name:{
      color: "white",
      fontWeight: 'bold',
      fontSize: 21,
    },
    amount:{
      color: "white",
      fontSize: 18,
    },
    iban:{
      color: 'rgba(255,255,255,0.5)',
      fontSize: 10,
      marginBottom: 3,
    },
  });
  
  

  if (isLoading){
    return <Loading/>
}

  return (
    // <View style={{flex:1,  margin: 4, marginBottom: 54, backgroundColor: colors.background}} >
    <View style={{flex:1, backgroundColor: colors.background}} >
              <View style={[styles.container]}>
                  <FlatList data={bankData} renderItem={({item, index}) =>{
                      return (
                        <TouchableOpacity style={[styles.item, {backgroundColor: item.color}]} key={index}>
                            <View style={styles.row}>
                                <Image
                                    source={{ uri: item.institution_logo }}
                                    style={{ width: 70, height: 70, marginRight: 10, resizeMode: 'contain', borderRadius: 10}}
                                />
                                <View style={{ borderRadius: 10}}>
                                  <Text style={styles.name}>{item.institution_name}</Text>
                                  <Text style={styles.iban}>{item.iban}</Text>
                                  <Text style={styles.amount}>{item.balance.string}</Text>
                                </View>
                              </View>
                          </TouchableOpacity>)
                      }}
                      ListEmptyComponent={<Text style={styles.text}>{'\nYou have no bank accounts\n'}</Text>}
                  />
              </View>
      </View>
  );
}