import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert, SectionList , TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { auth_get} from '../../authentication'
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from "victory-native";
function Chart() {
  const rawData2 = {
    "2023-02-17": "795.11",
    "2023-01-26": "695.11",
    "2023-01-25": "701.00",
    "2023-01-20": "601.00",
    "2022-12-23": "623.50",
    "2022-12-20": "523.50",
    "2022-11-26": "529.49",
    "2022-11-24": "531.14"
}
  const rawData = {
    "2023-02-17": "200.00",
    "2023-02-03": "400.00",
    "2023-01-25": "600.00",
    "2023-01-20": "500.00",
    "2022-12-23": "600.00",
    "2022-12-20": "500.00",
    "2022-11-26": "525.00",
    "2022-11-24": "525.00"
    }
  
  const data = Object.keys(rawData).map(date => ({
    x: new Date(date),
    y: parseFloat(rawData[date])
  }));

  const beforeMonths = Object.keys(rawData).map(date => {date = new Date(date); return new Date(date.getFullYear(), date.getMonth(), 1)});
  const afterMonths = Object.keys(rawData).map(date => {date = new Date(date); return new Date(date.getFullYear(), date.getMonth()+1, 1)});
  const months = beforeMonths.concat(afterMonths)
  
  return (
    <VictoryChart minDomain={{ y: 0 }} maxDomain={{ y: 700 }} >
    <VictoryLine data={data} interpolation="stepAfter" style={{ data: { stroke: "#0055b3", strokeWidth: 2 } }} />
    <VictoryAxis
      tickFormat={(date) => {
        var d = new Date(date)
        return `${d.getMonth()+1}/${date.getFullYear().toString().substr(-2)}`
      }}
      tickValues = {months}
      style={{
        grid: {
          stroke: "grey",
          strokeDasharray: "2, 5"
        }
      }}
    />
    <VictoryAxis
      tickFormat={(value) => `£${value}`}
      dependentAxis={true}
      style={{
        grid: {
          stroke: "grey",
          strokeDasharray: "2, 5"
        }
      }}
    />
    
  </VictoryChart>
  );
}

function BankTransactionsScreen({ route, navigation }) {
  const [ isLoading, setIsLoading ] = useState(true)
  const [ bankData, setBankData ] = useState([])
  const isFocused = useIsFocused();
  const {dark, colors, setScheme} = useTheme();

  useEffect(() =>{
    const fetchData = async () => {
        console.log('fetch bank transactions')
        setIsLoading(true)
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
    header:{
      paddingLeft:20, 
      paddingRight: 20,
      paddingTop: 6,
      paddingBottom: 6,
      fontWeight: 'bold',
      color:  colors.text,
      backgroundColor: dark ? '#505050' : '#f5f5f5',
    },
    padding:{
      paddingLeft:20, 
      paddingRight: 20
    }
  });

  const groupData = (data) => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return data.reduce((acc, item) => {
      const date = new Date(item.time);
      const month = months[date.getMonth()]
      const year = date.getFullYear();
      const title = `${month} ${year}`;
      const monthData = acc.find((item) => item.title === title);
      if (monthData) {
        monthData.data.push(item);
      } else {
        acc.push({ title: title, data: [item] });
      }
    
      return acc;
    }, []);
  }

  const TransactionItem = ({ item, name, date, amount, time, last}) => {
    const amountColor = amount >= 0 ? 'green' : 'red';
    return (
      <View style={[styles.item,last ? {} : {borderBottomWidth: 1, borderBottomColor: 'lightgray'}]}>
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
                  <SectionList 
                    ListEmptyComponent={<View style={styles.padding}><Text style={styles.text}>{'\nYou have no bank accounts\n'}</Text></View>}
                    sections={groupData(bankData)} 
                    renderSectionHeader={({section: {title}}) => (<Text style={styles.header}>{title}</Text>)}
                    renderItem={({item, index, section}) =>{
                      return (
                        <View style={styles.padding}>
                        <TransactionItem
                          item={item}
                          name={item.info}
                          amount={item.amount}
                          date={displayDate(item.time)}
                          time={displayTime(item.time)}
                          last={index == section.data.length-1}/>
                        </View>)
                      }}
                      ListFooterComponent = {(<Chart/>)}
                  />
              </View>
      </View>
  );
}


export default BankTransactionsScreen