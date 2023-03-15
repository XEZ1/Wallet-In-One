import {View, Text, StyleSheet, Image, ScrollView, Button} from "react-native";
import React, {useEffect, useState} from "react";
import { useIsFocused } from "@react-navigation/native";
import { auth_get } from "../../authentication";
import Loading from "../banking/Loading";
import Map from "./Map";

export default function StockInsight() {
    const isFocused = useIsFocused()
    const [data, setData] = useState()
    const [currentData, setCurrentData] = useState()
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect( () => {
        const getMetrics = async () => {
        const response = await auth_get('/stocks/get_metrics/')
        if(response.status == 200){
            console.log(response.body)
            setData(response.body)
            setCurrentData(response.body.all)
            setIsLoading(false)
        }
        
        }
        if(useIsFocused){getMetrics()}  
    }, [isFocused])

    const filter = (filter) => {
        setCurrentData(data[filter])
        console.log(currentData)
    }

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
        },
        button: {
            flexDirection: "row" , justifyContent: 'space-evenly'
        },
        text: {
            fontWeight: "700",
            fontSize: 25
        }
    })

    if(isLoading){
        return (<Loading/>)
    }
    return(
        <View style={{flex: 1}}>
            <View style={styles.button}>
            <Button onPress={() => filter('all')} title="All"/>
            <Button onPress={() => filter('1 Month')} title="1 Month"/>
            <Button onPress={() => filter('3 Months')} title="3 Months"/>
            <Button onPress={() => filter('6 Months')} title="6 Months"/>
            <Button onPress={() => filter('12 Months')} title="12 Months"/>
            </View>
            <View style={styles.container}>
            <Text style={styles.text}>Number of Transactions: {currentData.total_number_of_transactions}</Text>
            <Text style={styles.text}>Highest Transaction(£): {currentData.highest_transaction}</Text>
            <Text style={styles.text}>Lowest Transaction(£): {currentData.lowest_transaction}</Text>
            <Text style={styles.text}>Average Transaction(£): {currentData.average_transaction}</Text>
            <Text style={styles.text}>Variance: {currentData.variance}</Text>
            <Text style={styles.text}>Standard Deviation: {currentData.standard_deviation}</Text>
            <Text style={styles.text}>Highest Fee(£): {currentData.highest_fee}</Text>
            <Text style={styles.text}>Lowest Fee(£): {currentData.lowest_fee}</Text>
            <Text style={styles.text}>Average Fee(£): {currentData.average_fee}</Text>
            <Text style={styles.text}>Centroid of Transaction Locations:</Text>
            </View>
            <View style={{flex: 1}}>
            <View style={{height: '100%'}}>
            <Map latitude={currentData.average_latitude} longitude={currentData.average_longitude}/>
            </View>
            </View>
        </View>
    )
}