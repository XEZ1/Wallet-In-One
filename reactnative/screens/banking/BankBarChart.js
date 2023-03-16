import { VictoryChart, VictoryBar, VictoryAxis, VictoryScatter } from "victory-native";	
import { Text, Dimensions } from "react-native";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import {styles} from 'reactnative/screens/All_Styles.style.js'

import { BarChart } from "react-native-chart-kit";
export function BankBarChart({rawData, tab}) {

  const {dark, colors, setScheme} = useTheme();
  
  const data = {
    labels: rawData.labels,
    datasets: [
      {
        data: rawData.values
      }
    ],
  };

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.background,
    backgroundGradientToOpacity: 0.5,
    color: (opacity) => {
      if (tab == 1){
        return `rgba(26, 181, 9, ${opacity})`
      }
      if (tab == 2){
        return `rgba(300,0,0, ${opacity})`
      }
      else{
        return `rgba(6, 146, 207, ${opacity})`
      }
    },
    labelColor: (opacity = 1) => colors.text,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5, 
    useShadowColorFromDataset: false // optional
  };

  return (
    <BarChart
      data={data}
      width={Dimensions.get("window").width*0.8}
      height={200}
      yAxisLabel="£"
      fromZero={true}
      chartConfig={chartConfig}
      style={{}}
    />
  )
}
export function BankBarChart2() {	

  const rawData = {
    "2023-02-01": 100.0,
    "2023-01-01": 100.0,
    "2022-12-01": 100.0
  }
  	
  const data = Object.keys(rawData).map(date => ({	
    x: new Date(date),	
    y: parseFloat(rawData[date])	
  }));	

  const months = Object.keys(rawData).map(date => {date = new Date(date); return new Date(date.getFullYear(), date.getMonth(), 1)});	

  return (	
    <VictoryChart
      domainPadding={10}
    >
      <VictoryBar
        style={{ data: { fill: "#c43a31" } }}
        data={data}
      />
      <VictoryAxis	
        tickFormat={(date) => {	
          var d = new Date(date)	
          return `${d.getMonth()+1}/${d.getFullYear().toString().substr(-2)}`	
        }}	
        tickValues = {months}	
        style={{	
          grid: {	
            stroke: "grey",	
            strokeDsharray: "2, 5"	
          },
          axis: {stroke: 'grey'},
          tickLabels: {fill: colors.text},	
        }}	
      />
      <VictoryAxis	
        tickFormat={(value) => `£${value}`}	
        dependentAxis={true}	
        style={{	
          grid: {	
            stroke: "grey",	
            strokeDasharray: "2, 5"	
          },
          axis: {stroke: 'grey'},
          tickLabels: {fill: colors.text},		
        }}	
      />	
    </VictoryChart>
  );	
}