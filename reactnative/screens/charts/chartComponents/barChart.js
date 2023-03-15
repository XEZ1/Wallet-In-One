import {VictoryBar,VictoryLabel} from "victory-native";

export default function BarChart(colours, list, data, colors, spacing, handlePressIn) {
    return <VictoryBar
      horizontal={true}
      style={{
        data: { fill: ({ datum }) => colours[list.indexOf(datum.x)] },
      }}
      data={data}
      barWidth={18}
      padding={40}
      labels={({ datum }) => "●" + datum.x}
      labelComponent={<VictoryLabel
        dy={-20}
        x={30}
        style={{ fontSize: 22, fontWeight: "900", fill: colors.text }} />}
      height={spacing}
      events={[
        {
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn,
          },
        },
        {
          target: "labels",
          eventHandlers: {
            onPressIn: handlePressIn,
          },
        },
      ]} />;
  }
