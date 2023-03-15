import {View, Text, StyleSheet, Image, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import { useIsFocused } from "@react-navigation/native";
import { auth_get } from "../../authentication";

export default function StockInsight() {
    const isFocused = useIsFocused()
    const [data, setData] = useState()
    const [currentData, setCurrentData] = useState()

    useEffect( () => {
        const getMetrics = async () => {
        const response = await auth_get('/stocks/get_metrics/')
        console.log(response.body)
        setData(response.body)
        setCurrentData(response.body.all)
        
        }
        if(useIsFocused){getMetrics()}  
    }, [isFocused])

    return(
        <View>
            <Text>{JSON.stringify(currentData)}</Text>
        </View>
    )
}