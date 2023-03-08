import { View, Text } from 'react-native';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading'
import { auth_get } from '../../authentication'

export default function BankInsights() {
  const [ isLoading, setIsLoading ] = useState(true)
  const isFocused = useIsFocused();
  const {dark, colors, setScheme} = useTheme();
  const [ data, setData ] = useState('None')

  useEffect(() =>{
    const fetchData = async () => {
      response = await auth_get('/banking/metrics/')
        
        if (response.status == 200){
            setData(response.body)
            setIsLoading(false)
        }
    }
    if (isFocused){fetchData()}
  }, [isFocused])

  if (isLoading){
    return <Loading/>
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        {Object.keys(data.all).map((key) => (
        <View key={key}>
          <Text>{key}: {data.all[key]}</Text>
        </View>
      ))}
    </View>
  );
}
