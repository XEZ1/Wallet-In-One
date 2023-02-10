import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, TextInput,ActivityIndicator} from 'react-native';
import AuthWebView from './AuthView';
import { auth_get } from '../../authentication'
import Loading from './Loading'

export default function AddBankScreen({ navigation }) {
    const [ added, setAdded ] = useState(false)
    const [ info, setInfo ] = useState(null)
    const [ search, setSearch ] = useState('')
    const [ data, setData ] = useState([])
    const [ bankData, setbankData ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ bankAuthURL, setbankAuthURL ] = useState(null)
    
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

        const getAuthURL = async (id) => {
            console.log('fetching url')
            const response = await auth_get(`/banking/auth_page/${id}`)
            if (response.status == 200){
                setbankAuthURL(response.body.url)
            }
            else{
                console.log('error', response)
            }
        }
        console.log(item.id)
        getAuthURL(item.id)
    }

    const updateSearch = (string) => {
        setSearch(string)
        const searchString = string.toLowerCase()
        setbankData(data.filter(item => item.name.toLowerCase().includes(searchString)))
    }

    const detectFinish = (event) => {
        console.log('navigateURL',event.url)
        if (event.url.includes('example.com')) {
            setAdded(true)
            setbankAuthURL(null)
        }
    }

    if (isLoading){
        return <Loading/>
    }

    if (bankAuthURL){
        return <AuthWebView url={bankAuthURL} onCancel={()=>{setbankAuthURL(null)}} stateChange={detectFinish} />
    }
    
    return (
        <>  
            {!added ? (
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
                                    </TouchableOpacity>)
                                }}
                                ListEmptyComponent={<Text>{'\nNo banks found\n'}</Text>}
                            />
                        </View>
                </View>
            ): (
                <TouchableOpacity onPress={()=>setAdded(false)}>
                    <Text>Bank successfully linked</Text>
                    <Text>Tap here to go back</Text>
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
