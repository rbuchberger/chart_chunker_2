import { FunctionComponent } from "react"
import { LineChart, Line, YAxis, XAxis, Legend, Tooltip } from "recharts"
import { ChunkerOverview } from "../chunker/chunker"

export const OverviewChart: FunctionComponent<{
  chunkerOverview: ChunkerOverview
  width?: number
  height?: number
  selectedCycle?: number
}> = ({ chunkerOverview, width = 500, height = 200 }) => {
  const data = chunkerOverview.lines.map((line) => {
    return {
      "Charge Efficiency (%)": line[3],
      "Retention (%)": line[4],
    }
  })

  return (
    <LineChart width={width} height={height} data={data}>
      <YAxis
        domain={["auto", 100]}
        padding={{ top: 10, bottom: 10 }}
        stroke="white"
      />
      <XAxis stroke="white" interval={19} />
      <Line
        type="monotone"
        dataKey="Retention (%)"
        stroke="orange"
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="Charge Efficiency (%)"
        stroke="white"
        dot={false}
      />
      <Legend verticalAlign="top" height={36} />
      <Tooltip
        contentStyle={{
          borderRadius: "5px",
          backgroundColor: "rgba(20, 20, 20, 0.9)",
        }}
      />
    </LineChart>
  )
}
