import { View, ScrollView, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading'
import { auth_get } from '../../authentication'
import { BalanceChart } from './BalanceChart'
import { BankBarChart } from './BankBarChart'

import { BankBarChart2 } from './BankBarChart'

const SegmentedControl = ({ segments, activeIndex, setActiveIndex }) => {
  return (
    <View style={styles.segmentContainer}>
      {segments.map((segment, index) => (
        <View style={styles.buttonContainer} key={index}>
          <Button
            title={segment}
            color={activeIndex === index ? '#007AFF' : 'grey'}
            onPress={() => setActiveIndex(index)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f2f2f2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonContainer:{
    marginHorizontal: 10,
  },
  columnCenter:{
    flexDirection: 'column', alignItems: 'center'
  },
  item:{
    marginVertical:10,
  }
});


export default function BankInsights() {
  const [ isLoading, setIsLoading ] = useState(true)
  const isFocused = useIsFocused();
  const { dark, colors, setScheme} = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab ] = useState(0)

  const [ data, setData ] = useState('None')
  const [ currentData, setCurrentData ] = useState()
  const [ currentTabData, setCurrentTabData ] = useState()
  
  useEffect(() =>{
    const fetchData = async () => {
      response = await auth_get('/banking/metrics/')
        
        if (response.status == 200){
            setData(response.body)
            setCurrentData(response.body.all)
            setCurrentTabData(response.body.all.both)
            setActiveIndex(0)
            setActiveTab(0)
            setIsLoading(false)
            console.log('check this',response.body.all.balance_history)
        }
    }
    if (isFocused){fetchData()}
  }, [isFocused])


  useEffect(() =>{
    console.log(activeIndex)
    switch(activeIndex){
      case 0:
        setCurrentData(data['all'])
        break
      case 1:
        setCurrentData(data['1month'])
        break
      case 2:
        setCurrentData(data['3month'])
        break
      case 3:
        setCurrentData(data['6month'])
        break
    }
  }, [activeIndex])

  useEffect(() =>{
    if(currentData){
      switch(activeTab){
        case 0:
          setCurrentTabData(currentData['both'])
          break
        case 1:
          setCurrentTabData(currentData['positive'])
          break
        case 2:
          setCurrentTabData(currentData['negative'])
          break
      }
    }
  }, [activeTab, currentData])

  if (isLoading){
    return <Loading/>
  }

  return (
    <ScrollView>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.background, marginBottom: 100 }}>
      <View style={styles.item}>
        <SegmentedControl segments={['All', '1 Month','3 Month', '6 Month']} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </View>
      
      <View style={styles.item}>
        <View style={{ width: "80%", flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={styles.columnCenter}>
            <Text style={{ fontWeight: 'bold' }}>Money In:</Text>
            <Text style={{ color: 'green' }} >£{currentData.total_money_in}</Text>
          </View>
          <View style={styles.columnCenter}>
            <Text style={{ fontWeight: 'bold' }}>Money Out:</Text>
            <Text style={{ color: 'red' }} >£{currentData.total_money_out}</Text>
          </View>
          <View style={styles.columnCenter}>
            <Text style={{ fontWeight: 'bold' }}>Net:</Text>
            <Text style={{ color: currentData.net>0?'green':'red' }} >£{currentData.net}</Text>
          </View>
        </View>
      </View>
      <Text>Balance History:</Text>
      <BalanceChart rawData={currentData.balance_history} highest={currentData.highest_balance}/>
      {Object.keys(currentData).map((key) => {
        if (!["balance_history",'net','total_money_in','total_money_out','positive','negative','both','bar_data'].includes(key)){
          return (
            <View key={key}>
              <Text>{key.replace('_', ' ').replace(/\b(\w)/g, k => k.toUpperCase())}: {currentData[key]}</Text>
            </View>
          )
        }
      })}
      <View style={styles.item}>
        <SegmentedControl segments={['Both', 'Income','Spending']} activeIndex={activeTab} setActiveIndex={setActiveTab} />
      </View>

      {Object.keys(currentTabData).map((key) => {
        if (!["balance_history",'net','total_money_in','total_money_out','positive','negative','both','bar_data'].includes(key)){
          return (
            <View key={key}>
              <Text>{key.replace('_', ' ').replace(/\b(\w)/g, k => k.toUpperCase())}: {currentTabData[key]}</Text>
            </View>
          )
        }
      })}

      
      <BankBarChart rawData={currentTabData.bar_data} tab={activeTab}/>
      


    </View>
    </ScrollView>
  );
}