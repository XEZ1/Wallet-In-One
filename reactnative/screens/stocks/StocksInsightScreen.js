import {View, Text, StyleSheet, Image, ScrollView, Button} from "react-native";
import React, {useEffect, useState} from "react";
import { useIsFocused } from "@react-navigation/native";
import { auth_get } from "../../authentication";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons/faMoneyBillTransfer'
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons/faArrowTrendUp'
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons/faArrowTrendDown'
import Loading from "../banking/Loading";

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

    if(isLoading){
        return (<Loading/>)
    }
    return(
        <View>
            <Button onPress={() => filter('all')} title="All"/>
            <Button onPress={() => filter('1 Month')} title="1 Month"/>
            <Button onPress={() => filter('3 Months')} title="3 Months"/>
            <Button onPress={() => filter('6 Months')} title="6 Months"/>
            <Button onPress={() => filter('12 Months')} title="12 Months"/>
            <Text> <FontAwesomeIcon icon={faMoneyBillTransfer} />Number of Transactions: {currentData.total_number_of_transactions}</Text>
            <Text><FontAwesomeIcon icon={faArrowTrendUp} />Highest Transaction: £{currentData.highest_transaction}</Text>
            <Text><FontAwesomeIcon icon={faArrowTrendDown} />Lowest Transaction: £{currentData.lowest_transaction}</Text>
            <Text>Average Transaction: £{currentData.average_transaction}</Text>
            <Text>Variance: {currentData.variance}</Text>
            <Text>Standard Deviation: {currentData.standard_deviation}</Text>
            <Text>Highest Fee: £{currentData.highest_fee}</Text>
            <Text>Lowest Fee: £{currentData.lowest_fee}</Text>
            <Text>Highest Fee: £{currentData.highest_fee}</Text>
            <Text>Average Fee: £{currentData.average_fee}</Text>
        </View>
    )
}