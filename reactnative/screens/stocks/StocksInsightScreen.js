import {View, Text, StyleSheet, Image, ScrollView, Button} from "react-native";
import React, {useEffect, useState} from "react";
import { useIsFocused } from "@react-navigation/native";
import { auth_get } from "../../authentication";
import Loading from "../banking/Loading";
import Map from "./Map";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import { styles } from "reactnative/screens/All_Styles.style.js";


export default function StockInsight() {
    const {dark, colors, setScheme} = useTheme();
    const isFocused = useIsFocused()
    const [data, setData] = useState()
    const [currentData, setCurrentData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [index, setIndex] = useState(true)
    

    useEffect( () => {
        const getMetrics = async () => {
        const response = await auth_get('/stocks/get_metrics/')
        if(response.status == 200){
            console.log(response.body)
            setData(response.body)
            setCurrentData(response.body.all)
            setIndex("all")
            setIsLoading(false)
        }
        
        }
        if(useIsFocused){getMetrics()}  
    }, [isFocused])

    const filter = (filter) => {
        setCurrentData(data[filter])
        setIndex(filter)
        console.log(currentData)
    }

    const stylesInternal = StyleSheet.create({
        button: {
            flexDirection: "row" , justifyContent: 'space-evenly'
        },
        container: {
            padding: 10,
            borderRadius: 5,
            marginVertical: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        text: {
            fontSize: 16,
            marginBottom: 5,
        },
    })

    const buttons = [
        <View key="all" style={styles.button}>
            <Button color={index === "all" ? colors.primary : 'grey'} onPress={() => filter('all')} title="All"/>
            <Button color={index === "1 Month" ? colors.primary : 'grey'} onPress={() => filter('1 Month')} title="1 Month"/>
            <Button color={index === "3 Months" ? colors.primary : 'grey'} onPress={() => filter('3 Months')} title="3 Months"/>
            <Button color={index === "6 Months" ? colors.primary : 'grey'} onPress={() => filter('6 Months')} title="6 Months"/>
            <Button color={index === "12 Months" ? colors.primary : 'grey'} onPress={() => filter('12 Months')} title="12 Months"/>
        </View>
    ]
    if(isLoading){
        return (<Loading/>)
    }else if(currentData.average_latitude == 0 && currentData.average_longitude == 0){
        return(
        <View style={{flex: 1}}>
            {buttons}
            <Text style={[styles(dark, colors).text, {textAlign: 'center'}]}>No Data for Selected Date</Text>
        </View>
        )
    }
    return(
        <View style={styles(dark, colors).container}>
            {buttons}
            <View style={stylesInternal.container}>
                <Text style={[stylesInternal.text, styles(dark, colors).textBold, {color: colors.primary}]}>Transaction Statistics</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Number of Transactions: {currentData.total_number_of_transactions}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Highest Transaction(£): {currentData.highest_transaction}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Average Transaction(£): {currentData.average_transaction}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Variance: {currentData.variance}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Standard Deviation: {currentData.standard_deviation}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Highest Fee(£): {currentData.highest_fee}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Lowest Fee(£): {currentData.lowest_fee}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Average Fee(£): {currentData.average_fee}</Text>
                <Text style={[stylesInternal.text, styles(dark, colors).text]}>Centroid of Transaction Locations:</Text>
            </View>
            <View style={{flex: 1}}>
                <View style={{height: '100%'}}>
                    <Map latitude={currentData.average_latitude} longitude={currentData.average_longitude}/>
                </View>
            </View>
        </View>
    )
}