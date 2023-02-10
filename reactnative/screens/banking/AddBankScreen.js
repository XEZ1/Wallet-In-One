import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, TextInput,ActivityIndicator} from 'react-native';
import AuthWebView from './AuthView';
import { auth_get } from '../../authentication'
import Loading from './Loading'

export default function AddBankScreen({ navigation }) {
    const [ web, setWeb ] = useState(true)
    const [ info, setInfo ] = useState()
    const [ search, setSearch ] = useState('')
    const [ data, setData ] = useState([])
    const [ bankData, setbankData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    
    useEffect(() =>{
        const fetchData = async () => {
            console.log('fetching')
            const response = await auth_get('/banking/bank_list')
            if (response.status == 200){
                setData(response.body)
                setbankData(response.body)
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])
    const selectItem = (item) => {
        setInfo(item)
        setWeb(false)
    }
    const updateSearch = (string) => {
        setSearch(string)
        const searchString = string.toLowerCase()
        setbankData(data.filter(item => item.name.toLowerCase().includes(searchString)))
    }

    if (isLoading){
        return <Loading/>
    }
    
    return (
        <>  
            {web ? (
                <View style={{flex:1, margin: 4, marginBottom: 54}}>
                        <TextInput style={styles.input} placeholder='Search' value={search} onChangeText={updateSearch}/>
                        <View style={styles.container}>
                            <FlatList data={bankData} renderItem={({item, index}) =>{
                                return (
                                    <TouchableOpacity onPress={()=>selectItem(item)} style={styles.item}>
                                        <Image
                                            source={{ uri: item.logo }}
                                            style={{ width: 50, height: 50, marginRight: 10, resizeMode: 'contain'}}
                                        />
                                        <Text key={index}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                                }}
                                ListEmptyComponent={<Text>{'\nNo banks found\n'}</Text>}
                                />
                        </View>
                </View>
            ): (
                // <AuthWebView url="https://ob.nordigen.com/psd2/start/17271bad-1901-4c33-8168-961dee968a4f/BARCLAYS_BUKBGB22" />
                <TouchableOpacity onPress={()=>setWeb(true)} style={styles.item}>
                <Text>{JSON.stringify(info)}</Text>
                </TouchableOpacity>
            )}
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
    borderWidth: 1,

    borderRadius: 5,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  item:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  input:{
    height: 40,
    width: '100%',
    borderWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white'
  }

});
