import { ceil, floor, max, min } from "lodash-es"
import { FunctionComponent, useMemo } from "react"
import {
  Dot,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PartialCycle } from "../chunker/buildCycle"
import { useStore } from "../hooks/useStore"

export const CycleProfile: FunctionComponent<{
  cycle: PartialCycle
}> = ({ cycle }) => {
  const { config, chunker } = useStore((state) => {
    return {
      config: state.config,
      chunker: state.chunker,
    }
  })
  const { keptCols, spcCol, vCol, chargeFirst } = config

  if (!chunker) return <></>

  const minMaxes = useMemo(() => {
    const vals = chunker?.cycles.map((cycle) => {
      return {
        maxV: max([cycle.charge?.maxV, cycle.discharge?.maxV]),
        minV: min([cycle.charge?.minV, cycle.discharge?.minV]),
        maxCsp: max([cycle.charge?.maxCsp, cycle.discharge?.maxCsp]),
        minCsp: min([cycle.charge?.minCsp, cycle.discharge?.minCsp]),
      }
    })

    return {
      maxV: ceil(max(vals.map((val) => val.maxV)) || 0, 1),
      minV: floor(min(vals.map((val) => val.minV)) || 0, 1),
      maxCsp: ceil(max(vals.map((val) => val.maxCsp)) || 0, 1),
      minCsp: floor(min(vals.map((val) => val.minCsp)) || 0, 1),
    }
  }, [])

  const colNums = useMemo(() => {
    const offset = keptCols.length
    const chargeOffset = chargeFirst ? 0 : offset
    const dischargeOffset = chargeFirst ? offset : 0
    return {
      chargeCsp:
        chargeOffset + keptCols.findIndex(({ index }) => index == spcCol),
      dischargeCsp:
        dischargeOffset + keptCols.findIndex(({ index }) => index == spcCol),
      chargeV: chargeOffset + keptCols.findIndex(({ index }) => index == vCol),
      dischargeV:
        dischargeOffset + keptCols.findIndex(({ index }) => index == vCol),
    }
  }, [config])

  const [chargeData, dischargeData] = useMemo(() => {
    type Point = { x: number; y: number }
    const chargeData: Point[] = []
    const dischargeData: Point[] = []
    cycle.processedLines.slice(1).forEach((line) => {
      if (
        line[colNums.chargeCsp] !== undefined &&
        line[colNums.chargeV] !== undefined
      ) {
        chargeData.push({
          x: line[colNums.chargeCsp] as number,
          y: line[colNums.chargeV] as number,
        })
      }

      if (
        line[colNums.dischargeCsp] !== undefined &&
        line[colNums.dischargeV] !== undefined
      ) {
        dischargeData.push({
          x: line[colNums.dischargeCsp] as number,
          y: line[colNums.dischargeV] as number,
        })
      }
    })
    return [chargeData, dischargeData]
  }, [cycle, colNums])

  return (
    <div className="flex flex-row justify-center">
      <ScatterChart width={500} height={300} className="">
        <XAxis
          dataKey="x"
          type="number"
          name="Csp"
          unit="mAh/g"
          domain={[minMaxes.minCsp || "dataMin", minMaxes.maxCsp || "dataMax"]}
        />
        <YAxis
          dataKey="y"
          type="number"
          name="Potential"
          unit="V"
          domain={[minMaxes.minV || "dataMin", minMaxes.maxV || "dataMax"]}
        />
        <Legend />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            borderRadius: "5px",
            backgroundColor: "rgba(20, 20, 20, 0.9)",
          }}
        />
        <Scatter
          name="Charge"
          data={chargeData}
          fill="#eab308"
          line={{ stroke: "#eab308", strokeWidth: 1 }}
          isAnimationActive={false}
          shape={<Dot r={2} stroke="#eab308" strokeWidth={1} fill="#eab308" />}
        />
        <Scatter
          name="Discharge"
          data={dischargeData}
          fill="#f9fafb"
          isAnimationActive={false}
          line={{ stroke: "#f9fafb", strokeWidth: 1 }}
          shape={<Dot r={2} stroke="#f9fafb" strokeWidth={1} fill="#f9fafb" />}
        />
      </ScatterChart>
    </div>
  )
}