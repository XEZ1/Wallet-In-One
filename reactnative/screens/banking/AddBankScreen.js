import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, FlatList, TouchableOpacity, Image, TextInput,ActivityIndicator, Alert} from 'react-native';
import AuthWebView from './AuthView';
import { auth_get, auth_post} from '../../authentication'
import Loading from './Loading'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import {styles} from 'reactnative/screens/All_Styles.style.js'

export default function AddBankScreen({ navigation }) {
    const [ search, setSearch ] = useState('') // Stores contents of search box
    const [ data, setData ] = useState([])     // Stores all bank data
    const [ bankData, setbankData ] = useState([])        // Stores filtered bankdata
    const [ isLoading, setIsLoading ] = useState(true)    // Initial load

    const [ bankAuthURL, setbankAuthURL ] = useState(null)// Link to authenticate with selected bank
    const [ authComplete, setAuthComplete ] = useState(false)
    const [ savedBanks, setSavedBanks ] = useState(null)

    const {dark, colors, setScheme} = useTheme();

    const reset = () => {
        setbankAuthURL(null)
        setAuthComplete(false)
        setSavedBanks(null)
    }
    
    
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
        if (!authComplete && event.url.includes('example.com')) {
            setAuthComplete(true)
            updateServer(bankAuthURL)
            setbankAuthURL(null)
        }
    }

    const updateServer = (url) => {
        const sendLink = async () => {
            const response = await auth_post('/banking/finish_auth/',{'url': url})
            console.log(response)
            if (response.status == 200){
                setSavedBanks(response.body)
            }
            else if (response.status == 400 && response.body.error){
                Alert.alert("Error", response.body.error)
                reset()
            }
            else{
                Alert.alert("Error", "There was an error with the server, try again")
                reset()
            }
        }
        sendLink()
    }

    if (isLoading){
        return <Loading/>
    }

    if (bankAuthURL){
        return <AuthWebView url={bankAuthURL} onCancel={()=>{setbankAuthURL(null)}} stateChange={detectFinish} />
    }

    if (authComplete){
        return (
            <View
                style={styles(dark, colors).container}
            >
                {!savedBanks ? (
                    <TouchableOpacity onPress={()=>setAuthComplete(false)}>
                        <Text style={styles(dark, colors).text}>Bank Authentication Finished</Text>
                        <Text style={styles(dark, colors).text}>Waiting For server</Text>
                        <ActivityIndicator/>
                    </TouchableOpacity>
                ):(
                    <>
                        <Text style={styles(dark, colors).text}> Bank account(s) have been added</Text>
                        <Text style={styles(dark, colors).text}> Data for debugging </Text>
                        <FlatList data={savedBanks} renderItem={({item, index}) =>{
                            return (
                                    <Text style={styles(dark, colors).text} key={index}>{JSON.stringify(savedBanks)}</Text>
                                )
                            }}
                        />
                        <Button title="Back" onPress={reset}/>
                    </>
                )}
            </View>
        )
    }
    
    return (
        <View
            style={[styles(dark, colors).container, {margin: 4, marginBottom: 54}]}
        >
                <TextInput
                    style={styles(dark, colors).bankingInput}
                    placeholder='Search'
                    placeholderTextColor= {colors.text}
                    value={search}
                    onChangeText={updateSearch}
                />
                <View style={styles(dark, colors).bankingContainer}>
                    <FlatList data={bankData} renderItem={({item, index}) =>{
                        return (
                            <TouchableOpacity onPress={()=>selectItem(item)} style={styles(dark, colors).bankingItem}>
                                <Image                                   
                                    source={{ uri: item.logo }}
                                    style={styles(dark, colors).bankingImage}
                                />
                                <Text style={styles(dark, colors).text} key={index}>{item.name}</Text>
                            </TouchableOpacity>)
                        }}
                        ListEmptyComponent={<Text style={styles(dark, colors).text}>{'\nNo banks found\n'}</Text>}
                    />
                </View>
        </View>
    );
}
