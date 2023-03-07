import { FunctionComponent } from "react"
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import { ChunkerOverview } from "../chunker/chunk"

export const OverviewChart: FunctionComponent<{
  chunkerOverview: ChunkerOverview
  width?: number
  height?: number
  selectedCycle?: number
}> = ({ chunkerOverview, width = 400, height = 200 }) => {
  const data = chunkerOverview.lines.map((line) => {
    return {
      "Charge Efficiency (%)": line[3],
      "Retention (%)": line[4],
    }
  })

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
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
          stroke="#facc15"
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

      <ul className="flex flex-col items-center gap-6 whitespace-nowrap font-mono text-xs">
        <li className="text-yellow-300 flex items-center gap-2">
          <div>
            Retention<sub>n</sub> = 100 ·
          </div>
          <div className="text-center">
            <div className="mb-1 border-b border-b-yellow-300 pb-1">
              Specific Capacity<sub>n</sub>
            </div>
            <div>
              Specific Capacity<sub>first</sub>
            </div>
          </div>
        </li>
        <li className="flex items-center gap-2">
          <div>Charge Efficiency = 100 ·</div>
          <div className="text-center">
            <div className="mb-1 border-b border-b-gray-50">
              Specific Capacity<sub>discharge</sub>
            </div>
            <div>
              Specific Capacity<sub>charge</sub>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}
