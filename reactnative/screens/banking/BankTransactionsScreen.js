import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert, FlatList , TouchableOpacity, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { auth_get} from '../../authentication'
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

function BankTransactionsScreen({ route, navigation }) {
  const [ isLoading, setIsLoading ] = useState(true)
  const [ bankData, setBankData ] = useState([])
  const isFocused = useIsFocused();
  const {dark, colors, setScheme} = useTheme();

  useEffect(() =>{
    const fetchData = async () => {
        console.log('fetch bank data')
        if (route.params == undefined){
          response = await auth_get('/banking/transactions/')
        }
        else{
          response = await auth_get('/banking/transactions/' + route.params.accountID +'/')
        }
        
        if (response.status == 200){
            setIsLoading(false)
            response.body.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            setBankData(response.body)
        }
    }
    if (isFocused){fetchData()}
  }, [isFocused])

  const displayDate = (timestamp) => {
    const date = new Date(timestamp);
    return  date.toLocaleDateString();
  };

  const displayTime = (timestamp) => {
    const date = new Date(timestamp);
    return  date.toLocaleTimeString();
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
    olditem:{
      padding: 20,
    },
    text:{
      color: colors.text
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
    },
    leftContainer: {
      flex: 1,
    },
    rightContainer: {
      marginLeft: 10,
      alignItems: 'flex-end',
    },
    name: {
      fontWeight: 'bold',
      fontSize: 14,
      color: colors.text,
    },
    date: {
      fontSize: 14,
      color: 'gray',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    time: {
      fontSize: 14,
      color: 'gray',
    },
  });

  const TransactionItem = ({ item, name, date, amount, time }) => {
    const amountColor = amount >= 0 ? 'green' : 'red';
    return (
      <View style={styles.item}>
        <View style={styles.leftContainer}>
          <ScrollView horizontal={true}>
            <Text style={styles.name}>{name}</Text>
          </ScrollView>
          <Text style={styles.date}>{date} at {time}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={[styles.amount, { color: amountColor }]}>{item.formatted_amount.string}</Text>
        </View>
      </View>
    );
  };

  if (isLoading){
    return <Loading/>
}

  return (
    <View style={{flex:1,  margin: 4, marginBottom: 54}} >
              <View style={[styles.container, {backgroundColor: colors.background}]}>
                  <FlatList data={bankData} renderItem={({item, index}) =>{
                      return (
                        <TransactionItem
                          item={item}
                          name={item.info}
                          amount={item.amount}
                          date={displayDate(item.time)}
                          time={displayTime(item.time)} />)
                      }}
                      ListEmptyComponent={<Text style={styles.text}>{'\nYou have no bank accounts\n'}</Text>}
                  />
              </View>
      </View>
  );
}


export default BankTransactionsScreen