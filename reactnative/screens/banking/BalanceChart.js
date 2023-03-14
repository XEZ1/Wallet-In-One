import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter } from "victory-native";	
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
export function BalanceChart({rawData,highest}) {	

  const {dark, colors, setScheme} = useTheme();

//   const rawData2 = {	
//     "2023-02-17": "795.11",	
//     "2023-01-26": "695.11",	
//     "2023-01-25": "701.00",	
//     "2023-01-20": "601.00",	
//     "2022-12-23": "623.50",	
//     "2022-12-20": "523.50",	
//     "2022-11-26": "529.49",	
//     "2022-11-24": "531.14"	
// }	
//   const rawData = {	
//     "2023-02-17": "200.00",	
//     "2023-02-03": "400.00",	
//     "2023-01-25": "600.00",	
//     "2023-01-20": "500.00",	
//     "2022-12-23": "600.00",	
//     "2022-12-20": "500.00",	
//     "2022-11-26": "525.00",	
//     "2022-11-24": "525.00"	
//     }	


  const data = Object.keys(rawData).map(date => ({	
    x: new Date(date),	
    y: parseFloat(rawData[date])	
  }));	

  const beforeMonths = Object.keys(rawData).map(date => {date = new Date(date); return new Date(date.getFullYear(), date.getMonth(), 1)});	
  const afterMonths = Object.keys(rawData).map(date => {date = new Date(date); return new Date(date.getFullYear(), date.getMonth()+1, 1)});	
  const months = beforeMonths.concat(afterMonths)	
  	
  return (	
    <VictoryChart minDomain={{ y: 0 }} maxDomain={{ y: highest*1.1 }} height={220} width={350}>	
    <VictoryLine data={data} interpolation="stepAfter" style={{ data: { stroke: "#0055b3", strokeWidth: 2 } }} />	
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
        tickLabels: {fill: colors.text , fontSize: 12},
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